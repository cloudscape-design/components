// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import { KeyCode } from '../../../lib/components/internal/keycode';
import PromptInput, { PromptInputProps } from '../../../lib/components/prompt-input';
import createWrapper from '../../../lib/components/test-utils/dom';
import PromptInputWrapper from '../../../lib/components/test-utils/dom/prompt-input';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [800, () => {}],
}));

const renderPromptInput = (promptInputProps: PromptInputProps & React.RefAttributes<HTMLTextAreaElement>) => {
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

describe('ref', () => {
  test('can be used to focus the component', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    const { wrapper } = renderPromptInput({ value: '', ref });
    expect(document.activeElement).not.toBe(wrapper.findNativeTextarea().getElement());
    ref.current?.focus();
    expect(document.activeElement).toBe(wrapper.findNativeTextarea().getElement());
  });

  test('can be used to select all text', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    const { wrapper } = renderPromptInput({ value: 'Test', ref });
    const textarea = wrapper.findNativeTextarea().getElement();

    // Make sure no text is selected
    textarea.selectionStart = textarea.selectionEnd = 0;
    textarea.blur();
    expect(textarea.selectionStart).toBe(0);
    expect(textarea.selectionEnd).toBe(0);

    // Select all text
    ref.current!.select();
    expect(textarea.selectionStart).toBe(0);
    expect(textarea.selectionEnd).toBe(4);
  });
});

describe('disableBrowserAutocorrect', () => {
  test('does not modify autocorrect features by default', () => {
    const { wrapper } = renderPromptInput({ value: '' });
    const textarea = wrapper.findNativeTextarea().getElement();
    expect(textarea).not.toHaveAttribute('autocorrect');
    expect(textarea).not.toHaveAttribute('autocapitalize');
  });

  test('does not modify autocorrect features when falsy', () => {
    const { wrapper } = renderPromptInput({ value: '', disableBrowserAutocorrect: false });
    const textarea = wrapper.findNativeTextarea().getElement();

    expect(textarea).not.toHaveAttribute('autocorrect');
    expect(textarea).not.toHaveAttribute('autocapitalize');
  });

  test('can disable autocorrect features when set', () => {
    const { wrapper } = renderPromptInput({ value: '', disableBrowserAutocorrect: true });
    const textarea = wrapper.findNativeTextarea().getElement();

    expect(textarea).toHaveAttribute('autocorrect', 'off');
    expect(textarea).toHaveAttribute('autocapitalize', 'off');
  });
});

describe('autocomplete', () => {
  test('is disabled by default', () => {
    const { wrapper } = renderPromptInput({ value: '' });
    const textarea = wrapper.findNativeTextarea().getElement();
    expect(textarea).toHaveAttribute('autocomplete', 'off');
  });

  test('can be enabled', () => {
    const { wrapper } = renderPromptInput({ value: '', autoComplete: true });
    const textarea = wrapper.findNativeTextarea().getElement();

    expect(textarea).toHaveAttribute('autocomplete', 'on');
  });
});

describe('action button', () => {
  test('not present if not added to props', () => {
    const { wrapper } = renderPromptInput({ value: '' });
    expect(wrapper.findActionButton()).not.toBeInTheDocument();
  });

  test('present when added', () => {
    const { wrapper } = renderPromptInput({ value: '', actionButtonIconName: 'send' });
    expect(wrapper.findActionButton().getElement()).toBeInTheDocument();
  });

  test('disabled when in disabled state', () => {
    const { wrapper } = renderPromptInput({ value: '', actionButtonIconName: 'send', disabled: true });
    expect(wrapper.findActionButton().getElement()).toHaveAttribute('disabled');
  });

  test('disabled when in read-only state', () => {
    const { wrapper } = renderPromptInput({ value: '', actionButtonIconName: 'send', readOnly: true });
    expect(wrapper.findActionButton().getElement()).toHaveAttribute('disabled');
  });
});

describe('prompt input in form', () => {
  function renderPromptInputInForm(props: PromptInputProps = { value: '', actionButtonIconName: 'send' }) {
    const submitSpy = jest.fn();
    const renderResult = render(
      <form onSubmit={submitSpy}>
        <PromptInput {...props} />
      </form>
    );
    const promptInputWrapper = createWrapper(renderResult.container).findPromptInput()!;
    return [promptInputWrapper, submitSpy] as const;
  }

  beforeEach(() => {
    // JSDOM prints an error message to browser logs when form attempted to submit
    // https://github.com/jsdom/jsdom/issues/1937
    // We use it as an assertion
    jest.spyOn(console, 'error').mockImplementation(() => {
      /*do not print anything to browser logs*/
    });
  });

  afterEach(() => {
    expect(console.error).not.toHaveBeenCalled();
  });

  test('should submit the form when clicking the action button', () => {
    const [wrapper, submitSpy] = renderPromptInputInForm();
    wrapper.findActionButton().click();
    expect(submitSpy).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Error',
        message: 'Not implemented: HTMLFormElement.prototype.requestSubmit',
      })
    );
    (console.error as jest.Mock).mockClear();
  });

  test('enter key submits form', () => {
    const [wrapper, submitSpy] = renderPromptInputInForm({ value: '' });
    wrapper.findNativeTextarea().keydown(KeyCode.enter);
    expect(submitSpy).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Error',
        message: 'Not implemented: HTMLFormElement.prototype.requestSubmit',
      })
    );
    (console.error as jest.Mock).mockClear();
  });

  test('cancelling key event prevents submission', () => {
    const [wrapper, submitSpy] = renderPromptInputInForm({ value: '', onKeyDown: event => event.preventDefault() });
    wrapper.findNativeTextarea().keydown(KeyCode.enter);
    expect(submitSpy).not.toHaveBeenCalled();
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
      wrapper.findActionButton().click();
    });

    expect(onAction).toHaveBeenCalled();
  });

  test('fire keydown event', () => {
    const onKeyDown = jest.fn();
    const { wrapper } = renderPromptInput({
      value: 'value',
      actionButtonIconName: 'send',
      onKeyDown: event => onKeyDown(event.detail),
    });

    act(() => {
      wrapper.findNativeTextarea().keydown(KeyCode.enter);
    });

    expect(onKeyDown).toHaveBeenCalled();
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
      const { wrapper } = renderPromptInput({ value: '', controlId: undefined, ariaDescribedby: 'my-custom-id' });

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
