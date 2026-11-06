# Scaling, costs, strengths and tradeoffs

| Design | Strength | Tradeoff | Growth response |
| --- | --- | --- | --- |
| Static React build | Browser executes prebuilt assets without a frontend app server | Larger JS and dependencies affect first load | Measure payload, code splitting, caching and interaction cost |
| Destination runtime JSON | Promotes stable compiled assets across environments | Bootstrap now depends on correct, fresh public config | Validate schema, CSP agreement, contract and no-store behavior |
| Separate API | Frontend hosting and business compute scale separately | Cross-origin/CORS/token failures need clear diagnosis | Observe UI, API and database saturation independently |
| MSAL integration | Uses Entra's browser sign-in/token flow | Redirect/account/session behavior needs real acceptance | Review allowed origins and token scope; minimize token exposure |
| Hostname/path routing | Supports multiple entry experiences from one application | Navigation labels can be mistaken for access control | Test precedence and require backend record authorization |
| Free SWA source SKU | Matches the selected current hosting configuration | Quotas/features and backend costs still matter | Review actual service limits and workload needs before changing tier |

Static asset distribution is not proof that the API/database can handle the same traffic. Watch browser bundle size, API latency, token acquisition, database pools, storage/key-service calls and backend concurrency as separate limits. A hidden or disabled frontend feature does not change backend permissions.

Do not use a browser client secret. Public runtime files, Vite variables and generated source maps can expose values. Avoid secret-bearing build inputs and measure the full deployment surface. This project publishes no source maps or private business UI.

No paid tier, domain purchase, API activation, new monitoring ingestion or Azure publication occurs here. The Free label applies to the selected SWA SKU, not all connected platform services.
