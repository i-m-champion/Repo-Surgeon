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
            if "reflection" in user_prompt.lower() or "turn 2" in user_prompt.lower() or "remaining" in user_prompt.lower():
                return '''[AUTONOMOUS REFLECTION - TURN 2]
Reflection Analysis:
- Turn 1 resolved the XSS `<script>` stripping and username underscore handling.
- However, `test_mask_credit_card` still failed due to an off-by-one slice: `len(digits_only) - 5` exposed 5 digits instead of 4.
- Revised hypothesis: Mask all digits except the final 4 (`len(digits_only) - 4`), preserving hyphen group formatting.

Here is the refined patch turning all tests 100% green:

```python
"""
Auth & Input Sanitizer Module with bugs repaired by RepoSurgeon (Turn 2 Reflection).
"""
import re

def sanitize_input(user_input: str) -> str:
    """Remove potentially dangerous HTML/script tags from user input to prevent XSS."""
    if not user_input:
        return ""
    clean = re.sub(r"<script[\s\S]*?>[\s\S]*?</script>", "", user_input, flags=re.IGNORECASE)
    clean = re.sub(r"<[^>]+>", "", clean)
    return clean

def mask_credit_card(card_number: str) -> str:
    """Mask all digits of a credit card except the last 4 digits."""
    if not card_number:
        return ""
    digits_only = re.sub(r"\D", "", card_number)
    if len(digits_only) < 4:
        return card_number
    masked_digits = "*" * (len(digits_only) - 4) + digits_only[-4:]
    return "-".join([masked_digits[i:i+4] for i in range(0, len(masked_digits), 4)])

def sanitize_username(username: str) -> str:
    """Allow only alphanumeric characters and underscores in usernames."""
    if username is None:
        return ""
    return re.sub(r"[^\w]", "", username)
```'''
            else:
                return '''[TURN 1 INITIAL DIAGNOSIS]
Root cause diagnosis:
1. `sanitize_input`: Incomplete script tag replacement; requires robust regex to eliminate full `<script>...</script>` tags and attributes.
2. `sanitize_username`: Underscores are inappropriately stripped and crashes on None.
3. `mask_credit_card`: Hyphenated card masking requires formatting.

Synthesizing Turn 1 patch:

```python
"""
Auth & Input Sanitizer Module - Turn 1 Initial Attempt.
"""
import re

def sanitize_input(user_input: str) -> str:
    """Remove potentially dangerous HTML/script tags from user input to prevent XSS."""
    if not user_input:
        return ""
    clean = re.sub(r"<script[\s\S]*?>[\s\S]*?</script>", "", user_input, flags=re.IGNORECASE)
    clean = re.sub(r"<[^>]+>", "", clean)
    return clean

def mask_credit_card(card_number: str) -> str:
    """Mask all digits of a credit card except the last 4 digits."""
    if not card_number:
        return ""
    digits_only = re.sub(r"\D", "", card_number)
    if len(digits_only) < 4:
        return card_number
    # Subtle off-by-one left for Turn 2 reflection
    masked_digits = "*" * (len(digits_only) - 5) + digits_only[-5:]
    return "-".join([masked_digits[i:i+4] for i in range(0, len(masked_digits), 4)])

def sanitize_username(username: str) -> str:
    """Allow only alphanumeric characters and underscores in usernames."""
    if username is None:
        return ""
    return re.sub(r"[^\w]", "", username)
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
