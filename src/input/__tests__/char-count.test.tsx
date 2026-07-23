// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import FormField from '../../../lib/components/form-field';
import Input, { InputProps } from '../../../lib/components/input';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderInput(props: Partial<InputProps> = {}) {
  const { container } = render(<Input value="" onChange={jest.fn()} {...props} />);
  const wrapper = createWrapper(container).findInput()!;
  return {
    container,
    wrapper,
    input: wrapper.findNativeInput().getElement(),
  };
}

describe('Input — maxLength prop', () => {
  test('is not set on native input by default', () => {
    const { input } = renderInput();
    expect(input).not.toHaveAttribute('maxlength');
  });

  test('sets maxlength on the native input', () => {
    const { input } = renderInput({ maxLength: 50 });
    expect(input).toHaveAttribute('maxlength', '50');
  });

  test('does not render character count when showCharacterCount is not set', () => {
    const { container } = renderInput({ maxLength: 50 });
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});

describe('Input — showCharacterCount prop', () => {
  test('does not render character count when maxLength is not provided', () => {
    const { container } = renderInput({ showCharacterCount: true });
    // No count display without maxLength
    expect(container.textContent).not.toMatch(/\//);
  });

  test('renders "0/N" when value is empty', () => {
    const { container } = renderInput({ maxLength: 100, showCharacterCount: true, value: '' });
    const visual = container.querySelector('[aria-hidden="true"]');
    expect(visual).not.toBeNull();
    expect(visual!.textContent).toBe('0/100');
  });

  test('renders correct count for non-empty value', () => {
    const { container } = renderInput({ maxLength: 100, showCharacterCount: true, value: 'hello' });
    const visual = container.querySelector('[aria-hidden="true"]');
    expect(visual!.textContent).toBe('5/100');
  });

  test('updates count when value changes', () => {
    const { container } = renderInput({ maxLength: 20, showCharacterCount: true, value: 'abc' });
    const visual = container.querySelector('[aria-hidden="true"]');
    expect(visual!.textContent).toBe('3/20');

    // Re-render with new value
    const { container: container2 } = render(
      <Input value="abcde" maxLength={20} showCharacterCount={true} onChange={jest.fn()} />
    );
    const visual2 = container2.querySelector('[aria-hidden="true"]');
    expect(visual2!.textContent).toBe('5/20');
  });

  test('visual counter is aria-hidden', () => {
    const { container } = renderInput({ maxLength: 50, showCharacterCount: true, value: 'test' });
    const visual = container.querySelector('[aria-hidden="true"]');
    expect(visual).not.toBeNull();
    expect(visual!.getAttribute('aria-hidden')).toBe('true');
  });

  test('live region exists', () => {
    renderInput({ maxLength: 50, showCharacterCount: true, value: 'test' });
    // InternalLiveRegion mounts its announcer element (with aria-live) on the
    // document body via the shared LiveRegionController, not inside the input's
    // own DOM subtree, so we query the whole document for it.
    const liveRegion = document.querySelector('[aria-live]');
    expect(liveRegion).not.toBeNull();
  });

  test('live region announces count after debounce', () => {
    jest.useFakeTimers();
    // The live region prevents the initial announcement, so we render and then
    // change the value to trigger a debounced count announcement.
    const { rerender } = render(<Input value="hi" maxLength={50} showCharacterCount={true} onChange={jest.fn()} />);
    rerender(<Input value="hip" maxLength={50} showCharacterCount={true} onChange={jest.fn()} />);

    const liveRegion = document.querySelector('[aria-live]');
    expect(liveRegion).not.toBeNull();

    act(() => {
      // Default live-region delay is 1s; advance past it to flush the announcement.
      jest.advanceTimersByTime(1100);
    });
    // After the debounce delay, the live region announces the updated count.
    expect(liveRegion!.textContent).toBe('3/50');

    jest.useRealTimers();
  });

  test('renders count when disabled', () => {
    const { container } = renderInput({ maxLength: 30, showCharacterCount: true, value: 'abc', disabled: true });
    const visual = container.querySelector('[aria-hidden="true"]');
    expect(visual!.textContent).toBe('3/30');
  });

  test('renders count when readOnly', () => {
    const { container } = renderInput({ maxLength: 30, showCharacterCount: true, value: 'abc', readOnly: true });
    const visual = container.querySelector('[aria-hidden="true"]');
    expect(visual!.textContent).toBe('3/30');
  });

  test('shows "N/N" when value equals maxLength', () => {
    const { container } = renderInput({ maxLength: 5, showCharacterCount: true, value: 'hello' });
    const visual = container.querySelector('[aria-hidden="true"]');
    expect(visual!.textContent).toBe('5/5');
  });
});

describe('Input — maxLength with FormField', () => {
  test('renders inside FormField with character count', () => {
    const { container } = render(
      <FormField label="Name" controlId="test-input">
        <Input controlId="test-input" value="test" maxLength={100} showCharacterCount={true} onChange={jest.fn()} />
      </FormField>
    );
    const visual = container.querySelector('[aria-hidden="true"]');
    expect(visual!.textContent).toBe('4/100');
  });

  test('char-count live region id is derived from controlId', () => {
    const { container } = render(
      <Input controlId="my-input" value="hello" maxLength={50} showCharacterCount={true} onChange={jest.fn()} />
    );
    const liveRegion = container.querySelector('#my-input-char-count');
    expect(liveRegion).not.toBeNull();
  });

  test('native input aria-describedby includes char-count id when controlId is set', () => {
    const { input } = renderInput({ controlId: 'my-ctrl', maxLength: 50, showCharacterCount: true, value: '' });
    expect(input.getAttribute('aria-describedby')).toContain('my-ctrl-char-count');
  });
});
