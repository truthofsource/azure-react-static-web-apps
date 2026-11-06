# Frontend deployment troubleshooting

**Terms used here:** DNS turns a service name into the network address used to reach it.

| Symptom | Investigate | Next step |
| --- | --- | --- |
| UI cannot initialize | Missing/invalid runtime JSON, HTML fallback, wrong cache state | Inspect the expected public file and bootstrap error; do not start sign-in with partial config |
| Deep link fails after refresh | SWA config missing from output root or fallback/exclusions wrong | Check built dist config and actual hosted response |
| Sign-in loops or redirect failure | SPA origin/redirect/logout URL, tenant/client mismatch, initialization ordering | Verify exact destination registration and runtime config; avoid blind repeated login |
| API fetch fails | API may be Disabled; wrong URL, CORS, CSP, DNS or expired session | Read safe status/error detail and actual service state; a web deploy does not turn the API on |
| JSON parsing gets HTML | Missing runtime/API resource rewritten as index | Check route and fallback exclusions rather than hiding the parsing error |
| Old values remain after publication | Cached runtime JSON or a stale deployment overlay | Compare config hash and actual cache headers; keep bundle identity separate |
| Save result is uncertain | Request timed out or response unreadable after a possible write | Reload saved status before retrying; the actual API client explains this distinction |
| Private portal assumed private | Hostname/route labels confused with data authorization | Verify backend enforcement; static JS contains no confidential business data |

Do not log bearer tokens, sensitive link fragments, employee details or a raw deployment-secret response. The original helper strips a private handoff fragment into in-memory state when that flow is used; this minimal shell does not exercise it. Frontend retry guidance is not permission to repeat a business transaction.
