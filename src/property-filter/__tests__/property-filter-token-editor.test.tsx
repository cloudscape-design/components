// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { act, render } from '@testing-library/react';

import PropertyFilter from '../../../lib/components/property-filter';
import {
  FilteringOption,
  FilteringProperty,
  PropertyFilterProps,
  Ref,
} from '../../../lib/components/property-filter/interfaces';
import createWrapper from '../../../lib/components/test-utils/dom';
import { createDefaultProps, i18nStrings } from './common';

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
  });
});
