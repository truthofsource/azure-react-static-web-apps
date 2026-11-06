# Validation — November 6, 2026

The public reference passed local checks. No Azure resource was created or changed, no workflow was dispatched and no live identity/API call was made.

| Check | Observed result |
| --- | --- |
| Node runtime/config unit tests | 5 passed |
| Original API-error and hostname/path scripts | Both passed |
| Original Python runtime-writer tests | 5 passed |
| New Python staging tests | 4 passed |
| TypeScript and Vite production build | Passed |
| Terraform format, initialization and validation | Passed, signed AzureRM 4.81.0 provider |
| Terraform tests using simulated cloud responses | 2 passed; no cloud apply |
| Actionlint | Passed |
| Trivy secret scan of publishable source | No secret findings; not a dependency/OS vulnerability clearance |
| Local browser | Desktop, 390px mobile, navigation and deep-link refresh passed |
| Bootstrap failure/recovery | Invalid config displayed an error; reload recovered |
| Browser isolation | Zero external requests and zero page errors |
| Two destination overlays | Same compiled/static manifest; different runtime JSON hashes |

There are 14 unit-test cases plus two original JavaScript check scripts and two Terraform tests using simulated cloud responses. Screenshots were captured from the built local React reference, not the Azure-hosted production platform.

The preview does not implement Azure SWA hosting headers or authentication. MSAL integration is type-checked, but real sign-in, token validation, backend permission checks for the specific record, custom domains and hosted cache/CSP behavior remain outside this local acceptance. The manual validation workflow was reviewed but not run on GitHub.

[Machine-readable results](validation-results.json) retain the bundle and overlay hashes. The optional MSAL shell is not initialized by the offline preview.
