# Instructor Guide

## Course Intent
This lab introduces CI/CD through a small TypeScript project that feels close to data work without requiring any local setup. Students stay inside GitHub, edit only workflow YAML, and learn how CI pipelines are assembled from triggers, jobs, steps, and artifacts.

## Recommended Audience
- beginner to early-intermediate technical users
- data science students with limited DevOps exposure

## Recommended Timing
- 0:00-0:20 introduction and CI/CD concepts
- 0:20-0:35 fork repo and inspect starter workflow
- 0:35-1:20 build the CI job in GitHub (Part 3)
- 1:20-1:50 add the CD job (Part 4)
- 1:50-2:00 debrief and optional extensions

## Teaching Notes
- Emphasize that CI is about fast feedback on change.
- Be precise with terminology: artifact upload is not the same as production deployment.
- Keep students moving; the goal is understanding pipeline structure, not memorizing YAML.
- Remind students that workflows on forks may need to be enabled in the `Actions` tab.

## Facilitation Tips
- Ask students to predict what each workflow step does before opening GitHub.
- When a workflow fails, have them identify the failing step before editing any code.
- Keep the editing scope narrow: only `.github/workflows/lab.yml`.

## Expected Student Outcomes
- Most students should complete one successful CI run and one artifact-producing run.
- Stronger students should finish an extension such as matrix builds or caching.

## Common Student Issues
- Actions disabled on the fork
- Missing `setup-node` step before npm commands
- Wrong `run` command name (e.g. `npm run tests` instead of `npm test`)
- `cd` job downloading artifact to the wrong path — must be `path: dist/`
- `cd` job trying to run `npm install` or `npm run build` — neither is needed
- `cd` job failing because `data/sales.json` is not present — it needs `actions/checkout`
- Confusion between cache and artifact

## Fast Recovery Checklist
1. Confirm the fork has Actions enabled.
2. Confirm the `ci` job includes `actions/checkout` and `actions/setup-node`.
3. Confirm `npm install` happens before `npm run build` and `npm test`.
4. Confirm `ci` job uploads `dist/` as artifact name `build`.
5. Confirm `cd` job has `needs: ci`.
6. Confirm `cd` job downloads artifact with `path: dist/`.
7. Confirm `cd` job has `actions/checkout` (needed for `data/sales.json`).
8. Confirm artifact upload path is `artifacts/data-report.md`.

## Optional Extensions
- add a matrix for multiple Node versions
- add dependency caching
- restrict workflow triggers by paths
- split the pipeline into multiple jobs

## Instructor Answer Key
Suggested final workflow:

```yaml
name: ci-cd-lab

on:
  push:
    branches:
      - main
  pull_request:
  workflow_dispatch:

jobs:
  ci:
    runs-on: ubuntu-latest

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
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

    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      - name: Generate report
        run: npm run report

      - name: Upload report artifact
        uses: actions/upload-artifact@v4
        with:
          name: data-report
          path: artifacts/data-report.md
```

Notes:
- `cd` checks out the repo to get `data/sales.json` — the report script reads from it.
- `cd` does NOT run `npm install` or `npm run build` — it reuses `dist/` from `ci`.
- `npm test` and `npm run report` now only invoke `node` against pre-compiled files, not the compiler.
- `cache: npm` is intentionally omitted from `cd` because it does not call `npm install`.

## Why This Design Was Chosen
- Lowest setup friction for a 2-hour slot
- No local environments to troubleshoot during class
- Clear focus on workflow anatomy and CI/CD mechanics
- Lightweight delivery concept without external infrastructure
