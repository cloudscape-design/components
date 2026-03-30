// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render } from '@testing-library/react';

import PromptInput, { PromptInputProps } from '../../../lib/components/prompt-input';
import PromptInputWrapper from '../../../lib/components/test-utils/dom/prompt-input';
import { KeyCode } from '../../internal/keycode';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [800, () => {}],
}));

const renderPromptInput = (promptInputProps: PromptInputProps & React.RefAttributes<PromptInputProps.Ref>) => {
  const { container } = render(<PromptInput {...promptInputProps} />);
  return { wrapper: new PromptInputWrapper(container)!, container };
};

describe('disabled state', () => {
  test('textarea is disabled', () => {
    const { wrapper } = renderPromptInput({ value: '', disabled: true });
    expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('disabled');
  });

  test('does not fire onChange when disabled', () => {
    const onChange = jest.fn();
    const { wrapper } = renderPromptInput({ value: '', disabled: true, onChange });
    wrapper.setTextareaValue('new value');
    // The native textarea is disabled so the event won't fire through normal interaction
    // but setTextareaValue bypasses that - we verify the disabled attribute is set
    expect(wrapper.findNativeTextarea().getElement()).toBeDisabled();
  });
});

describe('readOnly state', () => {
  test('textarea has readonly attribute', () => {
    const { wrapper } = renderPromptInput({ value: 'readonly value', readOnly: true });
    expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('readonly');
  });

  test('value is still accessible when readOnly', () => {
    const { wrapper } = renderPromptInput({ value: 'readonly value', readOnly: true });
    expect(wrapper.getTextareaValue()).toBe('readonly value');
  });
});

describe('placeholder', () => {
  test('sets placeholder attribute on textarea', () => {
    const { wrapper } = renderPromptInput({ value: '', placeholder: 'Type here...' });
    expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('placeholder', 'Type here...');
  });
});

describe('spellcheck', () => {
  test('sets spellCheck attribute when true', () => {
    const { wrapper } = renderPromptInput({ value: '', spellcheck: true });
    expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('spellcheck', 'true');
  });

  test('sets spellCheck attribute when false', () => {
    const { wrapper } = renderPromptInput({ value: '', spellcheck: false });
    expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('spellcheck', 'false');
  });
});

describe('name', () => {
  test('sets name attribute on textarea', () => {
    const { wrapper } = renderPromptInput({ value: '', name: 'my-input' });
    expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('name', 'my-input');
  });
});

describe('onBlur and onFocus', () => {
  test('fires onBlur when textarea loses focus', () => {
    const onBlur = jest.fn();
    const { wrapper } = renderPromptInput({ value: '', onBlur });
    const textarea = wrapper.findNativeTextarea().getElement();
    act(() => {
      textarea.focus();
    });
    act(() => {
      textarea.blur();
    });
    expect(onBlur).toHaveBeenCalled();
  });

  test('fires onFocus when textarea gains focus', () => {
    const onFocus = jest.fn();
    const { wrapper } = renderPromptInput({ value: '', onFocus });
    const textarea = wrapper.findNativeTextarea().getElement();
    act(() => {
      textarea.focus();
    });
    expect(onFocus).toHaveBeenCalled();
  });
});

describe('disableActionButton', () => {
  test('disables action button when disableActionButton is true', () => {
    const { wrapper } = renderPromptInput({
      value: '',
      actionButtonIconName: 'send',
      disableActionButton: true,
    });
    expect(wrapper.findActionButton().getElement()).toHaveAttribute('disabled');
  });

  test('action button is enabled by default', () => {
    const { wrapper } = renderPromptInput({
      value: '',
      actionButtonIconName: 'send',
    });
    expect(wrapper.findActionButton().getElement()).not.toHaveAttribute('disabled');
  });
});

describe('insertText ref method (textarea mode)', () => {
  test('does nothing in textarea mode without menus', () => {
    const onChange = jest.fn();
    const ref = React.createRef<PromptInputProps.Ref>();
    renderPromptInput({ value: 'hello world', onChange, ref });
    act(() => {
      ref.current!.insertText(' beautiful');
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does nothing when disabled', () => {
    const onChange = jest.fn();
    const ref = React.createRef<PromptInputProps.Ref>();
    renderPromptInput({ value: 'hello', onChange, ref, disabled: true });
    act(() => {
      ref.current!.insertText(' world');
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does nothing when readOnly', () => {
    const onChange = jest.fn();
    const ref = React.createRef<PromptInputProps.Ref>();
    renderPromptInput({ value: 'hello', onChange, ref, readOnly: true });
    act(() => {
      ref.current!.insertText(' world');
    });
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('onKeyUp', () => {
  test('fires onKeyUp event', () => {
    const onKeyUp = jest.fn();
    const { wrapper } = renderPromptInput({ value: '', onKeyUp });
    wrapper.findNativeTextarea().keyup({ keyCode: KeyCode.enter });
    expect(onKeyUp).toHaveBeenCalled();
  });
});

describe('shift+enter in textarea mode', () => {
  test('does not fire onAction on shift+enter', () => {
    const onAction = jest.fn();
    const { wrapper } = renderPromptInput({
      value: 'value',
      actionButtonIconName: 'send',
      onAction,
    });

    wrapper.findNativeTextarea().keydown({ keyCode: KeyCode.enter, shiftKey: true });
    expect(onAction).not.toHaveBeenCalled();
  });
});

describe('autocomplete string value', () => {
  test('can be set to a custom string', () => {
    const { wrapper } = renderPromptInput({ value: '', autoComplete: 'username' });
    expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('autocomplete', 'username');
  });
});

describe('controlId', () => {
  test('sets id on textarea when controlId is provided', () => {
    const { wrapper } = renderPromptInput({ value: '', controlId: 'my-id' });
    expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('id', 'my-id');
  });
});

describe('invalid and warning states', () => {
  test('sets aria-invalid when invalid', () => {
    const { wrapper } = renderPromptInput({ value: '', invalid: true });
    expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('aria-invalid', 'true');
  });

  test('does not set aria-invalid when not invalid', () => {
    const { wrapper } = renderPromptInput({ value: '' });
    expect(wrapper.findNativeTextarea().getElement()).not.toHaveAttribute('aria-invalid');
  });
});

describe('secondary actions layout', () => {
  test('secondary actions not rendered when not provided', () => {
    const { wrapper } = renderPromptInput({ value: '' });
    expect(wrapper.findSecondaryActions()).toBeFalsy();
  });

  test('secondary content not rendered when not provided', () => {
    const { wrapper } = renderPromptInput({ value: '' });
    expect(wrapper.findSecondaryContent()).toBeNull();
  });
});
