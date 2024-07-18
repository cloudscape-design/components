// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { act, render } from '@testing-library/react';

import PropertyFilter from '../../../lib/components/property-filter';
import { FilteringProperty, PropertyFilterProps, Ref } from '../../../lib/components/property-filter/interfaces.js';
import createWrapper, { PropertyFilterWrapper } from '../../../lib/components/test-utils/dom';
import { createDefaultProps } from './common';

import styles from '../../../lib/components/property-filter/styles.selectors.js';

const defaultProps = createDefaultProps([], []);

const renderComponent = (props?: Partial<PropertyFilterProps & { ref: React.Ref<Ref> }>) => {
  const { container } = render(
    <div>
      <button id="button" />
      <PropertyFilter {...defaultProps} {...props} />
    </div>
  );
  const pageWrapper = createWrapper(container);
  return { container, propertyFilterWrapper: pageWrapper.findPropertyFilter()!, pageWrapper };
};

function openTokenEditor(wrapper: PropertyFilterWrapper, index = 0) {
  const tokenWrapper = createWrapper(wrapper.findTokens()![index].getElement());
  const popoverWrapper = tokenWrapper.findPopover()!;
  act(() => popoverWrapper.findTrigger().click());
  const contentWrapper = popoverWrapper.findContent()!;
  return [contentWrapper, popoverWrapper] as const;
}

describe('extended operators', () => {
  const indexProperty: FilteringProperty = {
    key: 'index',
    operators: [
      {
        operator: '>',
        form: ({ value, onChange, operator, filter = '' }) => (
          <button data-testid="change+" data-context={operator + filter} onClick={() => onChange((value || 0) + 1)}>
            {value || 0}
          </button>
        ),
      },
      {
        operator: '<',
        form: ({ value, onChange, operator, filter = '' }) => (
          <button data-testid="change-" data-context={operator + filter} onClick={() => onChange((value || 0) - 1)}>
            {value || 0}
          </button>
        ),
      },
    ],
    propertyLabel: 'index',
    groupValuesLabel: 'index value',
  };
  const extendedOperatorProps = { filteringProperties: [indexProperty] };

  test('property filter renders operator form instead of options list', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent(extendedOperatorProps);
    wrapper.setInputValue('index >');
    expect(wrapper.findDropdown()!.findOpenDropdown()!.find('[data-testid="change+"]')).not.toBe(null);
    wrapper.setInputValue('index <');
    expect(wrapper.findDropdown()!.findOpenDropdown()!.find('[data-testid="change-"]')).not.toBe(null);
  });

  test('property filter uses operator form in the token editor', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      ...extendedOperatorProps,
      query: {
        tokens: [
          { propertyKey: 'index', value: 1, operator: '>' },
          { propertyKey: 'index', value: 2, operator: '<' },
        ],
        operation: 'and',
      },
    });
    expect(wrapper.findTokens()).toHaveLength(2);
    expect(openTokenEditor(wrapper, 0)[0].find('[data-testid="change+"]')).not.toBe(null);
    expect(openTokenEditor(wrapper, 1)[0].find('[data-testid="change-"]')).not.toBe(null);
  });

  test('extended operator form takes value/onChange state', () => {
    const { propertyFilterWrapper: wrapper, pageWrapper } = renderComponent(extendedOperatorProps);
    wrapper.setInputValue('index >');
    expect(pageWrapper.find('[data-testid="change+"]')!.getElement()).toHaveTextContent('0');
    act(() => pageWrapper.find('[data-testid="change+"]')!.click());
    expect(pageWrapper.find('[data-testid="change+"]')!.getElement()).toHaveTextContent('1');
  });

  test('extended operator form can be cancelled/submitted', () => {
    const onChange = jest.fn();
    const { propertyFilterWrapper: wrapper, pageWrapper } = renderComponent({ ...extendedOperatorProps, onChange });

    // Increment value
    wrapper.setInputValue('index >');
    act(() => pageWrapper.find('[data-testid="change+"]')!.click());

    // Click cancel
    act(() => pageWrapper.findButton(`.${styles['property-editor-cancel']}`)!.click());
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    expect(onChange).not.toBeCalled();
    expect(wrapper.findNativeInput().getElement()).toHaveFocus();

    // Decrement value
    wrapper.setInputValue('index <');
    act(() => pageWrapper.find('[data-testid="change-"]')!.click());

    // Click submit
    act(() => pageWrapper.findButton(`.${styles['property-editor-submit']}`)!.click());
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    expect(onChange).toBeCalledWith(
      expect.objectContaining({
        detail: {
          operation: 'and',
          tokens: [{ propertyKey: 'index', operator: '<', value: -1 }],
        },
      })
    );
    expect(wrapper.findNativeInput().getElement()).toHaveFocus();
  });

  test('extended operator form takes chosen operator and entered filter text', () => {
    const { propertyFilterWrapper: wrapper, pageWrapper } = renderComponent(extendedOperatorProps);

    wrapper.setInputValue('index >');
    expect(pageWrapper.find('[data-testid="change+"]')!.getElement()).toHaveAttribute('data-context', '>');

    wrapper.setInputValue('index <');
    expect(pageWrapper.find('[data-testid="change-"]')!.getElement()).toHaveAttribute('data-context', '<');

    wrapper.setInputValue('index < ');
    expect(pageWrapper.find('[data-testid="change-"]')!.getElement()).toHaveAttribute('data-context', '<');

    wrapper.setInputValue('index < 1 2 ');
    expect(pageWrapper.find('[data-testid="change-"]')!.getElement()).toHaveAttribute('data-context', '<1 2 ');
  });

  test('property filter uses operator formatter to render token value', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent({
      filteringProperties: [
        {
          key: 'index',
          operators: [
            { operator: '=', format: value => `EQ${value}` },
            { operator: '!=', format: value => `NEQ${value}` },
          ],
          propertyLabel: 'index',
          groupValuesLabel: 'index value',
        },
      ],
      query: {
        tokens: [
          { propertyKey: 'index', value: 1, operator: '=' },
          { propertyKey: 'index', value: 2, operator: '!=' },
        ],
        operation: 'and',
      },
    });
    expect(wrapper.findTokens()).toHaveLength(2);
    expect(wrapper.findTokens()[0].getElement()).toHaveTextContent('index = EQ1');
    expect(wrapper.findTokens()[1].getElement()).toHaveTextContent('index != NEQ2');
  });
});
