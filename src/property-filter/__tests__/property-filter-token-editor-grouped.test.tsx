// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import { format } from 'date-fns';

import DatePicker from '../../../lib/components/date-picker';
import FormField from '../../../lib/components/form-field';
import { InternalFilteringProperty } from '../../../lib/components/property-filter/interfaces';
import { TokenEditor, TokenEditorProps } from '../../../lib/components/property-filter/token-editor-grouped';
import createWrapper from '../../../lib/components/test-utils/dom';
import { InternalPropertyFilterEditorDropdownWrapper } from '../../../lib/components/test-utils/dom/property-filter';

const externalProperty = {
  key: '',
  operators: [],
  propertyLabel: '',
  groupValuesLabel: '',
} as const;

const openCalendarAriaLabel = (selectedDate: string | null) =>
  'Choose Date' + (selectedDate ? `, selected date is ${selectedDate}` : '');

const nameProperty: InternalFilteringProperty = {
  propertyKey: 'name',
  propertyLabel: 'Name',
  groupValuesLabel: 'Name values',
  operators: ['=', '!='],
  defaultOperator: '=',
  getValueFormatter: () => null,
  getValueFormRenderer: () => null,
  externalProperty,
};

const dateProperty: InternalFilteringProperty = {
  propertyKey: 'date',
  propertyLabel: 'Date',
  groupValuesLabel: 'Date values',
  operators: ['=', '!='],
  defaultOperator: '=',
  getValueFormatter: () => (value: null | Date) => (value ? format(value, 'yyyy-MM-dd') : ''),
  getValueFormRenderer:
    () =>
    ({ value }) => (
      <FormField>
        <DatePicker value={value ? format(value, 'yyyy-MM-dd') : ''} openCalendarAriaLabel={openCalendarAriaLabel} />
      </FormField>
    ),
  externalProperty,
};

const defaultProps: TokenEditorProps = {
  asyncProps: {},
  customGroupsText: [],
  freeTextFiltering: {
    disabled: false,
    operators: [':', '!:'],
    defaultOperator: ':',
  },
  filteringProperties: [nameProperty, dateProperty],
  filteringOptions: [],
  i18nStrings: {
    editTokenHeader: 'Edit token',
    propertyText: 'Property',
    operatorText: 'Operator',
    valueText: 'Value',
    cancelActionText: 'Cancel',
    applyActionText: 'Apply',
  },
  i18nStringsExt: {
    tokenEditorTokenActionsLabel: token =>
      `Filter remove actions for ${token.propertyLabel} ${token.operator} ${token.value}`,
    tokenEditorTokenRemoveLabel: () => 'Remove filter',
    tokenEditorTokenRemoveFromGroupLabel: () => 'Remove filter from group',
    tokenEditorAddNewTokenLabel: 'Add new filter',
    tokenEditorAddTokenActionsLabel: 'Add filter actions',
    tokenEditorAddExistingTokenLabel: token =>
      `Add filter ${token.propertyLabel} ${token.operator} ${token.value} to group`,
  },
  onSubmit: () => {},
  onDismiss: () => {},
  standaloneTokens: [],
  onChangeStandalone: () => {},
  tempGroup: [{ property: nameProperty, operator: '=', value: 'John' }],
  onChangeTempGroup: () => {},
};

function renderComponent(props?: Partial<TokenEditorProps>) {
  const { container } = render(<TokenEditor {...defaultProps} {...props} />);
  return new InternalPropertyFilterEditorDropdownWrapper(container);
}

describe.each([500, 1000])('window size = %spx', width => {
  function findRemoveAction(wrapper: InternalPropertyFilterEditorDropdownWrapper, index: number) {
    wrapper.findTokenRemoveActions(index).openDropdown();
    return width === 500
      ? wrapper.findTokenRemoveActions(index).findMainAction()!
      : wrapper.findTokenRemoveActions(index).findItems()[0];
  }
  function findRemoveFromGroupAction(wrapper: InternalPropertyFilterEditorDropdownWrapper, index: number) {
    wrapper.findTokenRemoveActions(index).openDropdown();
    return wrapper.findTokenRemoveActions(index).findItems()[width === 500 ? 0 : 1];
  }

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: width });
    window.dispatchEvent(new CustomEvent('resize'));
  });

  test('renders token editor with a single property', () => {
    const wrapper = renderComponent({});

    // Not supported yet because the standalone editor does not include the popover
    // This can be uncommented when defining the test against the property filter
    // which is not possible for the internal-only token-editor-grouped yet.
    // expect(wrapper.findHeader().getElement()).toHaveTextContent('Edit token');
    // expect(wrapper.findDismissButton().getElement()).toHaveAccessibleName('Close token editor');

    // Token inputs
    expect(wrapper.findPropertyField().findControl()!.find('button')!.getElement()).toHaveAccessibleName(
      'Property Name'
    );
    expect(wrapper.findOperatorField().findControl()!.find('button')!.getElement()).toHaveAccessibleName('Operator =');
    expect(wrapper.findValueField().findControl()!.find('input')!.getElement()).toHaveAccessibleName('Value');
    expect(wrapper.findValueField().findControl()!.find('input')!.getElement()).toHaveValue('John');

    // Remove actions
    expect(wrapper.findTokenRemoveActions().findNativeButton().getElement()).toHaveAccessibleName(
      'Filter remove actions for Name = John'
    );
    expect(wrapper.findTokenRemoveActions().findNativeButton().getElement()).toBeDisabled();

    // Add actions
    expect(wrapper.findTokenAddActions().findNativeButton().getElement()).toHaveAccessibleName('Add filter actions');
    expect(wrapper.findTokenAddActions().findNativeButton().getElement()).toBeDisabled();
    expect(wrapper.findTokenAddActions().findMainAction()!.getElement()).toHaveTextContent('Add new filter');

    // Form actions
    expect(wrapper.findCancelButton().getElement()).toHaveTextContent('Cancel');
    expect(wrapper.findSubmitButton().getElement()).toHaveTextContent('Apply');
  });

  test('changes property name', () => {
    const onChangeTempGroup = jest.fn();
    const wrapper = renderComponent({ onChangeTempGroup });
    const propertySelect = createWrapper(wrapper.findPropertyField().getElement()).findSelect()!;

    propertySelect.openDropdown();
    propertySelect.selectOptionByValue('date');
    wrapper.findSubmitButton().click();

    expect(onChangeTempGroup).toHaveBeenCalledTimes(1);
    expect(onChangeTempGroup).toHaveBeenCalledWith([
      expect.objectContaining({ property: dateProperty, operator: '=', value: null }),
    ]);
  });

  test('changes property operator', () => {
    const onChangeTempGroup = jest.fn();
    const wrapper = renderComponent({ onChangeTempGroup });
    const operatorSelect = createWrapper(wrapper.findOperatorField().getElement()).findSelect()!;

    operatorSelect.openDropdown();
    operatorSelect.selectOptionByValue('!=');
    wrapper.findSubmitButton().click();

    expect(onChangeTempGroup).toHaveBeenCalledTimes(1);
    expect(onChangeTempGroup).toHaveBeenCalledWith([
      expect.objectContaining({ property: nameProperty, operator: '!=', value: 'John' }),
    ]);
  });

  test('changes property value', () => {
    const onChangeTempGroup = jest.fn();
    const wrapper = renderComponent({ onChangeTempGroup });
    const valueAutosuggest = createWrapper(wrapper.findValueField().getElement()).findAutosuggest()!;

    valueAutosuggest.setInputValue('Jane');
    wrapper.findSubmitButton().click();

    expect(onChangeTempGroup).toHaveBeenCalledTimes(1);
    expect(onChangeTempGroup).toHaveBeenCalledWith([
      expect.objectContaining({ property: nameProperty, operator: '=', value: 'Jane' }),
    ]);
  });

  test('removes first property', () => {
    const onChangeTempGroup = jest.fn();
    const wrapper = renderComponent({
      tempGroup: [
        { property: nameProperty, operator: '=', value: 'John' },
        { property: nameProperty, operator: '=', value: 'Jane' },
      ],
      onChangeTempGroup,
    });

    findRemoveAction(wrapper, 1).click();
    wrapper.findSubmitButton().click();

    expect(onChangeTempGroup).toHaveBeenCalledTimes(1);
    expect(onChangeTempGroup).toHaveBeenCalledWith([
      expect.objectContaining({ property: nameProperty, operator: '=', value: 'Jane' }),
    ]);
  });

  test('removes second property', () => {
    const onChangeTempGroup = jest.fn();
    const wrapper = renderComponent({
      tempGroup: [
        { property: nameProperty, operator: '=', value: 'John' },
        { property: nameProperty, operator: '=', value: 'Jane' },
      ],
      onChangeTempGroup,
    });

    findRemoveAction(wrapper, 2).click();
    wrapper.findSubmitButton().click();

    expect(onChangeTempGroup).toHaveBeenCalledTimes(1);
    expect(onChangeTempGroup).toHaveBeenCalledWith([
      expect.objectContaining({ property: nameProperty, operator: '=', value: 'John' }),
    ]);
  });

  test('removes first property from group', () => {
    const onChangeTempGroup = jest.fn();
    const onChangeStandalone = jest.fn();
    const wrapper = renderComponent({
      tempGroup: [
        { property: nameProperty, operator: '=', value: 'John' },
        { property: nameProperty, operator: '=', value: 'Jane' },
      ],
      onChangeTempGroup,
      onChangeStandalone,
    });

    findRemoveFromGroupAction(wrapper, 1).click();
    wrapper.findSubmitButton().click();

    expect(onChangeTempGroup).toHaveBeenCalledTimes(1);
    expect(onChangeTempGroup).toHaveBeenCalledWith([
      expect.objectContaining({ property: nameProperty, operator: '=', value: 'Jane' }),
    ]);

    expect(onChangeStandalone).toHaveBeenCalledTimes(1);
    expect(onChangeStandalone).toHaveBeenCalledWith([
      expect.objectContaining({ property: nameProperty, operator: '=', value: 'John' }),
    ]);
  });

  test('adds new property', () => {
    const onChangeTempGroup = jest.fn();
    const wrapper = renderComponent({
      tempGroup: [
        { property: nameProperty, operator: '=', value: 'John' },
        { property: nameProperty, operator: '=', value: 'Jane' },
      ],
      onChangeTempGroup,
    });

    wrapper.findTokenAddActions().findMainAction()!.click();
    wrapper.findSubmitButton().click();

    expect(onChangeTempGroup).toHaveBeenCalledTimes(1);
    expect(onChangeTempGroup).toHaveBeenCalledWith([
      expect.objectContaining({ property: nameProperty, operator: '=', value: 'John' }),
      expect.objectContaining({ property: nameProperty, operator: '=', value: 'Jane' }),
      expect.objectContaining({ property: null, operator: ':', value: null }),
    ]);
  });

  test('adds new property from standalone', () => {
    const onChangeTempGroup = jest.fn();
    const onChangeStandalone = jest.fn();
    const wrapper = renderComponent({
      tempGroup: [
        { property: nameProperty, operator: '=', value: 'John' },
        { property: nameProperty, operator: '=', value: 'Jane' },
      ],
      standaloneTokens: [{ property: dateProperty, operator: '=', value: null }],
      onChangeTempGroup,
      onChangeStandalone,
    });

    wrapper.findTokenAddActions().openDropdown();
    wrapper.findTokenAddActions().findItems()[0].click();
    wrapper.findSubmitButton().click();

    expect(onChangeTempGroup).toHaveBeenCalledTimes(1);
    expect(onChangeTempGroup).toHaveBeenCalledWith([
      expect.objectContaining({ property: nameProperty, operator: '=', value: 'John' }),
      expect.objectContaining({ property: nameProperty, operator: '=', value: 'Jane' }),
      expect.objectContaining({ property: dateProperty, operator: '=', value: null }),
    ]);

    expect(onChangeStandalone).toHaveBeenCalledTimes(1);
    expect(onChangeStandalone).toHaveBeenCalledWith([]);
  });
});
