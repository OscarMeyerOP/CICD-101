export type SalesRecord = {
  date: string;
  region: string;
  product: string;
  units: number;
  unitPrice: number;
};

export type DatasetSummary = {
  totalRows: number;
  totalUnits: number;
  totalRevenue: number;
  uniqueRegions: number;
};

export function validateSalesData(records: SalesRecord[]): string[] {
  const issues: string[] = [];

  if (records.length === 0) {
    return ["dataset is empty"];
  }

  records.forEach((record, index) => {
    const row = index + 1;

    if (!record.region.trim()) {
      issues.push(`row ${row}: region is blank`);
    }

    if (!record.product.trim()) {
      issues.push(`row ${row}: product is blank`);
    }

    if (!Number.isInteger(record.units) || record.units <= 0) {
      issues.push(`row ${row}: units must be a positive whole number`);
    }

    if (record.unitPrice <= 0) {
      issues.push(`row ${row}: unitPrice must be positive`);
    }
  });

  return issues;
}

export function datasetSummary(records: SalesRecord[]): DatasetSummary {
  return {
    totalRows: records.length,
    totalUnits: records.reduce((sum, record) => sum + record.units, 0),
    totalRevenue: Number(
      records
        .reduce((sum, record) => sum + record.units * record.unitPrice, 0)
        .toFixed(2)
    ),
    uniqueRegions: new Set(records.map((record) => record.region)).size
  };
}
