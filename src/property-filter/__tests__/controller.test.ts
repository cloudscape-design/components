// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ComparisonOperator, FilteringProperty, GroupText, InternalFilteringProperty, ParsedText } from '../interfaces';
import { parseText, getAllowedOperators, getAutosuggestOptions } from '../controller';
import { i18nStrings, toInternalProperties } from './common';

const filteringProperties = toInternalProperties([
  {
    key: 'string',
    propertyLabel: 'string',
    operators: ['!:', ':', '=', '!='],
    groupValuesLabel: 'String values',
  },
  // property label has the a prefix equal to another property's label
  {
    key: 'other-string',
    propertyLabel: 'string-other',
    operators: ['!:', ':', '=', '!='],
    groupValuesLabel: 'Other string values',
  },
  // operator unspecified
  {
    key: 'default-operator',
    propertyLabel: 'default',
    groupValuesLabel: 'Default values',
  },
  // supports range operators
  {
    key: 'range',
    propertyLabel: 'range',
    operators: ['>', '<', '=', '!=', '>=', '<='],
    groupValuesLabel: 'Range values',
    group: 'group-name',
  },
  // property label is consists of another property with an operator after
  {
    key: 'edge-case',
    propertyLabel: 'string!=',
    operators: ['!:', ':', '=', '!='],
    groupValuesLabel: 'Edge case values',
  },
  {
    key: 'custom-default',
    propertyLabel: 'custom column',
    defaultOperator: ':',
    groupValuesLabel: 'Custom column values',
  },
]);

const customGroupText: readonly GroupText[] = [
  { group: 'group-name', properties: 'Group properties', values: 'Group values' },
];

function getProperty(key: string) {
  return filteringProperties.find(p => p.propertyKey === key)!;
}

const filteringOptions = [
  { property: getProperty('string'), value: 'value1', label: 'value1' },
  { property: getProperty('other-string'), value: 'value1', label: 'value1' },
  { property: getProperty('string'), value: 'value2', label: 'value2' },
  { property: getProperty('range'), value: '1', label: '1' },
  { property: getProperty('range'), value: '2', label: '2' },
  { property: getProperty('other-string'), value: 'value2', label: 'value2' },
  { property: getProperty('missing-property'), value: 'value', label: 'value' },
  { property: getProperty('default-operator'), value: 'value', label: 'value' },
  { property: getProperty('custom-default'), value: 'value', label: 'value' },
];

describe('getAllowedOperators', () => {
  type TestCase = [string, InternalFilteringProperty, ComparisonOperator[]];
  const getFilteringProperty = (
    operators: FilteringProperty['operators'],
    defaultOperator?: FilteringProperty['defaultOperator']
  ) =>
    toInternalProperties([
      {
        operators,
        defaultOperator,
        key: '1',
        propertyLabel: '1',
        groupValuesLabel: '1',
      },
    ])[0];
  const cases: TestCase[] = [
    ['returns default operator', getFilteringProperty(undefined), ['=']],
    ['adds default operator', getFilteringProperty([':']), ['=', ':']],
    [
      'reorders operators',
      getFilteringProperty(['>', '>=', '<', '<=', '!=', '=', ':', '!:']),
      ['=', '!=', ':', '!:', '>=', '<=', '<', '>'],
    ],
    ['removes duplicates', getFilteringProperty(['=', { operator: '=' }]), ['=']],
    ['removes unsupported', getFilteringProperty(['<>' as ComparisonOperator, '>', '=']), ['=', '>']],
    ['adds default custom operator', getFilteringProperty(undefined, ':'), [':']],
  ];
  test.each<TestCase>(cases)('%s', (__description, input, exepcted) => {
    expect(getAllowedOperators(input)).toEqual(exepcted);
  });
});

describe('parseText', () => {
  type TestCase = [string, string, boolean, ParsedText];
  const cases: TestCase[] = [
    ['free text', 'text', false, { step: 'free-text', value: 'text' }],
    ['negated free text', '!:value', false, { step: 'free-text', operator: '!:', value: 'value' }],
    ['negated free text with whitespace', '!: value', false, { step: 'free-text', operator: '!:', value: ' value' }],
    ['negated free text shorthand', '!value', false, { step: 'free-text', operator: '!:', value: 'value' }],
    [
      'negated free text shorthand with whitespace',
      '! value',
      false,
      { step: 'free-text', operator: '!:', value: ' value' },
    ],
    ['free text negation after whitespace is ignored', ' !:value', false, { step: 'free-text', value: ' !:value' }],
    [
      'free text negation does not apply, if the free text is disabled',
      '!:value',
      true,
      { step: 'free-text', value: '!:value' },
    ],
    // property tokens
    [
      'full operator',
      'string!:value',
      false,
      { step: 'property', value: 'value', operator: '!:', property: filteringProperties[0] },
    ],
    [
      'full operator with whitespace before',
      'string   !=value',
      false,
      { step: 'property', value: 'value', operator: '!=', property: filteringProperties[0] },
    ],
    ['partial operator', 'string!', false, { step: 'operator', operatorPrefix: '!', property: filteringProperties[0] }],
    ['partial operator with text after', 'string! ', false, { step: 'free-text', value: 'string! ' }],
    [
      'partial operator with whitespace before',
      'string !',
      false,
      { step: 'operator', operatorPrefix: '!', property: filteringProperties[0] },
    ],
    ['partial operator was not completed', 'string !>', false, { step: 'free-text', value: 'string !>' }],
    [
      'range operator greedy (could have been completed by a "=", but is already treated like completed)',
      'range >',
      false,
      { step: 'property', operator: '>', value: '', property: filteringProperties[3] },
    ],
    [
      'operator after a property with the same prefix in the label',
      'string-other!=value',
      false,
      { step: 'property', value: 'value', operator: '!=', property: filteringProperties[1] },
    ],
    [
      'operator after edge case property',
      'string!=:value',
      false,
      { step: 'property', value: 'value', operator: ':', property: filteringProperties[4] },
    ],
    ['unsupported operator', 'string>value', false, { step: 'free-text', value: 'string>value' }],
    ['unsupported operator incompleted', 'string>', false, { step: 'free-text', value: 'string>' }],
    [
      'default operator',
      'default=value',
      false,
      { step: 'property', value: 'value', operator: '=', property: filteringProperties[2] },
    ],
    [
      'whitespace before the property label is not allowed',
      ' string!:value',
      false,
      { step: 'free-text', value: ' string!:value' },
    ],
    [
      'property label without an operator',
      'string',
      false,
      { step: 'operator', operatorPrefix: '', property: filteringProperties[0] },
    ],
  ];
  test.each<TestCase>(cases)('%s', (__description, input, disableFreeTextFiltering, expected) => {
    expect(parseText(input, filteringProperties, disableFreeTextFiltering)).toEqual(expected);
  });
});

// A function that generates suggestions for the filtering input, assisting with entering a filtering token.
// We make use of build-in autosuggest filtering and do not filter these suggestions, relying on the autosuggest to filter them later.
describe('getAutosuggestOptions', () => {
  const expectedPropertySuggestions = [
    {
      label: 'Properties',
      options: [
        { label: 'string', value: 'string', keepOpenOnSelect: true },
        { label: 'string-other', value: 'string-other', keepOpenOnSelect: true },
        { label: 'default', value: 'default', keepOpenOnSelect: true },
        { label: 'string!=', value: 'string!=', keepOpenOnSelect: true },
        { label: 'custom column', value: 'custom column', keepOpenOnSelect: true },
      ],
    },
    { options: [{ label: 'range', value: 'range', keepOpenOnSelect: true }], label: 'Group properties' },
  ];
  const expectedValueSuggestions = [
    {
      label: 'Values',
      options: [
        { value: 'string = value1', label: 'value1', __labelPrefix: 'string =' },
        { value: 'string-other = value1', label: 'value1', __labelPrefix: 'string-other =' },
        { value: 'string = value2', label: 'value2', __labelPrefix: 'string =' },
        { value: 'string-other = value2', label: 'value2', __labelPrefix: 'string-other =' },
        { value: 'default = value', label: 'value', __labelPrefix: 'default =' },
      ],
    },
    {
      label: 'Group values',
      options: [
        { value: 'range = 1', label: '1', __labelPrefix: 'range =' },
        { value: 'range = 2', label: '2', __labelPrefix: 'range =' },
      ],
    },
  ];
  const expectedOperatorSuggestions = [
    {
      options: [
        { value: 'string = ', label: 'string =', description: 'Equals', keepOpenOnSelect: true },
        { value: 'string != ', label: 'string !=', description: 'Does not equal', keepOpenOnSelect: true },
        { value: 'string : ', label: 'string :', description: 'Contains', keepOpenOnSelect: true },
        { value: 'string !: ', label: 'string !:', description: 'Does not contain', keepOpenOnSelect: true },
      ],
      label: 'Operators',
    },
  ];
  test('returns property suggestions when the filtering value is empty', () => {
    const parsedText: ParsedText = {
      step: 'free-text',
      value: '',
    };
    const expected = {
      filterText: '',
      options: expectedPropertySuggestions,
    };
    const actual = getAutosuggestOptions(
      parsedText,
      filteringProperties,
      filteringOptions,
      customGroupText,
      i18nStrings
    );
    // Every property suggestion has `keepOpenOnSelect` set on it
    // Default group and custom groups are labeled with corresponding labels
    // Custom group goes after the default group
    expect(actual).toEqual(expected);
  });
  test('returns all value and property suggestions, when the filtering text does not start with one of the property labels', () => {
    const parsedText: ParsedText = {
      step: 'free-text',
      value: 'text',
    };
    const expected = {
      filterText: 'text',
      options: [...expectedPropertySuggestions, ...expectedValueSuggestions],
    };
    const actual = getAutosuggestOptions(
      parsedText,
      filteringProperties,
      filteringOptions,
      customGroupText,
      i18nStrings
    );
    // Every value suggestion has a `__labelPrefix` of the format `${propertyLabel} =`
    // Default values group and custom values groups are labeled with corresponding labels
    // Custom values group goes after the default group, disregarding the order in the `filteringOptions`
    // The order of suggestions inside a group is preserved from `filteringOptions`
    // Filtering options that do not correspond to an item in the filteringProperties are filtered out
    // Filtering options of the properties that do not support equals are filtered out
    expect(actual).toEqual(expected);
  });
  test('returns all property suggestions and operator suggestions for a property, when the filtering text starts with this property`s label', () => {
    const parsedText: ParsedText = {
      step: 'operator',
      operatorPrefix: '!',
      property: filteringProperties[0],
    };
    const expected = {
      filterText: 'string !',
      options: [...expectedPropertySuggestions, ...expectedOperatorSuggestions],
    };
    const actual = getAutosuggestOptions(
      parsedText,
      filteringProperties,
      filteringOptions,
      customGroupText,
      i18nStrings
    );
    // Operator suggestions go after the property suggestions
    // Every operator suggestion has `keepOpenOnSelect` set on it
    // Operator suggestions and their group label are taken form the i18nStrings object
    // `filterText` should match `value` property of operator suggestions for autosuggest filtering to work
    expect(actual).toEqual(expected);
  });
  test('returns value suggestions for a given property, when the filteringText starts with this property`s labels followed by a completed operator', () => {
    const parsedText: ParsedText = {
      step: 'property',
      operator: '!=',
      value: 'value',
      property: filteringProperties[0],
    };
    const expected = {
      filterText: 'value',
      options: [
        {
          label: 'String values',
          options: [
            { value: 'string != value1', label: 'value1', __labelPrefix: 'string !=' },
            { value: 'string != value2', label: 'value2', __labelPrefix: 'string !=' },
          ],
        },
      ],
    };
    const actual = getAutosuggestOptions(
      parsedText,
      filteringProperties,
      filteringOptions,
      customGroupText,
      i18nStrings
    );
    // `filterText` should match `label` property of value suggestions for autosuggest filtering to work
    expect(actual).toEqual(expected);
  });
  test('returns value suggestions for the properies that support `!:` operator, when doing a negated free text search', () => {
    const parsedText: ParsedText = {
      step: 'free-text',
      operator: '!:',
      value: 'value',
    };
    const expected = {
      filterText: 'value',
      options: [
        {
          label: 'Values',
          options: [
            { value: 'string !: value1', label: 'value1', __labelPrefix: 'string !:' },
            { value: 'string-other !: value1', label: 'value1', __labelPrefix: 'string-other !:' },
            { value: 'string !: value2', label: 'value2', __labelPrefix: 'string !:' },
            { value: 'string-other !: value2', label: 'value2', __labelPrefix: 'string-other !:' },
          ],
        },
      ],
    };
    const actual = getAutosuggestOptions(
      parsedText,
      filteringProperties,
      filteringOptions,
      customGroupText,
      i18nStrings
    );
    expect(actual).toEqual(expected);
  });
});
