// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';

import '../../__a11y__/to-validate-a11y';
import PropertyFilter from '../../../lib/components/property-filter';
import {
  FilteringOption,
  FilteringProperty,
  PropertyFilterProps,
  Ref,
} from '../../../lib/components/property-filter/interfaces';
import createWrapper, { ElementWrapper, PropertyFilterWrapper } from '../../../lib/components/test-utils/dom';
import { createDefaultProps } from './common';

import styles from '../../../lib/components/property-filter/styles.selectors.js';

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
  { propertyKey: 'string', value: 'value2' },
  { propertyKey: 'state', value: '0', label: getStateLabel('0') },
  { propertyKey: 'state', value: '1', label: getStateLabel('1') },
  { propertyKey: 'state', value: '2', label: getStateLabel('2') },
];

const defaultProps = createDefaultProps(filteringProperties, filteringOptions);

const renderComponent = (props?: Partial<PropertyFilterProps & { ref: React.Ref<Ref> }>) => {
  const { container } = render(<PropertyFilter {...defaultProps} {...props} />);
  return { container, propertyFilterWrapper: createWrapper(container).findPropertyFilter()! };
};

function findValueField(wrapper: ElementWrapper) {
  return wrapper.findFormField(`.${styles['token-editor-field-value']}`)!;
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

describe('property filter parts', () => {
  test('`expandToViewport` property test utils', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      expandToViewport: true,
      query: { tokens: [{ propertyKey: 'string', value: 'first', operator: ':' }], operation: 'or' },
      filteringStatusType: 'error',
      filteringRecoveryText: 'recovery',
      filteringErrorText: 'error',
    });
    // find dropdown returns open dropdown
    expect(wrapper.findDropdown({ expandToViewport: true })).toBeNull();
    wrapper.findNativeInput().focus();
    expect(wrapper.findDropdown({ expandToViewport: true })!.getElement()).not.toBeNull();
    expect(wrapper.findDropdown({ expandToViewport: true }).findOpenDropdown()!.getElement()).not.toBeNull();
    wrapper.setInputValue('string');
    expect(wrapper.findEnteredTextOption({ expandToViewport: true })!.getElement()).toHaveTextContent('Use: "string"');
    expect(wrapper.findErrorRecoveryButton({ expandToViewport: true })!.getElement()).toHaveTextContent('recovery');
    expect(wrapper.findStatusIndicator({ expandToViewport: true })!.getElement()).toHaveTextContent('error');
    wrapper.selectSuggestion(2, { expandToViewport: true });
    expect(wrapper.findNativeInput().getElement()).toHaveValue('string != ');
  });

  describe('status indicators', () => {
    test('displays error status', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        filteringStatusType: 'error',
        filteringErrorText: 'Error text',
      });
      wrapper.findNativeInput().focus();
      wrapper.setInputValue('string');
      expect(wrapper.findStatusIndicator()!.getElement()).toHaveTextContent('Error text');
    });
    test('links error status to dropdown', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        filteringStatusType: 'error',
        filteringErrorText: 'Error text',
      });
      wrapper.findNativeInput().focus();
      wrapper.setInputValue('string');
      expect(wrapper.findDropdown().find('ul')!.getElement()).toHaveAccessibleDescription(`Error text`);
    });
    test('displays finished status', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        filteringStatusType: 'finished',
        filteringFinishedText: 'Finished text',
      });
      wrapper.findNativeInput().focus();
      wrapper.setInputValue('string');
      expect(wrapper.findStatusIndicator()!.getElement()).toHaveTextContent('Finished text');
    });
    test('links finished status to dropdown', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        filteringStatusType: 'finished',
        filteringFinishedText: 'Finished text',
      });
      wrapper.findNativeInput().focus();
      wrapper.setInputValue('string');
      expect(wrapper.findDropdown().find('ul')!.getElement()).toHaveAccessibleDescription(`Finished text`);
    });
  });

  describe('dropdown states', () => {
    it('when free text filtering is allowed and no property is matched the dropdown is visible but aria-expanded is false', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        disableFreeTextFiltering: false,
        filteringProperties: [],
      });
      wrapper.setInputValue('free-text');
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-expanded', 'false');
      expect(wrapper.findDropdown().findOpenDropdown()!.getElement()).toHaveTextContent('Use: "free-text"');
    });
    it('when free text filtering is not allowed and no property is matched the dropdown is not shown and aria-expanded is false', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        disableFreeTextFiltering: true,
        filteringProperties: [],
      });
      wrapper.setInputValue('free-text');
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-expanded', 'false');
      expect(wrapper.findDropdown().findOpenDropdown()).toBe(null);
    });
    it('when free text filtering is allowed and no properties available the filtering-empty is shown', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        disableFreeTextFiltering: false,
        filteringProperties: [],
      });
      wrapper.focus();
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-expanded', 'true');
      expect(wrapper.findDropdown().findOpenDropdown()!.getElement()).toHaveTextContent('Empty');
    });
    it('when free text filtering is not allowed and no properties available the filtering-empty is shown', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        disableFreeTextFiltering: true,
        filteringProperties: [],
      });
      wrapper.focus();
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-expanded', 'true');
      expect(wrapper.findDropdown().findOpenDropdown()!.getElement()).toHaveTextContent('Empty');
    });
  });

  describe('async loading', () => {
    test('calls onLoadItems with parsed property and operator when operator is selected', () => {
      const onLoadItems = jest.fn();
      const { propertyFilterWrapper: wrapper } = renderComponent({ onLoadItems });

      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(wrapper.findNativeInput().getElement()).toHaveValue('string');
      expect(onLoadItems).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            filteringText: 'string',
            filteringProperty: undefined,
            filteringOperator: undefined,
          }),
        })
      );

      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(wrapper.findNativeInput().getElement()).toHaveValue('string = ');
      expect(onLoadItems).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            filteringText: '',
            filteringProperty: expect.objectContaining({ key: 'string' }),
            filteringOperator: '=',
          }),
        })
      );
    });

    test('calls onLoadItems with parsed property and operator when operator is inserted', () => {
      const onLoadItems = jest.fn();
      const { propertyFilterWrapper: wrapper } = renderComponent({ onLoadItems });

      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.down));
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(wrapper.findNativeInput().getElement()).toHaveValue('default = ');
      expect(onLoadItems).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            filteringText: '',
            filteringProperty: expect.objectContaining({ key: 'default-operator' }),
            filteringOperator: '=',
          }),
        })
      );
    });

    test('token editor has matched property options', () => {
      function AsyncPropertyFilter(props: PropertyFilterProps) {
        const [loadedFilteringOptions, setFilteringOptions] = useState<readonly FilteringOption[]>([]);
        return (
          <PropertyFilter
            {...props}
            filteringOptions={loadedFilteringOptions}
            onLoadItems={(...args) => {
              props.onLoadItems?.(...args);
              setFilteringOptions(filteringOptions);
            }}
          />
        );
      }

      const renderComponent = (props?: Partial<PropertyFilterProps>) => {
        const { container } = render(<AsyncPropertyFilter {...defaultProps} {...props} />);
        return createWrapper(container).findPropertyFilter()!;
      };

      const wrapper = renderComponent({
        query: { tokens: [{ propertyKey: 'state', value: '0', operator: '=' }], operation: 'or' },
      });

      const [contentWrapper] = openTokenEditor(wrapper);
      const valueSelectWrapper = findValueSelector(contentWrapper);
      act(() => valueSelectWrapper.focus());
      expect(
        valueSelectWrapper
          .findDropdown()
          .findOptions()!
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['Stopped', 'Stopping', 'Running']);
    });
  });

  describe('labelled values', () => {
    test('tokens are labelled', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        query: { tokens: [{ propertyKey: 'state', value: '0', operator: '=' }], operation: 'or' },
      });

      expect(wrapper.findTokens()[0].getElement()).toHaveTextContent('state = Stopped');
    });

    test('token editor values are labelled', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        query: { tokens: [{ propertyKey: 'state', value: '0', operator: '=' }], operation: 'or' },
      });

      const [contentWrapper] = openTokenEditor(wrapper);
      const valueSelectWrapper = findValueSelector(contentWrapper);
      act(() => valueSelectWrapper.focus());
      expect(
        valueSelectWrapper
          .findDropdown()
          .findOptions()!
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['Stopped', 'Stopping', 'Running']);
    });

    test('property value suggestions are labelled', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent();

      act(() => wrapper.setInputValue('state='));
      expect(
        wrapper
          .findDropdown()
          .findOptions()
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['state = Stopped', 'state = Stopping', 'state = Running']);
    });

    test('matches property values', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent();

      // By label
      act(() => wrapper.setInputValue('state=Stopp'));
      expect(
        wrapper
          .findDropdown()
          .findOptions()
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['state = Stopped', 'state = Stopping']);

      // By value
      act(() => wrapper.setInputValue('state=2'));
      expect(
        wrapper
          .findDropdown()
          .findOptions()
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['state = Running']);
    });

    test('matches all values', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent();

      // By label
      act(() => wrapper.setInputValue('Stopp'));
      expect(
        wrapper
          .findDropdown()
          .findOptions()
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['state = Stopped', 'state = Stopping']);

      // By value
      act(() => wrapper.setInputValue('0'));
      expect(
        wrapper
          .findDropdown()
          .findOptions()
          .map(optionWrapper => optionWrapper.getElement().textContent)
      ).toEqual(['state = Stopped']);
    });

    test('query is created with actual value when clicking on option', () => {
      const onChange = jest.fn();
      const { propertyFilterWrapper: wrapper } = renderComponent({ onChange });

      // Selecting matched option from the list
      act(() => wrapper.setInputValue('state=Stopp'));
      act(() => wrapper.selectSuggestion(1));
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            tokens: [{ propertyKey: 'state', value: '0', operator: '=' }],
            operation: 'and',
          },
        })
      );
    });

    test('query is created with actual value when pressing enter', () => {
      const onChange = jest.fn();
      const { propertyFilterWrapper: wrapper } = renderComponent({ onChange });

      // Entering full label
      act(() => wrapper.setInputValue('state=Stopping'));
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            tokens: [{ propertyKey: 'state', value: '1', operator: '=' }],
            operation: 'and',
          },
        })
      );

      // Entering full value
      act(() => wrapper.setInputValue('state=2'));
      act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            tokens: [{ propertyKey: 'state', value: '2', operator: '=' }],
            operation: 'and',
          },
        })
      );
    });
  });

  describe('custom element slots', () => {
    test('can define a customControl element', () => {
      const { propertyFilterWrapper } = renderComponent({ customControl: <div>Custom</div> });
      expect(propertyFilterWrapper.findCustomControl()?.getElement()).toHaveTextContent('Custom');
    });

    test('can define a customFilterAction that replaces the clear filters button', () => {
      const { propertyFilterWrapper } = renderComponent({
        customFilterActions: <div>Custom actions</div>,
        query: { tokens: [{ value: 'free text', operator: '=' }], operation: 'and' },
      });
      expect(propertyFilterWrapper.findRemoveAllButton()).toBeNull();
      expect(propertyFilterWrapper.findCustomFilterActions()?.getElement()).toHaveTextContent('Custom actions');
    });
  });

  test('property filter input can be found with autosuggest selector', () => {
    const { container } = renderComponent();
    expect(createWrapper(container).findAutosuggest()!.getElement()).not.toBe(null);
  });
  test('property filter input can be found with styles.input', () => {
    const { container } = renderComponent();
    expect(createWrapper(container).findByClassName(styles.input)!.getElement()).not.toBe(null);
  });

  test('check a11y', async () => {
    const { container } = render(<PropertyFilter {...defaultProps} />);
    await expect(container).toValidateA11y();
  });
});
