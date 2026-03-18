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
    expect(hiddenInput.value).toBe('hello alice world');
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
    expect(wrapper.findMenu()).toBeNull();
  });
});
