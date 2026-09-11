// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Input from '../../../lib/components/input';
import PropertyFilter from '../../../lib/components/property-filter';
import { FilteringProperty, PropertyFilterProps, Ref } from '../../../lib/components/property-filter/interfaces.js';
import createWrapper, { PropertyFilterWrapper } from '../../../lib/components/test-utils/dom';
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
      {
        operator: '=',
        form: ({ value, onChange }) => (
          <Input name="" value={value} onChange={({ detail }) => onChange(detail.value)} />
        ),
      },
    ],
    propertyLabel: 'index',
    groupValuesLabel: 'index value',
  };
  const extendedOperatorProps = { filteringProperties: [indexProperty] };

  test('property label is used to annotate custom form field', () => {
    const { propertyFilterWrapper: wrapper } = renderComponent(extendedOperatorProps);
    wrapper.setInputValue('index =');
    expect(
      wrapper.findDropdown()!.findOpenDropdown()!.findInput()!.findNativeInput()!.getElement()
    ).toHaveAccessibleName('index value');
  });

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
    act(() => wrapper.findPropertyCancelButton()!.click());
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    expect(onChange).not.toHaveBeenCalled();
    expect(wrapper.findNativeInput().getElement()).toHaveFocus();

    // Decrement value
    wrapper.setInputValue('index <');
    act(() => pageWrapper.find('[data-testid="change-"]')!.click());

    // Click submit
    act(() => wrapper.findPropertySubmitButton()!.click());
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          operation: 'and',
          tokens: [{ propertyKey: 'index', operator: '<', value: -1 }],
        },
      })
    );
    expect(wrapper.findNativeInput().getElement()).toHaveFocus();
  });

  test('extended operator form value is reset when operator changes', () => {
    const { propertyFilterWrapper: wrapper, pageWrapper } = renderComponent({ ...extendedOperatorProps });

    // Increment value
    wrapper.setInputValue('index >');
    act(() => pageWrapper.find('[data-testid="change+"]')!.click());
    expect(wrapper.find('[data-testid="change+"]')!.getElement()).toHaveTextContent('1');

    // Change operator
    wrapper.setInputValue('index <');
    expect(wrapper.find('[data-testid="change-"]')!.getElement()).toHaveTextContent('0');
  });

  test('extended operator form value is reset when dropdown closes', () => {
    const { propertyFilterWrapper: wrapper, pageWrapper } = renderComponent({ ...extendedOperatorProps });

    // Increment value
    wrapper.setInputValue('index >');
    act(() => pageWrapper.find('[data-testid="change+"]')!.click());
    expect(wrapper.find('[data-testid="change+"]')!.getElement()).toHaveTextContent('1');

    // Close dropdown
    wrapper.findNativeInput().keydown(KeyCode.escape);
    expect(wrapper.findDropdown()?.findOpenDropdown()).toBeFalsy();

    // Reopen dropdown
    wrapper.setInputValue('index > ');
    expect(wrapper.find('[data-testid="change+"]')!.getElement()).toHaveTextContent('0');
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

describe('extended operator form submit', () => {
  // Custom form that lifts its value via onChange and applies it via the injected `submit` callback,
  // either through a dedicated button or by pressing "Enter" inside the input.
  const submittableProperty: FilteringProperty = {
    key: 'index',
    operators: [
      {
        operator: '=',
        form: ({ value, onChange, submit }) => (
          <div>
            <input
              data-testid="custom-input"
              value={value ?? ''}
              onChange={event => onChange(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.keyCode === 13) {
                  submit?.();
                }
              }}
            />
            <button data-testid="custom-submit" onClick={() => submit?.()}>
              apply
            </button>
          </div>
        ),
      },
    ],
    propertyLabel: 'index',
    groupValuesLabel: 'index value',
  };
  const submittableProps = { filteringProperties: [submittableProperty] };

  test('custom form receives a submit callback in the dropdown flow', () => {
    const { propertyFilterWrapper: wrapper, pageWrapper } = renderComponent(submittableProps);
    wrapper.setInputValue('index =');
    expect(pageWrapper.find('[data-testid="custom-submit"]')).not.toBe(null);
  });

  test('custom form submit applies the token in the dropdown flow (submit button)', () => {
    const onChange = jest.fn();
    const { propertyFilterWrapper: wrapper, pageWrapper } = renderComponent({ ...submittableProps, onChange });

    wrapper.setInputValue('index =');
    const input = pageWrapper.find('[data-testid="custom-input"]')!.getElement() as HTMLInputElement;
    act(() => {
      fireEvent.change(input, { target: { value: 'abc' } });
    });
    act(() => pageWrapper.find('[data-testid="custom-submit"]')!.click());

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'index', operator: '=', value: 'abc' }] },
      })
    );
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
    expect(wrapper.findNativeInput().getElement()).toHaveFocus();
  });

  test('custom form submit applies the token in the dropdown flow (Enter key)', () => {
    const onChange = jest.fn();
    const { propertyFilterWrapper: wrapper, pageWrapper } = renderComponent({ ...submittableProps, onChange });

    wrapper.setInputValue('index =');
    const input = pageWrapper.find('[data-testid="custom-input"]')!.getElement() as HTMLInputElement;
    act(() => {
      fireEvent.change(input, { target: { value: 'xyz' } });
    });
    act(() => {
      fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });
    });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'index', operator: '=', value: 'xyz' }] },
      })
    );
    expect(wrapper.findDropdown()!.findOpenDropdown()).toBe(null);
  });

  test('custom form submit applies changes from the token editor', () => {
    const onChange = jest.fn();
    const { propertyFilterWrapper: wrapper, pageWrapper } = renderComponent({
      ...submittableProps,
      onChange,
      query: { tokens: [{ propertyKey: 'index', value: 'abc', operator: '=' }], operation: 'and' },
    });

    const [contentWrapper] = openTokenEditor(wrapper, 0);
    const input = contentWrapper.find('[data-testid="custom-input"]')!.getElement() as HTMLInputElement;
    act(() => {
      fireEvent.change(input, { target: { value: 'def' } });
    });
    act(() => pageWrapper.find('[data-testid="custom-submit"]')!.click());

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'index', operator: '=', value: 'def' }] },
      })
    );
  });

  test('submit is optional: forms that ignore it keep working', () => {
    // Regression guard for backward compatibility: a form that never calls submit still applies via the
    // built-in submit button.
    const onChange = jest.fn();
    const property: FilteringProperty = {
      key: 'index',
      operators: [
        {
          operator: '=',
          form: ({ value, onChange }) => (
            <input data-testid="legacy-input" value={value ?? ''} onChange={event => onChange(event.target.value)} />
          ),
        },
      ],
      propertyLabel: 'index',
      groupValuesLabel: 'index value',
    };
    const { propertyFilterWrapper: wrapper, pageWrapper } = renderComponent({
      filteringProperties: [property],
      onChange,
    });

    wrapper.setInputValue('index =');
    const input = pageWrapper.find('[data-testid="legacy-input"]')!.getElement() as HTMLInputElement;
    act(() => {
      fireEvent.change(input, { target: { value: 'legacy' } });
    });
    act(() => wrapper.findPropertySubmitButton()!.click());

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { operation: 'and', tokens: [{ propertyKey: 'index', operator: '=', value: 'legacy' }] },
      })
    );
  });
});
