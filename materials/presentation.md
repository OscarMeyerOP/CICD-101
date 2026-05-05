# CI/CD Basics for Data Science

## Slide 1: Title
- CI/CD Basics for Data Science
- 2-hour GitHub-only lab
- Focus: GitHub Actions, TypeScript, tests, artifacts

## Slide 2: Why This Matters
- Data science code breaks too
- Reproducibility is a delivery problem, not only a modeling problem
- CI helps catch issues before they reach teammates or stakeholders

## Slide 3: Learning Outcomes
- Define CI, continuous delivery, continuous deployment
- Read a simple GitHub Actions workflow
- Configure a CI workflow in the GitHub web editor
- Publish an artifact from a workflow

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

**cd job (runs after ci):**
- Checkout code (for data files)
- Set up Node.js
- Download build artifact
- Generate report
- Upload report artifact

## Slide 9: Why Two Jobs?
- CI and CD have different responsibilities
- The `cd` job only runs if `ci` passes
- The `cd` job reuses compiled code — no rebuild
- Passing artifacts between jobs is a core pipeline pattern
- Failure in `ci` stops `cd` automatically — no wasted work

## Slide 10: Lab Roadmap
- Fork the repo
- Edit workflow YAML in GitHub
- Run build and tests in Actions
- Add report artifact upload
- Inspect logs and artifacts

## Slide 11: Common Failure Modes
- Wrong Node version
- Missing install step
- Broken imports
- Wrong artifact path
- YAML indentation mistakes

## Slide 12: Debugging Strategy
- Read the failing step first
- Read the exact command that failed
- Fix the smallest thing that explains the failure
- Re-run and verify

## Slide 13: What Counts as “CD” Here?
- Uploading a report artifact is a lightweight delivery action
- It keeps the exercise GitHub-only and low-friction
- We are not doing automatic production deployment in this lab

## Slide 14: Discussion
- What extra checks would matter for real ML projects?
- Where would model evaluation fit in the pipeline?
- When would you separate CI and deployment workflows?

## Slide 15: Takeaways
- CI/CD is about reliable change, not just automation
- Small automated checks create fast feedback
- GitHub Actions is enough for a solid beginner workflow
