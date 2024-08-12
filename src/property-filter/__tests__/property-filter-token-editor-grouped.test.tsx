// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import { format } from 'date-fns';

import DatePicker from '../../../lib/components/date-picker';
import FormField from '../../../lib/components/form-field';
import { useContainerBreakpoints } from '../../../lib/components/internal/hooks/container-queries';
import { InternalFilteringProperty } from '../../../lib/components/property-filter/interfaces';
import { TokenEditor, TokenEditorProps } from '../../../lib/components/property-filter/token-editor-grouped';
import createWrapper from '../../../lib/components/test-utils/dom';
import { InternalPropertyFilterEditorDropdownWrapper } from '../../../lib/components/test-utils/dom/property-filter';

jest.mock('../../../lib/components/internal/hooks/container-queries', () => ({
  ...jest.requireActual('../../../lib/components/internal/hooks/container-queries'),
  useContainerBreakpoints: jest.fn().mockReturnValue(['xs', () => {}]),
}));

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
  supportsGroups: true,
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
    tokenEditorTokenActionsLabel: token => `Remove actions ${token.propertyLabel} ${token.operator} ${token.value}`,
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

describe.each(['xs', 'default'] as const)('breakpoints = %s', breakpoint => {
  const isNarrow = breakpoint === 'default';

  function findRemoveAction(wrapper: InternalPropertyFilterEditorDropdownWrapper, index: number) {
    wrapper.findTokenRemoveActions(index)!.openDropdown();
    return isNarrow
      ? wrapper.findTokenRemoveActions(index)!.findMainAction()!
      : wrapper.findTokenRemoveActions(index)!.findItems()[0];
  }
  function findRemoveFromGroupAction(wrapper: InternalPropertyFilterEditorDropdownWrapper, index: number) {
    wrapper.findTokenRemoveActions(index)!.openDropdown();
    return wrapper.findTokenRemoveActions(index)!.findItems()[isNarrow ? 0 : 1];
  }

  beforeEach(() => {
    jest.mocked(useContainerBreakpoints).mockReturnValue([breakpoint, () => {}]);
  });

  test.each([false, true])('renders token editor with a single property, supportsGroups=%s', supportsGroups => {
    const wrapper = renderComponent({ supportsGroups });
    const propertyField = wrapper.findPropertyField();
    const operatorField = wrapper.findOperatorField();
    const valueField = wrapper.findValueField();
    const removeActions = wrapper.findTokenRemoveActions();
    const addActions = wrapper.findTokenAddActions();

    // Not supported yet because the standalone editor does not include the popover
    // This can be uncommented when defining the test against the property filter
    // which is not possible for the internal-only token-editor-grouped yet.
    // expect(wrapper.findHeader().getElement()).toHaveTextContent('Edit token');
    // expect(wrapper.findDismissButton().getElement()).toHaveAccessibleName('Close token editor');

    // Token inputs
    expect(propertyField.findControl()!.find('button')!.getElement()).toHaveAccessibleName('Property Name');
    expect(operatorField.findControl()!.find('button')!.getElement()).toHaveAccessibleName('Operator =');
    expect(valueField.findControl()!.find('input')!.getElement()).toHaveAccessibleName('Value');
    expect(valueField.findControl()!.find('input')!.getElement()).toHaveValue('John');

    if (supportsGroups) {
      expect(removeActions!.findNativeButton().getElement()).toHaveAccessibleName('Remove actions Name = John');
      expect(removeActions!.findNativeButton().getElement()).toBeDisabled();

      expect(addActions!.findNativeButton().getElement()).toHaveAccessibleName('Add filter actions');
      expect(addActions!.findNativeButton().getElement()).toBeDisabled();
      expect(addActions!.findMainAction()!.getElement()).toHaveTextContent('Add new filter');
    } else {
      expect(removeActions).toBe(null);
      expect(addActions).toBe(null);
    }

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

    wrapper.findTokenAddActions()!.findMainAction()!.click();
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

    wrapper.findTokenAddActions()!.openDropdown();
    wrapper.findTokenAddActions()!.findItems()[0].click();
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

  test('add standalone property menu items have indices as IDs', () => {
    const wrapper = renderComponent({
      tempGroup: [],
      standaloneTokens: [
        { property: nameProperty, operator: '=', value: '1' },
        { property: nameProperty, operator: '=', value: '2' },
      ],
    });
    const tokenActions = wrapper.findTokenAddActions()!;

    tokenActions.openDropdown();
    expect(tokenActions.findItemById('0')!.getElement().textContent).toBe('Add filter Name = 1 to group');
    expect(tokenActions.findItemById('1')!.getElement().textContent).toBe('Add filter Name = 2 to group');
  });
});
