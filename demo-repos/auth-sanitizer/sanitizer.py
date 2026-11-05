"""
Auth & Input Sanitizer Module with intentional security/logic bugs for RepoSurgeon to heal.
"""
import re
import hashlib

def sanitize_username(username: str) -> str:
    """
    Sanitize username: allow only alphanumeric and underscores.
    (BUG: fails when username is empty string)
    """
    if username is None:
        return ""
    return re.sub(r"[^\w]", "", username)

def validate_password_strength(password: str) -> bool:
    """
    Password must be at least 8 chars, contain at least 1 digit and 1 uppercase letter.
    (BUG: requires len < 12 instead of 8, rejecting valid 8-11 character passwords)
    """
    if len(password) < 12:
        return False
    has_digit = any(c.isdigit() for c in password)
    has_upper = any(c.isupper() for c in password)
    return has_digit and has_upper

def hash_secret_token(token: str, salt: str = "vultr_salt") -> str:
    """
    Hash a secret token using sha256 with salt.
    (BUG: does not validate empty token to raise ValueError("Token cannot be empty"))
    """
    return hashlib.sha256(f"{salt}:{token}".encode("utf-8")).hexdigest()

def escape_sql_fragment(value: str) -> str:
    """
    Escape single quotes and SQL comment delimiters to prevent SQL injection.
    (BUG: leaves SQL comment delimiter '--' intact and does not double quotes)
    """
    if not isinstance(value, str):
        return ""
    return value.replace("'", "\\'")
