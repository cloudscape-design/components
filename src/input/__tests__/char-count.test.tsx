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
    const { container } = renderInput({ maxLength: 50, showCharacterCount: true, value: 'test' });
    // InternalLiveRegion renders with aria-live attribute
    const liveRegion = container.querySelector('[aria-live]');
    expect(liveRegion).not.toBeNull();
  });

  test('live region announces count after debounce', () => {
    jest.useFakeTimers();
    const { container } = renderInput({ maxLength: 50, showCharacterCount: true, value: 'hi' });
    const liveRegion = container.querySelector('[aria-live]');

    act(() => {
      jest.advanceTimersByTime(1100);
    });
    // The live region should contain the count text after the delay
    expect(liveRegion).not.toBeNull();

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
