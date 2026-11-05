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
        if "analyze" in user_prompt.lower() or "diagnosis" in user_prompt.lower():
            return json.dumps({
                "diagnosis": "Division by zero is not handled when b=0. Also power function has off-by-one exponent error.",
                "root_cause": "calculator.py line 14 has no check for ZeroDivisionError; line 22 computes a ** (b - 1).",
                "recommended_action": "Add validation for zero denominator and fix exponent equation."
            }, indent=2)
        else:
            return """```python
# Fixed version of calculator.py
def add(a: float, b: float) -> float:
    return a + b

def subtract(a: float, b: float) -> float:
    return a - b

def multiply(a: float, b: float) -> float:
    return a * b

def divide(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

def power(a: float, b: float) -> float:
    return a ** b
```"""

vultr_client = VultrInferenceClient()
