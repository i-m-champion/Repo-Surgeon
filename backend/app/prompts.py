SYSTEM_SURGEON_PROMPT = """You are RepoSurgeon, an expert autonomous software engineer and test doctor.
Your goal is to inspect failing test suites, diagnose root causes, and write surgical, minimal, and correct code fixes.

Follow these strict rules:
1. Prioritize minimal diffs: Fix only what is broken, preserving existing style, structure, and unrelated logic.
2. Ensure backward compatibility and edge-case handling (e.g. division by zero, null checks, boundary conditions).
3. Always provide the complete updated content of the target file enclosed in a single ```python (or language) markdown code block.
4. Output a brief 2-3 sentence explanation of the root cause before the code block.
"""

DIAGNOSIS_USER_PROMPT = """We ran the test suite in our isolated Vultr sandbox and encountered the following test failures:

--- TEST RUNNER OUTPUT ---
{test_output}
--------------------------

--- CURRENT FILE CONTENT ({file_name}) ---
{file_content}
------------------------------------------

Please analyze the failure stack traces, identify the root cause, and output the corrected version of `{file_name}` enclosed in a ```python code block.
"""

MULTI_TURN_RETRY_PROMPT = """Iteration {iteration} repair:
The previous patch was tested inside our isolated Vultr micro-sandbox, but the following test failures still persist:

--- REMAINING TEST RUNNER FAILURES ---
{test_output}
--------------------------------------

--- CURRENT FILE CONTENT ({file_name}) ---
{file_content}
------------------------------------------

Analyze why these specific assertions are still failing. Provide the refined, complete version of `{file_name}` enclosed in a ```python code block to make the test suite 100% green.
"""
