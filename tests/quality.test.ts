import assert from "node:assert/strict";
import test from "node:test";

import { datasetSummary, validateSalesData, type SalesRecord } from "../src/quality";

const cleanData: SalesRecord[] = [
  { date: "2026-01-01", region: "North", product: "Widget", units: 10, unitPrice: 12.5 },
  { date: "2026-01-02", region: "South", product: "Gadget", units: 8, unitPrice: 15 },
  { date: "2026-01-03", region: "West", product: "Widget", units: 5, unitPrice: 12.5 },
  { date: "2026-01-04", region: "East", product: "Gizmo", units: 6, unitPrice: 20 }
];

test("validateSalesData accepts a clean dataset", () => {
  assert.deepEqual(validateSalesData(cleanData), []);
});

test("datasetSummary returns expected metrics", () => {
  assert.deepEqual(datasetSummary(cleanData), {
    totalRows: 4,
    totalUnits: 29,
    totalRevenue: 427.5,
    uniqueRegions: 4
  });
});

test("validateSalesData rejects a negative unit price", () => {
  const invalidData: SalesRecord[] = [
    { date: "2026-01-05", region: "North", product: "Widget", units: 3, unitPrice: -1 }
  ];

  assert.deepEqual(validateSalesData(invalidData), ["row 1: unitPrice must be positive"]);
});
