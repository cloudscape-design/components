// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, act } from '@testing-library/react';
import '../../__a11y__/to-validate-a11y';

import PromptInputWrapper from '../../../lib/components/test-utils/dom/prompt-input';

import PromptInput, { PromptInputProps } from '../../../lib/components/prompt-input';
// import styles from '../../../lib/components/prompt-input/styles.css.js';

const renderPromptInput = (promptInputProps: PromptInputProps) => {
  const { container } = render(<PromptInput {...promptInputProps} />);
  return { wrapper: new PromptInputWrapper(container)!, container };
};

describe('value', () => {
  test('can be set', () => {
    const { wrapper } = renderPromptInput({ value: 'value' });
    expect(wrapper.getElement()).toHaveTextContent('value');
  });
  test('can be obtained through getTextareaValue API', () => {
    const { wrapper } = renderPromptInput({ value: 'value' });
    expect(wrapper.getTextareaValue()).toBe('value');
  });
});

describe('action button', () => {
  test('not present if not added to props', () => {
    const { wrapper } = renderPromptInput({ value: '' });
    expect(wrapper.findSubmitButton()).not.toBeInTheDocument();
  });

  test('present when added', () => {
    const { wrapper } = renderPromptInput({ value: '', actionButtonIconName: 'send' });
    expect(wrapper.findSubmitButton().getElement()).toBeInTheDocument();
  });

  test('disabled when in disabled state', () => {
    const { wrapper } = renderPromptInput({ value: '', actionButtonIconName: 'send', disabled: true });
    expect(wrapper.findSubmitButton().getElement()).toHaveAttribute('disabled');
  });

  test('disabled when in read-only state', () => {
    const { wrapper } = renderPromptInput({ value: '', actionButtonIconName: 'send', readOnly: true });
    expect(wrapper.findSubmitButton().getElement()).toHaveAttribute('disabled');
  });
});

describe('events', () => {
  test('fire a change event with correct parameters', () => {
    const onChange = jest.fn();
    const { wrapper } = renderPromptInput({
      value: 'value',
      onChange: event => onChange(event.detail),
    });

    wrapper.setTextareaValue('updated value');

    expect(onChange).toHaveBeenCalledWith({ value: 'updated value' });
  });

  test('fire an action event with correct parameters', () => {
    const onAction = jest.fn();
    const { wrapper } = renderPromptInput({
      value: 'value',
      actionButtonIconName: 'send',
      onAction: event => onAction(event.detail),
    });

    act(() => {
      wrapper.findSubmitButton().click();
    });

    expect(onAction).toHaveBeenCalled();
  });
});

describe('min and max rows', () => {
  test('defaults to 1', () => {
    const { wrapper } = renderPromptInput({ value: '' });
    expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('rows', '1');
  });

  test('updates based on min row property', () => {
    const { wrapper } = renderPromptInput({ value: '', minRows: 4 });
    expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('rows', '4');
  });

  test('does not update based on max row property', () => {
    const { wrapper } = renderPromptInput({ value: '', maxRows: 4 });
    expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('rows', '1');
  });

  test('height updates based on max row property', () => {
    const { wrapper } = renderPromptInput({ value: '', maxRows: 4 });
    expect(wrapper.findNativeTextarea().getElement()).toHaveStyle('height: 4px');
  });
});

describe('a11y', () => {
  test('Valides a11y', async () => {
    const { container } = render(<PromptInput ariaLabel="Prompt input" value="" />);

    await expect(container).toValidateA11y();
  });

  describe('aria-label', () => {
    test('is not added if not defined', () => {
      const { wrapper } = renderPromptInput({ value: '' });
      expect(wrapper.findNativeTextarea().getElement()).not.toHaveAttribute('aria-label');
    });
    test('can be set to custom value', () => {
      const { wrapper } = renderPromptInput({ value: '', ariaLabel: 'my-custom-label' });
      expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('aria-label', 'my-custom-label');
    });
  });

  describe('aria-describedby', () => {
    test('is not added if set to null', () => {
      const { wrapper } = renderPromptInput({ value: '' });
      expect(wrapper.findNativeTextarea().getElement()).not.toHaveAttribute('aria-describedby');
    });
    test('can be set to custom value', () => {
      const { wrapper } = renderPromptInput({ value: '', ariaDescribedby: 'my-custom-id' });
      expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('aria-describedby', 'my-custom-id');
    });
    test('can be customized without controlId', () => {
      const { wrapper } = renderPromptInput({ value: '', id: undefined, ariaDescribedby: 'my-custom-id' });

      expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('aria-describedby', 'my-custom-id');
    });
  });

  describe('aria-labelledby', () => {
    test('is not added if not defined', () => {
      const { wrapper } = renderPromptInput({ value: '' });
      expect(wrapper.findNativeTextarea().getElement()).not.toHaveAttribute('aria-labelledby');
    });
    test('can be set to custom value', () => {
      const { wrapper } = renderPromptInput({ value: '', ariaLabelledby: 'my-custom-id' });
      expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('aria-labelledby', 'my-custom-id');
    });
  });
});
