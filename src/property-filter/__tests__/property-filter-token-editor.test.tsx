// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { act, render } from '@testing-library/react';

import createWrapper, {
  ElementWrapper,
  PropertyFilterWrapper,
  PopoverWrapper,
} from '../../../lib/components/test-utils/dom';
import PropertyFilter from '../../../lib/components/property-filter';
import styles from '../../../lib/components/property-filter/styles.selectors.js';
import {
  FilteringProperty,
  FilteringOption,
  PropertyFilterProps,
  Ref,
} from '../../../lib/components/property-filter/interfaces';
import { createDefaultProps, i18nStrings } from './common';

const states: Record<string, string> = {
  0: 'Stopped',
  1: 'Stopping',
  2: 'Running',
};
const getStateLabel = (value: string) => (value !== undefined ? states[value] : 'Unknown');

const filteringProperties: readonly FilteringProperty[] = [
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
    key: 'state',
    propertyLabel: 'state',
    operators: [{ operator: '=', format: getStateLabel }],
    groupValuesLabel: 'State values',
  },
];

const filteringOptions: readonly FilteringOption[] = [
  { propertyKey: 'string', value: 'value1' },
  { propertyKey: 'other-string', value: 'value1' },
  { propertyKey: 'string', value: 'value2' },
  { propertyKey: 'range', value: '1' },
  { propertyKey: 'range', value: '2' },
  { propertyKey: 'other-string', value: 'value2' },
  { propertyKey: 'missing-property', value: 'value' },
  { propertyKey: 'default-operator', value: 'value' },
  { propertyKey: 'state', value: '0', label: getStateLabel('0') },
  { propertyKey: 'state', value: '1', label: getStateLabel('1') },
  { propertyKey: 'state', value: '2', label: getStateLabel('2') },
];

const defaultProps = createDefaultProps(filteringProperties, filteringOptions);

const renderComponent = (props?: Partial<PropertyFilterProps & { ref: React.Ref<Ref> }>) => {
  const { container } = render(<PropertyFilter {...defaultProps} {...props} />);
  return { container, propertyFilterWrapper: createWrapper(container).findPropertyFilter()! };
};

function findPropertyField(wrapper: ElementWrapper) {
  return wrapper.findFormField(`.${styles['token-editor-field-property']}`)!;
}
function findOperatorField(wrapper: ElementWrapper) {
  return wrapper.findFormField(`.${styles['token-editor-field-operator']}`)!;
}
function findValueField(wrapper: ElementWrapper) {
  return wrapper.findFormField(`.${styles['token-editor-field-value']}`)!;
}

function findPropertySelector(wrapper: ElementWrapper) {
  return findPropertyField(wrapper).findControl()!.findSelect()!;
}
function findOperatorSelector(wrapper: ElementWrapper) {
  return findOperatorField(wrapper).findControl()!.findSelect()!;
}
function findValueSelector(wrapper: ElementWrapper) {
  return findValueField(wrapper).findControl()!.findAutosuggest()!;
}

function openTokenEditor(wrapper: PropertyFilterWrapper, index = 0) {
  const tokenWrapper = createWrapper(wrapper.findTokens()![index].getElement());
  const popoverWrapper = tokenWrapper.findPopover()!;
  act(() => popoverWrapper.findTrigger().click());
  const contentWrapper = popoverWrapper.findContent()!;
  return [contentWrapper, popoverWrapper] as const;
}

describe('token editor', () => {
  test('uses i18nStrings to populate header', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      query: { tokens: [{ value: 'first', operator: '!:' }], operation: 'or' },
    });
    const [, popoverWrapper] = openTokenEditor(wrapper);
    expect(popoverWrapper.findHeader()!.getElement()).toHaveTextContent(i18nStrings.editTokenHeader);
  });

  describe('form controls content', () => {
    test('default', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: '!:' }], operation: 'or' },
      });
      const [contentWrapper] = openTokenEditor(wrapper);
      expect(contentWrapper.getElement()).toHaveTextContent('PropertystringOperator!:Does not containValueCancelApply');
      const propertySelectWrapper = findPropertySelector(contentWrapper);
      act(() => propertySelectWrapper.openDropdown());
      expect(
        propertySelectWrapper
          .findDropdown()
          .findOptions()!
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['All properties', 'string', 'string-other', 'default', 'string!=', 'state', 'range']);

      const operatorSelectWrapper = findOperatorSelector(contentWrapper);
      act(() => operatorSelectWrapper.openDropdown());
      expect(
        operatorSelectWrapper
          .findDropdown()
          .findOptions()!
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['=Equals', '!=Does not equal', ':Contains', '!:Does not contain']);

      const valueSelectWrapper = findValueSelector(contentWrapper);
      act(() => valueSelectWrapper.focus());
      expect(
        valueSelectWrapper
          .findDropdown()
          .findOptions()!
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['value1', 'value2']);
    });

    test('with free text disabled', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        disableFreeTextFiltering: true,
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: '!:' }], operation: 'or' },
      });
      const [contentWrapper] = openTokenEditor(wrapper);
      expect(contentWrapper.getElement()).toHaveTextContent('PropertystringOperator!:Does not containValueCancelApply');
      const propertySelectWrapper = findPropertySelector(contentWrapper);
      act(() => propertySelectWrapper.openDropdown());
      expect(
        propertySelectWrapper
          .findDropdown()
          .findOptions()!
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['string', 'string-other', 'default', 'string!=', 'state', 'range']);
    });

    test('with custom free text operators', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        freeTextFiltering: { operators: ['=', '!=', ':', '!:'] },
        query: { tokens: [{ value: 'first', operator: '!=' }], operation: 'or' },
      });
      const [contentWrapper] = openTokenEditor(wrapper);
      expect(contentWrapper.getElement()).toHaveTextContent(
        'PropertyAll propertiesOperator!=Does not equalValueCancelApply'
      );
      const operatorSelectWrapper = findOperatorSelector(contentWrapper);
      act(() => operatorSelectWrapper.openDropdown());
      expect(
        operatorSelectWrapper
          .findDropdown()
          .findOptions()!
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['=Equals', '!=Does not equal', ':Contains', '!:Does not contain']);
    });

    test('preserves fields, when one is edited', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        disableFreeTextFiltering: true,
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
      });
      const [contentWrapper] = openTokenEditor(wrapper);
      const propertySelectWrapper = findPropertySelector(contentWrapper);
      const operatorSelectWrapper = findOperatorSelector(contentWrapper);
      const valueSelectWrapper = findValueSelector(contentWrapper);

      // Change operator
      act(() => operatorSelectWrapper.openDropdown());
      act(() => operatorSelectWrapper.selectOption(1));
      expect(propertySelectWrapper.findTrigger().getElement()).toHaveTextContent('string');
      expect(operatorSelectWrapper.findTrigger().getElement()).toHaveTextContent('=Equals');
      expect(valueSelectWrapper.findNativeInput().getElement()).toHaveAttribute('value', 'first');

      // Change value
      act(() => valueSelectWrapper.setInputValue('123'));
      expect(propertySelectWrapper.findTrigger().getElement()).toHaveTextContent('string');
      expect(operatorSelectWrapper.findTrigger().getElement()).toHaveTextContent('=Equals');
      expect(valueSelectWrapper.findNativeInput().getElement()).toHaveAttribute('value', '123');

      // Change property
      // This preserves operator but not value because the value type between properties can be different.
      act(() => propertySelectWrapper.openDropdown());
      act(() => propertySelectWrapper.selectOption(2));
      expect(propertySelectWrapper.findTrigger().getElement()).toHaveTextContent('string-other');
      expect(operatorSelectWrapper.findTrigger().getElement()).toHaveTextContent('=Equals');
      expect(valueSelectWrapper.findNativeInput().getElement()).toHaveAttribute('value', '');
    });
  });

  describe('exit actions', () => {
    let wrapper: PropertyFilterWrapper;
    let contentWrapper: ElementWrapper;
    let popoverWrapper: PopoverWrapper;
    const handleChange = jest.fn();
    beforeEach(() => {
      handleChange.mockReset();
      const { propertyFilterWrapper } = renderComponent({
        onChange: handleChange,
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: '!:' }], operation: 'or' },
      });
      wrapper = propertyFilterWrapper;
      const openResult = openTokenEditor(wrapper);
      contentWrapper = openResult[0];
      popoverWrapper = openResult[1];
    });

    test('dismiss button closes the popover and discards the changes', () => {
      const valueAutosuggestWrapper = findValueSelector(contentWrapper);
      act(() => valueAutosuggestWrapper.setInputValue('123'));
      const operatorSelectWrapper = findOperatorSelector(contentWrapper);
      act(() => operatorSelectWrapper.openDropdown());
      act(() => operatorSelectWrapper.selectOption(1));
      const propertySelectWrapper = findPropertySelector(contentWrapper);
      act(() => propertySelectWrapper.openDropdown());
      act(() => propertySelectWrapper.selectOption(1));

      act(() => popoverWrapper.findDismissButton()!.click());
      expect(popoverWrapper.findContent()).toBeNull();
      expect(handleChange).not.toHaveBeenCalled();

      const openResult = openTokenEditor(wrapper);
      contentWrapper = openResult[0];
      expect(contentWrapper.getElement()).toHaveTextContent('PropertystringOperator!:Does not containValueCancelApply');
    });

    test('cancel button closes the popover and discards the changes', () => {
      const valueAutosuggestWrapper = findValueSelector(contentWrapper);
      act(() => valueAutosuggestWrapper.setInputValue('123'));
      const operatorSelectWrapper = findOperatorSelector(contentWrapper);
      act(() => operatorSelectWrapper.openDropdown());
      act(() => operatorSelectWrapper.selectOption(1));
      const propertySelectWrapper = findPropertySelector(contentWrapper);
      act(() => propertySelectWrapper.openDropdown());
      act(() => propertySelectWrapper.selectOption(1));

      act(() => contentWrapper.findButton(`.${styles['token-editor-cancel']}`)!.click());
      popoverWrapper = wrapper.findTokens()[0]!.find('*')!.findPopover()!;
      expect(popoverWrapper.findContent()).toBeNull();
      expect(handleChange).not.toHaveBeenCalled();

      const openResult = openTokenEditor(wrapper);
      contentWrapper = openResult[0];
      expect(contentWrapper.getElement()).toHaveTextContent('PropertystringOperator!:Does not containValueCancelApply');
    });

    test('submit button closes the popover and saves the changes', () => {
      const operatorSelectWrapper = findOperatorSelector(contentWrapper);
      act(() => operatorSelectWrapper.openDropdown());
      act(() => operatorSelectWrapper.selectOption(1));
      const propertySelectWrapper = findPropertySelector(contentWrapper);
      act(() => propertySelectWrapper.openDropdown());
      act(() => propertySelectWrapper.selectOption(1));
      const valueAutosuggestWrapper = findValueSelector(contentWrapper);
      act(() => valueAutosuggestWrapper.setInputValue('123'));

      act(() => contentWrapper.findButton(`.${styles['token-editor-submit']}`)!.click());
      popoverWrapper = wrapper.findTokens()[0]!.find('*')!.findPopover()!;
      expect(popoverWrapper.findContent()).toBeNull();
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { operation: 'or', tokens: [{ operator: ':', propertyKey: undefined, value: '123' }] },
        })
      );
    });
  });
});
