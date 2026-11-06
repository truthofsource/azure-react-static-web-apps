# Actual Static Web Apps module

The source module defines the web resource group, Static Web App and optional public/staff custom-domain bindings. The public root supplies a provider and example defaults: Free SKU, custom domains Off and neutral example hostnames. Production's actual root selects Free and retains existing domain resources/lifecycle separately; this public root must not be used to adopt those live bindings.

The original repository_url/repository_branch lifecycle ignores are retained because the platform's controlled publication path owns source attachment rather than this module changing it on every apply. This is a source ownership decision, not evidence of an active public workflow or token grant.

```bash
terraform -chdir=infra init -backend=false -input=false
terraform -chdir=infra validate
terraform -chdir=infra test
```

Two mock tests cover Free SKU/default domain absence and explicit hostname/delegation inputs. They do not verify DNS ownership, TLS issuance, cloud availability or authentication. There is no backend API, Entra app, CORS rule, production hostname, deploy token or publication role created here.

Names/defaults are placeholders and real applies can create resources or change domain binding. Keep state, saved plans and private inputs out of Git. No Terraform apply is part of this project.
