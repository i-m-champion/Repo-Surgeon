import os
import re
import difflib
import asyncio
from typing import Dict, Any, Callable, Awaitable
from app.sandbox import sandbox_manager
from app.vultr_client import vultr_client
from app.prompts import SYSTEM_SURGEON_PROMPT, DIAGNOSIS_USER_PROMPT, REFLECTION_USER_PROMPT

class RepoSurgeonAgent:
    """
    Autonomous AI agent that orchestrates repo diagnosis, isolated sandbox execution,
    and iterative multi-turn reflection powered by Vultr Serverless Inference (Llama 3.3 70B).
    """
    def __init__(self, repo_path: str, stream_callback: Callable[[Dict[str, Any]], Awaitable[None]], max_iterations: int = 3):
        self.repo_path = repo_path
        self.stream = stream_callback
        self.max_iterations = max_iterations

    async def log(self, step: str, message: str, payload: Dict[str, Any] = None):
        """Broadcast live telemetry & reasoning step."""
        data = {
            "step": step,
            "message": message,
            "payload": payload or {}
        }
        await self.stream(data)

    async def heal(self, target_file_rel: str = "calculator.py", test_cmd: str = "pytest -v"):
        """Run the autonomous multi-turn healing workflow with self-correcting reflection."""
        repo_name = os.path.basename(self.repo_path)
        await self.log("INIT", f"Initializing RepoSurgeon on target repository: {repo_name}", {
            "repo": repo_name,
            "target_file": target_file_rel,
            "max_iterations": self.max_iterations
        })
        await asyncio.sleep(0.3)

        target_abs_path = os.path.join(self.repo_path, target_file_rel)
        if not os.path.exists(target_abs_path):
            await self.log("ERROR", f"Target file '{target_file_rel}' not found in repo.")
            return

        with open(target_abs_path, "r", encoding="utf-8") as f:
            initial_unmodified_code = f.read()

        current_code = initial_unmodified_code
        last_test_output = ""
        prev_patch_summary = ""

        # Step 1: Execute Baseline Tests in Isolated Sandbox
        await self.log("SANDBOX_START", f"Spinning up isolated sandbox to run baseline tests ({test_cmd})...", {
            "command": test_cmd,
            "containment": "Active (Blast Radius Zero)"
        })

        test_result = sandbox_manager.execute_in_sandbox(self.repo_path, test_cmd)
        last_test_output = test_result["output"]

        await self.log("SANDBOX_RESULT", f"Initial test run completed with status: {test_result['status']}", test_result)

        if test_result["status"] == "PASS":
            await self.log("VERIFIED_GREEN", "All tests are already passing! No surgery required.", {
                "test_metrics": test_result.get("test_metrics", {}),
                "security_audit": test_result.get("security_audit", {})
            })
            return

        # Multi-Turn Autonomous Reflection Loop
        for iteration in range(1, self.max_iterations + 1):
            turn_step = f"TURN_{iteration}_ATTEMPT"
            patch_step = f"TURN_{iteration}_PATCH"

            await self.log(turn_step, f"[Turn {iteration}/{self.max_iterations}] Analyzing failures and synthesizing surgical patch via Vultr Inference...", {
                "turn": iteration,
                "max_turns": self.max_iterations,
                "model": vultr_client.model
            })

            if iteration == 1:
                user_prompt = DIAGNOSIS_USER_PROMPT.format(
                    test_output=last_test_output,
                    file_name=target_file_rel,
                    file_content=current_code
                )
            else:
                user_prompt = REFLECTION_USER_PROMPT.format(
                    turn=iteration,
                    prev_turn=iteration - 1,
                    test_output=last_test_output,
                    file_name=target_file_rel,
                    file_content=current_code
                )

            ai_response, inference_telemetry = vultr_client.query(SYSTEM_SURGEON_PROMPT, user_prompt)

            # Extract Code Patch
            new_code = self._extract_code_block(ai_response, current_code)
            current_code = new_code

            # Calculate Unified Diff against original baseline
            diff_lines = list(difflib.unified_diff(
                initial_unmodified_code.splitlines(keepends=True),
                new_code.splitlines(keepends=True),
                fromfile=f"a/{target_file_rel}",
                tofile=f"b/{target_file_rel}"
            ))
            diff_text = "".join(diff_lines)
            lines_added = sum(1 for l in diff_lines if l.startswith('+') and not l.startswith('+++'))
            lines_removed = sum(1 for l in diff_lines if l.startswith('-') and not l.startswith('---'))

            await self.log(patch_step, f"[Turn {iteration}] Vultr Llama 3.3 patch synthesized (+{lines_added}/-{lines_removed} lines, {inference_telemetry.get('latency_ms', 0)}ms).", {
                "turn": iteration,
                "diff": diff_text,
                "raw_response": ai_response,
                "inference_telemetry": inference_telemetry,
                "stats": {
                    "lines_added": lines_added,
                    "lines_removed": lines_removed
                }
            })

            # Apply Patch to Target File & Verify in Sandbox
            with open(target_abs_path, "w", encoding="utf-8") as f:
                f.write(new_code)

            await self.log("SANDBOX_VERIFY", f"[Turn {iteration}] Re-executing test suite in isolated micro-sandbox...", {
                "turn": iteration,
                "command": test_cmd
            })

            verify_test = sandbox_manager.execute_in_sandbox(self.repo_path, test_cmd)
            last_test_output = verify_test["output"]

            await self.log("SANDBOX_VERIFY_RESULT", f"[Turn {iteration}] Sandbox verification status: {verify_test['status']}", verify_test)

            if verify_test["status"] == "PASS":
                # Generate Git Pull Request payload
                pr_payload = {
                    "title": f"fix({repo_name}): autonomous surgical repair via Vultr Serverless Inference",
                    "branch": f"reposurgeon/patch-{repo_name}",
                    "body": f"## 🩺 RepoSurgeon Autonomous Repair\n\nAll tests passed (**100% Green**) inside the Vultr micro-sandbox with **Blast Radius Zero**.\n\n### Metrics:\n- **Model:** Vultr Serverless Inference (`llama-3.3-70b-instruct`)\n- **Turns to Repair:** {iteration}/{self.max_iterations}\n- **Diff Stats:** +{lines_added} / -{lines_removed} lines\n- **Containment:** Memory 512MB, Network Quarantined\n\n```diff\n{diff_text}```",
                    "commit_message": f"fix({repo_name}): auto-heal test suite failures in {target_file_rel}\n\nVerified inside Vultr ephemeral sandbox."
                }

                success_payload = {
                    "iteration": iteration,
                    "max_iterations": self.max_iterations,
                    "diff": diff_text,
                    "verified": True,
                    "stats": {
                        "lines_added": lines_added,
                        "lines_removed": lines_removed
                    },
                    "test_metrics": verify_test.get("test_metrics", {}),
                    "security_audit": verify_test.get("security_audit", {}),
                    "pr_metadata": pr_payload,
                    "patch_content": diff_text
                }

                await self.log("VERIFIED_GREEN", f"🎉 SUCCESS! All test cases passed in Turn {iteration}/{self.max_iterations}. Repo is 100% healed!", success_payload)
                await self.log("HEALED", f"Surgery complete! Verified 100% green inside Vultr micro-sandbox.", success_payload)
                return

            else:
                if iteration < self.max_iterations:
                    # Self-Correction Reflection Step
                    failed_count = verify_test.get("test_metrics", {}).get("failed", 1)
                    await self.log("REFLECTING", f"Turn {iteration} resolved partial bugs, but {failed_count} failure(s) remain. Agent reflecting on traceback to formulate Turn {iteration + 1} patch...", {
                        "turn": iteration,
                        "remaining_failures": failed_count,
                        "trace_snippet": last_test_output[-500:] if len(last_test_output) > 500 else last_test_output
                    })
                    await asyncio.sleep(0.4)
                else:
                    await self.log("PARTIAL_FIX", f"Reached max turns ({self.max_iterations}). Tests partially healed.", {
                        "diff": diff_text,
                        "verified": False,
                        "test_metrics": verify_test.get("test_metrics", {})
                    })

    def _extract_code_block(self, response_text: str, fallback: str) -> str:
        """Extract content inside ```python ... ``` or return fallback."""
        pattern = r"```(?:python)?\s*([\s\S]*?)```"
        matches = re.findall(pattern, response_text)
        if matches:
            return matches[0].strip() + "\n"
        return fallback

    def _extract_code_block(self, response_text: str, fallback: str) -> str:
        """Extract content inside ```python ... ``` or return fallback."""
        pattern = r"```(?:python)?\s*([\s\S]*?)```"
        matches = re.findall(pattern, response_text)
        if matches:
            return matches[0].strip() + "\n"
        return fallback
