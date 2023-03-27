// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook } from '../../__tests__/render-hook';
import { getScrollableParent, isScrollable, useStableScrollPosition } from '../body-cell/use-stable-scroll-position';

const TestComponent = () => {
  const activeElementRef = React.useRef<HTMLTableCellElement>(null);
  const { storeScrollPosition, restoreScrollPosition } = useStableScrollPosition(activeElementRef);

  return (
    <>
      <div
        style={{
          overflowX: 'scroll',
          width: 200,
          height: 200,
        }}
        data-testid="scrollableParent"
      >
        <table style={{ width: 1000, height: 2000 }}>
          <tbody>
            <tr>
              <td ref={activeElementRef} data-testid="activeElement" tabIndex={0}>
                TEST
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button onClick={storeScrollPosition}>store</button>
      <button onClick={restoreScrollPosition}>restore</button>
    </>
  );
};

describe('useStableScrollPosition', () => {
  beforeEach(() => {
    document.body.scrollLeft = 0;
    document.body.scrollTop = 0;
  });

  it('does not scroll if active element is not set', () => {
    const emptyRef = React.createRef<HTMLTableCellElement>();
    const { result } = renderHook(() => useStableScrollPosition(emptyRef));
    document.body.scrollLeft = 100;
    document.body.scrollTop = 200;
    result.current.storeScrollPosition();
    document.body.scrollLeft = 0;
    document.body.scrollTop = 0;
    result.current.restoreScrollPosition();
    expect(document.body.scrollLeft).toBe(0);
    expect(document.body.scrollTop).toBe(0);
  });

  it('works with nearest scrollable parent', () => {
    const { getByTestId } = render(<TestComponent />);

    const parentElement = getByTestId('scrollableParent');

    parentElement.scrollLeft = 10;
    parentElement.scrollTop = 20;

    screen.getByText(/\bstore/i).click();
    expect(parentElement.scrollLeft).toBe(10);
    expect(parentElement.scrollTop).toBe(20);

    parentElement.scrollLeft = 30;
    parentElement.scrollTop = 40;
    screen.getByText(/\brestore/i).click();

    waitFor(() => {
      expect(parentElement.scrollLeft).toBe(10);
      expect(parentElement.scrollTop).toBe(20);
    });
  });
});

describe('isScrollable', () => {
  it('returns true if element is scrollable', () => {
    const { getByTestId } = render(<TestComponent />);
    const scrollableParent = getByTestId('scrollableParent');
    // necessary because jsdom doesn't actually render the scroll behavior
    Object.defineProperty(scrollableParent, 'clientWidth', { value: 100 });
    Object.defineProperty(scrollableParent, 'scrollWidth', { value: 1000 });
    expect(isScrollable(scrollableParent)).toBe(true);
  });

  it('returns false if element is not scrollable', () => {
    const { getByTestId } = render(<TestComponent />);
    const activeElement = getByTestId('activeElement');
    expect(isScrollable(activeElement)).toBe(false); // non-overflowing element

    const scrollableParent = getByTestId('scrollableParent');
    Object.defineProperty(scrollableParent, 'clientWidth', { value: 100 });
    Object.defineProperty(scrollableParent, 'scrollWidth', { value: 1000 });
    scrollableParent.style.overflowX = 'hidden';
    expect(isScrollable(scrollableParent)).toBe(false); // overflowing but hidden (so not scrollable)
  });
});

describe('getScrollableParent', () => {
  it('returns the scrollable parent', () => {
    const { getByTestId } = render(<TestComponent />);
    const activeElement = getByTestId('activeElement');
    const scrollableParent = getByTestId('scrollableParent');
    Object.defineProperty(scrollableParent, 'clientWidth', { value: 100 });
    Object.defineProperty(scrollableParent, 'scrollWidth', { value: 1000 });
    expect(getScrollableParent(activeElement)).toBe(scrollableParent);
  });

  it('returns the body if no scrollable parent is found', () => {
    const { getByTestId } = render(<TestComponent />);
    const activeElement = getByTestId('activeElement');
    const scrollableParent = getByTestId('scrollableParent');
    Object.defineProperty(scrollableParent, 'clientWidth', { value: 100 });
    Object.defineProperty(scrollableParent, 'scrollWidth', { value: 100 });
    expect(getScrollableParent(activeElement)).toBe(document.body);
  });

  it('returns the body if called with null', () => {
    expect(getScrollableParent(null)).toBe(document.body);
  });
});
