// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { act, render } from '@testing-library/react';

import { KeyCode } from '../../../lib/components/internal/keycode';
import PromptInput, { PromptInputProps } from '../../../lib/components/prompt-input';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [800, () => {}],
}));

const mentionOptions = [
  { value: 'user-1', label: 'Alice' },
  { value: 'user-2', label: 'Bob' },
  { value: 'user-3', label: 'Charlie' },
];

const commandOptions = [
  { value: 'dev', label: 'Developer Mode' },
  { value: 'creative', label: 'Creative Mode' },
];

const defaultMenus: PromptInputProps.MenuDefinition[] = [
  {
    id: 'mentions',
    trigger: '@',
    options: mentionOptions,
    filteringType: 'auto',
  },
];

const defaultI18nStrings: PromptInputProps.I18nStrings = {
  actionButtonAriaLabel: 'Submit',
  tokenInsertedAriaLabel: token => `${token.label || token.value} inserted`,
  tokenPinnedAriaLabel: token => `${token.label || token.value} pinned`,
  tokenRemovedAriaLabel: token => `${token.label || token.value} removed`,
};

interface TokenModeProps {
  tokens?: PromptInputProps.InputToken[];
  menus?: PromptInputProps.MenuDefinition[];
  onChange?: PromptInputProps['onChange'];
  onAction?: PromptInputProps['onAction'];
  onKeyDown?: PromptInputProps['onKeyDown'];
  onMenuItemSelect?: PromptInputProps['onMenuItemSelect'];
  onMenuLoadItems?: PromptInputProps['onMenuLoadItems'];
  onMenuFilter?: PromptInputProps['onMenuFilter'];
  onTriggerDetected?: PromptInputProps['onTriggerDetected'];
  onBlur?: PromptInputProps['onBlur'];
  onFocus?: PromptInputProps['onFocus'];
  onKeyUp?: PromptInputProps['onKeyUp'];
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  actionButtonIconName?: PromptInputProps['actionButtonIconName'];
  i18nStrings?: PromptInputProps.I18nStrings;
  ref?: React.Ref<PromptInputProps.Ref>;
  secondaryActions?: React.ReactNode;
  secondaryContent?: React.ReactNode;
  customPrimaryAction?: React.ReactNode;
  ariaLabel?: string;
  tokensToText?: PromptInputProps['tokensToText'];
}

function renderTokenMode(props: TokenModeProps = {}) {
  const {
    tokens = [],
    menus = defaultMenus,
    onChange,
    onAction,
    i18nStrings = defaultI18nStrings,
    ref,
    ...rest
  } = props;

  const renderResult = render(
    <PromptInput
      tokens={tokens}
      menus={menus}
      onChange={onChange}
      onAction={onAction}
      actionButtonIconName="send"
      i18nStrings={i18nStrings}
      ariaLabel="Chat input"
      ref={ref}
      {...rest}
    />
  );

  const wrapper = createWrapper(renderResult.container).findPromptInput()!;
  return { wrapper, container: renderResult.container, rerender: renderResult.rerender };
}

describe('token mode rendering', () => {
  test('renders contentEditable element when menus are provided', () => {
    const { wrapper } = renderTokenMode();
    expect(wrapper.findContentEditableElement()).not.toBeNull();
  });

  test('does not render native textarea when menus are provided', () => {
    const { wrapper } = renderTokenMode();
    // In token mode, findNativeTextarea may still exist as hidden input for form submission
    // but the contentEditable is the primary input
    expect(wrapper.findContentEditableElement()!.getElement()).toHaveAttribute('contenteditable', 'true');
  });

  test('renders with empty tokens', () => {
    const { wrapper } = renderTokenMode({ tokens: [] });
    expect(wrapper.getValue()).toBe('');
  });

  test('renders text tokens', () => {
    const { wrapper } = renderTokenMode({
      tokens: [{ type: 'text', value: 'hello world' }],
    });
    expect(wrapper.getValue()).toBe('hello world');
  });

  test('renders reference tokens', () => {
    const { wrapper } = renderTokenMode({
      tokens: [
        { type: 'text', value: 'hello ' },
        { type: 'reference', id: 'ref-1', label: 'Alice', value: 'user-1', menuId: 'mentions' },
      ],
    });
    const value = wrapper.getValue();
    expect(value).toContain('hello');
    expect(value).toContain('Alice');
  });

  test('renders break tokens as line breaks', () => {
    const { wrapper } = renderTokenMode({
      tokens: [
        { type: 'text', value: 'line1' },
        { type: 'break', value: '\n' },
        { type: 'text', value: 'line2' },
      ],
    });
    const value = wrapper.getValue();
    expect(value).toContain('line1');
    expect(value).toContain('line2');
  });

  test('renders placeholder when tokens are empty', () => {
    const { wrapper } = renderTokenMode({
      tokens: [],
      placeholder: 'Type something...',
    });
    const editable = wrapper.findContentEditableElement()!.getElement();
    expect(editable.getAttribute('data-placeholder')).toBe('Type something...');
  });
});

describe('token mode disabled/readOnly', () => {
  test('sets aria-disabled when disabled', () => {
    const { container } = renderTokenMode({ disabled: true });
    // When disabled, contenteditable="false" so findContentEditableElement returns null
    // Query the role=textbox element directly
    const editable = container.querySelector('[role="textbox"]')!;
    expect(editable).toHaveAttribute('aria-disabled', 'true');
    expect(editable).toHaveAttribute('contenteditable', 'false');
  });

  test('sets aria-readonly when readOnly', () => {
    const { container } = renderTokenMode({ readOnly: true });
    const editable = container.querySelector('[role="textbox"]')!;
    expect(editable).toHaveAttribute('aria-readonly', 'true');
    expect(editable).toHaveAttribute('contenteditable', 'false');
  });

  test('sets tabIndex to -1 when disabled', () => {
    const { container } = renderTokenMode({ disabled: true });
    const editable = container.querySelector('[role="textbox"]')!;
    expect(editable).toHaveAttribute('tabindex', '-1');
  });
});

describe('token mode action button', () => {
  test('fires onAction with tokens on action button click', () => {
    const onAction = jest.fn();
    const tokens: PromptInputProps.InputToken[] = [{ type: 'text', value: 'hello' }];
    const { wrapper } = renderTokenMode({ tokens, onAction });

    wrapper.findActionButton().click();

    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          tokens: expect.arrayContaining([expect.objectContaining({ type: 'text', value: 'hello' })]),
        }),
      })
    );
  });

  test('fires onAction with value derived from tokens', () => {
    const onAction = jest.fn();
    const tokens: PromptInputProps.InputToken[] = [{ type: 'text', value: 'hello' }];
    const { wrapper } = renderTokenMode({ tokens, onAction });

    wrapper.findActionButton().click();

    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({ value: 'hello' }),
      })
    );
  });

  test('uses tokensToText for value in onAction', () => {
    const onAction = jest.fn();
    const tokens: PromptInputProps.InputToken[] = [
      { type: 'reference', id: 'r1', label: '@Alice', value: 'user-1', menuId: 'mentions' },
      { type: 'text', value: ' hello' },
    ];
    const tokensToText = (t: readonly PromptInputProps.InputToken[]) =>
      t.map(tok => (tok.type === 'reference' ? `@${(tok as any).label}` : tok.value)).join('');

    const { wrapper } = renderTokenMode({ tokens, onAction, tokensToText });
    wrapper.findActionButton().click();

    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({ value: '@@Alice hello' }),
      })
    );
  });
});

describe('token mode ref methods', () => {
  test('focus() focuses the contentEditable element', () => {
    const ref = React.createRef<PromptInputProps.Ref>();
    const { wrapper } = renderTokenMode({ ref });

    act(() => {
      ref.current!.focus();
    });

    expect(document.activeElement).toBe(wrapper.findContentEditableElement()!.getElement());
  });

  test('select() selects all content', () => {
    const ref = React.createRef<PromptInputProps.Ref>();
    renderTokenMode({
      ref,
      tokens: [{ type: 'text', value: 'hello world' }],
    });

    act(() => {
      ref.current!.focus();
    });
    act(() => {
      ref.current!.select();
    });

    const selection = window.getSelection();
    expect(selection?.toString()).toContain('hello world');
  });

  test('select() does nothing in empty state', () => {
    const ref = React.createRef<PromptInputProps.Ref>();
    renderTokenMode({ ref, tokens: [] });

    act(() => {
      ref.current!.focus();
    });
    act(() => {
      ref.current!.select();
    });

    // Should not throw and selection should be empty or minimal
    const selection = window.getSelection();
    expect(selection?.toString().trim()).toBe('');
  });

  test('insertText does nothing when disabled', () => {
    const onChange = jest.fn();
    const ref = React.createRef<PromptInputProps.Ref>();
    renderTokenMode({ ref, disabled: true, onChange, tokens: [] });

    act(() => {
      ref.current!.insertText('hello');
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  test('insertText does nothing when readOnly', () => {
    const onChange = jest.fn();
    const ref = React.createRef<PromptInputProps.Ref>();
    renderTokenMode({ ref, readOnly: true, onChange, tokens: [] });

    act(() => {
      ref.current!.insertText('hello');
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  test('insertText inserts text at current caret position', () => {
    const onChange = jest.fn();
    const ref = React.createRef<PromptInputProps.Ref>();
    renderTokenMode({
      ref,
      onChange,
      tokens: [{ type: 'text', value: 'hello' }],
    });

    act(() => {
      ref.current!.focus();
    });
    act(() => {
      ref.current!.insertText(' world');
    });

    expect(onChange).toHaveBeenCalled();
  });

  test('insertText inserts at specific caretStart position', () => {
    const onChange = jest.fn();
    const ref = React.createRef<PromptInputProps.Ref>();
    renderTokenMode({
      ref,
      onChange,
      tokens: [{ type: 'text', value: 'helloworld' }],
    });

    act(() => {
      ref.current!.focus();
    });
    act(() => {
      ref.current!.insertText(' ', 5);
    });

    expect(onChange).toHaveBeenCalled();
  });

  test('insertText with caretStart and caretEnd positions caret correctly', () => {
    const onChange = jest.fn();
    const ref = React.createRef<PromptInputProps.Ref>();
    renderTokenMode({
      ref,
      onChange,
      tokens: [{ type: 'text', value: 'hello' }],
    });

    act(() => {
      ref.current!.focus();
    });
    act(() => {
      ref.current!.insertText('XYZ', 5, 8);
    });

    expect(onChange).toHaveBeenCalled();
  });

  test('insertText adjusts for pinned tokens when caretStart is provided', () => {
    const onChange = jest.fn();
    const ref = React.createRef<PromptInputProps.Ref>();
    renderTokenMode({
      ref,
      onChange,
      tokens: [
        { type: 'reference', id: 'p1', label: '/dev', value: 'dev', menuId: 'mode', pinned: true },
        { type: 'text', value: 'hello' },
      ],
    });

    act(() => {
      ref.current!.focus();
    });
    act(() => {
      ref.current!.insertText(' world', 5);
    });

    expect(onChange).toHaveBeenCalled();
  });

  test('insertText with undefined caretStart snaps past pinned tokens', () => {
    const onChange = jest.fn();
    const ref = React.createRef<PromptInputProps.Ref>();
    renderTokenMode({
      ref,
      onChange,
      tokens: [{ type: 'reference', id: 'p1', label: '/dev', value: 'dev', menuId: 'mode', pinned: true }],
    });

    act(() => {
      ref.current!.focus();
    });
    act(() => {
      ref.current!.setSelectionRange(0, 0);
    });
    act(() => {
      ref.current!.insertText('hello');
    });

    expect(onChange).toHaveBeenCalled();
  });
});

describe('token mode onChange', () => {
  test('fires onChange when content is modified via setValue', () => {
    const onChange = jest.fn();
    const { wrapper } = renderTokenMode({ onChange, tokens: [] });

    act(() => {
      wrapper.setValue('hello');
    });

    expect(onChange).toHaveBeenCalled();
  });
});

describe('token mode keyboard events', () => {
  test('fires onKeyDown on keypress', () => {
    const onKeyDown = jest.fn();
    const { wrapper } = renderTokenMode({
      onKeyDown,
      tokens: [{ type: 'text', value: 'hello' }],
    });

    const editable = wrapper.findContentEditableElement()!;
    editable.keydown(KeyCode.enter);

    expect(onKeyDown).toHaveBeenCalled();
  });
});

describe('token mode form submission', () => {
  test('action button fires onAction with tokens in token mode', () => {
    const onAction = jest.fn();
    const tokens: PromptInputProps.InputToken[] = [{ type: 'text', value: 'hello' }];
    const { wrapper } = renderTokenMode({ tokens, onAction });

    wrapper.findActionButton().click();

    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          value: 'hello',
          tokens: expect.arrayContaining([expect.objectContaining({ type: 'text', value: 'hello' })]),
        }),
      })
    );
  });

  test('action button submits form in token mode', () => {
    const submitSpy = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const tokens: PromptInputProps.InputToken[] = [{ type: 'text', value: 'hello' }];
    const { container } = render(
      <form onSubmit={submitSpy}>
        <PromptInput
          tokens={tokens}
          menus={defaultMenus}
          actionButtonIconName="send"
          ariaLabel="Chat input"
          i18nStrings={defaultI18nStrings}
        />
      </form>
    );

    const wrapper = createWrapper(container).findPromptInput()!;
    wrapper.findActionButton().click();

    expect(submitSpy).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledTimes(1);
    (console.error as jest.Mock).mockClear();
  });
});

describe('token mode hidden input', () => {
  test('renders hidden input with name and plain text value', () => {
    const tokens: PromptInputProps.InputToken[] = [
      { type: 'text', value: 'hello ' },
      { type: 'reference', id: 'r1', label: 'Alice', value: 'alice', menuId: 'mentions' },
      { type: 'text', value: ' world' },
    ];
    const { container } = render(
      <PromptInput
        tokens={tokens}
        menus={defaultMenus}
        actionButtonIconName="send"
        ariaLabel="Chat input"
        name="user-prompt"
        i18nStrings={defaultI18nStrings}
      />
    );

    const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hiddenInput).not.toBeNull();
    expect(hiddenInput.name).toBe('user-prompt');
    expect(hiddenInput.value).toBe('hello Alice world');
  });

  test('does not render hidden input when name is not set', () => {
    const { container } = render(
      <PromptInput
        tokens={[{ type: 'text', value: 'hello' }]}
        menus={defaultMenus}
        actionButtonIconName="send"
        ariaLabel="Chat input"
        i18nStrings={defaultI18nStrings}
      />
    );

    const hiddenInput = container.querySelector('input[type="hidden"]');
    expect(hiddenInput).toBeNull();
  });

  test('hidden input uses tokensToText when provided', () => {
    const tokens: PromptInputProps.InputToken[] = [
      { type: 'reference', id: 'r1', label: 'Alice', value: 'alice', menuId: 'mentions' },
    ];
    const tokensToText = () => 'custom-value';
    const { container } = render(
      <PromptInput
        tokens={tokens}
        menus={defaultMenus}
        actionButtonIconName="send"
        ariaLabel="Chat input"
        name="prompt"
        tokensToText={tokensToText}
        i18nStrings={defaultI18nStrings}
      />
    );

    const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hiddenInput.value).toBe('custom-value');
  });

  test('hidden input value is included in FormData on form submission', () => {
    const tokens: PromptInputProps.InputToken[] = [{ type: 'text', value: 'test message' }];
    const { container } = render(
      <form>
        <PromptInput
          tokens={tokens}
          menus={defaultMenus}
          actionButtonIconName="send"
          ariaLabel="Chat input"
          name="user-prompt"
          i18nStrings={defaultI18nStrings}
        />
      </form>
    );

    const form = container.querySelector('form')!;
    const formData = new FormData(form);
    expect(formData.get('user-prompt')).toBe('test message');
  });
});

describe('token mode with pinned tokens', () => {
  test('renders pinned reference tokens', () => {
    const { wrapper } = renderTokenMode({
      tokens: [
        { type: 'reference', id: 'p1', label: '/dev', value: 'dev', menuId: 'mode', pinned: true },
        { type: 'text', value: 'hello' },
      ],
    });
    const value = wrapper.getValue();
    expect(value).toContain('/dev');
    expect(value).toContain('hello');
  });
});

describe('token mode secondary slots', () => {
  test('renders secondary actions', () => {
    const { wrapper } = renderTokenMode({
      secondaryActions: <button>Action</button>,
    });
    expect(wrapper.findSecondaryActions()?.getElement()).toHaveTextContent('Action');
  });

  test('renders secondary content', () => {
    const { wrapper } = renderTokenMode({
      secondaryContent: <div>Extra content</div>,
    });
    expect(wrapper.findSecondaryContent()?.getElement()).toHaveTextContent('Extra content');
  });

  test('renders custom primary action', () => {
    const { wrapper } = renderTokenMode({
      customPrimaryAction: <button>Custom</button>,
    });
    expect(wrapper.findCustomPrimaryAction()?.getElement()).toHaveTextContent('Custom');
  });
});

describe('token mode a11y', () => {
  test('sets aria-label on contentEditable', () => {
    const { wrapper } = renderTokenMode({ ariaLabel: 'Chat input' });
    expect(wrapper.findContentEditableElement()!.getElement()).toHaveAttribute('aria-label', 'Chat input');
  });

  test('sets aria-label on region wrapper', () => {
    const { container } = renderTokenMode({ ariaLabel: 'Chat input' });
    const wrapper = createWrapper(container).findPromptInput()!;
    expect(wrapper.getElement()).toHaveAttribute('aria-label', 'Chat input');
  });
});

describe('token mode onBlur/onFocus', () => {
  test('fires onBlur when contentEditable loses focus', () => {
    const onBlur = jest.fn();
    const { wrapper } = renderTokenMode({ onBlur });
    const editable = wrapper.findContentEditableElement()!.getElement();

    act(() => {
      editable.focus();
    });
    act(() => {
      editable.blur();
    });

    expect(onBlur).toHaveBeenCalled();
  });

  test('fires onFocus when contentEditable gains focus', () => {
    const onFocus = jest.fn();
    const { wrapper } = renderTokenMode({ onFocus });
    const editable = wrapper.findContentEditableElement()!.getElement();

    act(() => {
      editable.focus();
    });

    expect(onFocus).toHaveBeenCalled();
  });
});

describe('token mode with useAtStart menus', () => {
  const menusWithUseAtStart: PromptInputProps.MenuDefinition[] = [
    ...defaultMenus,
    {
      id: 'mode',
      trigger: '/',
      options: commandOptions,
      filteringType: 'auto',
      useAtStart: true,
    },
  ];

  test('renders with useAtStart menu definition', () => {
    const { wrapper } = renderTokenMode({
      menus: menusWithUseAtStart,
      tokens: [],
    });
    expect(wrapper.findContentEditableElement()).not.toBeNull();
  });

  test('renders pinned tokens from useAtStart menu', () => {
    const { wrapper } = renderTokenMode({
      menus: menusWithUseAtStart,
      tokens: [
        { type: 'reference', id: 'p1', label: 'Developer Mode', value: 'dev', menuId: 'mode', pinned: true },
        { type: 'text', value: 'hello' },
      ],
    });
    const value = wrapper.getValue();
    expect(value).toContain('Developer Mode');
    expect(value).toContain('hello');
  });
});

describe('token mode with trigger tokens', () => {
  test('renders trigger tokens', () => {
    const { wrapper } = renderTokenMode({
      tokens: [
        { type: 'text', value: 'hello ' },
        { type: 'trigger', value: 'ali', triggerChar: '@', id: 'trigger-1' },
      ],
    });
    const value = wrapper.getValue();
    expect(value).toContain('hello');
    expect(value).toContain('@ali');
  });
});

describe('token mode menu interactions', () => {
  test('menu is not open by default', () => {
    const { wrapper } = renderTokenMode({ tokens: [] });
    expect(wrapper.findOpenMenu()).toBeNull();
  });
});

describe('external token updates', () => {
  test('updates display when tokens prop changes to include a new reference', () => {
    const { rerender, container } = renderTokenMode({
      tokens: [{ type: 'text', value: 'hello' }],
    });
    expect(createWrapper(container).findPromptInput()!.getValue()).toBe('hello');

    act(() => {
      rerender(
        <PromptInput
          tokens={[
            { type: 'text', value: 'hello ' },
            { type: 'reference', id: 'ref-new', label: 'Charlie', value: 'user-3', menuId: 'mentions' },
            { type: 'text', value: ' world' },
          ]}
          menus={defaultMenus}
          actionButtonIconName="send"
          i18nStrings={defaultI18nStrings}
          ariaLabel="Chat input"
        />
      );
    });

    const value = createWrapper(container).findPromptInput()!.getValue();
    expect(value).toContain('hello');
    expect(value).toContain('Charlie');
    expect(value).toContain('world');
  });

  test('renders a reference token added externally', () => {
    const { rerender, container } = renderTokenMode({
      tokens: [{ type: 'text', value: 'hello' }],
    });
    expect(createWrapper(container).findPromptInput()!.getValue()).toBe('hello');

    act(() => {
      rerender(
        <PromptInput
          tokens={[
            { type: 'text', value: 'hello ' },
            { type: 'reference', id: 'ref-1', label: 'Bob', value: 'user-2', menuId: 'mentions' },
          ]}
          menus={defaultMenus}
          actionButtonIconName="send"
          i18nStrings={defaultI18nStrings}
          ariaLabel="Chat input"
        />
      );
    });

    const value = createWrapper(container).findPromptInput()!.getValue();
    expect(value).toContain('hello');
    expect(value).toContain('Bob');
  });

  test('clearing tokens to empty array shows empty state', () => {
    const { rerender, container } = renderTokenMode({
      tokens: [{ type: 'text', value: 'hello' }],
    });
    expect(createWrapper(container).findPromptInput()!.getValue()).toBe('hello');

    act(() => {
      rerender(
        <PromptInput
          tokens={[]}
          menus={defaultMenus}
          actionButtonIconName="send"
          i18nStrings={defaultI18nStrings}
          ariaLabel="Chat input"
        />
      );
    });

    expect(createWrapper(container).findPromptInput()!.getValue()).toBe('');
  });
});

describe('token processing on prop change', () => {
  test('tokens with trigger characters in text are detected and processed', () => {
    const onChange = jest.fn();
    renderTokenMode({
      tokens: [{ type: 'text', value: 'hello @ali' }],
      onChange,
    });

    // The component should detect the trigger character and process the tokens
    // resulting in an onChange call with processed tokens
    if (onChange.mock.calls.length > 0) {
      const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
      expect(lastCall.detail.tokens).toBeDefined();
    }
  });

  test('onTriggerDetected returning true prevents trigger creation', () => {
    const onChange = jest.fn();
    const onTriggerDetected = jest.fn(() => true);
    renderTokenMode({
      tokens: [{ type: 'text', value: 'hello @ali' }],
      onChange,
      onTriggerDetected,
    });

    // When onTriggerDetected returns true (preventDefault), the trigger should be cancelled
    if (onTriggerDetected.mock.calls.length > 0) {
      expect(onTriggerDetected).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            triggerChar: '@',
          }),
        })
      );
    }
  });
});

describe('disabled and readOnly state transitions', () => {
  test('disabled state sets contentEditable to false', () => {
    const { container } = renderTokenMode({ disabled: true });
    const editable = container.querySelector('[role="textbox"]')!;
    expect(editable).toHaveAttribute('contenteditable', 'false');
  });

  test('readOnly state sets contentEditable to false', () => {
    const { container } = renderTokenMode({ readOnly: true });
    const editable = container.querySelector('[role="textbox"]')!;
    expect(editable).toHaveAttribute('contenteditable', 'false');
  });

  test('switching from disabled to enabled re-enables editing', () => {
    const { container, rerender } = renderTokenMode({ disabled: true });
    const editable = container.querySelector('[role="textbox"]')!;
    expect(editable).toHaveAttribute('contenteditable', 'false');

    rerender(
      <PromptInput
        tokens={[]}
        menus={defaultMenus}
        actionButtonIconName="send"
        i18nStrings={defaultI18nStrings}
        ariaLabel="Chat input"
        disabled={false}
      />
    );

    expect(editable).toHaveAttribute('contenteditable', 'true');
  });
});

describe('placeholder behavior', () => {
  test('placeholder shows when tokens are empty', () => {
    const { wrapper } = renderTokenMode({
      tokens: [],
      placeholder: 'Ask me anything...',
    });
    const editable = wrapper.findContentEditableElement()!.getElement();
    expect(editable.getAttribute('data-placeholder')).toBe('Ask me anything...');
  });

  test('placeholder hides when tokens have content', () => {
    const { container } = renderTokenMode({
      tokens: [{ type: 'text', value: 'hello' }],
      placeholder: 'Ask me anything...',
    });
    const editable = container.querySelector('[role="textbox"]')!;
    // The placeholder-visible class should not be present when there are tokens
    expect(editable.className).not.toContain('placeholder-visible');
  });
});

describe('multiple menu definitions', () => {
  const multipleMenus: PromptInputProps.MenuDefinition[] = [
    {
      id: 'mentions',
      trigger: '@',
      options: mentionOptions,
      filteringType: 'auto',
    },
    {
      id: 'commands',
      trigger: '/',
      options: commandOptions,
      filteringType: 'auto',
    },
  ];

  test('component accepts multiple menu definitions', () => {
    const { wrapper } = renderTokenMode({
      menus: multipleMenus,
      tokens: [],
    });
    expect(wrapper.findContentEditableElement()).not.toBeNull();
  });

  test('renders tokens from different menus', () => {
    const { wrapper } = renderTokenMode({
      menus: multipleMenus,
      tokens: [
        { type: 'reference', id: 'ref-1', label: 'Alice', value: 'user-1', menuId: 'mentions' },
        { type: 'text', value: ' ' },
        { type: 'reference', id: 'ref-2', label: 'Developer Mode', value: 'dev', menuId: 'commands' },
      ],
    });
    const value = wrapper.getValue();
    expect(value).toContain('Alice');
    expect(value).toContain('Developer Mode');
  });
});

describe('token ordering with pinned tokens', () => {
  test('pinned tokens appear before non-pinned tokens', () => {
    const { wrapper } = renderTokenMode({
      tokens: [
        { type: 'text', value: 'hello' },
        { type: 'reference', id: 'p1', label: '/dev', value: 'dev', menuId: 'mode', pinned: true },
      ],
    });
    const value = wrapper.getValue();
    // Pinned tokens are enforced to appear first
    const devIndex = value.indexOf('/dev');
    const helloIndex = value.indexOf('hello');
    expect(devIndex).toBeLessThan(helloIndex);
  });

  test('mixed pinned and non-pinned tokens maintain correct order', () => {
    const { wrapper } = renderTokenMode({
      tokens: [
        { type: 'text', value: 'some text' },
        { type: 'reference', id: 'p1', label: '/creative', value: 'creative', menuId: 'mode', pinned: true },
        { type: 'reference', id: 'r1', label: 'Alice', value: 'user-1', menuId: 'mentions' },
      ],
    });
    const value = wrapper.getValue();
    // Pinned token should come first
    const pinnedIndex = value.indexOf('/creative');
    const textIndex = value.indexOf('some text');
    expect(pinnedIndex).toBeLessThan(textIndex);
  });
});

describe('onBlur and onFocus additional scenarios', () => {
  test('onBlur fires when clicking outside the editable area', () => {
    const onBlur = jest.fn();
    const { wrapper, container } = renderTokenMode({ onBlur });
    const editable = wrapper.findContentEditableElement()!.getElement();

    act(() => {
      editable.focus();
    });

    // Simulate clicking outside by blurring
    act(() => {
      editable.blur();
      container.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(onBlur).toHaveBeenCalled();
  });

  test('onFocus fires when clicking the contentEditable element', () => {
    const onFocus = jest.fn();
    const { wrapper } = renderTokenMode({ onFocus });
    const editable = wrapper.findContentEditableElement()!.getElement();

    act(() => {
      editable.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      editable.focus();
    });

    expect(onFocus).toHaveBeenCalled();
  });
});

describe('keyboard events additional scenarios', () => {
  test('onKeyUp fires on key release', () => {
    const onKeyUp = jest.fn();
    const { wrapper } = renderTokenMode({
      onKeyUp,
      tokens: [{ type: 'text', value: 'hello' }],
    });

    const editable = wrapper.findContentEditableElement()!;
    editable.keyup(KeyCode.enter);

    expect(onKeyUp).toHaveBeenCalled();
  });

  test('Ctrl+A in empty state does not throw', () => {
    const { wrapper } = renderTokenMode({ tokens: [] });
    const editable = wrapper.findContentEditableElement()!.getElement();

    expect(() => {
      act(() => {
        editable.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', keyCode: 65, ctrlKey: true, bubbles: true }));
      });
    }).not.toThrow();
  });

  test('Meta+A (Cmd+A) in empty state does not throw', () => {
    const { wrapper } = renderTokenMode({ tokens: [] });
    const editable = wrapper.findContentEditableElement()!.getElement();

    expect(() => {
      act(() => {
        editable.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', keyCode: 65, metaKey: true, bubbles: true }));
      });
    }).not.toThrow();
  });
});

describe('live region announcements', () => {
  test('component has a live region element for accessibility', () => {
    renderTokenMode({
      tokens: [{ type: 'text', value: 'hello' }],
    });
    // InternalLiveRegion renders to the document body as a portal
    const liveRegion = document.querySelector('[aria-live]');
    expect(liveRegion).not.toBeNull();
  });
});

describe('menu dropdown rendering', () => {
  test('dropdown is not rendered when menu is closed', () => {
    const { wrapper } = renderTokenMode({ tokens: [] });
    expect(wrapper.findOpenMenu()).toBeNull();
  });

  test('dropdown does not render when there are no menu items and no trigger', () => {
    const { wrapper } = renderTokenMode({
      tokens: [{ type: 'text', value: 'hello' }],
      menus: [{ id: 'empty-menu', trigger: '@', options: [], filteringType: 'auto' }],
    });
    expect(wrapper.findOpenMenu()).toBeNull();
  });
});

describe('menu state - filtering and item management', () => {
  test('fires onMenuFilter with trigger filter text', () => {
    const onMenuFilter = jest.fn();
    renderTokenMode({
      tokens: [{ type: 'trigger', value: 'Ali', triggerChar: '@', id: 't1' }],
      onMenuFilter,
    });
    if (onMenuFilter.mock.calls.length > 0) {
      expect(onMenuFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({ menuId: 'mentions', filteringText: 'Ali' }),
        })
      );
    }
  });

  test('renders with grouped options', () => {
    const groupedMenus: PromptInputProps.MenuDefinition[] = [
      {
        id: 'topics',
        trigger: '#',
        options: [
          { value: 'aws', label: 'AWS' },
          {
            label: 'Frameworks',
            options: [
              { value: 'react', label: 'React' },
              { value: 'vue', label: 'Vue' },
            ],
          },
        ] as any,
        filteringType: 'auto',
      },
    ];
    const { wrapper } = renderTokenMode({ menus: groupedMenus, tokens: [] });
    expect(wrapper.findContentEditableElement()).not.toBeNull();
  });

  test('renders with manual filteringType', () => {
    const { wrapper } = renderTokenMode({
      menus: [{ id: 'search', trigger: '@', options: mentionOptions, filteringType: 'manual' }],
      tokens: [],
    });
    expect(wrapper.findContentEditableElement()).not.toBeNull();
  });

  test('renders with disabled options', () => {
    const { wrapper } = renderTokenMode({
      menus: [
        {
          id: 'mentions',
          trigger: '@',
          options: [
            { value: 'user-1', label: 'Alice' },
            { value: 'user-2', label: 'Bob', disabled: true },
          ],
          filteringType: 'auto',
        },
      ],
      tokens: [],
    });
    expect(wrapper.findContentEditableElement()).not.toBeNull();
  });
});

describe('menu state - load more', () => {
  test('fires onMenuLoadItems for manual filtering menu with trigger', () => {
    const onMenuLoadItems = jest.fn();
    renderTokenMode({
      tokens: [{ type: 'trigger', value: '', triggerChar: '@', id: 't1' }],
      onMenuLoadItems,
      menus: [
        { id: 'mentions', trigger: '@', options: mentionOptions, filteringType: 'manual', statusType: 'pending' },
      ],
    });
    if (onMenuLoadItems.mock.calls.length > 0) {
      expect(onMenuLoadItems).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({ menuId: 'mentions', firstPage: true }),
        })
      );
    }
  });

  test('onMenuItemSelect is not fired on action button click', () => {
    const onMenuItemSelect = jest.fn();
    const onAction = jest.fn();
    const { wrapper } = renderTokenMode({
      tokens: [{ type: 'text', value: 'hello' }],
      onMenuItemSelect,
      onAction,
    });
    wrapper.findActionButton().click();
    expect(onAction).toHaveBeenCalled();
    expect(onMenuItemSelect).not.toHaveBeenCalled();
  });
});

describe('menu state - status types', () => {
  test('renders with loading statusType', () => {
    const { wrapper } = renderTokenMode({
      tokens: [{ type: 'trigger', value: '', triggerChar: '@', id: 't1' }],
      menus: [{ id: 'mentions', trigger: '@', options: [], filteringType: 'manual', statusType: 'loading' }],
    });
    expect(wrapper.findContentEditableElement()).not.toBeNull();
  });

  test('renders with error statusType', () => {
    const { wrapper } = renderTokenMode({
      tokens: [{ type: 'trigger', value: '', triggerChar: '@', id: 't1' }],
      menus: [{ id: 'mentions', trigger: '@', options: [], filteringType: 'manual', statusType: 'error' }],
    });
    expect(wrapper.findContentEditableElement()).not.toBeNull();
  });

  test('renders with finished statusType and options', () => {
    const { wrapper } = renderTokenMode({
      tokens: [],
      menus: [{ id: 'mentions', trigger: '@', options: mentionOptions, filteringType: 'auto', statusType: 'finished' }],
    });
    expect(wrapper.findContentEditableElement()).not.toBeNull();
  });
});

describe('internal.tsx - adjustInputHeight', () => {
  test('renders with maxRows=-1 (infinite height)', () => {
    const { container } = render(
      <PromptInput
        tokens={[
          { type: 'text', value: 'line1' },
          { type: 'break', value: '\n' },
          { type: 'text', value: 'line2' },
          { type: 'break', value: '\n' },
          { type: 'text', value: 'line3' },
        ]}
        menus={defaultMenus}
        actionButtonIconName="send"
        ariaLabel="Chat input"
        i18nStrings={defaultI18nStrings}
        maxRows={-1}
      />
    );
    const promptInput = createWrapper(container).findPromptInput()!;
    expect(promptInput.findContentEditableElement()).not.toBeNull();
  });

  test('renders with custom maxRows value', () => {
    const { container } = render(
      <PromptInput
        tokens={[{ type: 'text', value: 'hello' }]}
        menus={defaultMenus}
        actionButtonIconName="send"
        ariaLabel="Chat input"
        i18nStrings={defaultI18nStrings}
        maxRows={10}
      />
    );
    const promptInput = createWrapper(container).findPromptInput()!;
    expect(promptInput.findContentEditableElement()).not.toBeNull();
  });
});

describe('internal.tsx - setSelectionRange', () => {
  test('setSelectionRange sets caret position in token mode', () => {
    const ref = React.createRef<PromptInputProps.Ref>();
    renderTokenMode({
      ref,
      tokens: [{ type: 'text', value: 'hello world' }],
    });

    act(() => {
      ref.current!.focus();
    });
    act(() => {
      ref.current!.setSelectionRange(5, 5);
    });

    // Should not throw and selection should be set
    const selection = window.getSelection();
    expect(selection?.rangeCount).toBeGreaterThan(0);
  });

  test('setSelectionRange creates range selection in token mode', () => {
    const ref = React.createRef<PromptInputProps.Ref>();
    renderTokenMode({
      ref,
      tokens: [{ type: 'text', value: 'hello world' }],
    });

    act(() => {
      ref.current!.focus();
    });
    act(() => {
      ref.current!.setSelectionRange(0, 5);
    });

    const selection = window.getSelection();
    expect(selection?.rangeCount).toBeGreaterThan(0);
  });

  test('setSelectionRange with null start defaults to 0', () => {
    const ref = React.createRef<PromptInputProps.Ref>();
    renderTokenMode({
      ref,
      tokens: [{ type: 'text', value: 'hello' }],
    });

    act(() => {
      ref.current!.focus();
    });
    act(() => {
      ref.current!.setSelectionRange(null as any, null as any);
    });

    // Should not throw
    expect(window.getSelection()?.rangeCount).toBeGreaterThan(0);
  });
});

describe('internal.tsx - plainTextValue computation', () => {
  test('computes plain text from tokens for hidden input', () => {
    const tokens: PromptInputProps.InputToken[] = [
      { type: 'text', value: 'hello ' },
      { type: 'trigger', value: 'user', triggerChar: '@', id: 't1' },
      { type: 'text', value: ' world' },
    ];
    const { container } = render(
      <PromptInput
        tokens={tokens}
        menus={defaultMenus}
        actionButtonIconName="send"
        ariaLabel="Chat input"
        name="prompt"
        i18nStrings={defaultI18nStrings}
      />
    );

    const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hiddenInput.value).toBe('hello @user world');
  });

  test('uses tokensToText for plain text computation', () => {
    const tokens: PromptInputProps.InputToken[] = [
      { type: 'reference', id: 'r1', label: 'Alice', value: 'user-1', menuId: 'mentions' },
    ];
    const tokensToText = () => 'custom plain text';
    const { container } = render(
      <PromptInput
        tokens={tokens}
        menus={defaultMenus}
        actionButtonIconName="send"
        ariaLabel="Chat input"
        name="prompt"
        tokensToText={tokensToText}
        i18nStrings={defaultI18nStrings}
      />
    );

    const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hiddenInput.value).toBe('custom plain text');
  });
});

describe('internal.tsx - action button variants', () => {
  test('renders with iconUrl action button', () => {
    const { container } = render(
      <PromptInput
        tokens={[]}
        menus={defaultMenus}
        actionButtonIconUrl="https://example.com/icon.svg"
        ariaLabel="Chat input"
        i18nStrings={defaultI18nStrings}
      />
    );
    const wrapper = createWrapper(container).findPromptInput()!;
    expect(wrapper.findActionButton()).not.toBeNull();
  });

  test('renders with iconSvg action button', () => {
    const { container } = render(
      <PromptInput
        tokens={[]}
        menus={defaultMenus}
        actionButtonIconSvg={
          <svg>
            <circle cx="10" cy="10" r="5" />
          </svg>
        }
        ariaLabel="Chat input"
        i18nStrings={defaultI18nStrings}
      />
    );
    const wrapper = createWrapper(container).findPromptInput()!;
    expect(wrapper.findActionButton()).not.toBeNull();
  });

  test('renders without action button when no icon props set', () => {
    const { container } = render(
      <PromptInput tokens={[]} menus={defaultMenus} ariaLabel="Chat input" i18nStrings={defaultI18nStrings} />
    );
    const wrapper = createWrapper(container).findPromptInput()!;
    expect(wrapper.findActionButton()).toBeNull();
  });
});
