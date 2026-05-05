import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { datasetSummary, validateSalesData, type SalesRecord } from "../src/quality";

const inputPath = resolve("data/sales.json");
const outputPath = resolve("artifacts/data-report.md");

const records = JSON.parse(readFileSync(inputPath, "utf-8")) as SalesRecord[];
const issues = validateSalesData(records);
const summary = datasetSummary(records);

const lines = [
  "# Data Quality Report",
  "",
  "## Summary",
  `- Total rows: ${summary.totalRows}`,
  `- Total units: ${summary.totalUnits}`,
  `- Total revenue: ${summary.totalRevenue}`,
  `- Unique regions: ${summary.uniqueRegions}`,
  "",
  "## Validation",
  issues.length === 0 ? "- Status: PASSED" : "- Status: FAILED",
  ...(issues.length === 0 ? ["- No validation issues found"] : issues.map((issue) => `- ${issue}`))
];

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf-8");

console.log(`Wrote report to ${outputPath}`);
