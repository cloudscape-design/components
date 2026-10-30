// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Textarea, { TextareaProps } from '../../../lib/components/textarea';

function renderTextarea(
  props: Omit<TextareaProps, 'value'> & { value?: string; styleClassNames?: Record<string, string> } = {}
) {
  const { container } = render(<Textarea value="" onChange={() => {}} ariaLabel="Textarea" {...props} />);
  return { container, wrapper: createWrapper(container).findTextarea()! };
}

describe('Textarea Style API v2', () => {
  test('applies the textarea class to the native textarea and ignores unknown keys', () => {
    const { container, wrapper } = renderTextarea({ styleClassNames: { textarea: 'a', unknown: 'b' } });
    const nativeTextarea = wrapper.findNativeTextarea().getElement();
    expect(nativeTextarea).toHaveClass('a');
    expect(wrapper.getElement()).not.toHaveClass('a');
    expect(container.querySelector('.b')).toBeNull();
  });

  test('applies the textarea class in every state', () => {
    for (const state of [{}, { invalid: true }, { warning: true }, { disabled: true }, { readOnly: true }]) {
      const { wrapper } = renderTextarea({ ...state, styleClassNames: { textarea: 'a' } });
      expect(wrapper.findNativeTextarea().getElement()).toHaveClass('a');
    }
  });

  test('does not leak the styleClassNames prop to the DOM', () => {
    const { container } = renderTextarea({ styleClassNames: { textarea: 'a' } });
    expect(container.querySelector('[styleClassNames]')).toBeNull();
  });
});
