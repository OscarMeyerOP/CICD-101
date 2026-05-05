# Instructor Guide

## Course Intent
This lab introduces CI/CD through a small TypeScript project that feels close to data work without requiring any local setup. Students stay inside GitHub, edit only workflow YAML, and learn how CI pipelines are assembled from triggers, jobs, steps, artifacts, and live deployments.

## Recommended Audience
- beginner to early-intermediate technical users
- data science students with limited DevOps exposure

## Recommended Timing
- 0:00-0:20 introduction and CI/CD concepts
- 0:20-0:35 fork repo, enable Pages, inspect starter workflow
- 0:35-1:20 build the CI job in GitHub (Part 3)
- 1:20-1:50 add the CD job with Pages deployment (Part 4)
- 1:50-2:00 debrief and optional extensions

## Teaching Notes
- Emphasize that CI is about fast feedback on change.
- Emphasize that CD means the output reaches somewhere — a live URL, not just a zip file.
- Keep students moving; the goal is understanding pipeline structure, not memorizing YAML.
- Remind students that workflows on forks may need to be enabled in the `Actions` tab.
- Remind students to enable Pages under Settings before starting Part 4.
- The `inputs.student_name || github.actor` expression is a good pause point — discuss what `||` means in an Actions expression and why the fallback matters.

## Facilitation Tips
- Ask students to predict what each workflow step does before opening GitHub.
- When a workflow fails, have them identify the failing step before editing any code.
- Keep the editing scope narrow: only `.github/workflows/lab.yml`.
- For the Pages deployment, ask students to trigger a manual run with `workflow_dispatch` using their own name — the live result is a good classroom moment.

## Expected Student Outcomes
- Most students should complete one successful CI run and see a live Pages report.
- Stronger students should finish an extension such as path filters or a step summary.

## Common Student Issues
- Actions disabled on the fork
- Pages source not set to `GitHub Actions` in fork settings
- Missing `setup-node` step before npm commands
- Wrong `run` command name (e.g. `npm run tests` instead of `npm test`)
- `cd` job downloading artifact to the wrong path — must be `path: dist/`
- `cd` job trying to run `npm install` or `npm run build` — neither is needed
- `cd` job failing because `data/sales.json` is not present — it needs `actions/checkout`
- Forgetting `permissions: pages: write` and `id-token: write` on the `cd` job
- Using `actions/upload-artifact` instead of `actions/upload-pages-artifact` in the `cd` job
- `STUDENT_NAME` not passed via `env:` on the report step — name shows as "Student"

## Fast Recovery Checklist
1. Confirm the fork has Actions enabled.
2. Confirm Pages source is set to `GitHub Actions` in fork settings.
3. Confirm the `ci` job includes `actions/checkout` and `actions/setup-node`.
4. Confirm `npm install` happens before `npm run build` and `npm test`.
5. Confirm `ci` job uploads `dist/` as artifact name `build`.
6. Confirm `cd` job has `needs: ci` and `if: github.ref == 'refs/heads/main'`.
7. Confirm `cd` job has `permissions: pages: write` and `id-token: write`.
8. Confirm `cd` job downloads artifact with `path: dist/`.
9. Confirm `cd` job has `actions/checkout` (needed for `data/sales.json`).
10. Confirm `cd` job uses `actions/upload-pages-artifact` with `path: artifacts/`.
11. Confirm `STUDENT_NAME` env var is set on the Generate report step.

## Optional Extensions
- add a Node version matrix to the `ci` job
- restrict workflow triggers by file paths
- write the Pages URL to `$GITHUB_STEP_SUMMARY`

## Instructor Answer Key

```yaml
name: ci-cd-lab

on:
  push:
    branches:
      - main
  pull_request:
  workflow_dispatch:
    inputs:
      student_name:
        description: Your name
        required: true
        default: Student

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm

      - name: Install dependencies
        run: npm install

      - name: Build TypeScript
        run: npm run build

      - name: Run tests
        run: npm test

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  cd:
    runs-on: ubuntu-latest
    needs: ci
    if: github.ref == 'refs/heads/main'

    permissions:
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24

      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      - name: Generate report
        run: npm run report
        env:
          STUDENT_NAME: ${{ inputs.student_name || github.actor }}

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: artifacts/

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Notes:
- `cd` checks out the repo to get `data/sales.json` — the report script reads from it.
- `cd` does NOT run `npm install` or `npm run build` — it reuses `dist/` from `ci`.
- `inputs.student_name || github.actor` — `inputs.student_name` is empty on `push` events, so `github.actor` (the GitHub username of whoever pushed) is used as a fallback.
- `cache: npm` is intentionally omitted from `cd` because it does not call `npm install`.
- `id-token: write` is required by `actions/deploy-pages` to authenticate with GitHub's Pages infrastructure using OIDC — no stored secret is needed.

## Why This Design Was Chosen
- Lowest setup friction for a 2-hour slot
- No local environments to troubleshoot during class
- Clear focus on workflow anatomy and CI/CD mechanics
- GitHub Pages makes CD tangible — students open a real URL with their name on it
