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

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [800, () => {}],
}));

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
    const { wrapper } = renderPromptInput({ tokens: [], menus, styleClassNames: { root: 'a', textarea: 'b' } });
    expect(wrapper.getElement()).toHaveClass('a');
    expect(wrapper.findContentEditableElement()!.getElement()).toHaveClass('b');
  });

  test('forwards the action button class to the built-in action button root only', () => {
    const { wrapper } = renderPromptInput({ styleClassNames: { actionButton: 'a' } });
    expect(wrapper.findActionButton().getElement()).toHaveClass(buttonStyles.button);
    expect(wrapper.findActionButton().getElement()).toHaveClass('a');

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
  });

  test('does not pass the prop to the DOM', () => {
    const { wrapper } = renderPromptInput({ styleClassNames: { root: 'a' } });
    expect(wrapper.getElement()).not.toHaveAttribute('styleClassNames');
    expect(wrapper.getElement()).not.toHaveAttribute('styleclassnames');
  });

  describe('height adjustment', () => {
    let heights: string[];

    beforeEach(() => {
      heights = [];
      jest.spyOn(window.CSSStyleDeclaration.prototype, 'height', 'set').mockImplementation((value: string) => {
        if (value !== 'auto') {
          heights.push(value);
        }
      });
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      });
    });

    afterEach(() => jest.restoreAllMocks());

    function mockTextElementPadding(padding: string) {
      const originalGetComputedStyle = window.getComputedStyle;
      jest.spyOn(window, 'getComputedStyle').mockImplementation((element: Element, pseudo?: string | null) => {
        const computed = originalGetComputedStyle(element, pseudo);
        const isPadding = (property: string | symbol) => property === 'paddingTop' || property === 'paddingBottom';
        return element.classList.contains('a')
          ? new Proxy(computed, {
              get: (target, property) => (isPadding(property) ? padding : Reflect.get(target, property)),
            })
          : computed;
      });
    }

    describe.each([
      ['textarea mode', {}],
      ['token mode', { tokens: [], menus }],
    ])('%s', (_, modeProps) => {
      const renderElement = (styleClassNames: StyleClassNames) => (
        <PromptInput ariaLabel="Prompt" value="" actionButtonIconName="send" {...modeProps} {...{ styleClassNames }} />
      );

      test.each(['root', 'textarea', 'token', 'actionButton'])('re-measures only when the %s class changes', slot => {
        const { rerender } = render(renderElement({ [slot]: 'a' }));
        const initialCount = heights.length;
        expect(initialCount).toBeGreaterThan(0);

        rerender(renderElement({ [slot]: 'a' }));
        expect(heights).toHaveLength(initialCount);

        rerender(renderElement({ [slot]: 'b' }));
        expect(heights.length).toBeGreaterThan(initialCount);
      });
    });

    test.each([
      [
        'the floor and the maxRows bound in textarea mode',
        { minRows: 1, maxRows: 3 },
        /^min\(max\(.+, calc\(.+ \+ 24px \+ 24px\)\), calc\(3 \* .+ \+ \(24px \+ 24px - 2 \* var\(.+\)\)\)\)$/,
      ],
      [
        'the minRows bound in token mode',
        { tokens: [], menus, minRows: 3, maxRows: -1 },
        /^max\(.+, calc\(3 \* .+ \+ \(24px \+ 24px - 2 \* var\(.+\)\)\)\)$/,
      ],
    ])('adds the computed block padding to %s', (_, props, formula) => {
      mockTextElementPadding('24px');
      renderPromptInput({ ...props, styleClassNames: { textarea: 'a' } });
      expect(heights[heights.length - 1]).toMatch(formula);
    });

    test('falls back to the stock padding when the computed padding is not numeric', () => {
      mockTextElementPadding('');
      renderPromptInput({ tokens: [], menus, minRows: 3, maxRows: -1, styleClassNames: { textarea: 'a' } });
      expect(heights[heights.length - 1]).toMatch(/\((var\(--space-field-vertical[^)]+\)) \+ \1 - 2 \* \1\)\)\)$/);
    });

    test('content-box observer re-measures when padding changes', () => {
      let contentBoxCallback: ResizeObserverCallback | undefined;
      const originalRO = window.ResizeObserver;
      window.ResizeObserver = class {
        private cb: ResizeObserverCallback;
        constructor(cb: ResizeObserverCallback) {
          this.cb = cb;
        }
        observe(_el: Element, opts?: ResizeObserverOptions) {
          if (opts?.box === 'content-box') {
            contentBoxCallback = this.cb;
          }
        }
        unobserve() {}
        disconnect() {}
      } as unknown as typeof ResizeObserver;

      let currentPadding = '10px';
      const originalGetComputedStyle = window.getComputedStyle;
      jest.spyOn(window, 'getComputedStyle').mockImplementation((element: Element, pseudo?: string | null) => {
        const computed = originalGetComputedStyle(element, pseudo);
        const isPadding = (p: string | symbol) => p === 'paddingTop' || p === 'paddingBottom';
        return element.classList.contains('a')
          ? new Proxy(computed, {
              get: (target, property) => (isPadding(property) ? currentPadding : Reflect.get(target, property)),
            })
          : computed;
      });

      renderPromptInput({ styleClassNames: { textarea: 'a' } });
      const beforeCount = heights.length;

      currentPadding = '20px';
      act(() => {
        contentBoxCallback?.([], {} as ResizeObserver);
      });

      expect(heights.length).toBeGreaterThan(beforeCount);
      expect(heights[heights.length - 1]).toContain('20px');

      window.ResizeObserver = originalRO;
    });
  });
});
