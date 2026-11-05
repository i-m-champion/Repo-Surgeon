"""
Calculator Module with intentional bugs for RepoSurgeon to diagnose and repair.
"""

def add(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b

def subtract(a: float, b: float) -> float:
    """Subtract b from a (BUG: reversed operands)."""
    return b - a

def multiply(a: float, b: float) -> float:
    """Multiply two numbers."""
    return a * b

def divide(a: float, b: float) -> float:
    """
    Divide a by b.
    (BUG: Does not validate b == 0 to raise ValueError("Cannot divide by zero"))
    """
    return a / b

def power(a: float, b: float) -> float:
    """
    Raise a to the power of b.
    (BUG: off-by-one exponent error)
    """
    return a ** (b - 1)

