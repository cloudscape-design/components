// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { PropertyFilterProps } from '~components/property-filter';

export function isQueryEqual(queryA: PropertyFilterProps.Query, queryB: PropertyFilterProps.Query) {
  return (
    queryA.operation === queryB.operation &&
    queryA.tokens.length === queryB.tokens.length &&
    queryA.tokens.every((_, i) => {
      return (
        queryA.tokens[i].operator === queryB.tokens[i].operator &&
        queryA.tokens[i].value === queryB.tokens[i].value &&
        queryA.tokens[i].propertyKey === queryB.tokens[i].propertyKey
      );
    })
  );
}

export function queryToString(query: PropertyFilterProps.Query): string {
  // TODO: Use proper labeling
  return query.tokens
    .map(({ operator, value, propertyKey }) => {
      if (propertyKey) {
        return `${propertyKey} ${operator} ${value}`;
      }
      return value;
    })
    .join(`, ${query.operation} `);
}
