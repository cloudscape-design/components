// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render, within } from '@testing-library/react';

import '../../__a11y__/to-validate-a11y';
import { KeyCode } from '../../../lib/components/internal/keycode';
import PromptInput, { PromptInputProps } from '../../../lib/components/prompt-input';
import createWrapper from '../../../lib/components/test-utils/dom';
import PromptInputWrapper from '../../../lib/components/test-utils/dom/prompt-input';

import styles from '../../../lib/components/prompt-input/styles.selectors.js';

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

  test('can be used to select a range', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    const { wrapper } = renderPromptInput({ value: 'Test', ref });
    const textarea = wrapper.findNativeTextarea().getElement();

    // Make sure no text is selected
    textarea.selectionStart = textarea.selectionEnd = 0;
    textarea.blur();
    expect(textarea.selectionStart).toBe(0);
    expect(textarea.selectionEnd).toBe(0);

    // Select all text
    ref.current!.setSelectionRange(1, 3);
    expect(textarea.selectionStart).toBe(1);
    expect(textarea.selectionEnd).toBe(3);
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
    const { wrapper } = renderPromptInput({
      value: '',
      disableBrowserAutocorrect: false,
    });
    const textarea = wrapper.findNativeTextarea().getElement();

    expect(textarea).not.toHaveAttribute('autocorrect');
    expect(textarea).not.toHaveAttribute('autocapitalize');
  });

  test('can disable autocorrect features when set', () => {
    const { wrapper } = renderPromptInput({
      value: '',
      disableBrowserAutocorrect: true,
    });
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
    const { wrapper } = renderPromptInput({
      value: '',
      actionButtonIconName: 'send',
    });
    expect(wrapper.findActionButton().getElement()).toBeInTheDocument();
  });

  test('should not find primary button within secondaryActions', () => {
    const { wrapper } = renderPromptInput({
      value: '',
      minRows: 4,
      secondaryActions: 'secondary actions',
      actionButtonIconName: 'send',
    });

    const secondaryActionsContainer = wrapper.findSecondaryActions()!.getElement();
    const actionButton = within(secondaryActionsContainer).queryByRole('button');

    expect(actionButton).toBeFalsy();
  });

  test('disabled when in disabled state', () => {
    const { wrapper } = renderPromptInput({
      value: '',
      actionButtonIconName: 'send',
      disabled: true,
    });
    expect(wrapper.findActionButton().getElement()).toHaveAttribute('disabled');
  });

  test('adds aria disabled but not disabled attribute when in read-only state', () => {
    const { wrapper } = renderPromptInput({
      value: '',
      actionButtonIconName: 'send',
      readOnly: true,
    });

    expect(wrapper.findActionButton().getElement()).toHaveAttribute('aria-disabled', 'true');
    expect(wrapper.findActionButton().getElement()).not.toHaveAttribute('disabled');
  });
});

describe('custom primary action', () => {
  test('customPrimaryAction can be provided', () => {
    const { wrapper } = renderPromptInput({
      value: '',
      actionButtonIconName: 'send',
      customPrimaryAction: (
        <>
          <button>One</button>
          <button>Two</button>
        </>
      ),
    });
    expect(wrapper.findCustomPrimaryAction()!.getElement().querySelectorAll('button').length).toBe(2);
  });
  test('default primary action is removed if custom primaryAction provided', () => {
    const { wrapper } = renderPromptInput({
      value: '',
      actionButtonIconName: 'send',
      customPrimaryAction: 'custom content',
    });
    expect(wrapper.findActionButton()).toBeFalsy();
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

  test('enter key during IME composition does not submit form', () => {
    const [wrapper, submitSpy] = renderPromptInputInForm({ value: '' });
    wrapper.findNativeTextarea().keydown({ keyCode: KeyCode.enter, isComposing: true });
    expect(submitSpy).not.toHaveBeenCalled();
  });

  test('cancelling key event prevents submission', () => {
    const [wrapper, submitSpy] = renderPromptInputInForm({
      value: '',
      onKeyDown: event => event.preventDefault(),
    });
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

  test('fire an action event on action button click with correct parameters', () => {
    const onAction = jest.fn();
    const { wrapper } = renderPromptInput({
      value: 'value',
      actionButtonIconName: 'send',
      onAction: event => onAction(event.detail),
    });

    wrapper.findActionButton().click();
    expect(onAction).toHaveBeenCalled();
  });

  test('fire an action event on enter keydown with correct parameters', () => {
    const onAction = jest.fn();
    const { wrapper } = renderPromptInput({
      value: 'value',
      actionButtonIconName: 'send',
      onAction: event => onAction(event.detail),
    });

    wrapper.findNativeTextarea().keydown(KeyCode.enter);
    expect(onAction).toHaveBeenCalled();
  });

  test('does not fire an action event on enter keydown if part of IME composition', () => {
    const onAction = jest.fn();
    const { wrapper } = renderPromptInput({
      value: 'value',
      actionButtonIconName: 'send',
      onAction: event => onAction(event.detail),
    });

    wrapper.findNativeTextarea().keydown({ keyCode: KeyCode.enter, isComposing: true });
    expect(onAction).not.toHaveBeenCalled();
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

  test('does not update when max rows is set to -1', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    const { wrapper } = renderPromptInput({ value: '', maxRows: -1, ref });
    expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('rows', '1');
  });
});

describe('secondary actions', () => {
  test('should render correct text in secondary actions slot', () => {
    const { wrapper } = renderPromptInput({
      value: '',
      minRows: 4,
      secondaryActions: 'secondary actions',
    });

    expect(wrapper.findSecondaryActions()?.getElement()).toHaveTextContent('secondary actions');
  });
});

test('clicking the area between secondary actions and action button should focus the component', () => {
  const { wrapper } = renderPromptInput({
    value: '',
    secondaryActions: 'secondary actions',
  });

  wrapper.find(`.${styles.buffer}`)!.click();

  expect(wrapper.findNativeTextarea().getElement()).toHaveFocus();
});

describe('secondary content', () => {
  test('should render correct text in secondary content slot', () => {
    const { wrapper } = renderPromptInput({
      value: '',
      minRows: 4,
      secondaryContent: 'secondary content',
    });

    expect(wrapper.findSecondaryContent()?.getElement()).toHaveTextContent('secondary content');
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
      const { wrapper } = renderPromptInput({
        value: '',
        ariaLabel: 'my-custom-label',
      });
      expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('aria-label', 'my-custom-label');
    });
    test('is added to the region wrapper', () => {
      const { wrapper } = renderPromptInput({
        value: '',
        ariaLabel: 'my-custom-label',
      });
      expect(within(wrapper.getElement()).getByRole('region')).toHaveAttribute('aria-label', 'my-custom-label');
    });
  });

  describe('aria-describedby', () => {
    test('is not added if set to null', () => {
      const { wrapper } = renderPromptInput({ value: '' });
      expect(wrapper.findNativeTextarea().getElement()).not.toHaveAttribute('aria-describedby');
    });
    test('can be set to custom value', () => {
      const { wrapper } = renderPromptInput({
        value: '',
        ariaDescribedby: 'my-custom-id',
      });
      expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('aria-describedby', 'my-custom-id');
    });
    test('can be customized without controlId', () => {
      const { wrapper } = renderPromptInput({
        value: '',
        controlId: undefined,
        ariaDescribedby: 'my-custom-id',
      });

      expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('aria-describedby', 'my-custom-id');
    });
  });

  describe('aria-labelledby', () => {
    test('is not added if not defined', () => {
      const { wrapper } = renderPromptInput({ value: '' });
      expect(wrapper.findNativeTextarea().getElement()).not.toHaveAttribute('aria-labelledby');
    });
    test('can be set to custom value', () => {
      const { wrapper } = renderPromptInput({
        value: '',
        ariaLabelledby: 'my-custom-id',
      });
      expect(wrapper.findNativeTextarea().getElement()).toHaveAttribute('aria-labelledby', 'my-custom-id');
    });
  });
});

describe('native attributes', () => {
  it('adds native attributes', () => {
    const { container } = renderPromptInput({ value: '', nativeTextareaAttributes: { 'data-testid': 'my-test-id' } });
    expect(container.querySelectorAll('[data-testid="my-test-id"]')).toHaveLength(1);
    expect(container.querySelectorAll('textarea[data-testid="my-test-id"]')).toHaveLength(1);
  });
  it('concatenates class names', () => {
    const { container } = renderPromptInput({ value: '', nativeTextareaAttributes: { className: 'additional-class' } });
    const textarea = container.querySelector('textarea')!;
    expect(textarea).toHaveClass(styles.textarea);
    expect(textarea).toHaveClass('additional-class');
  });
});
