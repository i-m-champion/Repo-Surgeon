import os
import sys
import shutil
import tempfile
import time
import subprocess
from typing import Dict, Any, Optional
from app.config import settings

try:
    import docker
    docker_client = docker.from_env()
except Exception:
    docker_client = None

class SandboxManager:
    """
    Manages isolated execution environments enforcing 'Blast Radius Zero'.
    Runs untrusted commands inside isolated Docker containers or ephemeral restricted sub-processes.
    """
    def __init__(self):
        self.image_name = "reposurgeon-sandbox:latest"
        self.has_docker = docker_client is not None
        self._ensure_image()

    def _ensure_image(self):
        """Verify or build the sandbox image if Docker is active."""
        if not self.has_docker:
            return
        try:
            docker_client.images.get(self.image_name)
        except Exception:
            # Fallback to python:3.11-slim if custom image not yet built
            self.image_name = "python:3.11-slim"

    def execute_in_sandbox(
        self,
        repo_dir: str,
        command: str,
        timeout: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Executes a command inside an isolated sandbox with strict resource boundaries.
        Returns execution telemetry, stdout, stderr, and exit code.
        """
        timeout = timeout or settings.SANDBOX_TIMEOUT_SECONDS
        start_time = time.time()
        
        # Create an ephemeral isolated copy of the repository
        temp_run_dir = tempfile.mkdtemp(prefix="reposurgeon_sandbox_")
        shutil.copytree(repo_dir, temp_run_dir, dirs_exist_ok=True)

        try:
            if self.has_docker and settings.USE_DOCKER_SANDBOX:
                return self._run_docker_container(temp_run_dir, command, timeout, start_time)
            else:
                return self._run_isolated_subprocess(temp_run_dir, command, timeout, start_time)
        finally:
            # Lifecycle hygiene: Cleanup ephemeral sandbox disk space
            shutil.rmtree(temp_run_dir, ignore_errors=True)

    def _run_docker_container(self, workdir: str, command: str, timeout: int, start_time: float) -> Dict[str, Any]:
        """Run inside disposable Docker container with strict CPU & memory caps."""
        container = None
        try:
            container = docker_client.containers.create(
                image=self.image_name,
                command=["bash", "-c", command],
                volumes={workdir: {"bind": "/workspace", "mode": "rw"}},
                working_dir="/workspace",
                mem_limit=settings.SANDBOX_MEMORY_LIMIT,
                nano_cpus=int(settings.SANDBOX_CPU_LIMIT * 1e9),
                network_mode="none",  # Blast Radius Zero: Network quarantined
                user="10001",         # Non-root user
                detach=True
            )
            container.start()
            
            # Wait with strict timeout enforcement
            result = container.wait(timeout=timeout)
            logs = container.logs(stdout=True, stderr=True).decode("utf-8", errors="replace")
            duration = round(time.time() - start_time, 2)
            
            return {
                "exit_code": result.get("StatusCode", 0),
                "output": logs,
                "duration_seconds": duration,
                "isolation_mode": "Docker Micro-Sandbox (Blast Radius Zero)",
                "limits": {
                    "memory": settings.SANDBOX_MEMORY_LIMIT,
                    "cpu": f"{settings.SANDBOX_CPU_LIMIT} cores",
                    "network": "Quarantined (none)"
                },
                "status": "PASS" if result.get("StatusCode", 0) == 0 else "FAIL"
            }
        except Exception as e:
            duration = round(time.time() - start_time, 2)
            return {
                "exit_code": 1,
                "output": f"Sandbox execution terminated / error: {str(e)}",
                "duration_seconds": duration,
                "isolation_mode": "Docker Micro-Sandbox (Blast Radius Zero)",
                "status": "ERROR"
            }
        finally:
            if container:
                try:
                    container.remove(force=True)
                except Exception:
                    pass

    def _run_isolated_subprocess(self, workdir: str, command: str, timeout: int, start_time: float) -> Dict[str, Any]:
        """Ephemeral fallback isolation runner when Docker daemon is not active."""
        try:
            # Strip dangerous environment variables to protect secrets, while keeping runner executables
            bin_dir = os.path.dirname(sys.executable)
            current_path = os.environ.get("PATH", "/usr/bin:/bin")
            safe_path = f"{bin_dir}:{current_path}" if bin_dir and bin_dir not in current_path else current_path
            
            clean_env = {
                "PATH": safe_path,
                "PYTHONPATH": workdir,
                "HOME": workdir,
                "LANG": "en_US.UTF-8"
            }
            
            proc = subprocess.run(
                command,
                shell=True,
                cwd=workdir,
                env=clean_env,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                timeout=timeout,
                text=True
            )
            duration = round(time.time() - start_time, 2)
            return {
                "exit_code": proc.returncode,
                "output": proc.stdout,
                "duration_seconds": duration,
                "isolation_mode": "Subprocess Quarantine (Secret-Sanitized Fallback)",
                "limits": {
                    "timeout": f"{timeout}s",
                    "network": "Host Network (Docker recommended for full network quarantine)"
                },
                "status": "PASS" if proc.returncode == 0 else "FAIL"
            }
        except subprocess.TimeoutExpired:
            duration = round(time.time() - start_time, 2)
            return {
                "exit_code": 124,
                "output": f"Execution timed out after {timeout} seconds. Process safely terminated.",
                "duration_seconds": duration,
                "isolation_mode": "Subprocess Quarantine",
                "status": "TIMEOUT"
            }
        except Exception as e:
            duration = round(time.time() - start_time, 2)
            return {
                "exit_code": 1,
                "output": f"Execution error: {str(e)}",
                "duration_seconds": duration,
                "isolation_mode": "Subprocess Quarantine",
                "status": "ERROR"
            }

sandbox_manager = SandboxManager()
