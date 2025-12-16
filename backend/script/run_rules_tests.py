import os
import re
import sys
import unittest


# When this file is executed as a script (python script/run_rules_tests.py),
# Python puts the script directory (/app/script) on sys.path[0]. That prevents
# importing the sibling namespace package "script" from the project root.
# Add the project root (/app) explicitly.
_here = os.path.dirname(os.path.abspath(__file__))
_project_root = os.path.dirname(_here)
if _project_root not in sys.path:
    sys.path.insert(0, _project_root)


def _supports_color() -> bool:
    if os.environ.get("NO_COLOR"):
        return False
    return hasattr(sys.stdout, "isatty") and sys.stdout.isatty()


class _C:
    def __init__(self, enabled: bool):
        self.enabled = enabled

    def wrap(self, s: str, code: str) -> str:
        if not self.enabled:
            return s
        return f"\033[{code}m{s}\033[0m"

    def green(self, s: str) -> str:
        return self.wrap(s, "32")

    def red(self, s: str) -> str:
        return self.wrap(s, "31")

    def yellow(self, s: str) -> str:
        return self.wrap(s, "33")

    def cyan(self, s: str) -> str:
        return self.wrap(s, "36")


class ColoredTextTestResult(unittest.TextTestResult):
    _re_rule = re.compile(r"\btest_(R\d{2}[A-Z]?)\b")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.c = _C(_supports_color())

    def _rule_id(self, test) -> str:
        name = test.id().split(".")[-1]
        match = self._re_rule.search(name)
        return match.group(1) if match else name

    def _test_name(self, test) -> str:
        return test.id().split(".")[-1].replace("test_", "")

    def startTest(self, test):
        super().startTest(test)
        rule = self._rule_id(test)
        name = self._test_name(test)
        self.stream.writeln(self.c.cyan(f"→ [{rule}] {name}"))
        self.stream.flush()

    def addSuccess(self, test):
        super().addSuccess(test)
        self.stream.writeln(self.c.green("  OK"))
        self.stream.flush()

    def addFailure(self, test, err):
        super().addFailure(test, err)
        self.stream.writeln(self.c.red("  FAIL"))
        self.stream.flush()

    def addError(self, test, err):
        super().addError(test, err)
        self.stream.writeln(self.c.red("  ERROR"))
        self.stream.flush()

    def addSkip(self, test, reason):
        super().addSkip(test, reason)
        self.stream.writeln(self.c.yellow(f"  SKIP: {reason}"))
        self.stream.flush()


class ColoredTextTestRunner(unittest.TextTestRunner):
    resultclass = ColoredTextTestResult


if __name__ == "__main__":
    # Avoid duplicate prints from the test module when using this runner.
    os.environ["RULE_TEST_ANNOUNCE"] = "0"

    # Import module and run suite.
    from script import test_rules_unit

    suite = unittest.defaultTestLoader.loadTestsFromModule(test_rules_unit)
    runner = ColoredTextTestRunner(verbosity=0)
    result = runner.run(suite)
    raise SystemExit(0 if result.wasSuccessful() else 1)
