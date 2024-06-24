// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import PromptInputWrapper from '../../../lib/components/test-utils/dom/prompt-input';

import PromptInput, { PromptInputProps } from '../../../lib/components/prompt-input';
// import styles from '../../../lib/components/prompt-input/styles.css.js';

const renderPromptInput = (promptInputProps: PromptInputProps): PromptInputWrapper => {
  const { container } = render(<PromptInput {...promptInputProps} />);
  return new PromptInputWrapper(container);
};

describe('value', () => {
  test('can be set', () => {
    const wrapper = renderPromptInput({ value: 'value' });
    expect(wrapper.getElement()).toHaveTextContent('value');
  });
  test('can be obtained through getTextareaValue API', () => {
    const wrapper = renderPromptInput({ value: 'value' });
    expect(wrapper.getTextareaValue()).toBe('value');
  });
});
