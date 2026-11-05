import json
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

    def query(self, system_prompt: str, user_prompt: str, temperature: float = 0.2) -> str:
        """Query Vultr Serverless Inference with system & user prompt."""
        if not self.client:
            # Fallback mock for testing when VULTR_API_KEY is not yet populated
            return self._mock_response(user_prompt)

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
            return response.choices[0].message.content
        except Exception as e:
            return f"Error contacting Vultr Serverless Inference ({str(e)}). Ensure VULTR_API_KEY is valid."

    def _mock_response(self, user_prompt: str) -> str:
        """Simulated response for initial setup when API key is pending."""
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
