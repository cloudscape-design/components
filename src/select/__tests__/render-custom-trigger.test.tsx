// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Select, { SelectProps } from '../../../lib/components/select';
import createWrapper from '../../../lib/components/test-utils/dom';

const defaultOptions: SelectProps.Options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
];

function renderSelect(props: Partial<SelectProps>) {
  const { container } = render(<Select selectedOption={null} options={defaultOptions} {...props} />);
  return createWrapper(container).findSelect()!;
}

describe('Select renderCustomTrigger', () => {
  test('renders the consumer-provided trigger element when renderCustomTrigger is set', () => {
    const wrapper = renderSelect({
      renderCustomTrigger: ({ triggerRef, ariaProps }) => (
        <button
          ref={triggerRef as React.Ref<HTMLButtonElement>}
          aria-haspopup="listbox"
          {...ariaProps}
          data-testid="custom-trigger"
        >
          Custom trigger
        </button>
      ),
    });

    const customTrigger = wrapper.findCustomTrigger();
    expect(customTrigger).not.toBeNull();
    expect(customTrigger!.find('[data-testid="custom-trigger"]')).not.toBeNull();
    expect(wrapper.findCustomTrigger()!.getElement().textContent).toBe('Custom trigger');
  });

  test('findTrigger returns null when renderCustomTrigger is set, and the default ButtonTrigger is not rendered', () => {
    const wrapper = renderSelect({
      renderCustomTrigger: ({ triggerRef, ariaProps }) => (
        <button ref={triggerRef as React.Ref<HTMLButtonElement>} aria-haspopup="listbox" {...ariaProps}>
          Custom
        </button>
      ),
    });
    expect(wrapper.findTrigger()).toBeNull();
  });

  test('findCustomTrigger returns null for default Select', () => {
    const wrapper = renderSelect({});
    expect(wrapper.findCustomTrigger()).toBeNull();
    // Default trigger still works
    expect(wrapper.findTrigger()).not.toBeNull();
  });

  test('clicking the custom trigger toggles the dropdown open', () => {
    const wrapper = renderSelect({
      renderCustomTrigger: ({ triggerRef, ariaProps, onClick }) => (
        <button
          ref={triggerRef as React.Ref<HTMLButtonElement>}
          onClick={onClick}
          aria-haspopup="listbox"
          {...ariaProps}
        >
          Open
        </button>
      ),
    });

    expect(wrapper.findDropdown().findOpenDropdown()).toBeNull();
    (wrapper.findCustomTrigger()!.find('button')!.getElement() as HTMLButtonElement).click();
    expect(wrapper.findDropdown().findOpenDropdown()).not.toBeNull();
  });

  test('ariaProps include id, aria-expanded, and reflect the open state', () => {
    let captured: { 'aria-expanded': boolean; id: string } | null = null;
    const wrapper = renderSelect({
      renderCustomTrigger: ({ triggerRef, ariaProps, onClick }) => {
        captured = { 'aria-expanded': ariaProps['aria-expanded'], id: ariaProps.id };
        return (
          <button
            ref={triggerRef as React.Ref<HTMLButtonElement>}
            onClick={onClick}
            aria-haspopup="listbox"
            {...ariaProps}
          >
            T
          </button>
        );
      },
    });

    expect(captured).not.toBeNull();
    expect(captured!['aria-expanded']).toBe(false);
    expect(typeof captured!.id).toBe('string');
    expect(captured!.id.length).toBeGreaterThan(0);

    (wrapper.findCustomTrigger()!.find('button')!.getElement() as HTMLButtonElement).click();
    expect(captured!['aria-expanded']).toBe(true);
  });
});
