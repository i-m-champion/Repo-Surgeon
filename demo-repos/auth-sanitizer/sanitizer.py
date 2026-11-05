"""
Auth & Input Sanitizer Module with intentional security/regex bugs for RepoSurgeon to diagnose and heal.
"""
import re

def sanitize_input(user_input: str) -> str:
    """
    Remove potentially dangerous HTML/script tags from user input to prevent XSS.
    (BUG: Incomplete replacement leaves closing tags, uppercase tags, and attributes intact)
    """
    if not user_input:
        return ""
    # BUG: only replaces exact lowercase "<script>" string
    return user_input.replace("<script>", "")

def mask_credit_card(card_number: str) -> str:
    """
    Mask all digits of a credit card except the last 4 digits.
    Example: '4532-1234-5678-9010' -> '****-****-****-9010'
    (BUG: Off-by-one exposing 5 digits instead of 4)
    """
    if not card_number:
        return ""
    digits_only = re.sub(r"\D", "", card_number)
    if len(digits_only) < 4:
        return card_number
    # BUG: off-by-one slice error exposing 5 digits
    masked_digits = "*" * (len(digits_only) - 5) + digits_only[-5:]
    return "-".join([masked_digits[i:i+4] for i in range(0, len(masked_digits), 4)])

def sanitize_username(username: str) -> str:
    """
    Allow only alphanumeric characters and underscores in usernames.
    (BUG: Strips underscores and crashes if username is None)
    """
    if username is None:
        raise ValueError("Username cannot be None")
    # BUG: Strips valid underscores
    return re.sub(r"[^a-zA-Z0-9]", "", username)
