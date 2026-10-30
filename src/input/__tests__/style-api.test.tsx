// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Input, { InputProps } from '../../../lib/components/input';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderInput(
  props: Omit<InputProps, 'value'> & { value?: string; styleClassNames?: Record<string, string> } = {}
) {
  const { container } = render(<Input value="" onChange={() => {}} ariaLabel="Input" {...props} />);
  return { container, wrapper: createWrapper(container).findInput()! };
}

describe('Input Style API v2', () => {
  test('applies styleClassNames to the slots', () => {
    const { container, wrapper } = renderInput({
      type: 'search',
      value: 'query',
      inlineLabelText: 'Label',
      styleClassNames: { root: 'a', input: 'b', inlineLabel: 'c', searchIcon: 'd', clearButton: 'e', unknown: 'f' },
    });
    const nativeInput = wrapper.findNativeInput().getElement();
    expect(nativeInput.parentElement).toHaveClass('a');
    expect(nativeInput).toHaveClass('b');
    expect(wrapper.findInlineLabel()!.getElement()).toHaveClass('c');
    expect(container.querySelector('.d')).toBe(nativeInput.parentElement!.previousElementSibling);
    expect(wrapper.findClearButton()!.getElement()).toHaveClass('e');
    expect(container.querySelector('.f')).toBeNull();
  });

  test('applies the root and input classes in every state', () => {
    for (const state of [{}, { invalid: true }, { warning: true }, { disabled: true }, { readOnly: true }]) {
      const { wrapper } = renderInput({ ...state, prefix: '$', styleClassNames: { root: 'a', input: 'b' } });
      const nativeInput = wrapper.findNativeInput().getElement();
      expect(nativeInput.parentElement).toHaveClass('a');
      expect(nativeInput).toHaveClass('b');
    }
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderInput({ styleClassNames: { root: 'a', input: 'b' } });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
