# Runtime configuration and Entra integration

The actual loader validates apiBaseUrl, apiScope, entraTenantId, entraClientId and entraAuthority before dependent application code is imported. Optional visibility flags must be booleans; they are not backend permissions. A missing/invalid file should produce a visible bootstrap error and reload option rather than a partially initialized sign-in flow.

The public JSON is not a secret store. Entra tenant/client identifiers are configuration, not passwords; this project still uses fictional values for privacy. Vite environment variables embedded into a build are also browser-visible. Azure SWA application settings do not magically rewrite already-built JavaScript variables; the runtime JSON is an explicit application mechanism.

The included MSAL configuration and provider shell show the integration boundary: load destination config first, initialize PublicClientApplication, handle any redirect response and provide the instance to MsalProvider. A real registration must permit the exact SPA redirect/logout origin and the correct API delegated scope. The preview does not initialize this flow and no real sign-in was tested.

Backend token validation, current roles/record access and API CORS remain independent. sessionStorage is not a defense against script execution in the origin. CSP, dependency control and avoiding token/error leakage remain important.

Two public-only hardenings reject credentials in the authority URL and a nondefault API port. They are listed as adaptations; the private platform files were not changed by this project. The original API-host suffix validation is a format constraint, not authorization to call every azurewebsites.net service.
