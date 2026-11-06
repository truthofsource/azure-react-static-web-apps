# Actual implementation and public adaptations

**Terms used here:** Provenance means the record of where a release came from and how it was produced.

| Public area | Relationship |
| --- | --- |
| frontend/src/lib/runtimeConfig.ts | Actual loader/validator; neutral labels; two additional public URL hardenings |
| frontend/src/lib/apiClient.ts | Actual response/error/retry guidance |
| frontend/src/lib/frontendExperience.ts | Actual hostname/path selection; neutral domains |
| frontend/src/auth/msalConfig.ts | Actual destination-based MSAL configuration |
| frontend/public/staticwebapp.config.json | Actual routing/headers with neutral API/runtime paths |
| frontend/scripts/test-api-client.mjs | Original API-error check script |
| frontend/scripts/test-frontend-experience.mjs | Original hostname/path section; unrelated full-portal page checks omitted |
| reference/web_runtime_config.py and its tests | Actual writer/validator and five original tests; neutral IDs/environment names |
| infra/*.tf | Actual SWA module, plus standalone provider and public defaults |
| frontend/src/App.tsx, main.tsx, CSS | New minimal offline React shell using the extracted modules |
| scripts/prepare_site.py and tests | New local bundle/config staging reference, not the private publisher |
| reference/web-publication-step.yml.example | Inert adaptation of prebuilt-upload inputs; no real token or active workflow |

[Machine provenance](source-map.json) records original input hashes. Identifying resource labels/domains and tenant/client IDs are replaced consistently. Private source history, raw release receipts and employee records are excluded.

The source build shape is retained, but the public Vite config omits the business-specific job-title plugin and the package omits unrelated application/PDF dependencies. Optional auth integration is type-checked but not initialized or accepted by the offline browser tests.
