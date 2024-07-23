// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { act, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';

import PropertyFilter from '../../../lib/components/property-filter';
import {
  FilteringOption,
  FilteringProperty,
  PropertyFilterProps,
  Ref,
} from '../../../lib/components/property-filter/interfaces';
import createWrapper from '../../../lib/components/test-utils/dom';
import { createDefaultProps } from './common';

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

describe('filtering input', () => {
  describe('"use entered" option', () => {
    test('is added, when a token can be created from the current text in the input', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent();
      act(() => wrapper.setInputValue('string'));
      expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Use: "string"');
    });

    test('with free text tokens disabled', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({ disableFreeTextFiltering: true });
      // is not shown, when the current text does not represent a property token
      act(() => wrapper.setInputValue('string'));
      expect(wrapper.findEnteredTextOption()).toBeNull();
      // is shown otherwise
      act(() => wrapper.setInputValue('string:'));
      expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Use: "string:"');
    });

    test('causes a token to be created, when selected', () => {
      const handleChange = jest.fn();
      const { propertyFilterWrapper: wrapper } = renderComponent({ onChange: handleChange });
      // free text
      act(() => wrapper.setInputValue('string'));
      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({ detail: { tokens: [{ value: 'string', operator: ':' }], operation: 'and' } })
      );
      // property
      act(() => wrapper.setInputValue('string   !:123'));
      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(handleChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          detail: { tokens: [{ propertyKey: 'string', value: '123', operator: '!:' }], operation: 'and' },
        })
      );
    });
  });

  test('can be focused using the property filter ref', () => {
    const focusRef: React.Ref<Ref> = { current: null };
    const { propertyFilterWrapper: wrapper } = renderComponent({ ref: focusRef });
    act(() => focusRef.current!.focus());
    expect(wrapper.findNativeInput().getElement()).toHaveFocus();
  });

  test('receives `placeholder`, `ariaLabel` and `disabled` properties passed to the component', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      disabled: true,
      filteringPlaceholder: 'placeholder',
    });
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('placeholder', 'placeholder');
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('disabled');
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-label', 'your choice');
  });

  test('receives `ariaLabelledby`, `ariaDescribedby` and `controlId` properties passed to the component', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      ariaLabelledby: 'label-by-id',
      ariaDescribedby: 'described-by-id',
      controlId: 'control-id',
    });
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-labelledby', 'label-by-id');
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-describedby', 'described-by-id');
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute('id', 'control-id');
  });

  describe('typing experience: ', () => {
    test('provides relevant suggestions depending on the currently entered string', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent();
      // property suggestions
      act(() => wrapper.findNativeInput().focus());
      expect(
        wrapper
          .findDropdown()
          .findOptions()
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['string', 'string-other', 'default', 'string!=', 'state', 'range']);
      // property and value suggestions
      act(() => wrapper.setInputValue('a'));
      expect(
        wrapper
          .findDropdown()
          .findOptions()
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual([
        'default',
        'state',
        'range',
        'string = value1',
        'string-other = value1',
        'string = value2',
        'string-other = value2',
        'default = value',
      ]);
      // operator suggestions
      act(() => wrapper.setInputValue('string'));
      expect(
        wrapper
          .findDropdown()
          .findOptions()
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['string =Equals', 'string !=Does not equal', 'string :Contains', 'string !:Does not contain']);
      // value suggestions
      act(() => wrapper.setInputValue('string:'));
      expect(
        wrapper
          .findDropdown()
          .findOptions()
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['string : value1', 'string : value2']);
    });

    test('supports property names that are substrings of others', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        filteringProperties: [
          {
            key: 'string',
            propertyLabel: 'string',
            operators: ['!:', ':', '=', '!='],
            groupValuesLabel: 'String values',
          },
          {
            key: 'other-string',
            propertyLabel: 'string-other',
            operators: ['!:', ':', '=', '!='],
            groupValuesLabel: 'Other string values',
          },
        ],
      });
      act(() => wrapper.setInputValue('string'));
      expect(
        wrapper
          .findDropdown()
          .findOptions()
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['string =Equals', 'string !=Does not equal', 'string :Contains', 'string !:Does not contain']);
      act(() => wrapper.setInputValue('string-other'));
      expect(
        wrapper
          .findDropdown()
          .findOptions()
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual([
        'string-other =Equals',
        'string-other !=Does not equal',
        'string-other :Contains',
        'string-other !:Does not contain',
      ]);
    });

    test('supports property names that are substrings of others (alternate order)', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        filteringProperties: [
          {
            key: 'other-string',
            propertyLabel: 'string-other',
            operators: ['!:', ':', '=', '!='],
            groupValuesLabel: 'Other string values',
          },
          {
            key: 'string',
            propertyLabel: 'string',
            operators: ['!:', ':', '=', '!='],
            groupValuesLabel: 'String values',
          },
        ],
      });
      act(() => wrapper.setInputValue('string'));
      expect(
        wrapper
          .findDropdown()
          .findOptions()
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['string =Equals', 'string !=Does not equal', 'string :Contains', 'string !:Does not contain']);
      act(() => wrapper.setInputValue('string-other'));
      expect(
        wrapper
          .findDropdown()
          .findOptions()
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual([
        'string-other =Equals',
        'string-other !=Does not equal',
        'string-other :Contains',
        'string-other !:Does not contain',
      ]);
    });

    test('can be submitted to create a token', () => {
      const handleChange = jest.fn();
      const { propertyFilterWrapper: wrapper } = renderComponent({ onChange: handleChange });
      act(() => wrapper.findNativeInput().focus());
      act(() => wrapper.setInputValue('string'));
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { tokens: [{ value: 'string', operator: ':' }], operation: 'and' },
        })
      );
      expect(wrapper.findNativeInput().getElement()).toHaveValue('');

      act(() => wrapper.setInputValue('string:value'));
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(handleChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          detail: { tokens: [{ value: 'value', operator: ':', propertyKey: 'string' }], operation: 'and' },
        })
      );
      expect(wrapper.findNativeInput().getElement()).toHaveValue('');
    });

    test('submitting empty input does not create a token', () => {
      const handleChange = jest.fn();
      const { propertyFilterWrapper: wrapper } = renderComponent({ onChange: handleChange });
      act(() => wrapper.findNativeInput().focus());
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(handleChange).not.toHaveBeenCalled();
    });

    test('can not be submitted to create a free text token, when free text tokens are disabled', () => {
      const handleChange = jest.fn();
      const { propertyFilterWrapper: wrapper } = renderComponent({
        onChange: handleChange,
        disableFreeTextFiltering: true,
      });
      act(() => wrapper.findNativeInput().focus());
      act(() => wrapper.setInputValue('string'));
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(handleChange).not.toHaveBeenCalled();
      expect(wrapper.findNativeInput().getElement()).toHaveValue('string');
    });
  });

  describe('selecting items in the dropdown', () => {
    test('keeps the dropdown open, when property or operator suggestions are selected', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent();

      act(() => wrapper.findNativeInput().focus());
      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(wrapper.findNativeInput().getElement()).toHaveValue('string');
      expect(wrapper.findDropdown()?.findOpenDropdown()).toBeTruthy();

      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(wrapper.findNativeInput().getElement()).toHaveValue('string = ');
      expect(wrapper.findDropdown()?.findOpenDropdown()).toBeTruthy();
    });

    test('creates a new token and closes the dropdown, when a value suggestion is selected', () => {
      const handleChange = jest.fn();
      const { propertyFilterWrapper: wrapper } = renderComponent({ onChange: handleChange });

      act(() => wrapper.setInputValue('string='));
      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(wrapper.findNativeInput().getElement()).toHaveValue('');
      expect(handleChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          detail: { tokens: [{ value: 'value1', operator: '=', propertyKey: 'string' }], operation: 'and' },
        })
      );
      expect(wrapper.findDropdown()?.findOpenDropdown()).toBeFalsy();
    });

    test('inserts operator when property is selected if only one operator is defined for that property', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent();

      act(() => wrapper.findNativeInput().focus());
      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(wrapper.findNativeInput().getElement()).toHaveValue('default = ');
      expect(wrapper.findDropdown()?.findOpenDropdown()).toBeTruthy();
    });
  });

  test('can use selectSuggestionByValue', () => {
    const onChange = jest.fn();
    const { propertyFilterWrapper: wrapper } = renderComponent({ onChange });
    act(() => wrapper.focus());
    act(() => wrapper.selectSuggestionByValue('string-other'));
    expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Use: "string-other"');

    act(() => wrapper.selectSuggestionByValue('string-other != '));
    expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Use: "string-other != "');

    act(() => wrapper.selectSuggestionByValue('string-other != value2'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'other-string', operator: '!=', value: 'value2' }] },
      })
    );
  });
});

describe('count text', () => {
  test('is not displayed when count text is empty', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      countText: '',
      query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
    });
    expect(wrapper.findResultsCount()).toBe(null);
  });

  test('is not displayed when there are no filtering tokens', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({ countText: '5 matches' });
    expect(wrapper.findResultsCount()).toBe(null);
  });

  test('is visible when there is at least 1 token', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      countText: '5 matches',
      query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
    });
    expect(wrapper.findResultsCount()!.getElement()).toHaveTextContent('5 matches');
  });
});

describe('constraint text', () => {
  test('is not displayed when constraint text is empty', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      filteringConstraintText: '',
      query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
    });
    expect(wrapper.findConstraint()).toBe(null);
  });

  test('is visible when the constraint text is not empty', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      filteringConstraintText: <div>This is my constraint</div>,
      query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
    });
    expect(wrapper.findConstraint()!.getElement()).toHaveTextContent('This is my constraint');
  });

  test('is used as ARIA description for the autosuggest input', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      ariaDescribedby: 'my-custom-description',
      filteringConstraintText: <div>This is my constraint</div>,
      query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
    });
    expect(wrapper.findNativeInput().getElement()).toHaveAttribute(
      'aria-describedby',
      'my-custom-description' + ' ' + wrapper.findConstraint()!.getElement().id
    );
  });
});
