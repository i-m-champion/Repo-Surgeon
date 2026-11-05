import os
import shutil
import json
import difflib
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from app.config import settings
from app.agent import RepoSurgeonAgent

app = FastAPI(
    title="RepoSurgeon API",
    description="Autonomous Code Doctor & Test Runner powered by Vultr Serverless Inference",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealRequest(BaseModel):
    repo_name: str = "broken-calculator"
    target_file: str = "calculator.py"
    test_command: str = "pytest -v"

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "RepoSurgeon",
        "vultr_inference_configured": bool(settings.VULTR_API_KEY),
        "vultr_model": settings.VULTR_MODEL,
        "blast_radius_zero": {
            "sandbox_timeout": f"{settings.SANDBOX_TIMEOUT_SECONDS}s",
            "memory_limit": settings.SANDBOX_MEMORY_LIMIT,
            "cpu_limit": settings.SANDBOX_CPU_LIMIT
        }
    }

DEMO_CONFIGS = {
    "broken-calculator": {
        "id": "broken-calculator",
        "name": "Broken Calculator (Logic Bugs)",
        "target_file": "calculator.py",
        "test_command": "pytest -v",
        "description": "Arithmetic & boundary bugs causing ZeroDivisionError and power exponent failures.",
        "tags": ["Arithmetic", "ZeroDivisionError", "Pytest"]
    },
    "auth-sanitizer": {
        "id": "auth-sanitizer",
        "name": "Auth Sanitizer (Adversarial Security Trap)",
        "target_file": "sanitizer.py",
        "test_command": "pytest -v -s",
        "description": "Adversarial security attack trap (host secret probing, /etc/ root writing, socket egress) + regex/credit card masking bugs.",
        "tags": ["Blast Radius Zero", "Security Trap", "Multi-Turn Reflection", "Regex Bugs"]
    }
}

@app.get("/api/demos")
def list_demos():
    """List pre-packaged demo repositories available for repair."""
    base_demo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../demo-repos"))
    demos = []
    if os.path.exists(base_demo_dir):
        for entry in os.listdir(base_demo_dir):
            entry_path = os.path.join(base_demo_dir, entry)
            if os.path.isdir(entry_path):
                cfg = DEMO_CONFIGS.get(entry, {
                    "id": entry,
                    "name": entry.replace("-", " ").title(),
                    "target_file": "calculator.py",
                    "test_command": "pytest -v",
                    "description": "Python project with failing unit tests.",
                    "tags": ["General", "Pytest"]
                })
                cfg["path"] = entry_path
                demos.append(cfg)
    return {"demos": demos}

@app.get("/api/demos/{demo_id}/patch")
def get_demo_patch(demo_id: str):
    """Return unified diff patch between current state and original broken state."""
    base_demo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../demo-repos"))
    demo_path = os.path.join(base_demo_dir, demo_id)
    if not os.path.exists(demo_path):
        return {"status": "error", "message": f"Demo repo '{demo_id}' not found"}

    patches = {}
    for filename in os.listdir(demo_path):
        if filename.endswith(".broken.py"):
            target_name = filename.replace(".broken.py", ".py")
            src = os.path.join(demo_path, filename)
            dst = os.path.join(demo_path, target_name)
            if os.path.exists(dst):
                with open(src, "r") as f_src, open(dst, "r") as f_dst:
                    diff_lines = list(difflib.unified_diff(
                        f_src.read().splitlines(keepends=True),
                        f_dst.read().splitlines(keepends=True),
                        fromfile=f"a/{target_name}",
                        tofile=f"b/{target_name}"
                    ))
                    patches[target_name] = "".join(diff_lines)

    combined_patch = "\n".join(patches.values())
    return {
        "demo_id": demo_id,
        "patch": combined_patch,
        "filename": f"reposurgeon-{demo_id}-fix.patch"
    }

@app.post("/api/demos/{demo_id}/reset")
def reset_demo(demo_id: str):
    """Reset a demo repository back to its intentional broken state."""
    base_demo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../demo-repos"))
    demo_path = os.path.join(base_demo_dir, demo_id)
    if not os.path.exists(demo_path):
        return {"status": "error", "message": f"Demo repo '{demo_id}' not found"}

    reset_count = 0
    for filename in os.listdir(demo_path):
        if filename.endswith(".broken.py"):
            target_name = filename.replace(".broken.py", ".py")
            src = os.path.join(demo_path, filename)
            dst = os.path.join(demo_path, target_name)
            shutil.copy(src, dst)
            reset_count += 1

    if reset_count > 0:
        return {"status": "success", "message": f"Reset {reset_count} file(s) in '{demo_id}' to intentional broken state"}

    return {"status": "noop", "message": "No backup template found"}

@app.websocket("/ws/heal")
async def websocket_heal_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint streaming live agent thought process,
    sandbox command outputs, and diff updates directly to the frontend.
    """
    await websocket.accept()
    try:
        data = await websocket.receive_text()
        req = json.loads(data)
        
        repo_name = req.get("repo_name", "broken-calculator")
        target_file = req.get("target_file", "calculator.py")
        test_cmd = req.get("test_command", "pytest -v")
        max_iterations = int(req.get("max_iterations", 3))
        
        base_demo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../demo-repos"))
        target_repo_path = os.path.join(base_demo_dir, repo_name)
        
        if not os.path.exists(target_repo_path):
            await websocket.send_json({
                "step": "ERROR",
                "message": f"Demo repo '{repo_name}' not found."
            })
            return

        async def stream_callback(payload: dict):
            await websocket.send_json(payload)

        agent = RepoSurgeonAgent(
            repo_path=target_repo_path,
            stream_callback=stream_callback,
            max_iterations=max_iterations
        )
        await agent.heal(target_file_rel=target_file, test_cmd=test_cmd)

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({
            "step": "ERROR",
            "message": f"Unexpected server error: {str(e)}"
        })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
