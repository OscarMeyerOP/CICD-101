# Lab: CI/CD Basics for Data Science with GitHub Actions

## Learning Objectives
By the end of this lab, you should be able to:
- explain the difference between CI, continuous delivery, and continuous deployment
- identify the main sections of a GitHub Actions workflow
- edit a workflow file 
- configure a Node and TypeScript CI job
- publish a artifact from a workflow run
- consume and use artifacts

## Time Budget
- Part 1: Introduction to pipelines and CI, 20min
- Part 2: CI Lab, 45 minutes 
- Part 3: Review and discuss, 10 minutes
- Part 4: add a delivery step, 30 minutes
- Part 5: review and debrief, 15 minutes

## Scenario
You joined a data team that keeps a small TypeScript project in GitHub. The project validates a sales dataset, runs tests, and can generate a Markdown report.

The code is already written.

Your task is to create the CI pipeline by editing only the workflow YAML.

## Part 1: Fork the Repository
1. Fork this repository.
2. Open your fork.
3. If GitHub Actions is disabled on the fork, enable it from the `Actions` tab.
4. Open `LAB.md` in one tab and `.github/workflows/lab.yml` in another.


## Part 2: Understand the Starter Workflow
Open `.github/workflows/lab.yml`.

Find these sections:
- workflow name
- trigger section
- jobs section
- runner
- steps

Starter state:
- the workflow is valid
- it checks out the repository
- it does not yet build, test, or publish anything useful

## Part 3: Turn the Starter into a Real CI Workflow
Edit `.github/workflows/lab.yml` in GitHub.

Your goal is to build a `ci` job that does all of the following:
1. Triggered on `push`, `pull_request`, and manual `workflow_dispatch`
2. Sets up Node.js
3. Installs dependencies
4. Builds the TypeScript project
5. Runs the tests
6. Uploads the compiled `dist/` folder as a build artifact named `build`

That last step is important — the `dist/` artifact is what the next job will use instead of compiling again.

Hints:
- use `actions/checkout`
- use `actions/setup-node` with Node `20` and `cache: npm`
- run `npm install`, then `npm run build`, then `npm test`
- use `actions/upload-artifact` to upload `dist/` with the name `build`

Commit your change directly to `main` on your fork.

Then open the `Actions` tab and inspect the run.

To test the `pull_request` trigger in a GitHub-only workflow:
1. create a new branch when saving the workflow file
2. open a pull request from that branch in your fork
3. inspect the workflow run attached to the pull request

## Part 4: Add a Lightweight Delivery Step
Add a second job called `cd` to the same workflow file.

This job must:
1. Run **only after** the `ci` job succeeds — use `needs: ci`
2. Download the `build` artifact that the `ci` job uploaded
3. Download the artifact into the `dist/` folder
4. Run the report script using the pre-built code — `npm run report`
5. Upload `artifacts/data-report.md` as an artifact named `data-report`

Key point: the `cd` job reuses the compiled code from `ci`. It does not install Node packages or run the TypeScript compiler again. The only reason it needs Node is to execute the pre-compiled JavaScript.

Hints:
- use `needs: ci` on the job
- use `actions/download-artifact` with `name: build` and `path: dist/`
- use `actions/setup-node` to make the `node` command available
- run `npm run report` directly — no `npm install` or build needed
- upload the result with `actions/upload-artifact`

After the run finishes:
1. open the workflow run
2. find the artifact section
3. download `data-report` and read the Markdown

## Part 5: Optional Extensions
If you finish early, choose one:

### Option A: Restrict the Trigger
Only run on changes that affect `.ts`, `.json`, or workflow files.

### Option B: Gate the CD job on a branch
Only run the `cd` job when on `main`, not on pull request branches.

By the end of the lab, your fork should contain:
- an updated `.github/workflows/lab.yml`
- at least one successful workflow run
- a downloadable report artifact

## Suggested Final Workflow Shape

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
