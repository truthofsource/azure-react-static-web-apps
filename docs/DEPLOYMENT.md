# Build once, validate the destination, publish prebuilt assets

The actual frontend build command is TypeScript project checking followed by Vite build. This sample retains that shape and selected locked React/Vite/MSAL versions while omitting business UI, PDF dependencies and the platform-specific job-title build plugin.

The actual production publisher uploads a selected prebuilt directory using Azure/static-web-apps-deploy with skip_app_build=true, empty api_location and empty output_location. [Inert publication excerpt](../reference/web-publication-step.yml.example). Its action commit is intentionally a placeholder for separate reviewed pinning; the file is not an active workflow or an authorization bypass.

Azure login and SWA upload use different trust steps. In the actual pipeline an authorized Azure session reads the target SWA deployment token, masks it and passes it to the upload action. Using OIDC for Azure login does not mean the upload action never needs a deployment token. Do not print the token or place it in a browser bundle/runtime file.

## Destination-owned public configuration

The same compiled JS/CSS can be promoted while a validated same-origin JSON file supplies API endpoint/scope and Entra identifiers. The actual writer rejects unexpected fields and supports artifact-option compatibility. The new public staging helper copies build output to a fresh owned destination, validates config/CSP agreement and records bundle/overlay hashes.

The compiled/static bundle is preserved while runtime JSON differs. Track those identities separately; do not claim every final deployed byte is identical when environment overlays change. Real source/archive selection and exact release authorization still belong to the trusted publisher.

This workflow validates/builds/stages locally only. It does not retrieve a SWA token, publish, modify DNS, start an API or test a live tenant. Future real publication needs exact target/source/artifact selection and hosted acceptance.
