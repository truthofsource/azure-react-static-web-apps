"""Validate and write destination-owned public Workforce web configuration."""

import argparse
import json
import os
from pathlib import Path
import re
from urllib.parse import urlsplit

FIELDS = ("apiBaseUrl", "apiScope", "entraAuthority", "entraClientId", "entraTenantId")
GUID = re.compile(r"[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}", re.I)


def validate(value):
    if (not isinstance(value, dict) or not set(FIELDS).issubset(value)
            or not set(value).issubset(set(FIELDS) | {"employeeBadgesEnabled", "employeeProfilePhotosEnabled"})):
        raise ValueError("Invalid runtime configuration fields")
    if any(key in value and not isinstance(value[key], bool) for key in ("employeeBadgesEnabled", "employeeProfilePhotosEnabled")):
        raise ValueError("Invalid employee badge visibility flag")
    if any(not isinstance(value[key], str) or not value[key] or value[key] != value[key].strip() for key in FIELDS):
        raise ValueError("Invalid runtime configuration value")
    tenant, client = value["entraTenantId"].lower(), value["entraClientId"]
    if not GUID.fullmatch(tenant) or not GUID.fullmatch(client):
        raise ValueError("Invalid Entra identifiers")
    authority = urlsplit(value["entraAuthority"])
    if (authority.scheme, authority.netloc.lower(), authority.path, authority.query, authority.fragment) != (
        "https", "login.microsoftonline.com", "/" + tenant, "", ""
    ):
        raise ValueError("Invalid Entra authority")
    api = urlsplit(value["apiBaseUrl"])
    if (api.scheme != "https" or not api.hostname or not api.hostname.endswith(".azurewebsites.net")
            or api.username or api.password or api.port or api.path not in ("", "/") or api.query or api.fragment):
        raise ValueError("Invalid API URL")
    if not value["apiScope"].lower().startswith(f"api://{tenant}/") or not value["apiScope"].endswith("/access_as_user"):
        raise ValueError("Invalid API scope")
    return value


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("operation", choices=("write", "verify"))
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    if args.operation == "write":
        value = {
            "apiBaseUrl": os.environ.get("WORKFORCE_API_BASE_URL"),
            "apiScope": os.environ.get("WORKFORCE_API_SCOPE"),
            "entraAuthority": os.environ.get("WORKFORCE_ENTRA_AUTHORITY"),
            "entraClientId": os.environ.get("WORKFORCE_ENTRA_CLIENT_ID"),
            "entraTenantId": os.environ.get("WORKFORCE_ENTRA_TENANT_ID"),
        }
        badges = os.environ.get("WORKFORCE_EMPLOYEE_BADGES_ENABLED")
        if badges is not None:
            if badges not in ("true", "false"):
                raise ValueError("Badge visibility must be exactly true or false")
            value["employeeBadgesEnabled"] = badges == "true"
        photos = os.environ.get("WORKFORCE_EMPLOYEE_PROFILE_PHOTOS_ENABLED")
        contract_path = args.output.parent / "workforce-web-contract.json"
        if photos is not None:
            if photos not in ("true", "false"):
                raise ValueError("Photo visibility must be exactly true or false")
            if contract_path.exists():
                contract = json.loads(contract_path.read_text(encoding="utf-8"))
                if contract != {"schemaVersion": 1, "supportedRuntimeOptions": ["employeeBadgesEnabled", "employeeProfilePhotosEnabled"]}:
                    raise ValueError("Unsupported web runtime-option contract")
                value["employeeProfilePhotosEnabled"] = photos == "true"
        value = validate(value)
        if args.output.exists():
            raise ValueError("Refusing to replace an existing runtime configuration")
        args.output.write_text(json.dumps(value, sort_keys=True, separators=(",", ":")) + "\n", encoding="utf-8")
    else:
        validate(json.loads(args.output.read_text(encoding="utf-8")))
    print("Workforce public runtime configuration validated")


if __name__ == "__main__":
    main()
