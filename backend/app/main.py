import os
import json
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

@app.get("/api/demos")
def list_demos():
    """List pre-packaged demo repositories available for repair."""
    base_demo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../demo-repos"))
    demos = []
    if os.path.exists(base_demo_dir):
        for entry in os.listdir(base_demo_dir):
            entry_path = os.path.join(base_demo_dir, entry)
            if os.path.isdir(entry_path):
                demos.append({
                    "id": entry,
                    "name": entry.replace("-", " ").title(),
                    "path": entry_path,
                    "description": "Python project with failing unit tests and arithmetic bugs."
                })
    return {"demos": demos}

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

        agent = RepoSurgeonAgent(repo_path=target_repo_path, stream_callback=stream_callback)
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
