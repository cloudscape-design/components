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
      propertyLabel: 'string',
      operators: ['!:', ':', '=', '!='],
      groupValuesLabel: 'String values',
    },
    {
      key: 'range',
      propertyLabel: 'range',
      operators: ['>', '<', '=', '!=', '>=', '<='],
      groupValuesLabel: 'Range values',
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
            'i18nStrings.removeTokenButtonAriaLabel': `{token__operator, select, 
              equals {Remove filter, {token__propertyKey} Custom equals {token__value}}
              not_equals {Remove filter, {token__propertyKey} Custom does not equal {token__value}}
              greater_than {Remove filter, {token__propertyKey} Custom greater than {token__value}}
              greater_than_equal {Remove filter, {token__propertyKey} Custom greater than or equals {token__value}}
              less_than {Remove filter, {token__propertyKey} Custom less than {token__value}}
              less_than_equal {Remove filter, {token__propertyKey} Custom less than or equals {token__value}}
              contains {Remove filter, {token__propertyKey} Custom contains {token__value}}
              not_contains {Remove filter, {token__propertyKey} Custom does not contain {token__value}}
              starts_with {Remove filter, {token__propertyKey} Custom starts with {token__value}}
              not_starts_with {Remove filter, {token__propertyKey} Custom does not start with {token__value}}
              other {}}`,
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
            ],
          }}
          i18nStrings={{ filteringAriaLabel: 'your choice', filteringPlaceholder: 'Search' }}
        />
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findPropertyFilter()!;
    expect(wrapper.findRemoveAllButton()!.getElement()).toHaveTextContent('Custom Clear filters');
    expect(wrapper.findTokenToggle()!.getElement()).toHaveTextContent('Custom Show more');
    wrapper.findTokenToggle()!.click();
    expect(wrapper.findTokenToggle()!.getElement()).toHaveTextContent('Custom Show fewer');

    const getRemoveButton = (index: number) => wrapper.findTokens()[index].findRemoveButton().getElement();
    expect(getRemoveButton(0)).toHaveAccessibleName('Remove filter, string Custom equals value1');
    expect(getRemoveButton(1)).toHaveAccessibleName('Remove filter, string Custom does not equal value2');
    expect(getRemoveButton(2)).toHaveAccessibleName('Remove filter, string Custom contains value3');
    expect(getRemoveButton(3)).toHaveAccessibleName('Remove filter, string Custom does not contain value4');
    expect(getRemoveButton(4)).toHaveAccessibleName('Remove filter, string Custom starts with value5');
    expect(getRemoveButton(5)).toHaveAccessibleName('Remove filter, string Custom does not start with value6');
    expect(getRemoveButton(6)).toHaveAccessibleName('Remove filter, range Custom greater than 1');
    expect(getRemoveButton(7)).toHaveAccessibleName('Remove filter, range Custom less than 2');
    expect(getRemoveButton(8)).toHaveAccessibleName('Remove filter, range Custom greater than or equals 3');
    expect(getRemoveButton(9)).toHaveAccessibleName('Remove filter, range Custom less than or equals 4');

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
});
