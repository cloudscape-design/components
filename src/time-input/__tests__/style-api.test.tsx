// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import TimeInput, { TimeInputProps } from '../../../lib/components/time-input';

function renderTimeInput(
  props: Omit<TimeInputProps, 'value'> & {
    value?: string;
    styleClassNames?: Record<string, string | Record<string, string>>;
  } = {}
) {
  const { container } = render(<TimeInput value="" onChange={() => {}} ariaLabel="Time" {...props} />);
  return { container, wrapper: createWrapper(container).findTimeInput()! };
}

describe('Time input Style API v2', () => {
  test('forwards the input classes to the Input slots and ignores unknown keys', () => {
    const { container, wrapper } = renderTimeInput({
      value: '14:30:00',
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
      const { wrapper } = renderTimeInput({ ...state, styleClassNames: { input: { root: 'a', input: 'b' } } });
      const nativeInput = wrapper.findNativeInput().getElement();
      expect(nativeInput.parentElement).toHaveClass('a');
      expect(nativeInput).toHaveClass('b');
    }
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderTimeInput({ styleClassNames: { input: { root: 'a', input: 'b' } } });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
