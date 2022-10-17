// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FilteringProperty } from '../interfaces';
import { matchFilteringProperty } from '../utils';

const filteringProperties: FilteringProperty[] = [
  {
    key: 'instanceId',
    propertyLabel: 'Instance ID',
    operators: ['!:', ':'],
    groupValuesLabel: '',
  },
  {
    key: 'averageLatency',
    propertyLabel: 'Averange latency',
    operators: ['=', '!=', '<', '<=', '>', '>='],
    groupValuesLabel: '',
  },
];

describe('matchFilteringProperty', () => {
  test('should match property by label when filtering text equals to it', () => {
    const property = matchFilteringProperty(filteringProperties, 'Averange latency');
    expect(property).toBe(filteringProperties[1]);
  });
  test('should match property by label ignoring case', () => {
    const property = matchFilteringProperty(filteringProperties, 'averange Latency');
    expect(property).toBe(filteringProperties[1]);
  });
  test('should match property by label when filtering text has trailing space', () => {
    const property = matchFilteringProperty(filteringProperties, 'Averange latency ');
    expect(property).toBe(filteringProperties[1]);
  });
  test('should match property by label when filtering text has trailing symbol', () => {
    const property = matchFilteringProperty(filteringProperties, 'Averange latencyX');
    expect(property).toBe(filteringProperties[1]);
  });
  test('should not match property by label when filtering text has leading space', () => {
    const property = matchFilteringProperty(filteringProperties, ' Averange latency');
    expect(property).toBe(null);
  });
});
