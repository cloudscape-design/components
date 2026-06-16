// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
// zod replaced with a lightweight JSON parse + type cast (zod not available in this environment)
import { PropertyFilterQuery } from '@cloudscape-design/collection-hooks';

export const parsePropertyFilterQuery = (stringifiedPropertyFilter: string): PropertyFilterQuery => {
  const defaultQuery: PropertyFilterQuery = { operation: 'and', tokens: [] };

  if (!stringifiedPropertyFilter) {
    return defaultQuery;
  }
  try {
    const json = JSON.parse(stringifiedPropertyFilter);
    if (
      json &&
      typeof json === 'object' &&
      Array.isArray(json.tokens) &&
      (json.operation === 'and' || json.operation === 'or')
    ) {
      return json as PropertyFilterQuery;
    }
    return defaultQuery;
  } catch {
    return defaultQuery;
  }
};
