// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import DateInput, { DateInputProps } from '../../../lib/components/date-input';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderDateInput(
  props: Omit<DateInputProps, 'value'> & {
    value?: string;
    styleClassNames?: Record<string, string | Record<string, string>>;
  } = {}
) {
  const { container } = render(<DateInput value="" onChange={() => {}} ariaLabel="Date" {...props} />);
  return { container, wrapper: createWrapper(container).findDateInput()! };
}

describe('Date input Style API v2', () => {
  test('forwards the input classes to the Input slots and ignores unknown keys', () => {
    const { container, wrapper } = renderDateInput({
      value: '2024-03-15',
      styleClassNames: { input: { root: 'a', input: 'b', unknown: 'c' }, unknown: 'd' },
    });
    const nativeInput = wrapper.findNativeInput().getElement();
    expect(nativeInput.parentElement).toHaveClass('a');
    expect(nativeInput).toHaveClass('b');
    expect(container.querySelector('.c')).toBeNull();
    expect(container.querySelector('.d')).toBeNull();
  });

  test('forwards the input classes in every state', () => {
    for (const state of [{}, { invalid: true }, { warning: true }, { disabled: true }, { readOnly: true }]) {
      const { wrapper } = renderDateInput({ ...state, styleClassNames: { input: { root: 'a', input: 'b' } } });
      const nativeInput = wrapper.findNativeInput().getElement();
      expect(nativeInput.parentElement).toHaveClass('a');
      expect(nativeInput).toHaveClass('b');
    }
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderDateInput({ styleClassNames: { input: { root: 'a', input: 'b' } } });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
