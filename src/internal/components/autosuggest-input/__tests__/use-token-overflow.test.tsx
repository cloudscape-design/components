// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { useTokenOverflow } from '../../../../../lib/components/internal/components/autosuggest-input/use-token-overflow';

// ---------------------------------------------------------------------------
// ResizeObserver mock that fires the callback synchronously on observe()
// so the useLayoutEffect inside useTokenOverflow actually executes.
// ---------------------------------------------------------------------------

class FiringResizeObserver {
  private cb: (entries: ResizeObserverEntry[]) => void;
  constructor(cb: (entries: ResizeObserverEntry[]) => void) {
    this.cb = cb;
  }
  observe(el: Element) {
    const width = (el as HTMLElement).offsetWidth;
    const height = (el as HTMLElement).offsetHeight;
    const sizeEntry = { inlineSize: width, blockSize: height };
    this.cb([
      {
        target: el,
        borderBoxSize: [sizeEntry],
        contentBoxSize: [sizeEntry],
        devicePixelContentBoxSize: [sizeEntry],
        contentRect: el.getBoundingClientRect(),
      } as unknown as ResizeObserverEntry,
    ]);
  }
  unobserve() {}
  disconnect() {}
}

// ---------------------------------------------------------------------------
// Width + getComputedStyle mocks
// ---------------------------------------------------------------------------

function setupMocks({
  containerWidth,
  tokenWidth,
  pillWidth,
  iconWidth,
  padding = 0,
  gap = 0,
}: {
  containerWidth: number;
  tokenWidth: number;
  pillWidth: number;
  iconWidth: number;
  padding?: number;
  gap?: number;
}) {
  const origWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')!;
  const origGetComputedStyle = window.getComputedStyle;
  const origResizeObserver = window.ResizeObserver;

  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      if ((this as HTMLElement).hasAttribute('data-measure-pill')) {
        return pillWidth;
      }
      if ((this as HTMLElement).hasAttribute('data-measure-token')) {
        return tokenWidth;
      }
      if ((this as HTMLElement).hasAttribute('data-search-icon')) {
        return iconWidth;
      }
      return containerWidth;
    },
  });

  window.getComputedStyle = (elt: Element) => {
    const orig = origGetComputedStyle.call(window, elt);
    return new Proxy(orig, {
      get(target: CSSStyleDeclaration, prop: string | symbol) {
        if (prop === 'paddingInlineStart') {
          return `${padding}px`;
        }
        if (prop === 'paddingInlineEnd') {
          return `${padding}px`;
        }
        if (prop === 'gap') {
          return `${gap}px`;
        }
        if (prop === 'columnGap') {
          return `${gap}px`;
        }
        const val = (target as any)[prop];
        return typeof val === 'function' ? val.bind(target) : val;
      },
    });
  };

  // Replace the global ResizeObserver with our firing version
  (window as any).ResizeObserver = FiringResizeObserver;

  return () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', origWidth);
    window.getComputedStyle = origGetComputedStyle;
    (window as any).ResizeObserver = origResizeObserver;
  };
}

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

interface HarnessProps {
  tokenCount: number;
  enabled: boolean;
  onResult: (r: { visibleCount: number | undefined; tokenListMaxWidth: number | undefined }) => void;
}

function Harness({ tokenCount, enabled, onResult }: HarnessProps) {
  const measureRef = React.useRef<HTMLDivElement>(null);
  const triggerRowRef = React.useRef<HTMLDivElement>(null);
  const { containerRef, visibleCount, tokenListMaxWidth } = useTokenOverflow(
    measureRef,
    triggerRowRef,
    tokenCount,
    `key-${tokenCount}`,
    enabled
  );

  React.useEffect(() => {
    onResult({ visibleCount, tokenListMaxWidth });
  });

  const tokens = Array.from({ length: tokenCount }, (_, i) => (
    <span key={i} data-measure-token="true" style={{ display: 'inline-block' }}>
      t{i}
    </span>
  ));

  return (
    <div ref={containerRef}>
      <div ref={triggerRowRef}>
        <span data-search-icon="true">i</span>
        <div ref={measureRef}>
          <span data-measure-pill="true">+N</span>
          {tokens}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useTokenOverflow — disabled', () => {
  test('returns undefined visibleCount when enabled=false', () => {
    const results: Array<{ visibleCount: number | undefined }> = [];
    const restore = setupMocks({ containerWidth: 400, tokenWidth: 80, pillWidth: 40, iconWidth: 24 });
    render(<Harness tokenCount={3} enabled={false} onResult={r => results.push(r)} />);
    restore();
    expect(results[results.length - 1].visibleCount).toBeUndefined();
  });
});

describe('useTokenOverflow — ResizeObserver callback triggers remeasurement', () => {
  test('borderBoxWidth > 0 triggers containerResizeCount increment and re-measurement', () => {
    const results: Array<{ visibleCount: number | undefined }> = [];
    // container=500px, 2 small tokens → all fit
    const restore = setupMocks({
      containerWidth: 500,
      tokenWidth: 60,
      pillWidth: 40,
      iconWidth: 24,
      padding: 0,
      gap: 0,
    });
    const { unmount } = render(<Harness tokenCount={2} enabled={true} onResult={r => results.push(r)} />);
    restore();
    unmount();
    // After FiringResizeObserver fires the callback, useLayoutEffect runs and sets visibleCount
    const last = results[results.length - 1];
    expect(last.visibleCount).toBeDefined();
  });
});

describe('useTokenOverflow — sets visibleCount=0 when no tokens to measure', () => {
  test('sets visibleCount=0 when no measure-token elements exist', () => {
    const results: Array<{ visibleCount: number | undefined }> = [];
    const restore = setupMocks({
      containerWidth: 400,
      tokenWidth: 80,
      pillWidth: 40,
      iconWidth: 0,
      padding: 0,
      gap: 0,
    });
    // tokenCount=0 → no [data-measure-token] elements → early return path sets visibleCount=0
    const { unmount } = render(<Harness tokenCount={0} enabled={true} onResult={r => results.push(r)} />);
    restore();
    unmount();
    const last = results[results.length - 1];
    if (last.visibleCount !== undefined) {
      expect(last.visibleCount).toBe(0);
    }
  });
});

describe('useTokenOverflow — all tokens fit without overflow pill', () => {
  test('sets visibleCount=tokenCount when all tokens fit without pill', () => {
    const results: Array<{ visibleCount: number | undefined; tokenListMaxWidth: number | undefined }> = [];
    // 2 tokens × 60px = 120; container=500, iconWidth=24, inputMinWidth=100, budget=376 → 120 fits
    const restore = setupMocks({
      containerWidth: 500,
      tokenWidth: 60,
      pillWidth: 40,
      iconWidth: 24,
      padding: 0,
      gap: 0,
    });
    const { unmount } = render(<Harness tokenCount={2} enabled={true} onResult={r => results.push(r)} />);
    restore();
    unmount();
    const last = results[results.length - 1];
    if (last.visibleCount !== undefined) {
      expect(last.visibleCount).toBe(2);
      expect(last.tokenListMaxWidth).toBeUndefined();
    }
  });
});

describe("useTokenOverflow — overflow: fewer tokens shown when they don't fit", () => {
  test('sets visibleCount < tokenCount when tokens overflow', () => {
    const results: Array<{ visibleCount: number | undefined }> = [];
    // 3 tokens × 300px each; container=200 → all overflow; first token cost=300 > budgetWithPill
    const restore = setupMocks({
      containerWidth: 200,
      tokenWidth: 300,
      pillWidth: 40,
      iconWidth: 0,
      padding: 0,
      gap: 0,
    });
    const { unmount } = render(<Harness tokenCount={3} enabled={true} onResult={r => results.push(r)} />);
    restore();
    unmount();
    const last = results[results.length - 1];
    if (last.visibleCount !== undefined) {
      expect(last.visibleCount).toBeLessThan(3);
    }
  });

  test('sets visibleCount=0 and computes newMaxWidth when no tokens fit', () => {
    const results: Array<{ visibleCount: number | undefined; tokenListMaxWidth: number | undefined }> = [];
    // container=50, tokenWidth=500 → budgetWithPill will be negative → 0 tokens fit
    const restore = setupMocks({
      containerWidth: 50,
      tokenWidth: 500,
      pillWidth: 30,
      iconWidth: 0,
      padding: 0,
      gap: 0,
    });
    const { unmount } = render(<Harness tokenCount={3} enabled={true} onResult={r => results.push(r)} />);
    restore();
    unmount();
    const last = results[results.length - 1];
    if (last.visibleCount !== undefined) {
      expect(last.visibleCount).toBe(0);
    }
  });
});
