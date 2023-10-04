// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComparisonOperator, Token } from '../interfaces';
import { matchFilteringProperty, matchOperator, matchOperatorPrefix, matchTokenValue } from '../utils';
import { makeFilteringSettings, toInternalOptions, toInternalProperties } from './common';

const filteringProperties = toInternalProperties([
  {
    key: 'instanceId',
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

const filteringSettings = makeFilteringSettings(filteringProperties, []);

describe('matchFilteringProperty', () => {
  test('should match property by label when filtering text equals to it', () => {
    const property = matchFilteringProperty(filteringSettings, 'Average latency');
    expect(property).toBe(filteringProperties[1]);
  });
  test('should match property by label ignoring case', () => {
    const property = matchFilteringProperty(filteringSettings, 'average Latency');
    expect(property).toBe(filteringProperties[1]);
  });
  test('should match property by label when filtering text has trailing space', () => {
    const property = matchFilteringProperty(filteringSettings, 'Average latency ');
    expect(property).toBe(filteringProperties[1]);
  });
  test('should match property by label when filtering text has trailing symbol', () => {
    const property = matchFilteringProperty(filteringSettings, 'Average latencyX');
    expect(property).toBe(filteringProperties[1]);
  });
  test('should not match property by label when filtering text has leading space', () => {
    const property = matchFilteringProperty(filteringSettings, ' Average latency');
    expect(property).toBe(null);
  });
  test('should prefer an exact match to non-exact', () => {
    const properties = toInternalProperties([
      { key: 'Test', propertyLabel: 'Test', groupValuesLabel: '' },
      { key: 'test', propertyLabel: 'test', groupValuesLabel: '' },
    ]);
    const property = matchFilteringProperty(makeFilteringSettings(properties, []), 'test');
    expect(property).toBe(properties[1]);
  });
  test('should prefer an exact match to non-exact (with operator)', () => {
    const properties = toInternalProperties([
      { key: 'Test', propertyLabel: 'Test', groupValuesLabel: '' },
      { key: 'test', propertyLabel: 'test', groupValuesLabel: '' },
    ]);
    const property = matchFilteringProperty(makeFilteringSettings(properties, []), 'test =');
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
    const token: Token = { propertyKey: 'key', operator: '=', value: 'one' };
    const result = matchTokenValue(token, toInternalOptions([{ propertyKey: 'key', value: 'two' }]));
    expect(result.value).toBe('one');
  });
  test('should match by label', () => {
    const token: Token = { propertyKey: 'key', operator: '=', value: 'one' };
    const result = matchTokenValue(
      token,
      toInternalOptions([
        { propertyKey: 'key', label: 'one', value: '1' },
        { propertyKey: 'key', value: 'two' },
      ])
    );
    expect(result.value).toBe('1');
  });
  test('should case-insensitive match', () => {
    const token: Token = { propertyKey: 'key', operator: '=', value: 'one' };
    const result = matchTokenValue(
      token,
      toInternalOptions([
        { propertyKey: 'key', value: 'One' },
        { propertyKey: 'key', value: 'two' },
      ])
    );
    expect(result.value).toBe('One');
  });
  test('should prefer case-sensitive match', () => {
    const token: Token = { propertyKey: 'key', operator: '=', value: 'one' };
    const result = matchTokenValue(
      token,
      toInternalOptions([
        { propertyKey: 'key', value: 'One' },
        { propertyKey: 'key', value: 'one' },
      ])
    );
    expect(result.value).toBe('one');
  });
  test('should return token as-is for a token value of type string[]', () => {
    const token: Token = { propertyKey: 'key', operator: '=', value: ['one', 'two', 'three'] };
    const result = matchTokenValue(token, toInternalOptions([{ propertyKey: 'key', value: 'one,two,three' }]));
    expect(result.value).toEqual(['one', 'two', 'three']);
  });
});
