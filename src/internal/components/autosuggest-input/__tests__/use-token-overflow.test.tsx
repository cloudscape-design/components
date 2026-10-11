// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { useTokenOverflow } from '../../../../../lib/components/internal/components/autosuggest-input/use-token-overflow';

import styles from '../../../../../lib/components/internal/components/autosuggest-input/styles.css.js';

let mockContainerWidth: number | null = null;
jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [mockContainerWidth, () => {}],
}));

interface Geometry {
  container: number | null;
  token: number;
  trigger: number;
  icon: number;
  padding?: number;
  gap?: number;
  inputMinWidth?: string;
}

function setGeometry({ container, token, trigger, icon, padding = 0, gap = 0, inputMinWidth = '0px' }: Geometry) {
  mockContainerWidth = container;
  jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains(styles['measurement-token'])) {
      return token;
    }
    return { trigger, icon }[this.dataset.part as 'trigger' | 'icon'] ?? 0;
  });
  const getComputedStyle = window.getComputedStyle;
  jest.spyOn(window, 'getComputedStyle').mockImplementation(element => {
    const style = getComputedStyle(element);
    const overrides: Record<string, string> = {
      paddingInlineStart: `${padding}px`,
      paddingInlineEnd: `${padding}px`,
      columnGap: `${gap}px`,
      minInlineSize: (element as HTMLElement).dataset.part === 'input' ? inputMinWidth : style.minInlineSize,
    };
    return new Proxy(style, { get: (target, prop: string) => overrides[prop] ?? (target as any)[prop] });
  });
}

afterEach(() => {
  jest.restoreAllMocks();
  mockContainerWidth = null;
});

function Harness({
  tokenCount,
  enabled = true,
  layoutKey = '',
}: {
  tokenCount: number;
  enabled?: boolean;
  layoutKey?: string;
}) {
  const measureRef = React.useRef<HTMLDivElement>(null);
  const measureTriggerRef = React.useRef<HTMLSpanElement>(null);
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const leadingIconRef = React.useRef<HTMLSpanElement>(null);
  const inputWrapperRef = React.useRef<HTMLDivElement>(null);
  const { containerRef, visibleCount } = useTokenOverflow({
    enabled,
    tokenCount,
    tokenContentKey: String(tokenCount),
    measureRef,
    measureTriggerRef,
    fieldRef,
    leadingIconRef,
    inputWrapperRef,
    layoutKey,
  });
  return (
    <div ref={containerRef}>
      <div ref={measureRef}>
        {Array.from({ length: tokenCount }, (_, i) => (
          <span key={i} className={styles['measurement-token']} />
        ))}
        <span ref={measureTriggerRef} data-part="trigger" />
      </div>
      <div ref={fieldRef}>
        <span ref={leadingIconRef} data-part="icon" />
        <div ref={inputWrapperRef} data-part="input" />
      </div>
      <output>{visibleCount}</output>
    </div>
  );
}

const visibleCountFor = (props: { tokenCount: number; enabled?: boolean }) =>
  Number(render(<Harness {...props} />).container.querySelector('output')!.textContent);

describe('useTokenOverflow', () => {
  test('shows all tokens before the container is measured', () => {
    setGeometry({ container: null, token: 100, trigger: 30, icon: 20 });
    expect(visibleCountFor({ tokenCount: 5 })).toBe(5);
  });

  test('shows all tokens when disabled', () => {
    setGeometry({ container: 50, token: 100, trigger: 30, icon: 20 });
    expect(visibleCountFor({ tokenCount: 5, enabled: false })).toBe(5);
  });

  test('shows all tokens when they fit', () => {
    setGeometry({ container: 320, token: 100, trigger: 30, icon: 20 });
    expect(visibleCountFor({ tokenCount: 3 })).toBe(3);
  });

  test('keeps the trailing tokens that fit next to the overflow trigger', () => {
    setGeometry({ container: 260, token: 100, trigger: 30, icon: 20 });
    expect(visibleCountFor({ tokenCount: 5 })).toBe(2);
  });

  test('never shows a partially visible token', () => {
    setGeometry({ container: 249, token: 100, trigger: 30, icon: 20 });
    expect(visibleCountFor({ tokenCount: 5 })).toBe(1);
  });

  test('hides all tokens when none fit next to the trigger', () => {
    setGeometry({ container: 120, token: 100, trigger: 30, icon: 20 });
    expect(visibleCountFor({ tokenCount: 2 })).toBe(0);
  });

  test('accounts for padding and gaps', () => {
    setGeometry({ container: 320, token: 100, trigger: 30, icon: 20, padding: 10, gap: 4 });
    expect(visibleCountFor({ tokenCount: 3 })).toBe(2);
  });

  test('re-measures when the field layout changes', () => {
    setGeometry({ container: 320, token: 100, trigger: 30, icon: 20 });
    const { container, rerender } = render(<Harness tokenCount={3} layoutKey="valid" />);
    expect(container.querySelector('output')).toHaveTextContent('3');
    jest.restoreAllMocks();
    setGeometry({ container: 320, token: 100, trigger: 30, icon: 20, padding: 10 });
    rerender(<Harness tokenCount={3} layoutKey="invalid" />);
    expect(container.querySelector('output')).toHaveTextContent('2');
  });

  test('reserves the input minimum width defined in CSS', () => {
    setGeometry({ container: 399, token: 100, trigger: 30, icon: 0, inputMinWidth: '25%' });
    expect(visibleCountFor({ tokenCount: 3 })).toBe(2);
  });
});
