# SPA routing, security headers and caching

The actual staticwebapp.config.json defines an index.html navigation fallback. Assets and runtime JSON are excluded so missing configuration does not silently become an HTML page that later fails JSON parsing. A route explicitly marks the runtime file no-store with an application/json content type.

CSP constrains script/style/image/connect/frame/worker sources, and the configuration also carries nosniff, referrer, opener/resource, frame and permissions policies. API/login destinations must agree with runtime settings. The public staging helper checks its exact API origin against the reviewed connect-src list.

CSP connect-src is not backend CORS. CORS controls permitted browser origins at the API; CSP controls destinations the frontend may contact. Neither authenticates a user. Origin redirects and allowed Entra SPA URLs must also match.

The selected source keeps a protected-handoff route's no-referrer/no-store/noindex headers as an example. The minimal UI does not implement employee handoff screens. A staff/private portal hostname alone does not make static assets private.

Vite preview proves local rendering and history navigation, not SWA response headers or Azure authentication. This project's browser record explicitly marks hosted-header acceptance false. Actual hosted deep links, missing-asset behavior, headers, TLS/custom domains and cache behavior require a later real site check. [Microsoft configuration reference](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration).
