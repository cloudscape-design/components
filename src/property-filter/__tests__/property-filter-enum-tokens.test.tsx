// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import '../../__a11y__/to-validate-a11y';
import {
  FilteringOption,
  FilteringProperty,
  PropertyFilterProps,
} from '../../../lib/components/property-filter/interfaces';
import createWrapper from '../../../lib/components/test-utils/dom';
import { createDefaultProps, StatefulPropertyFilter } from './common';

const states: Record<string, string> = {
  0: 'Stopped',
  1: 'Stopping',
  2: 'Running',
};
const formatState = (value: unknown, fallback = value as string) => {
  if (!value) {
    return '';
  }
  return typeof value === 'string' ? states[value] || fallback : fallback;
};
const formatStateEnum = (value: string[]) => {
  return value.map(entry => formatState(entry, 'Unknown option')).join(', ');
};

const filteringProperties: readonly FilteringProperty[] = [
  {
    key: 'state',
    propertyLabel: 'State',
    operators: [
      { operator: '=', format: formatStateEnum, tokenType: 'enum' },
      { operator: '!=', format: formatStateEnum, tokenType: 'enum' },
      { operator: ':', format: formatState },
      { operator: '!:', format: formatState },
    ],
    groupValuesLabel: 'State values',
  },
  {
    key: 'tags',
    propertyLabel: 'Tags',
    operators: [
      { operator: '=', tokenType: 'enum' },
      { operator: '!=', tokenType: 'enum' },
      { operator: ':', tokenType: 'enum' },
      { operator: '!:', tokenType: 'enum' },
    ],
    groupValuesLabel: 'Tags values',
  },
];

const filteringOptions: readonly FilteringOption[] = [
  { propertyKey: 'state', value: '0', label: formatState('0') },
  { propertyKey: 'state', value: '1', label: formatState('1') },
  { propertyKey: 'state', value: '2', label: formatState('2') },
];

const defaultProps = createDefaultProps(filteringProperties, filteringOptions);

const renderComponent = (props?: Partial<PropertyFilterProps>) => {
  const onChange = jest.fn();
  const onLoadItems = jest.fn();
  const { container } = render(
    <StatefulPropertyFilter {...defaultProps} onChange={onChange} onLoadItems={onLoadItems} {...props} />
  );
  const wrapper = createWrapper(container).findPropertyFilter()!;
  const openEditor = () => wrapper.findTokens()[0].findLabel().click();
  const findEditor = () => wrapper.findTokens()[0].findEditorDropdown()!;
  const getTokensContent = () => wrapper.findTokens().map(w => w.findLabel().getElement().textContent);
  const getOptionsContent = () =>
    wrapper
      .findDropdown()
      .findOptions()
      .map(w => w.getElement().textContent);
  const findEditorMultiselect = () => findEditor().findValueField().findControl()!.findMultiselect()!;
  const getEditorOptionsContent = () =>
    findEditorMultiselect()
      .findDropdown()
      .findOptions()
      .map(w => w.getElement().textContent);
  return {
    container,
    wrapper,
    openEditor,
    findEditor,
    getTokensContent,
    getOptionsContent,
    findEditorMultiselect,
    getEditorOptionsContent,
    onChange,
    onLoadItems,
  };
};

test('formats tokens using custom and default formatters', () => {
  const { getTokensContent } = renderComponent({
    query: {
      operation: 'and',
      tokens: [
        { propertyKey: 'state', operator: ':', value: '0' },
        { propertyKey: 'state', operator: ':', value: 'ing' },
        { propertyKey: 'state', operator: '=', value: ['0', '1'] },
        { propertyKey: 'tags', operator: '=', value: ['A', 'B'] },
      ],
    },
  });
  expect(getTokensContent()).toEqual(['State : Stopped', 'State : ing', 'State = Stopped, Stopping', 'Tags = A, B']);
});

describe('sync token creation', () => {
  test('creates a value token for state', () => {
    const { wrapper, getTokensContent, onChange } = renderComponent();

    wrapper.focus();
    wrapper.setInputValue('state : ');
    wrapper.selectSuggestionByValue('State : 0');

    expect(getTokensContent()).toEqual(['State : Stopped']);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'state', operator: ':', value: '0' }] },
      })
    );
  });

  test('creates an enum token for state by selecting a suggested value', () => {
    const { wrapper, getTokensContent, onChange } = renderComponent();

    wrapper.focus();
    wrapper.setInputValue('Sto');
    wrapper.selectSuggestionByValue('State = 1');

    expect(getTokensContent()).toEqual(['State = Stopping']);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['1'] }] },
      })
    );
  });

  test('creates an enum token for state by submitting value with Enter', () => {
    const { wrapper, getTokensContent, onChange } = renderComponent();

    wrapper.focus();
    wrapper.setInputValue('state = Running');
    wrapper.findNativeInput().keydown(KeyCode.enter);

    expect(getTokensContent()).toEqual(['State = Running']);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['2'] }] },
      })
    );
  });

  test('creates an enum token for state by submitting non-matched value with Enter', () => {
    const { wrapper, getTokensContent, onChange } = renderComponent();

    wrapper.focus();
    wrapper.setInputValue('state = Unmatched');
    wrapper.findNativeInput().keydown(KeyCode.enter);

    expect(getTokensContent()).toEqual(['State = Unknown option']);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['Unmatched'] }] },
      })
    );
  });

  test('creates an enum token for state by submitting two values with multiselect', () => {
    const { wrapper, getTokensContent, onChange } = renderComponent();

    wrapper.focus();
    wrapper.setInputValue('state = ');
    wrapper.selectSuggestionByValue('0');
    wrapper.selectSuggestionByValue('1');
    wrapper.findPropertySubmitButton()!.click();

    expect(getTokensContent()).toEqual(['State = Stopped, Stopping']);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['0', '1'] }] },
      })
    );
  });

  test('filters enum token values with property filter input text', () => {
    const { wrapper, getOptionsContent } = renderComponent();

    wrapper.focus();
    wrapper.setInputValue('state = ing');

    expect(getOptionsContent()).toEqual(['Stopping', 'Running']);
  });

  test('shows filtering empty if no enum token values are provided', () => {
    const { wrapper } = renderComponent({ filteringOptions: [] });

    wrapper.focus();
    wrapper.setInputValue('state =');

    expect(wrapper.findStatusIndicator()!.getElement()).toHaveTextContent('Empty');
  });

  test('shows filtering empty if no enum token values are matched', () => {
    const { wrapper } = renderComponent();

    wrapper.focus();
    wrapper.setInputValue('state = X');

    expect(wrapper.findStatusIndicator()!.getElement()).toHaveTextContent('Empty');
  });
});

describe('sync token editing', () => {
  test('can replace value token with enum token', () => {
    const { openEditor, findEditor, getTokensContent, onChange } = renderComponent({
      query: { operation: 'and', tokens: [{ propertyKey: 'state', operator: ':', value: '0' }] },
    });

    openEditor();
    findEditor().findOperatorField().findControl()!.findSelect()!.openDropdown();
    findEditor().findOperatorField().findControl()!.findSelect()!.selectOptionByValue('=');
    findEditor().findSubmitButton().click();

    expect(getTokensContent()).toEqual(['State = ']);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: [] }] },
      })
    );
  });

  test('can replace enum token with value token', () => {
    const { openEditor, findEditor, getTokensContent, onChange } = renderComponent({
      query: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['0'] }] },
    });

    openEditor();
    findEditor().findOperatorField().findControl()!.findSelect()!.openDropdown();
    findEditor().findOperatorField().findControl()!.findSelect()!.selectOptionByValue(':');
    findEditor().findSubmitButton().click();

    expect(getTokensContent()).toEqual(['State : ']);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'state', operator: ':', value: null }] },
      })
    );
  });

  test('can change value in enum token', () => {
    const { openEditor, findEditor, findEditorMultiselect, getTokensContent, onChange } = renderComponent({
      query: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['0'] }] },
    });

    openEditor();
    findEditorMultiselect().openDropdown();
    findEditorMultiselect().selectOptionByValue('1');
    findEditor().findSubmitButton().click();

    expect(getTokensContent()).toEqual(['State = Stopped, Stopping']);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['0', '1'] }] },
      })
    );
  });

  test('keeps value when changing operator so that value type preserves', () => {
    const { openEditor, findEditor, getTokensContent, onChange } = renderComponent({
      query: { operation: 'and', tokens: [{ propertyKey: 'state', operator: ':', value: '0' }] },
    });

    openEditor();
    findEditor().findOperatorField().findControl()!.findSelect()!.openDropdown();
    findEditor().findOperatorField().findControl()!.findSelect()!.selectOptionByValue('!:');
    findEditor().findSubmitButton().click();

    expect(getTokensContent()).toEqual(['State !: Stopped']);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '!:', value: '0' }] },
      })
    );
  });

  test('keeps value when changing operator so that enum type preserves', () => {
    const { openEditor, findEditor, getTokensContent, onChange } = renderComponent({
      query: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['0'] }] },
    });

    openEditor();
    findEditor().findOperatorField().findControl()!.findSelect()!.openDropdown();
    findEditor().findOperatorField().findControl()!.findSelect()!.selectOptionByValue('!=');
    findEditor().findSubmitButton().click();

    expect(getTokensContent()).toEqual(['State != Stopped']);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '!=', value: ['0'] }] },
      })
    );
  });

  test('enum token options can be filtered', () => {
    const { openEditor, findEditorMultiselect, getEditorOptionsContent } = renderComponent({
      query: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['0'] }] },
    });

    openEditor();
    findEditorMultiselect().openDropdown();
    findEditorMultiselect().findFilteringInput()!.setInputValue('ing');

    expect(getEditorOptionsContent()).toEqual(['Stopping', 'Running']);
  });
});

describe('async token creation', () => {
  test('shows enum token values and a loading indicator if status type is loading', () => {
    const { wrapper, getOptionsContent } = renderComponent({ filteringStatusType: 'loading' });

    wrapper.focus();
    wrapper.setInputValue('state =');

    expect(getOptionsContent()).toEqual(['Stopped', 'Stopping', 'Running']);
    expect(wrapper.findStatusIndicator()!.getElement()).toHaveTextContent('Loading status');
  });

  test('shows enum token values and an error indicator if status type is error', () => {
    const { wrapper, getOptionsContent } = renderComponent({ filteringStatusType: 'error' });

    wrapper.focus();
    wrapper.setInputValue('state =');

    expect(getOptionsContent()).toEqual(['Stopped', 'Stopping', 'Running']);
    expect(wrapper.findStatusIndicator()!.getElement()).toHaveTextContent('Error status');
    expect(wrapper.findStatusIndicator()!.getElement()).toHaveTextContent('Retry');
  });

  test('shows enum token values and finished text if status type is finished', () => {
    const { wrapper, getOptionsContent } = renderComponent({ filteringStatusType: 'finished' });

    wrapper.focus();
    wrapper.setInputValue('state =');

    expect(getOptionsContent()).toEqual(['Stopped', 'Stopping', 'Running']);
    expect(wrapper.findStatusIndicator()!.getElement()).toHaveTextContent('Finished status');
  });

  test('shows filtering empty if status type is finished and no options', () => {
    const { wrapper, getOptionsContent } = renderComponent({ filteringOptions: [], filteringStatusType: 'finished' });

    wrapper.focus();
    wrapper.setInputValue('state =');

    expect(getOptionsContent()).toEqual([]);
    expect(wrapper.findStatusIndicator()!.getElement().textContent).toBe('Empty');
  });

  test('calls onLoadItems upon rendering when status type is pending', () => {
    const { wrapper, getOptionsContent, onLoadItems } = renderComponent({
      filteringOptions: [],
      filteringStatusType: 'pending',
    });

    wrapper.focus();
    wrapper.setInputValue('state = S');

    expect(getOptionsContent()).toEqual([]);
    expect(onLoadItems).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          filteringProperty: expect.objectContaining({ key: 'state' }),
          filteringOperator: '=',
          filteringText: 'S',
          firstPage: true,
          samePage: false,
        },
      })
    );
  });

  test('calls onLoadItems upon retrying', () => {
    const { wrapper, onLoadItems } = renderComponent({ filteringStatusType: 'error' });

    wrapper.focus();
    wrapper.setInputValue('state = S');

    expect(onLoadItems).not.toHaveBeenCalled();

    wrapper.findErrorRecoveryButton()!.click();
    expect(onLoadItems).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          filteringProperty: expect.objectContaining({ key: 'state' }),
          filteringOperator: '=',
          filteringText: 'S',
          firstPage: false,
          samePage: true,
        },
      })
    );
  });
});

describe('async token editing', () => {
  test('shows enum token values and a loading indicator if status type is loading', () => {
    const { openEditor, findEditorMultiselect, getEditorOptionsContent } = renderComponent({
      filteringStatusType: 'loading',
      query: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['0'] }] },
    });

    openEditor();
    findEditorMultiselect().openDropdown();

    expect(getEditorOptionsContent()).toEqual(['Stopped', 'Stopping', 'Running']);
    expect(findEditorMultiselect().findStatusIndicator()!.getElement()).toHaveTextContent('Loading status');
  });

  test('shows enum token values and an error indicator if status type is error', () => {
    const { openEditor, findEditorMultiselect, getEditorOptionsContent } = renderComponent({
      filteringStatusType: 'error',
      query: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['0'] }] },
    });

    openEditor();
    findEditorMultiselect().openDropdown();

    expect(getEditorOptionsContent()).toEqual(['Stopped', 'Stopping', 'Running']);
    expect(findEditorMultiselect().findStatusIndicator()!.getElement()).toHaveTextContent('Error');
    expect(findEditorMultiselect().findStatusIndicator()!.getElement()).toHaveTextContent('Retry');
  });

  test('shows enum token values and finished text if status type is finished', () => {
    const { openEditor, findEditorMultiselect, getEditorOptionsContent } = renderComponent({
      filteringStatusType: 'finished',
      query: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['0'] }] },
    });

    openEditor();
    findEditorMultiselect().openDropdown();

    expect(getEditorOptionsContent()).toEqual(['Stopped', 'Stopping', 'Running']);
    expect(findEditorMultiselect().findStatusIndicator()!.getElement()).toHaveTextContent('Finished status');
  });

  test('shows filtering empty if status type is finished and no options', () => {
    const { openEditor, findEditorMultiselect, getEditorOptionsContent } = renderComponent({
      filteringStatusType: 'finished',
      filteringOptions: [],
      query: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['0'] }] },
    });

    openEditor();
    findEditorMultiselect().openDropdown();

    expect(getEditorOptionsContent()).toEqual([]);
    expect(findEditorMultiselect().findStatusIndicator()!.getElement().textContent).toBe('Empty');
  });

  test('calls onLoadItems upon opening dropdown when status is pending', () => {
    const { openEditor, findEditorMultiselect, getEditorOptionsContent, onLoadItems } = renderComponent({
      filteringStatusType: 'pending',
      query: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['0'] }] },
    });

    openEditor();
    findEditorMultiselect().openDropdown();

    expect(getEditorOptionsContent()).toEqual(['Stopped', 'Stopping', 'Running']);
    expect(onLoadItems).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          filteringProperty: expect.objectContaining({ key: 'state' }),
          filteringOperator: '=',
          filteringText: '',
          firstPage: true,
          samePage: false,
        },
      })
    );
    expect(onLoadItems).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          filteringProperty: expect.objectContaining({ key: 'state' }),
          filteringOperator: '=',
          filteringText: '',
          firstPage: false,
          samePage: false,
        },
      })
    );
  });

  test('calls onLoadItems upon retrying', () => {
    const { openEditor, findEditorMultiselect, getEditorOptionsContent, onLoadItems } = renderComponent({
      filteringStatusType: 'error',
      filteringOptions: [],
      query: { operation: 'and', tokens: [{ propertyKey: 'state', operator: '=', value: ['0'] }] },
    });

    openEditor();
    findEditorMultiselect().openDropdown();

    expect(getEditorOptionsContent()).toEqual([]);
    expect(onLoadItems).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          filteringProperty: expect.objectContaining({ key: 'state' }),
          filteringOperator: '=',
          filteringText: '',
          firstPage: true,
          samePage: false,
        },
      })
    );

    findEditorMultiselect().findErrorRecoveryButton()!.click();

    expect(onLoadItems).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          filteringProperty: expect.objectContaining({ key: 'state' }),
          filteringOperator: '=',
          filteringText: '',
          firstPage: true,
          samePage: false,
        },
      })
    );
    expect(onLoadItems).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          filteringProperty: expect.objectContaining({ key: 'state' }),
          filteringOperator: '=',
          filteringText: '',
          firstPage: false,
          samePage: true,
        },
      })
    );
  });
});
