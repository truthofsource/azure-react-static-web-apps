# Commands and expected results

Use Node 22 and Python 3.12. The checked-in npm lockfile pins the selected minimal dependencies. Default commands require no Azure credentials or real sign-in.

```bash
npm ci --prefix frontend --ignore-scripts --no-audit --no-fund
npm test --prefix frontend
npm run build --prefix frontend
python -B -m unittest discover -s reference -v
python -B -m unittest discover -s tests -v
```

Expected: original API-error and hostname/path scripts pass, five new browser runtime/config tests pass, five original runtime-writer tests pass and four new staging tests pass. Script checks contain multiple assertions and are not counted as invented individual test cases.

```bash
npm run preview --prefix frontend -- --port 4173
```

Open http://localhost:4173. Use localhost because the actual validator restricts insecure development origins. The first process stays running; Ctrl+C stops it. PowerShell may use npm.cmd. The offline page will not open Microsoft sign-in or fetch the example API.

```bash
python -B scripts/prepare_site.py --config config/nonproduction.example.json --output .release/nonproduction
python -B scripts/prepare_site.py --config config/production.example.json --output .release/production
```

Run staging with new output paths. Existing/overlapping outputs are rejected. Expected: identical bundle manifest hash, different runtime JSON hashes and published=false. These are local directories, not uploads.

```bash
terraform -chdir=infra init -backend=false -input=false
terraform -chdir=infra fmt -check -recursive
terraform -chdir=infra validate
terraform -chdir=infra test
```

Expected: two mock plans and no apply. Provider initialization needs its registry or a verified local cache. No deploy command, token-retrieval command or mutating domain instruction is run for this portfolio.
