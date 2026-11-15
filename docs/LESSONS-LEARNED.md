# Troubleshooting lessons from the actual platform

These are historical engineering incidents summarized from maintained internal records. They are not newly reproduced tests, a fresh cloud inventory or instructions to repeat a consumed operation. Names, resource identifiers, private payloads and credentials are excluded.

## The browser displayed a parsing error for a missing endpoint

**What happened.** Employee/client reference controls received empty 404 responses, and an older frontend then tried to parse the empty body as JSON.

**What the evidence showed.** The historical record identifies a frontend expecting backend endpoints absent from the deployed package. The JSON exception described the reader failure, not the underlying reason the expected route was missing.

**What changed and how it was checked.** The operating checks compared the frontend expectation with the actual deployed route set and backend publication. Response handling distinguished empty/non-JSON failures; Layer 34E introduced shared JSON handling while reference loading retained explicit text handling.

**What to carry forward.** Check status and response shape before JSON parsing, and keep frontend/backend release compatibility visible. A page deep-link fallback failure is a different path from an API 404; a 200 HTML shell does not prove a successful API response.

Source record: `docs/archive/common-careops-issues.md — Reference dropdown buttons return 404 / JSON.parse errors; docs/architecture/layer-34e-frontend-api-helper.md`. These internal paths identify provenance; they are not public file links.

## The test helper failed while the PDF was visible

**What happened.** Some protected-PDF checks stopped at a helper assertion or download operation even while the user could see the saved PDF.

**What the evidence showed.** Recorded causes included a browser-server client using Download.path(), an overbroad request mock intercepting internal viewer resources and a download wait matching the PDF viewer event rather than the intended PNG. These are distinct failures, not proof of a product authorization or PDF defect.

**What changed and how it was checked.** The relevant helpers used saveAs to an owned temporary file, checked actual bytes, preserved required viewer resources and selected the intended download. The fixes kept external traffic restrictions and access-denial checks rather than weakening the application to satisfy a faulty test.

**What to carry forward.** Validate the observation tool as well as the product. Authorized error-path probes can establish an access boundary without proving a successful business operation, and an attached frame is weaker evidence than visible rendering and correct downloaded bytes.

Source record: `docs/troubleshooting/vulnerability-scanning.md — November 4 compatibility and host-inventory lessons; docs/troubleshooting/employee-badge-photos.md — Portal test captures the wrong download`. These internal paths identify provenance; they are not public file links.

## Evidence and project boundaries

The local examples and screenshots in this repository remain separate from the dated hosted incidents above. A new documentation summary does not establish another successful deployment, restore, security scan or business transaction. Follow the repository’s existing validation guide for the commands and limits of the runnable reference.

The practical sequence is: identify the failing boundary, preserve safe correlation evidence, reconcile any uncertain result, apply only the relevant repair and verify the resulting state. A completed local command is not interchangeable with a completed cloud operation.

## Related project details

- [API route history](https://github.com/truthofsource/azure-api-routes/blob/main/docs/ROUTE-TROUBLESHOOTING.md)
