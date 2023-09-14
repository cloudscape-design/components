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

export function queryToString(
  query: PropertyFilterProps.Query,
  filteringProperties?: readonly PropertyFilterProps.FilteringProperty[]
): string {
  return query.tokens
    .map(({ operator, value, propertyKey }) => {
      if (propertyKey) {
        const property = filteringProperties?.find(({ key }) => key === propertyKey);
        const keyLabel = property?.propertyLabel ?? propertyKey;

        let valueLabel = value;

        // See if there is a custom value formatter defined for this property and operator
        if (property && property.operators) {
          property.operators.forEach(propertyOperator => {
            if (
              typeof propertyOperator !== 'string' &&
              propertyOperator.operator === operator &&
              propertyOperator.format
            ) {
              valueLabel = propertyOperator.format(value);
            }
          });
        }

        return `${keyLabel} ${operator} ${valueLabel}`;
      }
      return value;
    })
    .join(`, ${query.operation} `);
}
