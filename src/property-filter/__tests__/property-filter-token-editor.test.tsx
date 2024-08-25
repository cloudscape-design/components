// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { format } from 'date-fns';

import DatePicker from '../../../lib/components/date-picker';
import FormField from '../../../lib/components/form-field';
import { useMobile } from '../../../lib/components/internal/hooks/use-mobile';
import PropertyFilter from '../../../lib/components/property-filter';
import { usePropertyFilterI18n } from '../../../lib/components/property-filter/i18n-utils';
import {
  FilteringOption,
  FilteringProperty,
  PropertyFilterProps,
  Ref,
} from '../../../lib/components/property-filter/interfaces';
import { InternalFilteringProperty } from '../../../lib/components/property-filter/interfaces';
import { TokenEditor, TokenEditorProps } from '../../../lib/components/property-filter/token-editor';
import createWrapper from '../../../lib/components/test-utils/dom';
import { InternalPropertyFilterEditorDropdownWrapper } from '../../../lib/components/test-utils/dom/property-filter';
import { createDefaultProps, i18nStrings } from './common';

jest.mock('../../../lib/components/internal/hooks/use-mobile', () => ({
  ...jest.requireActual('../../../lib/components/internal/hooks/use-mobile'),
  useMobile: jest.fn().mockReturnValue(true),
}));

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
];

const defaultProps = createDefaultProps(filteringProperties, filteringOptions);

function renderComponent(props?: Partial<PropertyFilterProps & { ref: React.Ref<Ref> }>) {
  render(<PropertyFilter {...defaultProps} {...props} />);
}

function openEditor(tokenIndex: number, { expandToViewport }: { expandToViewport: boolean }) {
  const propertyFilter = createWrapper().findPropertyFilter()!;
  propertyFilter.findTokens()[tokenIndex].findLabel()!.click();
  return findEditor(tokenIndex, { expandToViewport })!;
}

function findEditor(tokenIndex: number, { expandToViewport }: { expandToViewport: boolean }) {
  const propertyFilter = createWrapper().findPropertyFilter()!;
  const editor = propertyFilter.findTokens()[tokenIndex].findEditorDropdown({ expandToViewport })!;
  return editor
    ? {
        textContent: editor.getElement().textContent,
        header: editor.findHeader(),
        dismissButton: editor.findDismissButton(),
        propertyField: editor.findPropertyField(),
        propertySelect: editor.findPropertyField().findControl()!.findSelect()!,
        operatorField: editor.findOperatorField(),
        operatorSelect: editor.findOperatorField().findControl()!.findSelect()!,
        valueField: editor.findValueField(),
        valueAutosuggest: editor.findValueField().findControl()!.findAutosuggest()!,
        cancelButton: editor.findCancelButton(),
        submitButton: editor.findSubmitButton(),
        form: editor.findForm(),
      }
    : null;
}

describe.each([false, true])('token editor, expandToViewport=%s', expandToViewport => {
  test('uses i18nStrings to populate header', () => {
    renderComponent({
      query: { tokens: [{ value: 'first', operator: '!:' }], operation: 'or' },
    });
    const editor = openEditor(0, { expandToViewport });
    expect(editor.header.getElement()).toHaveTextContent(i18nStrings.editTokenHeader);
  });

  describe('form controls content', () => {
    test('default', () => {
      renderComponent({
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: '!:' }], operation: 'or' },
      });
      const editor = openEditor(0, { expandToViewport });
      expect(editor.textContent).toBe('Edit filterPropertystringOperator!:Does not containValueCancelApply');
      act(() => editor.propertySelect.openDropdown());
      expect(
        editor.propertySelect
          .findDropdown()
          .findOptions()!
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['All properties', 'string', 'string-other', 'default', 'string!=', 'range']);

      act(() => editor.operatorSelect.openDropdown());
      expect(
        editor.operatorSelect
          .findDropdown()
          .findOptions()!
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['=Equals', '!=Does not equal', ':Contains', '!:Does not contain']);

      act(() => editor.valueAutosuggest.focus());
      expect(
        editor.valueAutosuggest
          .findDropdown()
          .findOptions()!
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['value1', 'value2']);
    });

    test('with free text disabled', () => {
      renderComponent({
        disableFreeTextFiltering: true,
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: '!:' }], operation: 'or' },
      });
      const editor = openEditor(0, { expandToViewport });
      expect(editor.textContent).toBe('Edit filterPropertystringOperator!:Does not containValueCancelApply');
      act(() => editor.propertySelect.openDropdown());
      expect(
        editor.propertySelect
          .findDropdown()
          .findOptions()!
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['string', 'string-other', 'default', 'string!=', 'range']);
    });

    test('with custom free text operators', () => {
      renderComponent({
        freeTextFiltering: { operators: ['=', '!=', ':', '!:'] },
        query: { tokens: [{ value: 'first', operator: '!=' }], operation: 'or' },
      });
      const editor = openEditor(0, { expandToViewport });
      expect(editor.textContent).toBe('Edit filterPropertyAll propertiesOperator!=Does not equalValueCancelApply');
      act(() => editor.operatorSelect.openDropdown());
      expect(
        editor.operatorSelect
          .findDropdown()
          .findOptions()!
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['=Equals', '!=Does not equal', ':Contains', '!:Does not contain']);
    });

    test('preserves fields, when one is edited', () => {
      renderComponent({
        disableFreeTextFiltering: true,
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
      });
      const editor = openEditor(0, { expandToViewport });

      // Change operator
      act(() => editor.operatorSelect.openDropdown());
      act(() => editor.operatorSelect.selectOption(1));
      expect(editor.propertySelect.findTrigger().getElement()).toHaveTextContent('string');
      expect(editor.operatorSelect.findTrigger().getElement()).toHaveTextContent('=Equals');
      expect(editor.valueAutosuggest.findNativeInput().getElement()).toHaveAttribute('value', 'first');

      // Change value
      act(() => editor.valueAutosuggest.setInputValue('123'));
      expect(editor.propertySelect.findTrigger().getElement()).toHaveTextContent('string');
      expect(editor.operatorSelect.findTrigger().getElement()).toHaveTextContent('=Equals');
      expect(editor.valueAutosuggest.findNativeInput().getElement()).toHaveAttribute('value', '123');

      // Change property
      // This preserves operator but not value because the value type between properties can be different.
      act(() => editor.propertySelect.openDropdown());
      act(() => editor.propertySelect.selectOption(2));
      expect(editor.propertySelect.findTrigger().getElement()).toHaveTextContent('string-other');
      expect(editor.operatorSelect.findTrigger().getElement()).toHaveTextContent('=Equals');
      expect(editor.valueAutosuggest.findNativeInput().getElement()).toHaveAttribute('value', '');
    });
  });

  describe('exit actions', () => {
    test('dismiss button closes the popover and discards the changes', () => {
      const handleChange = jest.fn();
      renderComponent({
        onChange: handleChange,
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: '!:' }], operation: 'or' },
      });
      const editor = openEditor(0, { expandToViewport });

      act(() => editor.valueAutosuggest.setInputValue('123'));
      act(() => editor.operatorSelect.openDropdown());
      act(() => editor.operatorSelect.selectOption(1));
      act(() => editor.propertySelect.openDropdown());
      act(() => editor.propertySelect.selectOption(1));
      act(() => editor.dismissButton.click());
      expect(findEditor(0, { expandToViewport })).toBeNull();
      expect(handleChange).not.toHaveBeenCalled();
    });

    test('cancel button closes the popover and discards the changes', () => {
      const handleChange = jest.fn();
      renderComponent({
        onChange: handleChange,
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: '!:' }], operation: 'or' },
      });
      const editor = openEditor(0, { expandToViewport });

      act(() => editor.valueAutosuggest.setInputValue('123'));
      act(() => editor.operatorSelect.openDropdown());
      act(() => editor.operatorSelect.selectOption(1));
      act(() => editor.propertySelect.openDropdown());
      act(() => editor.propertySelect.selectOption(1));
      act(() => editor.cancelButton.click());
      expect(findEditor(0, { expandToViewport })).toBeNull();
      expect(handleChange).not.toHaveBeenCalled();
    });

    test('submit button closes the popover and saves the changes', () => {
      const handleChange = jest.fn();
      renderComponent({
        onChange: handleChange,
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: '!:' }], operation: 'or' },
      });
      const editor = openEditor(0, { expandToViewport });

      act(() => editor.operatorSelect.openDropdown());
      act(() => editor.operatorSelect.selectOption(1));
      act(() => editor.propertySelect.openDropdown());
      act(() => editor.propertySelect.selectOption(1));
      act(() => editor.valueAutosuggest.setInputValue('123'));
      act(() => editor.submitButton.click());
      expect(findEditor(0, { expandToViewport })).toBeNull();
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { operation: 'or', tokens: [{ operator: ':', propertyKey: undefined, value: '123' }] },
        })
      );
    });

    test('form submit closes the popover and saves the changes', () => {
      const handleChange = jest.fn();
      renderComponent({
        onChange: handleChange,
        query: { tokens: [{ propertyKey: 'string', value: 'first', operator: '!:' }], operation: 'or' },
      });
      const editor = openEditor(0, { expandToViewport });

      act(() => editor.operatorSelect.openDropdown());
      act(() => editor.operatorSelect.selectOption(1));
      act(() => editor.propertySelect.openDropdown());
      act(() => editor.propertySelect.selectOption(1));
      act(() => editor.valueAutosuggest.setInputValue('123'));
      fireEvent.submit(editor.form!.getElement());
      expect(findEditor(0, { expandToViewport })).toBeNull();
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { operation: 'or', tokens: [{ operator: ':', propertyKey: undefined, value: '123' }] },
        })
      );
    });
  });
});

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

const defaultEditorProps: Omit<TokenEditorProps, 'i18nStrings'> = {
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
  onSubmit: () => {},
  onDismiss: () => {},
  standaloneTokens: [],
  onChangeStandalone: () => {},
  tempGroup: [{ property: nameProperty, operator: '=', value: 'John' }],
  onChangeTempGroup: () => {},
};

function TokenEditorWithI18n(props: Omit<TokenEditorProps, 'i18nStrings'>) {
  const i18nStringsInternal = usePropertyFilterI18n({
    editTokenHeader: 'Edit token',
    propertyText: 'Property',
    operatorText: 'Operator',
    valueText: 'Value',
    cancelActionText: 'Cancel',
    applyActionText: 'Apply',
    tokenEditorTokenActionsAriaLabel: token => `Remove actions ${token.propertyLabel} ${token.operator} ${token.value}`,
    tokenEditorTokenRemoveAriaLabel: token => `Remove filter, ${token.propertyLabel} ${token.operator} ${token.value}`,
    tokenEditorTokenRemoveLabel: 'Remove filter',
    tokenEditorTokenRemoveFromGroupLabel: 'Remove filter from group',
    tokenEditorAddNewTokenLabel: 'Add new filter',
    tokenEditorAddTokenActionsAriaLabel: 'Add filter actions',
    tokenEditorAddExistingTokenAriaLabel: token =>
      `Add filter ${token.propertyLabel} ${token.operator}(label) ${token.value} to group`,
    tokenEditorAddExistingTokenLabel: token =>
      `Add filter ${token.propertyLabel} ${token.operator} ${token.value} to group`,
  });
  return <TokenEditor {...props} i18nStrings={i18nStringsInternal} />;
}

function renderTokenEditor(props?: Partial<TokenEditorProps>) {
  const { container } = render(<TokenEditorWithI18n {...defaultEditorProps} {...props} />);
  return new InternalPropertyFilterEditorDropdownWrapper(container);
}

describe.each([false, true] as const)('isMobile = %s', isMobile => {
  function findRemoveAction(wrapper: InternalPropertyFilterEditorDropdownWrapper, index: number) {
    wrapper.findTokenRemoveActions(index)!.openDropdown();
    return isMobile
      ? wrapper.findTokenRemoveActions(index)!.findMainAction()!
      : wrapper.findTokenRemoveActions(index)!.findItems()[0];
  }
  function findRemoveFromGroupAction(wrapper: InternalPropertyFilterEditorDropdownWrapper, index: number) {
    wrapper.findTokenRemoveActions(index)!.openDropdown();
    return wrapper.findTokenRemoveActions(index)!.findItems()[isMobile ? 0 : 1];
  }

  beforeEach(() => {
    jest.mocked(useMobile).mockReturnValue(isMobile);
  });

  test.each([false, true])('renders token editor with a single property, supportsGroups=%s', supportsGroups => {
    const wrapper = renderTokenEditor({ supportsGroups });
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
    const wrapper = renderTokenEditor({ onChangeTempGroup });
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
    const wrapper = renderTokenEditor({ onChangeTempGroup });
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
    const wrapper = renderTokenEditor({ onChangeTempGroup });
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
    const wrapper = renderTokenEditor({
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
    const wrapper = renderTokenEditor({
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
    const wrapper = renderTokenEditor({
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
    const wrapper = renderTokenEditor({
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
    const wrapper = renderTokenEditor({
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
    const wrapper = renderTokenEditor({
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
