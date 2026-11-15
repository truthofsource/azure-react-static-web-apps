# React, Static Web Apps and the separate API

The actual browser application uses React/TypeScript and Vite. Azure Static Web Apps serves its compiled files, while a separately hosted Node.js API performs business operations and accesses SQL/private storage. This example does not bundle the backend into SWA-managed Functions.

Runtime settings load before code that reads identity/API configuration. The actual MSAL configuration uses the destination client and authority, origin-based sign-in/sign-out redirects and sessionStorage. The public React shell deliberately does not initialize it. [Optional provider shell](../frontend/src/auth/EntraShell.tsx).

The actual frontend chooses experiences by hostname/path. This is navigation, not permission: the backend still checks token, role, current account state and exact record access. A public staff-site bundle must not contain employee data or private credentials.

The SWA module owns hosting and optional domain bindings. Backend CORS, Entra app registrations/redirects, API roles, deployment identity, actual publication and testing in the hosted environment remain separate. Related [Node API deployment](https://github.com/truthofsource/azure-nodejs-api-deployment) and [identity boundaries](https://github.com/truthofsource/cloud-identity-access-automation) show those layers.
