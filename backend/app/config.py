import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    VULTR_API_KEY: str = os.getenv("VULTR_API_KEY", "")
    VULTR_INFERENCE_BASE_URL: str = os.getenv("VULTR_INFERENCE_BASE_URL", "https://api.vultrinference.com/v1")
    VULTR_MODEL: str = os.getenv("VULTR_MODEL", "llama-3.3-70b-instruct")
    
    SANDBOX_TIMEOUT_SECONDS: int = int(os.getenv("SANDBOX_TIMEOUT_SECONDS", "45"))
    SANDBOX_MEMORY_LIMIT: str = os.getenv("SANDBOX_MEMORY_LIMIT", "512m")
    SANDBOX_CPU_LIMIT: float = float(os.getenv("SANDBOX_CPU_LIMIT", "1.0"))
    USE_DOCKER_SANDBOX: bool = os.getenv("USE_DOCKER_SANDBOX", "true").lower() == "true"
    
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
