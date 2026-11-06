import unittest
import json
import tempfile
from pathlib import Path
from unittest.mock import patch
import web_runtime_config as runtime

from web_runtime_config import validate


VALID = {
    "apiBaseUrl": "https://func-example-api-nonproduction.azurewebsites.net",
    "apiScope": "api://00000000-0000-4000-8000-000000000001/esi-workforce-api-nonproduction/access_as_user",
    "entraAuthority": "https://login.microsoftonline.com/00000000-0000-4000-8000-000000000001",
    "entraClientId": "00000000-0000-4000-8000-000000000002",
    "entraTenantId": "00000000-0000-4000-8000-000000000001",
}


class RuntimeConfigTests(unittest.TestCase):
    def test_accepts_expected_public_config(self):
        self.assertEqual(validate(VALID.copy()), VALID)

    def test_badge_visibility_is_optional_and_boolean_only(self):
        for enabled in (True, False):
            value = {**VALID, "employeeBadgesEnabled": enabled}
            self.assertEqual(validate(value), value)
        for invalid in ("true", "false", 0, 1, None, {}):
            with self.subTest(value=invalid), self.assertRaises(ValueError):
                validate({**VALID, "employeeBadgesEnabled": invalid})

    def test_profile_photo_visibility_is_optional_boolean_only(self):
        for enabled in (True, False):
            self.assertEqual(validate({**VALID, "employeeProfilePhotosEnabled": enabled})["employeeProfilePhotosEnabled"], enabled)
        for invalid in ("true", 1, None, {}):
            with self.assertRaises(ValueError):
                validate({**VALID, "employeeProfilePhotosEnabled": invalid})

    def test_photo_flag_is_not_injected_into_an_older_artifact_on_rollback(self):
        env = {"WORKFORCE_" + key: value for key, value in {
            "API_BASE_URL": VALID["apiBaseUrl"], "API_SCOPE": VALID["apiScope"],
            "ENTRA_AUTHORITY": VALID["entraAuthority"], "ENTRA_CLIENT_ID": VALID["entraClientId"],
            "ENTRA_TENANT_ID": VALID["entraTenantId"], "EMPLOYEE_PROFILE_PHOTOS_ENABLED": "true",
        }.items()}
        with tempfile.TemporaryDirectory() as directory, patch.dict("os.environ", env, clear=True):
            folder = Path(directory)
            old = folder / "old.json"
            with patch("sys.argv", ["runtime", "write", "--output", str(old)]):
                runtime.main()
            self.assertNotIn("employeeProfilePhotosEnabled", json.loads(old.read_text(encoding="utf-8")))
            (folder / "workforce-web-contract.json").write_text(json.dumps({"schemaVersion": 1, "supportedRuntimeOptions": ["employeeBadgesEnabled", "employeeProfilePhotosEnabled"]}), encoding="utf-8")
            new = folder / "new.json"
            with patch("sys.argv", ["runtime", "write", "--output", str(new)]):
                runtime.main()
            self.assertTrue(json.loads(new.read_text(encoding="utf-8"))["employeeProfilePhotosEnabled"])

    def test_rejects_invalid_or_extra_values(self):
        for replacement in (
            {"apiBaseUrl": "https://evil.example"},
            {"apiBaseUrl": "https://user:pass@evil.azurewebsites.net"},
            {"entraAuthority": "https://login.microsoftonline.com/other"},
            {"apiScope": "api://other/access_as_user"},
            {"entraClientId": "not-a-guid"},
            {"extra": "value"},
        ):
            with self.subTest(replacement=replacement), self.assertRaises(ValueError):
                validate({**VALID, **replacement})


if __name__ == "__main__":
    unittest.main()
