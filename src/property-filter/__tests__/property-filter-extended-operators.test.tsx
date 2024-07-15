// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { act, render } from '@testing-library/react';
import createWrapper, {
  ElementWrapper,
  FormFieldWrapper,
  PropertyFilterWrapper,
} from '../../../lib/components/test-utils/dom';
import DropdownWrapper from '../../../lib/components/test-utils/dom/internal/dropdown';
import PropertyFilter from '../../../lib/components/property-filter';
import styles from '../../../lib/components/property-filter/styles.selectors.js';
import { FilteringProperty, PropertyFilterProps, Ref } from '../../../lib/components/property-filter/interfaces.js';
import { createDefaultProps } from './common';

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

function findPropertySubmitButton(wrapper: ElementWrapper) {
  return wrapper.findButton(`.${styles['property-editor-submit']}`)!;
}
function findTokenSubmitButton(wrapper: ElementWrapper) {
  return wrapper.findButton(`.${styles['token-editor-submit']}`)!;
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
    const onChange = jest.fn();
    const { propertyFilterWrapper: wrapper } = renderComponent({
      ...extendedOperatorProps,
      query: {
        operation: 'and',
        tokens: [
          { propertyKey: 'index', value: 1, operator: '>' },
          { propertyKey: 'index', value: 2, operator: '<' },
        ],
      },
      onChange,
    });

    // Ensure token editors have respective custom forms
    expect(wrapper.findTokens()).toHaveLength(2);
    const [editorPlus, editorMinus] = [openTokenEditor(wrapper, 0)[0], openTokenEditor(wrapper, 1)[0]];
    expect(editorPlus.find('[data-testid="change+"]')).not.toBe(null);
    expect(editorMinus.find('[data-testid="change-"]')).not.toBe(null);

    // Click on value field.
    const valueFormField = editorPlus.findAllByClassName(FormFieldWrapper.rootSelector)[2];
    valueFormField.find('button')!.click();

    // Click change+ button
    const valueDropdown = new DropdownWrapper(valueFormField.find(`.${DropdownWrapper.rootSelector}`)!.getElement());
    valueDropdown.findOpenDropdown()!.find('button[data-testid="change+"]')!.click();

    // Click value apply button
    findPropertySubmitButton(valueDropdown.findOpenDropdown()!).click();

    // Click token editor apply button
    findTokenSubmitButton(editorPlus).click();

    expect(onChange).toBeCalledWith(
      expect.objectContaining({
        detail: {
          operation: 'and',
          tokens: [
            { propertyKey: 'index', value: 2, operator: '>' },
            { propertyKey: 'index', value: 2, operator: '<' },
          ],
        },
      })
    );
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
