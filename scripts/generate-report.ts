import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { datasetSummary, validateSalesData, type SalesRecord } from "../src/quality";

const inputPath = resolve("data/sales.json");
const outputPath = resolve("artifacts/index.html");

const studentName = process.env.STUDENT_NAME ?? "Student";

const records = JSON.parse(readFileSync(inputPath, "utf-8")) as SalesRecord[];
const issues = validateSalesData(records);
const summary = datasetSummary(records);

const validationHtml =
  issues.length === 0
    ? `<p class="status passed">&#10003; PASSED &mdash; No validation issues found</p>`
    : `<p class="status failed">&#10007; FAILED</p>
       <ul class="issues">${issues.map((i) => `<li>${i}</li>`).join("\n")}</ul>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Data Quality Report</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 760px;
      margin: 2rem auto;
      padding: 0 1.5rem;
      color: #222;
    }
    h1 { border-bottom: 2px solid #222; padding-bottom: 0.4rem; }
    h2 { margin-top: 2rem; }
    .congrats {
      background: #e8f5e9;
      border-left: 4px solid #2a7a2a;
      padding: 0.75rem 1rem;
      font-size: 1.2rem;
      font-weight: bold;
      color: #2a7a2a;
      margin-bottom: 1.5rem;
    }
    .meta { color: #666; font-size: 0.9rem; }
    table { border-collapse: collapse; width: 100%; margin-top: 0.5rem; }
    th, td { border: 1px solid #ccc; padding: 0.5rem 1rem; text-align: left; }
    th { background: #f4f4f4; }
    .status { font-weight: bold; font-size: 1.1rem; }
    .passed { color: #2a7a2a; }
    .failed { color: #b00020; }
    .issues { padding-left: 1.5rem; }
    .issues li { margin: 0.25rem 0; }
  </style>
</head>
<body>
  <div class="congrats">Well done, ${studentName}!</div>

  <h1>Data Quality Report</h1>
  <p class="meta">Generated: ${new Date().toISOString()}</p>

  <h2>Summary</h2>
  <table>
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Total rows</td><td>${summary.totalRows}</td></tr>
    <tr><td>Total units sold</td><td>${summary.totalUnits}</td></tr>
    <tr><td>Total revenue</td><td>${summary.totalRevenue}</td></tr>
    <tr><td>Unique regions</td><td>${summary.uniqueRegions}</td></tr>
  </table>

  <h2>Validation</h2>
  ${validationHtml}
</body>
</html>`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, html, "utf-8");

console.log(`Wrote report to ${outputPath}`);
