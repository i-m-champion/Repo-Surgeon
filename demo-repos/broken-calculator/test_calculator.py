import pytest
from calculator import add, subtract, multiply, divide, power

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0

def test_multiply():
    assert multiply(3, 4) == 12
    assert multiply(0, 100) == 0

def test_subtract():
    # Will fail initially: 10 - 4 should be 6, but calculator returns 4 - 10 = -6
    assert subtract(10, 4) == 6

def test_divide_by_zero():
    # Will fail initially: should raise ValueError("Cannot divide by zero")
    with pytest.raises(ValueError, match="Cannot divide by zero"):
        divide(10, 0)

def test_power():
    # Will fail initially: 2 ** 3 should be 8, but returns 2 ** 2 = 4
    assert power(2, 3) == 8
    assert power(5, 2) == 25
