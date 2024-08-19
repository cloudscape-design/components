// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { act, render } from '@testing-library/react';

import TestI18nProvider from '../../../lib/components/i18n/testing';
import PropertyFilter from '../../../lib/components/property-filter';
import createWrapper, { ElementWrapper, PropertyFilterWrapper } from '../../../lib/components/test-utils/dom';
import { createDefaultProps } from './common';

import styles from '../../../lib/components/property-filter/styles.selectors.js';

const defaultProps = createDefaultProps(
  [
    {
      key: 'string',
      propertyLabel: 'String',
      operators: ['!:', ':', '=', '!='],
      groupValuesLabel: 'String values',
    },
    {
      key: 'range',
      propertyLabel: 'Range',
      operators: ['>', '<', '=', '!=', '>=', '<='],
      groupValuesLabel: 'Range values',
      group: 'group-name',
    },
    {
      key: 'custom',
      propertyLabel: 'Custom',
      operators: [{ operator: '=', format: () => 'empty' }],
      groupValuesLabel: 'Custom values',
      group: 'group-name',
    },
  ],
  [
    { propertyKey: 'string', value: 'value1' },
    { propertyKey: 'string', value: 'value2' },
    { propertyKey: 'range', value: '1' },
    { propertyKey: 'range', value: '2' },
  ]
);

function findPropertyField(wrapper: ElementWrapper) {
  return wrapper.findFormField(`.${styles['token-editor-field-property']}`)!;
}
function findOperatorField(wrapper: ElementWrapper) {
  return wrapper.findFormField(`.${styles['token-editor-field-operator']}`)!;
}
function findValueField(wrapper: ElementWrapper) {
  return wrapper.findFormField(`.${styles['token-editor-field-value']}`)!;
}
function findCancelButton(wrapper: ElementWrapper) {
  return wrapper.findButton(`.${styles['token-editor-cancel']}`)!;
}
function findSubmitButton(wrapper: ElementWrapper) {
  return wrapper.findButton(`.${styles['token-editor-submit']}`)!;
}

function openTokenEditor(wrapper: PropertyFilterWrapper, index = 0) {
  const tokenWrapper = createWrapper(wrapper.findTokens()![index].getElement());
  const popoverWrapper = tokenWrapper.findPopover()!;
  act(() => popoverWrapper.findTrigger().click());
  const contentWrapper = popoverWrapper.findContent()!;
  return [contentWrapper, popoverWrapper] as const;
}

describe('i18n', () => {
  const providerMessages = {
    'property-filter': {
      'i18nStrings.allPropertiesLabel': 'Custom All properties',
      'i18nStrings.groupPropertiesText': 'Custom Properties',
      'i18nStrings.groupValuesText': 'Custom Values',
      'i18nStrings.operatorContainsText': 'Custom Contains',
      'i18nStrings.operatorDoesNotContainText': 'Custom Does not contain',
      'i18nStrings.operatorDoesNotEqualText': 'Custom Does not equal',
      'i18nStrings.operatorEqualsText': 'Custom Equals',
      'i18nStrings.operatorGreaterOrEqualText': 'Custom Greater than or equal',
      'i18nStrings.operatorGreaterText': 'Custom Greater than',
      'i18nStrings.operatorLessOrEqualText': 'Custom Less than or equal',
      'i18nStrings.operatorLessText': 'Custom Less than',
      'i18nStrings.operatorStartsWithText': 'Custom Starts with',
      'i18nStrings.operatorDoesNotStartWithText': 'Custom Does not start with',
      'i18nStrings.operatorText': 'Custom Operator',
      'i18nStrings.operatorsText': 'Custom Operators',
      'i18nStrings.propertyText': 'Custom Property',
    },
  };

  it('uses dropdown labels from i18n provider for a string property', () => {
    const { container } = render(
      <TestI18nProvider messages={providerMessages}>
        <PropertyFilter
          {...defaultProps}
          filteringProperties={[
            {
              key: 'string',
              propertyLabel: 'string',
              operators: ['!:', ':', '=', '!=', '^', '!^'],
              groupValuesLabel: 'String values',
            },
          ]}
          i18nStrings={{ filteringAriaLabel: 'your choice', filteringPlaceholder: 'Search' }}
        />
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findPropertyFilter()!;

    wrapper.focus();
    const dropdown = wrapper.findDropdown()!;
    expect(dropdown.find('li')!.getElement()).toHaveTextContent('Custom Properties');

    wrapper.selectSuggestion(1);
    expect(dropdown.find('li:nth-child(2)')!.getElement()).toHaveTextContent('Custom Operators');
    expect(
      dropdown.findOptions().map(optionWrapper => optionWrapper.findDescription()?.getElement().textContent)
    ).toEqual([
      'Custom Equals',
      'Custom Does not equal',
      'Custom Contains',
      'Custom Does not contain',
      'Custom Starts with',
      'Custom Does not start with',
    ]);
  });

  it('uses dropdown labels from i18n provider for a numeric property', () => {
    const { container } = render(
      <TestI18nProvider messages={providerMessages}>
        <PropertyFilter
          {...defaultProps}
          i18nStrings={{ filteringAriaLabel: 'your choice', filteringPlaceholder: 'Search' }}
        />
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findPropertyFilter()!;

    wrapper.focus();
    const dropdown = wrapper.findDropdown()!;
    expect(dropdown.find('li')!.getElement()).toHaveTextContent('Custom Properties');

    wrapper.selectSuggestion(2);
    expect(dropdown.find('li:nth-child(2)')!.getElement()).toHaveTextContent('Custom Operators');
    expect(
      dropdown.findOptions().map(optionWrapper => optionWrapper.findDescription()?.getElement().textContent)
    ).toEqual([
      'Custom Equals',
      'Custom Does not equal',
      'Custom Greater than or equal',
      'Custom Less than or equal',
      'Custom Less than',
      'Custom Greater than',
    ]);
  });

  it('uses token and editor labels from i18n provider', () => {
    const { container } = render(
      <TestI18nProvider
        messages={{
          'property-filter': {
            'i18nStrings.allPropertiesLabel': 'Custom All properties',
            'i18nStrings.applyActionText': 'Custom Apply',
            'i18nStrings.cancelActionText': 'Custom Cancel',
            'i18nStrings.clearFiltersText': 'Custom Clear filters',
            'i18nStrings.editTokenHeader': 'Custom Edit filter',
            'i18nStrings.groupPropertiesText': 'Custom Properties',
            'i18nStrings.groupValuesText': 'Custom Values',
            'i18nStrings.operationAndText': 'Custom and',
            'i18nStrings.operationOrText': 'Custom or',
            'i18nStrings.operatorText': 'Custom Operator',
            'i18nStrings.operatorsText': 'Operators',
            'i18nStrings.propertyText': 'Custom Property',
            'i18nStrings.tokenLimitShowFewer': 'Custom Show fewer',
            'i18nStrings.tokenLimitShowMore': 'Custom Show more',
            'i18nStrings.valueText': 'Custom Value',
            'i18nStrings.formatToken': `{token__operator, select, 
              equals {{token__propertyLabel} Custom equals {token__value}}
              not_equals {{token__propertyLabel} Custom does not equal {token__value}}
              greater_than {{token__propertyLabel} Custom greater than {token__value}}
              greater_than_equal {{token__propertyLabel} Custom greater than or equals {token__value}}
              less_than {{token__propertyLabel} Custom less than {token__value}}
              less_than_equal {{token__propertyLabel} Custom less than or equals {token__value}}
              contains {{token__propertyLabel} Custom contains {token__value}}
              not_contains {{token__propertyLabel} Custom does not contain {token__value}}
              starts_with {{token__propertyLabel} Custom starts with {token__value}}
              not_starts_with {{token__propertyLabel} Custom does not start with {token__value}}
              other {}}`,
            'i18nStrings.removeTokenButtonAriaLabel': `Remove filter, {token__formattedText}`,
          },
        }}
      >
        <PropertyFilter
          {...defaultProps}
          tokenLimit={1}
          query={{
            operation: 'and',
            tokens: [
              { propertyKey: 'string', operator: '=', value: 'value1' },
              { propertyKey: 'string', operator: '!=', value: 'value2' },
              { propertyKey: 'string', operator: ':', value: 'value3' },
              { propertyKey: 'string', operator: '!:', value: 'value4' },
              { propertyKey: 'string', operator: '^', value: 'value5' },
              { propertyKey: 'string', operator: '!^', value: 'value6' },
              { propertyKey: 'range', operator: '>', value: '1' },
              { propertyKey: 'range', operator: '<', value: '2' },
              { propertyKey: 'range', operator: '>=', value: '3' },
              { propertyKey: 'range', operator: '<=', value: '4' },
              { propertyKey: 'custom', operator: '=', value: null },
              { propertyKey: undefined, operator: ':', value: 'all' },
            ],
          }}
          i18nStrings={{ filteringAriaLabel: 'your choice', filteringPlaceholder: 'Search' }}
        />
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findPropertyFilter()!;
    const token = (index: number) => wrapper.findTokens()[index];

    expect(wrapper.findRemoveAllButton()!.getElement()).toHaveTextContent('Custom Clear filters');
    expect(wrapper.findTokenToggle()!.getElement()).toHaveTextContent('Custom Show more');
    wrapper.findTokenToggle()!.click();
    expect(wrapper.findTokenToggle()!.getElement()).toHaveTextContent('Custom Show fewer');

    expect(token(0).getElement().textContent).toBe('String = value1');
    expect(token(0).getElement()).toHaveAccessibleName('String Custom equals value1');
    expect(token(1).getElement()).toHaveAccessibleName('String Custom does not equal value2');
    expect(token(2).getElement()).toHaveAccessibleName('String Custom contains value3');
    expect(token(3).getElement()).toHaveAccessibleName('String Custom does not contain value4');
    expect(token(4).getElement()).toHaveAccessibleName('String Custom starts with value5');
    expect(token(5).getElement()).toHaveAccessibleName('String Custom does not start with value6');
    expect(token(6).getElement()).toHaveAccessibleName('Range Custom greater than 1');
    expect(token(7).getElement()).toHaveAccessibleName('Range Custom less than 2');
    expect(token(8).getElement()).toHaveAccessibleName('Range Custom greater than or equals 3');
    expect(token(9).getElement()).toHaveAccessibleName('Range Custom less than or equals 4');
    expect(token(10).getElement()).toHaveAccessibleName('Custom Custom equals empty');
    expect(token(11).getElement()).toHaveAccessibleName('Custom All properties Custom contains all');
    expect(token(0).findRemoveButton().getElement()).toHaveAccessibleName('Remove filter, String Custom equals value1');

    const tokenOperation = wrapper.findTokens()[1].findTokenOperation()!;
    tokenOperation.openDropdown();
    expect(tokenOperation.findDropdown()!.findOption(1)!.getElement()).toHaveTextContent('Custom and');
    expect(tokenOperation.findDropdown()!.findOption(2)!.getElement()).toHaveTextContent('Custom or');

    const [popoverContent, popover] = openTokenEditor(wrapper);
    expect(popover.findHeader()!.getElement()).toHaveTextContent('Custom Edit filter');
    expect(findPropertyField(popoverContent).findLabel()!.getElement()).toHaveTextContent('Custom Property');
    expect(findOperatorField(popoverContent).findLabel()!.getElement()).toHaveTextContent('Custom Operator');
    expect(findValueField(popoverContent).findLabel()!.getElement()).toHaveTextContent('Custom Value');
    expect(findCancelButton(popoverContent).getElement()).toHaveTextContent('Custom Cancel');
    expect(findSubmitButton(popoverContent).getElement()).toHaveTextContent('Custom Apply');
  });

  it('uses formatted token for removeTokenButtonAriaLabel', () => {
    const { container } = render(
      <PropertyFilter
        {...defaultProps}
        query={{
          operation: 'and',
          tokens: [
            { propertyKey: 'custom', operator: '=', value: null },
            { propertyKey: undefined, operator: ':', value: 'all' },
          ],
        }}
        i18nStrings={{
          allPropertiesLabel: 'All',
          removeTokenButtonAriaLabel: token =>
            `Remove ${token.propertyKey} ${token.propertyLabel} ${token.operator} ${token.value}`,
        }}
      />
    );
    const wrapper = createWrapper(container).findPropertyFilter()!;
    const getRemoveButton = (index: number) => wrapper.findTokens()[index].findRemoveButton().getElement();

    expect(getRemoveButton(0)).toHaveAccessibleName('Remove custom Custom = empty');
    expect(getRemoveButton(1)).toHaveAccessibleName('Remove undefined All : all');
  });
});
