# Lab: CI/CD Basics for Data Science with GitHub Actions

## Learning Objectives
By the end of this lab, you should be able to:
- explain the difference between CI, continuous delivery, and continuous deployment
- identify the main sections of a GitHub Actions workflow
- edit a workflow file
- configure a Node and TypeScript CI job
- pass variables into a workflow using inputs and expressions
- deploy a live report to GitHub Pages as a CD step

## Time Budget
- Part 1: Introduction to pipelines and CI, 20min
- Part 2: CI Lab, 45 minutes
- Part 3: Review and discuss, 10 minutes
- Part 4: add a delivery step, 30 minutes
- Part 5: review and debrief, 15 minutes

## Scenario
You joined a data team that keeps a small TypeScript project in GitHub. The project validates a sales dataset, runs tests, and generates an HTML report.

The code is already written.

Your task is to create the CI/CD pipeline by editing only the workflow YAML.

## Part 1: Fork the Repository and Enable GitHub Pages

1. Fork this repository.
2. Open your fork.
3. If GitHub Actions is disabled on the fork, enable it from the `Actions` tab.
4. Enable GitHub Pages:
   - go to `Settings` > `Pages`
   - under **Build and deployment**, set **Source** to `GitHub Actions`
   - save

## Part 2: Create your first Workflow
Open `Actions` > `New Workflow` > `set up a workflow yourself`

Your goal is to build a `ci` job that does all of the following:
1. Triggered on `push`, `pull_request`, and manual `workflow_dispatch`
2. The `workflow_dispatch` trigger should accept an input called `student_name` with a description and a default value of `Student`
3. Sets up Node.js
4. Installs dependencies
5. Builds the TypeScript project
6. Runs the tests
7. Uploads the compiled `dist/` folder as a build artifact named `build`

That last step is important — the `dist/` artifact is what the next job will use instead of compiling again.
> \[!TIP]
> Use the documentation on the right side and ask AI to help you!
>
> Actions hints:
> - use `actions/checkout`
> - use `actions/setup-node` with Node `24` and `cache: npm`
> - run `npm install`, then `npm run build`, then `npm test`
> - use `actions/upload-artifact` to upload `dist/` with the name `build`

Commit your change directly to `main` on your fork.

Then open the `Actions` tab and inspect the run.

To test the `pull_request` trigger in a GitHub-only workflow:
1. create a new branch when saving the workflow file
2. open a pull request from that branch in your fork
3. inspect the workflow run attached to the pull request

## Part 4: Add the CD Job — Deploy to GitHub Pages
Add a second job called `cd` to the same workflow file.

This job must:
1. Run **only after** the `ci` job succeeds — use `needs: ci`
2. Run **only on the `main` branch** — use `if: github.ref == 'refs/heads/main'`
3. Declare the correct permissions for Pages deployment
4. Declare a `github-pages` environment so GitHub links the deployment to the Pages URL
5. Check out the repository (needed to read `data/sales.json`)
6. Set up Node.js
7. Download the `build` artifact into `dist/`
8. Run `npm run report`, passing `STUDENT_NAME` as an environment variable
9. Upload the `artifacts/` folder with `actions/upload-pages-artifact`
10. Deploy to Pages with `actions/deploy-pages`

Key points:
- The `cd` job reuses compiled code from `ci` — no `npm install` or rebuild needed.
- The `STUDENT_NAME` variable comes from the workflow input when run manually, or falls back to `github.actor` on automatic pushes.
- `actions/upload-pages-artifact` is different from `actions/upload-artifact` — it packages the folder specifically for Pages.

Hints:

```yaml
cd:
  permissions:
    pages: write
    id-token: write
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
```

For the `STUDENT_NAME` expression:
```yaml
env:
  STUDENT_NAME: ${{ inputs.student_name || github.actor }}
```

After the run finishes:
1. open the workflow run
2. find the deployment link in the summary or the `github-pages` environment
3. open the URL — you should see your personalised report

Questions:
1. Why does the `cd` job have `if: github.ref == 'refs/heads/main'`?
2. What happens to `inputs.student_name` on an automatic `push` — why is the `|| github.actor` fallback needed?
3. Why does this job need `id-token: write` when the `ci` job does not?

Expected answer to question 3:
- `id-token: write` lets GitHub Actions generate a short-lived token that proves the workflow is who it says it is. `actions/deploy-pages` uses this to authenticate with the Pages infrastructure securely, without needing a stored secret.

## Part 5: Optional Extensions
If you finish early, choose one:

### Option A: Add a Node Version Matrix
Run the `ci` job on more than one Node version.

### Option B: Restrict the Trigger
Only run on changes that affect `.ts`, `.json`, or workflow files.

### Option C: Add a Deployment Summary
Use `$GITHUB_STEP_SUMMARY` to write the report URL into the workflow run summary page.

## Deliverables
By the end of the lab, your fork should contain:
- an updated `.github/workflows/lab.yml`
- at least one successful workflow run
- a live GitHub Pages report at your fork's Pages URL

## Suggested Final Workflow Shape
TODO a branch with the full pipeline