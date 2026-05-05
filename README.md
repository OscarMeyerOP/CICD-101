# CI/CD Basics for Data Science

A 2-hour lab that introduces CI/CD with a small TypeScript data-quality project and GitHub Actions.

## What Students Will Learn
- what CI, continuous delivery, and continuous deployment mean
- how GitHub Actions workflows are structured
- how a Node and TypeScript project is built and tested in CI
- how to inspect workflow runs and debug failures in GitHub
- how to publish a workflow artifact

## Key Constraint for This Lab
Students do not clone the repository and do not edit application code.

They work entirely in GitHub and only modify the workflow YAML file.

## Repository Structure
- `LAB.md`: student-facing lab instructions
- `materials/presentation.md`: slide-style presentation notes
- `materials/instructor_guide.md`: instructor facilitation guide
- `src/quality.ts`: starter TypeScript logic
- `tests/quality.test.ts`: automated tests already present in the repo
- `scripts/generate-report.ts`: report generator used by the workflow
- `data/sales.json`: sample dataset
- `.github/workflows/lab.yml`: starter workflow students will edit
- `RESEARCH_NOTES.md`: structured research notes and hypothesis updates

## Intended Flow
Students fork the repository, enable Actions on the fork if needed, and edit `.github/workflows/lab.yml`. 

## Suggested Duration
- 20 min: CI/CD Intro
- 45 min: CI Lab
- 10 min: Discussion
- 30 min: CD Lab
- 15 min: End discussion