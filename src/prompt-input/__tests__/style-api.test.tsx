// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, render } from '@testing-library/react';

import PromptInput, { PromptInputProps } from '../../../lib/components/prompt-input';
import { StyleClassNames } from '../../../lib/components/prompt-input/internal';
import createWrapper from '../../../lib/components/test-utils/dom';

import buttonStyles from '../../../lib/components/button/styles.css.js';
import dropdownStyles from '../../../lib/components/dropdown/styles.css.js';
import tokenStyles from '../../../lib/components/token/styles.css.js';

jest.mock('../../../lib/components/internal/utils/react-version', () => ({
  getReactMajorVersion: () => 18,
}));

const menus: PromptInputProps.MenuDefinition[] = [
  { id: 'mentions', trigger: '@', options: [{ value: 'user-1', label: 'Alice' }], filteringType: 'auto' },
];

function renderPromptInput(props: Partial<PromptInputProps> & { styleClassNames?: StyleClassNames } = {}) {
  const { container } = render(<PromptInput ariaLabel="Prompt" value="" actionButtonIconName="send" {...props} />);
  return { container, wrapper: createWrapper(container).findPromptInput()! };
}

function StatefulTokenMode({
  innerRef,
  ...props
}: Partial<PromptInputProps> & { styleClassNames?: StyleClassNames; innerRef: React.Ref<PromptInputProps.Ref> }) {
  const [tokens, setTokens] = useState<readonly PromptInputProps.InputToken[]>([]);
  return (
    <PromptInput
      ariaLabel="Prompt"
      menus={menus}
      {...props}
      tokens={tokens}
      onChange={({ detail }) => setTokens(detail.tokens ?? [])}
      ref={innerRef}
    />
  );
}

describe('PromptInput Style API v2', () => {
  test('applies the root and textarea classes in textarea mode', () => {
    const { wrapper } = renderPromptInput({ styleClassNames: { root: 'a', textarea: 'b' } });
    expect(wrapper.getElement()).toHaveClass('a');
    expect(wrapper.findNativeTextarea().getElement()).toHaveClass('b');
    expect(wrapper.findNativeTextarea().getElement()).not.toHaveClass('a');
  });

  test('applies the textarea class to the editable element in token mode', () => {
    const { wrapper, container } = renderPromptInput({
      tokens: [],
      menus,
      styleClassNames: { root: 'a', textarea: 'b' },
    });
    expect(wrapper.getElement()).toHaveClass('a');
    expect(wrapper.findContentEditableElement()!.getElement()).toHaveClass('b');
    expect(container.querySelectorAll('.b')).toHaveLength(1);
  });

  test('forwards the action button class to the built-in action button root only', () => {
    const { wrapper, container: builtIn } = renderPromptInput({ styleClassNames: { actionButton: 'a' } });
    expect(wrapper.findActionButton().getElement()).toHaveClass(buttonStyles.button);
    expect(wrapper.findActionButton().getElement()).toHaveClass('a');
    expect(builtIn.querySelectorAll('.a')).toHaveLength(1);

    const { container } = renderPromptInput({
      customPrimaryAction: <button>Custom</button>,
      styleClassNames: { actionButton: 'a' },
    });
    expect(container.querySelector('.a')).toBeNull();
  });

  test('forwards the token class to every inline reference token', () => {
    const { container } = renderPromptInput({
      menus,
      tokens: [
        { type: 'reference', id: 'r1', label: 'Alice', value: 'user-1', menuId: 'mentions' },
        { type: 'text', value: ' and ' },
        { type: 'reference', id: 'r2', label: 'Bob', value: 'user-2', menuId: 'mentions' },
      ],
      styleClassNames: { token: 'a' },
    });
    const tokenRoots = container.querySelectorAll(`.${tokenStyles['token-box-inline']}`);
    expect(tokenRoots).toHaveLength(2);
    for (const tokenRoot of Array.from(tokenRoots)) {
      expect(tokenRoot).toHaveClass('a');
    }
  });

  test('forwards the menu class to the dropdown container of an open menu', () => {
    const ref = React.createRef<PromptInputProps.Ref>();
    const { container } = render(<StatefulTokenMode innerRef={ref} styleClassNames={{ menu: 'a' }} />);
    const wrapper = createWrapper(container).findPromptInput()!;
    expect(document.querySelector('.a')).toBeNull();
    act(() => {
      ref.current!.focus();
    });
    act(() => {
      ref.current!.insertText('@', 0, 1);
    });
    expect(wrapper.isMenuOpen()).toBe(true);
    const panel = createWrapper().findByClassName(dropdownStyles['dropdown-content-wrapper'])!.getElement();
    expect(panel).toHaveClass('a');
    expect(document.querySelectorAll('.a')).toHaveLength(1);
  });

  test('does not pass the prop to the DOM', () => {
    const { wrapper } = renderPromptInput({ styleClassNames: { root: 'a' } });
    expect(wrapper.getElement()).not.toHaveAttribute('styleClassNames');
    expect(wrapper.getElement()).not.toHaveAttribute('styleclassnames');
  });
});
