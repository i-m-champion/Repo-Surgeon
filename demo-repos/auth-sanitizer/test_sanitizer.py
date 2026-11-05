import pytest
from sanitizer import sanitize_username, validate_password_strength, hash_secret_token, escape_sql_fragment

def test_sanitize_username():
    assert sanitize_username("admin_user!@#$") == "admin_user"
    assert sanitize_username("") == ""

def test_validate_password_strength_valid():
    # Valid 8-char password with uppercase & digit
    assert validate_password_strength("Pass1234") is True
    assert validate_password_strength("Security99") is True

def test_validate_password_strength_invalid():
    # Too short or missing criteria
    assert validate_password_strength("pass") is False
    assert validate_password_strength("onlylowercase") is False

def test_hash_secret_token_empty():
    # Must raise ValueError on empty string
    with pytest.raises(ValueError, match="Token cannot be empty"):
        hash_secret_token("")

def test_escape_sql_fragment():
    malicious = "admin' OR '1'='1' --"
    sanitized = escape_sql_fragment(malicious)
    assert "--" not in sanitized
    assert "''" in sanitized
