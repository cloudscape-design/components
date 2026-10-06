// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import ControlGroup from '../../../../../lib/components/internal/components/control-group';
import { ResetGroupedControlContext } from '../../../../../lib/components/internal/context/control-group-context';
import { DirectionProbe, PositionProbe } from './common';

import styles from '../../../../../lib/components/internal/components/control-group/styles.css.js';

// `requiredRowWidth` comes from `useContainerQuery` (the hidden ghost's content width).
// Mock it so each test controls that width directly; `availableWidth` is driven through
// the stubbed ResizeObserver + ancestor measurement below.
let requiredRowWidth: number | null = null;
jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: jest.fn(),
}));

// jsdom does not lay out, so the ancestor-walk sees zero widths and no ResizeObserver.
// Stub a ResizeObserver that fires once on observe, and give the group a parent whose
// content width is `availableWidth` and whose clientWidth is reported wider than the root
// (so the walk stops at it). The root's own width stays 0 in jsdom, so any positive
// `availableWidth` is "wider than the group" and becomes the available width.
let availableWidth = 1000;
// The most recent observer's callback, so a test can fire it to simulate a resize after
// changing `availableWidth`.
let lastObserverCallback: ResizeObserverCallback | null = null;

class StubResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    lastObserverCallback = callback;
  }
  observe() {
    lastObserverCallback?.([], this as unknown as ResizeObserver);
  }
  unobserve() {}
  disconnect() {}
}

function fireResize() {
  lastObserverCallback?.([], undefined as unknown as ResizeObserver);
}

beforeEach(() => {
  requiredRowWidth = null;
  availableWidth = 1000;
  lastObserverCallback = null;
  (useContainerQuery as jest.Mock).mockImplementation(() => [requiredRowWidth, () => {}]);
  (global as any).ResizeObserver = StubResizeObserver;
  // The ancestor-walk reads the parent's computed padding and clientWidth. Report no
  // padding and a clientWidth equal to `availableWidth`, wider than the root's 0-width box
  // in jsdom, so the walk stops at the immediate parent and uses that width.
  jest.spyOn(window, 'getComputedStyle').mockImplementation(
    () =>
      ({
        paddingLeft: '0px',
        paddingRight: '0px',
        overflowX: 'visible',
        overflow: 'visible',
      }) as unknown as CSSStyleDeclaration
  );
  jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => availableWidth);
});

afterEach(() => {
  jest.restoreAllMocks();
  delete (global as any).ResizeObserver;
});

describe('Control group', () => {
  test('keeps focus on a control when the children are reordered', () => {
    const alpha = <input key="alpha" data-testid="alpha" />;
    const beta = <input key="beta" data-testid="beta" />;

    const { getAllByTestId, rerender } = render(<ControlGroup>{[alpha, beta]}</ControlGroup>);

    // The ghost duplicates the children, so there are two "alpha" nodes; the first is the
    // real (focusable) one, the second is in the inert ghost.
    const alphaInput = getAllByTestId('alpha')[0];
    alphaInput.focus();
    expect(document.activeElement).toBe(alphaInput);

    // Move the focused control from first to last position.
    rerender(<ControlGroup>{[beta, alpha]}</ControlGroup>);

    // The same DOM node is still focused; it was moved, not remounted.
    expect(getAllByTestId('alpha')[0]).toBe(alphaInput);
    expect(document.activeElement).toBe(alphaInput);
  });

  describe('position', () => {
    // The ghost duplicates each child, so every probe matches twice; the first match is
    // the real control, the second is the inert ghost copy.
    test('exposes the "only" position to a single child control', () => {
      const { getAllByTestId } = render(
        <ControlGroup>
          <PositionProbe />
        </ControlGroup>
      );

      expect(getAllByTestId('probe')[0]).toHaveTextContent('only');
    });

    test('exposes first / middle / last positions to each child in order', () => {
      const { getAllByTestId } = render(
        <ControlGroup>
          <PositionProbe testId="a" />
          <PositionProbe testId="b" />
          <PositionProbe testId="c" />
        </ControlGroup>
      );

      expect(getAllByTestId('a')[0]).toHaveTextContent('first');
      expect(getAllByTestId('b')[0]).toHaveTextContent('middle');
      expect(getAllByTestId('c')[0]).toHaveTextContent('last');
    });

    test('resets the grouped position for content wrapped in ResetGroupedControlContext', () => {
      // Mirrors a nested control rendered inside a control's custom slot (e.g.
      // Autosuggest `empty`): it must not inherit the surrounding group position.
      const { getAllByTestId } = render(
        <ControlGroup>
          <ResetGroupedControlContext>
            <PositionProbe />
          </ResetGroupedControlContext>
        </ControlGroup>
      );

      expect(getAllByTestId('probe')[0]).toHaveTextContent('none');
    });
  });

  describe('direction', () => {
    // With the default `direction="auto"` and the jsdom harness (`availableWidth = 1000`,
    // `requiredRowWidth = null`), the measurement falls back and `resolvedDirection` is
    // `'horizontal'`, so the "defaults to horizontal" expectation holds unchanged.
    test('defaults the direction to "horizontal" and exposes it to each child', () => {
      const { getAllByTestId } = render(
        <ControlGroup>
          <DirectionProbe testId="a" />
          <DirectionProbe testId="b" />
        </ControlGroup>
      );

      expect(getAllByTestId('a')[0]).toHaveTextContent('horizontal');
      expect(getAllByTestId('b')[0]).toHaveTextContent('horizontal');
    });

    test('exposes direction="vertical" to each child when the group is vertical', () => {
      const { getAllByTestId } = render(
        <ControlGroup direction="vertical">
          <DirectionProbe testId="a" />
          <DirectionProbe testId="b" />
          <DirectionProbe testId="c" />
        </ControlGroup>
      );

      expect(getAllByTestId('a')[0]).toHaveTextContent('vertical');
      expect(getAllByTestId('b')[0]).toHaveTextContent('vertical');
      expect(getAllByTestId('c')[0]).toHaveTextContent('vertical');
    });

    test('ResetGroupedControlContext preserves the group direction', () => {
      const { getAllByTestId } = render(
        <ControlGroup direction="vertical">
          <ResetGroupedControlContext>
            <DirectionProbe testId="direction" />
          </ResetGroupedControlContext>
        </ControlGroup>
      );

      expect(getAllByTestId('direction')[0]).toHaveTextContent('vertical');
    });
  });
});

describe('Control group responsiveness', () => {
  function renderGroup() {
    return render(
      <ControlGroup>
        <input data-testid="a" />
        <input data-testid="b" />
      </ControlGroup>
    );
  }

  function getRoot(container: HTMLElement) {
    return container.querySelector(`.${styles.root}`)!;
  }

  test('renders the hidden measurement ghost: aria-hidden and inert, horizontal by default', () => {
    requiredRowWidth = 300;
    availableWidth = 1000;
    const { container } = renderGroup();

    const ghost = container.querySelector(`.${styles.ghost}`) as HTMLElement;
    expect(ghost).not.toBeNull();
    expect(ghost).toHaveAttribute('aria-hidden', 'true');
    // `inert` is set imperatively after mount so the duplicated controls are not focusable
    // and not announced (no phantom tab stops).
    expect(ghost.inert).toBe(true);

    // The group fits (available 1000 > required 300), so it resolves to horizontal.
    expect(getRoot(container)).toHaveClass(styles['root-horizontal']);
    expect(getRoot(container)).not.toHaveClass(styles['root-vertical']);
  });

  test('falls back to horizontal while measurements are null', () => {
    // No required width measured yet.
    requiredRowWidth = null;
    availableWidth = 1000;
    const { container } = renderGroup();
    expect(getRoot(container)).toHaveClass(styles['root-horizontal']);
    expect(getRoot(container)).not.toHaveClass(styles['root-vertical']);
  });

  test('stacks (vertical) when the available width is below the required row width', () => {
    requiredRowWidth = 500;
    availableWidth = 200;
    const { container } = renderGroup();
    expect(getRoot(container)).toHaveClass(styles['root-vertical']);
    expect(getRoot(container)).not.toHaveClass(styles['root-horizontal']);
  });

  test('re-expands (horizontal) when the available width grows back above the required width', () => {
    requiredRowWidth = 500;
    availableWidth = 200;
    const { container } = renderGroup();
    expect(getRoot(container)).toHaveClass(styles['root-vertical']);

    // Widen the available space and fire a resize so the ancestor-walk re-runs. This is
    // the deadlock-safe re-expand: the walk re-reads the (now wider) ancestor width.
    availableWidth = 1000;
    act(() => {
      fireResize();
    });
    expect(getRoot(container)).toHaveClass(styles['root-horizontal']);
    expect(getRoot(container)).not.toHaveClass(styles['root-vertical']);
  });

  test('focus reaches only the real controls, not the inert ghost duplicates', () => {
    requiredRowWidth = 300;
    const { container } = renderGroup();
    const ghost = container.querySelector(`.${styles.ghost}`) as HTMLElement;
    // The ghost subtree is inert, so its duplicated inputs are not in the tab order.
    expect(ghost.inert).toBe(true);
    expect(ghost.querySelectorAll('input')).toHaveLength(2);
  });

  test('a forced direction wins and bypasses measurement (no ghost rendered)', () => {
    // Even with a tiny available width and a large required width, a forced horizontal
    // direction stays horizontal and renders no measurement ghost.
    requiredRowWidth = 500;
    availableWidth = 50;
    const { container } = render(
      <ControlGroup direction="horizontal">
        <input data-testid="a" />
        <input data-testid="b" />
      </ControlGroup>
    );
    expect(getRoot(container)).toHaveClass(styles['root-horizontal']);
    expect(getRoot(container)).not.toHaveClass(styles['root-vertical']);
    expect(container.querySelector(`.${styles.ghost}`)).toBeNull();
  });
});
