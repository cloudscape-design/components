// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import '../../__a11y__/to-validate-a11y';
import PropertyFilter from '../../../lib/components/property-filter';
import {
  FilteringOption,
  FilteringProperty,
  PropertyFilterProps,
} from '../../../lib/components/property-filter/interfaces';
import createWrapper, { ElementWrapper, PropertyFilterWrapper } from '../../../lib/components/test-utils/dom';
import { createDefaultProps } from './common';

import styles from '../../../lib/components/property-filter/styles.selectors.js';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

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
const stateProperty = filteringProperties.find(property => property.key === 'state')!;

const filteringOptions: readonly FilteringOption[] = [
  { propertyKey: 'string', value: 'value1' },
  { propertyKey: 'string', value: 'value2' },
  { propertyKey: 'state', value: '0', label: getStateLabel('0') },
  { propertyKey: 'state', value: '1', label: getStateLabel('1') },
  { propertyKey: 'state', value: '2', label: getStateLabel('2') },
];

const defaultProps = createDefaultProps(filteringProperties, filteringOptions);

const renderComponent = (props?: Partial<PropertyFilterProps>) => {
  const { container, rerender } = render(
    <div>
      <button id="focus-target" />
      <PropertyFilter {...defaultProps} {...props} />
    </div>
  );
  const patchedRerender = (props?: Partial<PropertyFilterProps>) =>
    rerender(
      <div>
        <button id="focus-target" />
        <PropertyFilter {...defaultProps} {...props} />
      </div>
    );

  return {
    container,
    propertyFilterWrapper: createWrapper(container).findPropertyFilter()!,
    rerender: patchedRerender,
  };
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
    });
    // find dropdown returns open dropdown
    expect(wrapper.findDropdown({ expandToViewport: true })).toBeNull();
    wrapper.findNativeInput().focus();
    expect(wrapper.findDropdown({ expandToViewport: true })!.getElement()).not.toBeNull();
    expect(wrapper.findDropdown({ expandToViewport: true }).findOpenDropdown()!.getElement()).not.toBeNull();
    wrapper.setInputValue('string');
    expect(wrapper.findEnteredTextOption({ expandToViewport: true })!.getElement()).toHaveTextContent('Use: "string"');
    expect(wrapper.findErrorRecoveryButton({ expandToViewport: true })!.getElement()).toHaveTextContent('Retry');
    expect(wrapper.findStatusIndicator({ expandToViewport: true })!.getElement()).toHaveTextContent('Error status');
    wrapper.selectSuggestion(2, { expandToViewport: true });
    expect(wrapper.findNativeInput().getElement()).toHaveValue('string != ');
  });

  describe('status indicators', () => {
    test('displays error status', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        filteringStatusType: 'error',
      });
      wrapper.findNativeInput().focus();
      wrapper.setInputValue('string');
      expect(wrapper.findStatusIndicator()!.getElement()).toHaveTextContent('Error status');
    });
    test('links error status to dropdown', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({ filteringStatusType: 'error' });
      wrapper.findNativeInput().focus();
      wrapper.setInputValue('string');
      expect(wrapper.findDropdown().find('ul')!.getElement()).toHaveAccessibleDescription(`Error status Retry`);
    });
    test('displays finished status', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        filteringStatusType: 'finished',
      });
      wrapper.findNativeInput().focus();
      wrapper.setInputValue('string');
      expect(wrapper.findStatusIndicator()!.getElement()).toHaveTextContent('Finished status');
    });
    test('links finished status to dropdown', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        filteringStatusType: 'finished',
      });
      wrapper.findNativeInput().focus();
      wrapper.setInputValue('string');
      expect(wrapper.findDropdown().find('ul')!.getElement()).toHaveAccessibleDescription(`Finished status`);
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
    it('when free text filtering is allowed and no properties available the filtering-empty is shown', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        disableFreeTextFiltering: false,
        filteringProperties: [],
      });
      wrapper.focus();
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-expanded', 'true');
      expect(wrapper.findDropdown().findOpenDropdown()!.getElement()).toHaveTextContent('Empty');
    });
    it('when free text filtering is allowed and no properties available, with text entered, the use message is shown', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        disableFreeTextFiltering: false,
        filteringProperties: [],
      });
      wrapper.focus();
      wrapper.setInputValue('free-text');
      expect(wrapper.findEnteredTextOption()!.getElement()).toHaveTextContent('Use: "free-text"');
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
    it('when free text filtering is not allowed and no properties available the filtering-empty is shown, also when text is entered', () => {
      const { propertyFilterWrapper: wrapper } = renderComponent({
        disableFreeTextFiltering: true,
        filteringProperties: [],
      });
      wrapper.focus();
      wrapper.setInputValue('free-text');
      expect(wrapper.findNativeInput().getElement()).toHaveAttribute('aria-expanded', 'true');
      expect(wrapper.findDropdown().findOpenDropdown()!.getElement()).toHaveTextContent('Empty');
    });
  });

  describe('async loading', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });
    afterEach(() => {
      jest.useRealTimers();
    });

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

    test('does not call onLoadItems when clear button is clicked and asyncProperties=false', () => {
      const loadItemCalls: PropertyFilterProps.LoadItemsDetail[] = [];
      const { propertyFilterWrapper: wrapper } = renderComponent({
        onLoadItems: ({ detail }) => loadItemCalls.push(detail),
        filteringStatusType: 'pending',
        asyncProperties: false,
      });

      wrapper.focus();
      wrapper.setInputValue('state = 123');
      expect(loadItemCalls).toEqual([
        expect.objectContaining({ filteringText: '123', filteringProperty: stateProperty, filteringOperator: '=' }),
      ]);

      wrapper.findClearButton()!.click();
      jest.advanceTimersByTime(1000);
      expect(loadItemCalls).toHaveLength(1);
    });

    test('calls onLoadItems on clear when filter by text and asyncProperties=true', () => {
      const loadItemCalls: PropertyFilterProps.LoadItemsDetail[] = [];
      const {
        propertyFilterWrapper: wrapper,
        container,
        rerender,
      } = renderComponent({
        onLoadItems: ({ detail }) => loadItemCalls.push(detail),
        filteringStatusType: 'pending',
        asyncProperties: true,
      });

      wrapper.focus();
      expect(loadItemCalls).toEqual([
        expect.objectContaining({ filteringText: '' }),
        expect.objectContaining({ filteringText: '' }),
      ]);

      wrapper.setInputValue('free-text');
      expect(loadItemCalls).toHaveLength(2);

      jest.advanceTimersByTime(1000);
      expect(loadItemCalls).toEqual([
        expect.objectContaining({ filteringText: '' }),
        expect.objectContaining({ filteringText: '' }),
        expect.objectContaining({ filteringText: 'free-text' }),
      ]);

      rerender({
        onLoadItems: ({ detail }) => loadItemCalls.push(detail),
        filteringStatusType: 'finished',
        asyncProperties: true,
      });

      createWrapper(container).find('#focus-target')!.focus();

      wrapper.findClearButton()!.click();

      jest.advanceTimersByTime(1000);

      expect(loadItemCalls).toEqual([
        expect.objectContaining({ filteringText: '' }),
        expect.objectContaining({ filteringText: '' }),
        expect.objectContaining({ filteringText: 'free-text' }),
        expect.objectContaining({ filteringText: 'free-text' }),
        expect.objectContaining({ filteringText: '' }),
      ]);
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

    test('calls onLoadItem when opening editor value autosuggest', () => {
      const onLoadItems = jest.fn();
      const { propertyFilterWrapper: wrapper } = renderComponent({
        onLoadItems,
        filteringOptions: [],
        filteringStatusType: 'pending',
        query: { operation: 'and', tokens: [{ propertyKey: 'state', operator: ':', value: 'Sto' }] },
      });

      const [contentWrapper] = openTokenEditor(wrapper);
      const valueSelectWrapper = findValueSelector(contentWrapper);
      valueSelectWrapper.focus();
      expect(onLoadItems).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            filteringProperty: expect.objectContaining({ key: 'state' }),
            filteringOperator: ':',
            filteringText: 'Sto',
            firstPage: true,
            samePage: false,
          },
        })
      );
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

    test.each([false, true])(
      'query is created with actual value when clicking on option, disableFreeTextFiltering=%s',
      disableFreeTextFiltering => {
        const onChange = jest.fn();
        const { propertyFilterWrapper: wrapper } = renderComponent({ disableFreeTextFiltering, onChange });

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
      }
    );

    test.each([false, true])(
      'query is created with actual value when pressing enter, disableFreeTextFiltering=%s',
      disableFreeTextFiltering => {
        const onChange = jest.fn();
        const { propertyFilterWrapper: wrapper } = renderComponent({ disableFreeTextFiltering, onChange });

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
      }
    );
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

test('warns and does not hide operations when using hideOperations and enableTokenGroups', () => {
  const { propertyFilterWrapper: wrapper } = renderComponent({
    query: {
      operation: 'or',
      tokenGroups: [
        { propertyKey: 'string', operator: '=', value: 'first' },
        {
          operation: 'and',
          tokens: [
            { propertyKey: 'string', operator: ':', value: 'se' },
            { propertyKey: 'string', operator: ':', value: 'cond' },
          ],
        },
      ],
      tokens: [],
    },
    hideOperations: true,
    enableTokenGroups: true,
  });

  expect(wrapper.findTokens()[1].findTokenOperation()).not.toBe(null);
  expect(wrapper.findTokens()[1].findGroupTokens()[1].findTokenOperation()).not.toBe(null);

  expect(warnOnce).toHaveBeenCalledTimes(1);
  expect(warnOnce).toHaveBeenCalledWith('PropertyFilter', 'Operations cannot be hidden when token groups are enabled.');
});
