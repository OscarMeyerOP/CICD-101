# CI/CD Basics for Data Science

## Slide 1: Title
- CI/CD Basics for Data Science
- 2-hour GitHub-only lab
- Focus: GitHub Actions, TypeScript, tests, Pages deployment

## Slide 2: Why This Matters
- Data science code breaks too
- Reproducibility is a delivery problem, not only a modeling problem
- CI helps catch issues before they reach teammates or stakeholders

## Slide 3: Learning Outcomes
- Define CI, continuous delivery, continuous deployment
- Read a simple GitHub Actions workflow
- Configure a CI workflow in the GitHub web editor
- Pass variables into a pipeline using inputs and expressions
- Deploy a live report to GitHub Pages

## Slide 4: CI, Delivery, Deployment
- Continuous integration: merge often, test automatically
- Continuous delivery: code is kept in a releasable state
- Continuous deployment: every passing change goes live automatically

## Slide 5: A Data Science View of CI
- Validate datasets
- Test transformation code
- Build TypeScript code safely
- Generate reports automatically
- Reduce hand-run quality checks

## Slide 6: Anatomy of a GitHub Actions Workflow
- Workflow
- Event
- Job
- Runner
- Step
- Action

## Slide 7: Repo Tour
- `src/quality.ts`
- `tests/quality.test.ts`
- `data/sales.json`
- `.github/workflows/lab.yml`
- `scripts/generate-report.ts`

## Slide 8: What the Pipeline Does
Two jobs, one workflow.

**ci job:**
- Checkout code
- Set up Node.js
- Install dependencies
- Build TypeScript
- Run tests
- Upload `dist/` as build artifact

**cd job (runs after ci, only on main):**
- Checkout code (for data files)
- Set up Node.js
- Download build artifact
- Generate HTML report (with your name)
- Upload to Pages
- Deploy — live URL

## Slide 9: Why Two Jobs?
- CI and CD have different responsibilities
- The `cd` job only runs if `ci` passes
- The `cd` job reuses compiled code — no rebuild
- Passing artifacts between jobs is a core pipeline pattern
- Failure in `ci` stops `cd` automatically — no wasted work

## Slide 10: Pipeline Variables and Inputs
- `workflow_dispatch` lets you trigger a workflow manually with custom inputs
- Inputs are accessed with `${{ inputs.student_name }}`
- `||` provides a fallback: `${{ inputs.student_name || github.actor }}`
- Inputs are passed into steps via `env:`
- The script reads them as normal environment variables

## Slide 11: Lab Roadmap
- Fork the repo and enable Pages
- Edit workflow YAML in GitHub
- Build the CI job — tests pass, artifact uploaded
- Add the CD job — report deployed to a live URL
- Trigger manually with your name and see it on the page

## Slide 12: Common Failure Modes
- Pages source not set to `GitHub Actions`
- Wrong Node version
- Missing install step
- Using `upload-artifact` instead of `upload-pages-artifact`
- Missing `permissions` block on the `cd` job
- YAML indentation mistakes

## Slide 13: Debugging Strategy
- Read the failing step first
- Read the exact command that failed
- Fix the smallest thing that explains the failure
- Re-run and verify

## Slide 14: What Counts as "CD" Here?
- Deploying to GitHub Pages is a real delivery step
- Every passing push to `main` updates a live URL
- `inputs.student_name || github.actor` makes each deployment personal
- It is not continuous deployment to a production service — but the pattern is identical

## Slide 15: Discussion
- What extra checks would matter for real ML projects?
- Where would model evaluation fit in the pipeline?
- When would you separate CI and deployment workflows?

## Slide 16: Takeaways
- CI/CD is about reliable change, not just automation
- Small automated checks create fast feedback
- Delivery means putting something where consumers can reach it — a URL, not a zip
- GitHub Actions is enough for a solid beginner workflow
