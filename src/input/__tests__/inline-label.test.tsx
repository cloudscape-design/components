// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import Input, { InputProps } from '../../../lib/components/input';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderInput(props: Partial<InputProps> = {}) {
  const { container, rerender } = render(<Input value="" onChange={() => {}} {...props} />);
  const wrapper = createWrapper(container).findInput()!;
  return { wrapper, rerender };
}

describe('Inline label', () => {
  test('is rendered when inlineLabelText is provided', () => {
    const { wrapper } = renderInput({ inlineLabelText: 'Region' });
    const label = wrapper.findInlineLabel();
    expect(label).not.toBeNull();
    expect(label!.getElement()).toHaveTextContent('Region');
  });

  test('is not rendered when inlineLabelText is not provided', () => {
    const { wrapper } = renderInput();
    expect(wrapper.findInlineLabel()).toBeNull();
  });

  test('is rendered alongside prefix and suffix', () => {
    const { wrapper } = renderInput({ inlineLabelText: 'Amount', prefix: '$', suffix: 'USD' });
    expect(wrapper.findInlineLabel()!.getElement()).toHaveTextContent('Amount');
  });

  test('is associated with the native input', () => {
    const { wrapper } = renderInput({ inlineLabelText: 'Region', controlId: 'region-input' });
    const label = wrapper.findInlineLabel()!.getElement() as HTMLLabelElement;
    expect(label.htmlFor).toBe('region-input');
    expect(wrapper.findNativeInput().getElement().id).toBe('region-input');
  });

  test('is associated with the native input when no controlId is provided', () => {
    const { wrapper } = renderInput({ inlineLabelText: 'Region' });
    const label = wrapper.findInlineLabel()!.getElement() as HTMLLabelElement;
    const inputId = wrapper.findNativeInput().getElement().id;
    expect(inputId).toBeTruthy();
    expect(label.htmlFor).toBe(inputId);
  });
});
