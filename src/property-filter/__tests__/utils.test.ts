// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComparisonOperator, InternalToken } from '../interfaces';
import { matchFilteringProperty, matchOperator, matchOperatorPrefix, matchTokenValue } from '../utils';
import { toInternalProperties } from './common';

const filteringProperties = toInternalProperties([
  {
    key: 'instanceIdentifier',
    propertyLabel: 'Instance ID',
    operators: ['!:', ':'],
    groupValuesLabel: '',
  },
  {
    key: 'averageLatency',
    propertyLabel: 'Average latency',
    operators: ['=', '!=', '<', '<=', '>', '>='],
    groupValuesLabel: '',
  },
]);

const operators: ComparisonOperator[] = ['!:', ':', 'contains', 'does not contain'] as any;

describe('matchFilteringProperty', () => {
  test('should match property by label when filtering text equals to it', () => {
    const property = matchFilteringProperty(filteringProperties, 'Average latency');
    expect(property).toBe(filteringProperties[1]);
  });
  test('should match property by label ignoring case', () => {
    const property = matchFilteringProperty(filteringProperties, 'average Latency');
    expect(property).toBe(filteringProperties[1]);
  });
  test('should match property by label when filtering text has trailing space', () => {
    const property = matchFilteringProperty(filteringProperties, 'Average latency ');
    expect(property).toBe(filteringProperties[1]);
  });
  test('should match property by label when filtering text has trailing symbol', () => {
    const property = matchFilteringProperty(filteringProperties, 'Average latencyX');
    expect(property).toBe(filteringProperties[1]);
  });
  test('should not match property by label when filtering text has leading space', () => {
    const property = matchFilteringProperty(filteringProperties, ' Average latency');
    expect(property).toBe(null);
  });
  test('should prefer an exact match to non-exact', () => {
    const properties = toInternalProperties([
      { key: 'Test', propertyLabel: 'Test', groupValuesLabel: '' },
      { key: 'test', propertyLabel: 'test', groupValuesLabel: '' },
    ]);
    const property = matchFilteringProperty(properties, 'test');
    expect(property).toBe(properties[1]);
  });
  test('should prefer an exact match to non-exact (with operator)', () => {
    const properties = toInternalProperties([
      { key: 'Test', propertyLabel: 'Test', groupValuesLabel: '' },
      { key: 'test', propertyLabel: 'test', groupValuesLabel: '' },
    ]);
    const property = matchFilteringProperty(properties, 'test =');
    expect(property).toBe(properties[1]);
  });
});

describe('matchOperator', () => {
  test('should match operator when filtering text equals to it', () => {
    const operator = matchOperator(operators, 'does not contain');
    expect(operator).toBe(operators[3]);
  });
  test('should match operator ignoring case', () => {
    const operator = matchOperator(operators, 'does NOT contain');
    expect(operator).toBe(operators[3]);
  });
  test('should match operator when filtering text has trailing space', () => {
    const operator = matchOperator(operators, '!: ');
    expect(operator).toBe(operators[0]);
  });
  test('should match operator when filtering text has trailing symbol', () => {
    const operator = matchOperator(operators, ':!');
    expect(operator).toBe(operators[1]);
  });
  test('should not match operator when filtering text has leading space', () => {
    const operator = matchOperator(operators, ' :');
    expect(operator).toBe(null);
  });
});

describe('matchOperatorPrefix', () => {
  test('should return empty string if filtering text is empty', () => {
    const operatorPrefix = matchOperatorPrefix(operators, '');
    expect(operatorPrefix).toBe('');
  });
  test('should return empty string if filtering text only has spaces', () => {
    const operatorPrefix = matchOperatorPrefix(operators, '   ');
    expect(operatorPrefix).toBe('');
  });
  test('should return filtering text if it matches some operator prefix', () => {
    const operatorPrefix = matchOperatorPrefix(operators, '!');
    expect(operatorPrefix).toBe('!');
  });
  test('should return filtering text if it matches some operator prefix ignoring case', () => {
    const operatorPrefix = matchOperatorPrefix(operators, 'DOES');
    expect(operatorPrefix).toBe('DOES');
  });
  test('should return null if filtering text has leading space', () => {
    const operatorPrefix = matchOperatorPrefix(operators, ' !');
    expect(operatorPrefix).toBe(null);
  });
});

describe('matchTokenValue', () => {
  test('should return token as-is if no match found', () => {
    const token: InternalToken = { property: null, operator: '=', value: 'one' };
    const result = matchTokenValue(token, [{ property: null, value: 'two', label: 'two' }]);
    expect(result.value).toBe('one');
  });
  test('should match by label', () => {
    const token: InternalToken = { property: null, operator: '=', value: 'one' };
    const result = matchTokenValue(token, [
      { property: null, value: '1', label: 'one' },
      { property: null, value: 'two', label: 'two' },
    ]);
    expect(result.value).toBe('1');
  });
  test('should case-insensitive match', () => {
    const token: InternalToken = { property: null, operator: '=', value: 'one' };
    const result = matchTokenValue(token, [
      { property: null, value: 'One', label: 'One' },
      { property: null, value: 'two', label: 'two' },
    ]);
    expect(result.value).toBe('One');
  });
  test('should prefer case-sensitive match', () => {
    const token: InternalToken = { property: null, operator: '=', value: 'one' };
    const result = matchTokenValue(token, [
      { property: null, value: 'One', label: 'One' },
      { property: null, value: 'one', label: 'one' },
    ]);
    expect(result.value).toBe('one');
  });
  test('should return token as-is for a token value of type string[]', () => {
    const token: InternalToken = { property: null, operator: '=', value: ['one', 'two', 'three'] };
    const result = matchTokenValue(token, [{ property: null, value: 'one,two,three', label: 'one,two,three' }]);
    expect(result.value).toEqual(['one', 'two', 'three']);
  });
});
