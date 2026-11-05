import os
import re
import difflib
import asyncio
from typing import Dict, Any, Callable, Awaitable
from app.sandbox import sandbox_manager
from app.vultr_client import vultr_client
from app.prompts import SYSTEM_SURGEON_PROMPT, DIAGNOSIS_USER_PROMPT

class RepoSurgeonAgent:
    """
    Autonomous AI agent that orchestrates repo diagnosis, isolated sandbox execution,
    and iterative repair powered by Vultr Serverless Inference.
    """
    def __init__(self, repo_path: str, stream_callback: Callable[[Dict[str, Any]], Awaitable[None]]):
        self.repo_path = repo_path
        self.stream = stream_callback

    async def log(self, step: str, message: str, payload: Dict[str, Any] = None):
        """Broadcast live telemetry & reasoning step."""
        data = {
            "step": step,
            "message": message,
            "payload": payload or {}
        }
        await self.stream(data)

    async def heal(self, target_file_rel: str = "calculator.py", test_cmd: str = "pytest -v"):
        """Run the autonomous healing workflow."""
        await self.log("INIT", f"Initializing RepoSurgeon on target repository: {os.path.basename(self.repo_path)}")
        await asyncio.sleep(0.5)

        # Step 1: Execute Baseline Tests in Isolated Sandbox
        await self.log("SANDBOX_START", f"Spinning up isolated sandbox to run baseline tests ({test_cmd})...", {
            "command": test_cmd,
            "containment": "Active (Blast Radius Zero)"
        })
        
        initial_test = sandbox_manager.execute_in_sandbox(self.repo_path, test_cmd)
        await self.log("SANDBOX_RESULT", f"Initial test run completed with status: {initial_test['status']}", initial_test)

        if initial_test["status"] == "PASS":
            await self.log("SUCCESS", "All tests are already passing! No surgery required.")
            return

        # Step 2: Read Broken Target File
        target_abs_path = os.path.join(self.repo_path, target_file_rel)
        if not os.path.exists(target_abs_path):
            await self.log("ERROR", f"Target file '{target_file_rel}' not found in repo.")
            return

        with open(target_abs_path, "r", encoding="utf-8") as f:
            original_code = f.read()

        # Step 3: Vultr Serverless Inference Reasoning Loop
        await self.log("AI_THINKING", "Querying Vultr Serverless Inference (Llama 3.3) for root-cause diagnosis...", {
            "model": vultr_client.model,
            "endpoint": vultr_client.base_url
        })
        
        user_prompt = DIAGNOSIS_USER_PROMPT.format(
            test_output=initial_test["output"],
            file_name=target_file_rel,
            file_content=original_code
        )

        ai_response = vultr_client.query(SYSTEM_SURGEON_PROMPT, user_prompt)
        await self.log("AI_PROPOSAL", "Vultr Inference generated diagnosis and surgical patch.", {
            "raw_response": ai_response
        })

        # Step 4: Extract Code Patch
        new_code = self._extract_code_block(ai_response, original_code)
        
        # Calculate Unified Diff
        diff_lines = list(difflib.unified_diff(
            original_code.splitlines(keepends=True),
            new_code.splitlines(keepends=True),
            fromfile=f"a/{target_file_rel}",
            tofile=f"b/{target_file_rel}"
        ))
        diff_text = "".join(diff_lines)

        await self.log("PATCH_GENERATED", "Surgical patch calculated.", {
            "diff": diff_text
        })

        # Step 5: Apply Patch Temporarily & Verify in Sandbox
        with open(target_abs_path, "w", encoding="utf-8") as f:
            f.write(new_code)

        await self.log("SANDBOX_VERIFY", f"Re-executing test suite in sandbox to verify patch...", {
            "command": test_cmd
        })

        verify_test = sandbox_manager.execute_in_sandbox(self.repo_path, test_cmd)
        await self.log("SANDBOX_VERIFY_RESULT", f"Verification test finished with status: {verify_test['status']}", verify_test)

        if verify_test["status"] == "PASS":
            await self.log("HEALED", "🎉 SUCCESS! All test cases passed in the sandbox. Repo is healed!", {
                "diff": diff_text,
                "verified": True
            })
        else:
            await self.log("PARTIAL_FIX", "Patch applied, but some tests still failed. Further iterations required.", {
                "diff": diff_text,
                "verified": False
            })

    def _extract_code_block(self, response_text: str, fallback: str) -> str:
        """Extract content inside ```python ... ``` or return fallback."""
        pattern = r"```(?:python)?\s*([\s\S]*?)```"
        matches = re.findall(pattern, response_text)
        if matches:
            return matches[0].strip() + "\n"
        return fallback
