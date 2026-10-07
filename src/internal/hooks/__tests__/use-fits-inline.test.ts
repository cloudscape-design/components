// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { measureConstrainingAncestorWidth } from '../../../../lib/components/internal/hooks/use-fits-inline';

interface FakeAncestor {
  // Content-box width reported via clientWidth (padding is assumed 0 here).
  width: number;
  // When true, the element clips/scrolls (overflow !== visible).
  clips?: boolean;
  // When true, the element's content overflows it (scrollWidth > clientWidth).
  scrolls?: boolean;
}

// Builds a `root` element whose ancestor chain (closest first) has the given geometry. The
// root itself is given a fixed width; the walk compares ancestors against it.
function buildChain(rootWidth: number, ancestors: FakeAncestor[]): HTMLElement {
  const makeEl = ({ width, clips, scrolls }: FakeAncestor) => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'clientWidth', { configurable: true, value: width });
    Object.defineProperty(el, 'scrollWidth', { configurable: true, value: scrolls ? width + 100 : width });
    el.style.overflowX = clips ? 'hidden' : 'visible';
    el.style.overflow = clips ? 'hidden' : 'visible';
    return el;
  };

  const root = document.createElement('div');
  root.getBoundingClientRect = () => ({ width: rootWidth }) as DOMRect;

  let parent = root;
  for (const ancestor of ancestors) {
    const el = makeEl(ancestor);
    el.appendChild(parent);
    parent = el;
  }
  return root;
}

beforeEach(() => {
  // No inline padding, and echo back the element's own overflow styles.
  jest.spyOn(window, 'getComputedStyle').mockImplementation(
    (el: Element) =>
      ({
        paddingLeft: '0px',
        paddingRight: '0px',
        overflowX: (el as HTMLElement).style.overflowX,
        overflow: (el as HTMLElement).style.overflow,
      }) as unknown as CSSStyleDeclaration
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('measureConstrainingAncestorWidth', () => {
  test('returns null when the element has no ancestors', () => {
    const root = document.createElement('div');
    root.getBoundingClientRect = () => ({ width: 600 }) as DOMRect;
    expect(measureConstrainingAncestorWidth(root)).toBeNull();
  });

  test('stops at the first ancestor wider than the content', () => {
    // Immediate parent is wider than the 600px content, so it defines the available width.
    const root = buildChain(600, [{ width: 800 }]);
    expect(measureConstrainingAncestorWidth(root)).toBe(800);
  });

  test('stops at an ancestor that clips, using its narrower width', () => {
    // The parent shrink-wraps to the content (same width, overflow visible) and is skipped;
    // the next ancestor is no wider but clips, so it constrains the content.
    const root = buildChain(600, [{ width: 600 }, { width: 400, clips: true }]);
    expect(measureConstrainingAncestorWidth(root)).toBe(400);
  });

  test('stops at an ancestor the content overflows (scrollWidth > clientWidth)', () => {
    const root = buildChain(600, [{ width: 400, scrolls: true }]);
    expect(measureConstrainingAncestorWidth(root)).toBe(400);
  });

  test('skips shrink-wrapping ancestors until it finds a wider one', () => {
    // Two shrink-wrapping ancestors (same width, no clip/scroll) are skipped to reach the
    // wider one that actually defines the available width.
    const root = buildChain(600, [{ width: 600 }, { width: 600 }, { width: 900 }]);
    expect(measureConstrainingAncestorWidth(root)).toBe(900);
  });
});
