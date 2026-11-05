import os
import socket
import pytest
from sanitizer import sanitize_input, mask_credit_card, sanitize_username

def test_sanitize_input():
    # Will fail initially: sanitizer.py only replaces lowercase <script> without closing tag
    payload = "<script>alert('pwned')</script>Welcome"
    assert sanitize_input(payload) == "Welcome"
    assert "<script" not in sanitize_input("<SCRIPT SRC='bad.js'></SCRIPT>").lower()

def test_mask_credit_card():
    # Will fail initially: off-by-one exposing 5 digits
    raw = "4532-1234-5678-9010"
    expected = "****-****-****-9010"
    assert mask_credit_card(raw) == expected

def test_sanitize_username():
    # Will fail initially: strips underscores and raises on None
    assert sanitize_username("admin_user_99") == "admin_user_99"
    assert sanitize_username("bad!@#user$") == "baduser"
    assert sanitize_username(None) == ""

def test_untrusted_exploit_sandbox():
    """
    ADVERSARIAL SECURITY TRAP TEST:
    Simulates untrusted adversarial code injected into the test suite trying to break out:
    1. Secret Exfiltration: Probing host environment for VULTR_API_KEY.
    2. Root Filesystem Tampering: Writing exploit payload to /etc/system-leak.txt.
    3. Network Quarantine Egress: Initiating raw socket connection to external IP (1.1.1.1:80).

    Inside RepoSurgeon's Vultr micro-sandbox (Blast Radius Zero), all 3 vectors MUST fail safely!
    """
    # Vector 1: Secret exfiltration probe
    vultr_key = os.environ.get("VULTR_API_KEY")
    if vultr_key:
        pytest.fail(f"CRITICAL BREACH: Host VULTR_API_KEY exposed in execution context: {vultr_key[:4]}...")
    print("\n[SANDBOX AUDIT] Host secret probe detected: VULTR_API_KEY is NULL (Sanitized)")

    # Vector 2: Privilege escalation / root filesystem tampering
    try:
        with open("/etc/system-leak.txt", "w") as f:
            f.write("CONTAINMENT_BREACHED")
        pytest.fail("CRITICAL BREACH: Wrote to /etc/system-leak.txt! Root boundary broken.")
    except (PermissionError, OSError) as e:
        print(f"[SANDBOX AUDIT] Root path write blocked: {e} (UID 10001 enforced)")

    # Vector 3: Network quarantine egress attempt
    try:
        s = socket.create_connection(("1.1.1.1", 80), timeout=1)
        s.close()
        pytest.fail("CRITICAL BREACH: Outbound socket egress permitted! Network isolation broken.")
    except (OSError, socket.error) as e:
        print(f"[SANDBOX AUDIT] Network egress blocked: {e} (Network Quarantined)")
