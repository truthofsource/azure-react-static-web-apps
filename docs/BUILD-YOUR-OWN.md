# Build your own from scratch: Azure React Static Web Apps

Your own React page built locally and deployed to a new Azure Static Web App from your own GitHub repository.

Start with a new folder, your own files and your own accounts. The numbered steps below describe the build; no portfolio repository checkout is required. The existing implementation/evidence elsewhere in this repository is a separate reference, not a claim that your new build has already passed.

## Prerequisites

A Node version supported by your chosen Vite release; npm; Git; your own GitHub and Azure accounts; permission to create a Static Web App and its deployment workflow.

Use Bash on Linux/macOS/WSL for Bash blocks and PowerShell for PowerShell blocks. Select the tool versions supported by the official sources below, record the versions you actually install and retain generated dependency locks. Cloud resources, scanner downloads, logs and external AI calls can create costs; review the stated scope before enabling them.

## Create your project folder

Choose a new folder name. These first commands create a blank project; an optional `git init` gives it its own history. Create parent directories in your editor when a later step introduces a nested file.

```bash
mkdir my-azure-react-static-web-apps
cd my-azure-react-static-web-apps
git init
```

Create `.gitignore` before saving credentials or build outputs:

```gitignore
.venv/
node_modules/
.env
.env.*
local.settings.json
credentials.json
token.json
*.pem
*.key
*.tfstate*
*.tfplan
.terraform/
private*/
captures/
backups/
batch.json
reports/
out/
app-config.local.yaml
```

The source/file snippets are a starting implementation you type or paste into the named files. Replace `YOUR_*`, names, regions and addresses only with values from your own lab; do not place real client/employee records in a test project. Keep your terminal in this project root unless a step explicitly changes directory.

Before a first commit, set your own repository-local author with `git config user.name "YOUR_NAME"` and `git config user.email "YOUR_PUBLIC_COMMIT_EMAIL"`. Review `git status --short` and the staged diff before publishing; ignored local files are not a substitute for reviewing what you upload.

## Step 1 — Create a new React app

**Where:** A parent folder on your workstation.

Use Vite to scaffold a new app called my-portal, then install its dependencies. Record the resolved tool versions and retain package-lock.json rather than relying on an unrecorded future generator version.

```bash
npm create vite@latest my-portal -- --template react
cd my-portal
npm install
```

**Check before continuing:** You have a new app with its own source, package.json and dependency lock.

## Step 2 — Write your own page

**Where:** my-portal/src/App.jsx.

Replace the example component with the code below. Start with harmless local content so a deployment or screenshot cannot disclose employee information.

Create **`src/App.jsx`** with the following contents:

```jsx
export default function App() {
  return <main style={{maxWidth: 760, margin: '3rem auto', padding: '1rem'}}>
    <h1>My operations portal</h1>
    <p>A small React site deployed through my own release pipeline.</p>
    <section><h2>Service status</h2><p>This first build has no live backend.</p></section>
  </main>;
}
```

**Check before continuing:** The page displays your own service name and purpose.

## Step 3 — Test the production build locally

**Where:** Your app folder.

Run the build and preview, then open the URL printed by Vite. Check the browser console and the page on a narrow screen before publishing.

```bash
npm run build
npm run preview
```

**Check before continuing:** dist exists and your production bundle loads without an assumed backend.

## Step 4 — Create your own remote repository

**Where:** Your app folder and GitHub.

Initialize Git, ignore node_modules and local secrets, commit your source and lockfile, and create an empty repository in your own account. Add that repository as origin and push your branch; no existing portfolio checkout is involved.

```bash
git init
git add .
git commit -m "Create my React portal"
# Create an empty repository in your account, then:
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_NEW_REPOSITORY.git
git push -u origin main
```

**Check before continuing:** Your own repository contains the app you just wrote.

## Step 5 — Configure Static Web Apps

**Where:** Azure Portal → Static Web Apps → Create.

Choose your own repository and branch, React preset, app location /, output location dist and no API location for this frontend-only build. Review the plan and generated workflow; its deployment credential belongs in the generated GitHub secret, never in source.

**Check before continuing:** The generated workflow builds this app and publishes its dist output.

## Step 6 — Verify the hosted page and your update path

**Where:** Azure Portal deployment URL and GitHub Actions.

Wait for a successful deployment, open the hosted URL and confirm the page content. Change your own heading, commit it and verify a new successful deployment; then configure identity and backend calls as separate, tested additions.

**Check before continuing:** Your own source change reaches the intended hosted page.

## Step 7 — Record and clean up

**Where:** Your evidence folder and Azure Portal.

Capture the page, build settings and deployment run without tokens or private account details. Delete the dedicated Static Web App when finished and account for any separately created domains or backend resources.

**Check before continuing:** The build and publication steps can be followed by someone with their own accounts.

## Verification and your own screenshots

| Evidence | What to record | Your result |
| --- | --- | --- |
| New build | Your own files/resource settings and tool versions | Not yet recorded |
| Working path | The actual successful request, configuration or recovery result | Not yet recorded |
| Failure boundary | A meaningful denied, malformed, stale or failed case | Not yet recorded |
| Recovery / cleanup | What you restored or removed and what remains billed | Not yet recorded |

Capture your own architecture/configuration, one working result and one failure/recovery result. Keep tokens, credentials, personal records and private identifiers out of public screenshots. The architecture diagram explains the design; record your own results rather than treating it as execution evidence.

## Troubleshooting order

1. Confirm the named file, working directory and selected tool/interpreter.
2. Check the exact input and resource/account selected for the failing step.
3. Separate identity permission, network/DNS reachability and application validation.
4. Keep the actual error and reconcile an unknown write outcome before repeating it; do not widen access or repeat paid operations blindly.

The numbered steps describe a build procedure. Local syntax checks, an accepted API request, a completed hosted operation and a human verification are different evidence levels; fill in the verification table with what you actually observed.

## Official implementation references

- [learn.microsoft.com — getting-started](https://learn.microsoft.com/en-us/azure/static-web-apps/getting-started)
- [vite.dev — guide](https://vite.dev/guide/)

The walkthrough layout follows the prerequisites → creation/configuration → test → verification → troubleshooting → cleanup pattern of the [Splunk project reference](https://github.com/davidharris6/splunk-siem-log-analysis). Its Splunk-specific settings are not copied into unrelated projects.
