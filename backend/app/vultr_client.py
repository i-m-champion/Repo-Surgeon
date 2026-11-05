import json
import time
from typing import Dict, Any, Tuple
from openai import OpenAI
from app.config import settings

class VultrInferenceClient:
    def __init__(self):
        self.api_key = settings.VULTR_API_KEY
        self.base_url = settings.VULTR_INFERENCE_BASE_URL
        self.model = settings.VULTR_MODEL
        
        if self.api_key:
            self.client = OpenAI(
                api_key=self.api_key,
                base_url=self.base_url
            )
        else:
            self.client = None

    def query(self, system_prompt: str, user_prompt: str, temperature: float = 0.2) -> Tuple[str, Dict[str, Any]]:
        """
        Query Vultr Serverless Inference with system & user prompt.
        Returns response content and telemetry (latency, model, endpoint).
        """
        start = time.time()
        if not self.client:
            # Fallback mock for testing when VULTR_API_KEY is pending
            content = self._mock_response(user_prompt)
            latency = round((time.time() - start) * 1000, 1)
            return content, {
                "model": f"{self.model} (Vultr Mock Fallback)",
                "latency_ms": latency,
                "endpoint": self.base_url,
                "tokens_estimated": len(content.split()) * 2
            }

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=temperature,
                max_tokens=2048
            )
            latency = round((time.time() - start) * 1000, 1)
            content = response.choices[0].message.content or ""
            usage = getattr(response, "usage", None)
            return content, {
                "model": self.model,
                "latency_ms": latency,
                "endpoint": self.base_url,
                "prompt_tokens": getattr(usage, "prompt_tokens", 0) if usage else 0,
                "completion_tokens": getattr(usage, "completion_tokens", 0) if usage else 0,
                "total_tokens": getattr(usage, "total_tokens", 0) if usage else 0
            }
        except Exception as e:
            latency = round((time.time() - start) * 1000, 1)
            error_msg = f"Error contacting Vultr Serverless Inference ({str(e)}). Ensure VULTR_API_KEY is valid."
            return error_msg, {
                "model": self.model,
                "latency_ms": latency,
                "endpoint": self.base_url,
                "error": str(e)
            }

    def _mock_response(self, user_prompt: str) -> str:
        """Simulated response for initial setup when API key is pending."""
        if "sanitizer" in user_prompt.lower():
            return '''Root cause diagnosis:
1. `validate_password_strength`: Requires `len < 12` instead of `>= 8`, rejecting valid 8-11 character passwords.
2. `hash_secret_token`: Missing validation check `if not token:` to raise `ValueError("Token cannot be empty")`.
3. `escape_sql_fragment`: Leaves SQL comment delimiters `--` intact and fails to escape quotes as double single-quotes.

Here is the surgical patch fixing all identified security vulnerabilities:

```python
"""
Auth & Input Sanitizer Module with intentional security/logic bugs repaired by RepoSurgeon.
"""
import re
import hashlib

def sanitize_username(username: str) -> str:
    """Sanitize username: allow only alphanumeric and underscores."""
    if not username:
        return ""
    return re.sub(r"[^\w]", "", username)

def validate_password_strength(password: str) -> bool:
    """Password must be at least 8 chars, contain at least 1 digit and 1 uppercase letter."""
    if len(password) < 8:
        return False
    has_digit = any(c.isdigit() for c in password)
    has_upper = any(c.isupper() for c in password)
    return has_digit and has_upper

def hash_secret_token(token: str, salt: str = "vultr_salt") -> str:
    """Hash a secret token using sha256 with salt."""
    if not token:
        raise ValueError("Token cannot be empty")
    return hashlib.sha256(f"{salt}:{token}".encode("utf-8")).hexdigest()

def escape_sql_fragment(value: str) -> str:
    """Escape single quotes and SQL comment delimiters to prevent SQL injection."""
    if not isinstance(value, str):
        return ""
    return value.replace("'", "''").replace("--", "")
```'''

        return '''Root cause diagnosis:
1. `subtract`: Reversed operands (`b - a` instead of `a - b`), causing negative difference assertions to fail.
2. `divide`: Missing validation for `b == 0` to raise `ValueError("Cannot divide by zero")`.
3. `power`: Off-by-one exponent bug (`a ** (b - 1)` instead of `a ** b`).

Here is the surgical patch fixing all identified bugs while preserving the API:

```python
"""
Calculator Module with intentional bugs repaired by RepoSurgeon.
"""

def add(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b

def subtract(a: float, b: float) -> float:
    """Subtract b from a."""
    return a - b

def multiply(a: float, b: float) -> float:
    """Multiply two numbers."""
    return a * b

def divide(a: float, b: float) -> float:
    """
    Divide a by b.
    Validates b != 0 to prevent unhandled ZeroDivisionError.
    """
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

def power(a: float, b: float) -> float:
    """
    Raise a to the power of b.
    """
    return a ** b
```'''

vultr_client = VultrInferenceClient()
