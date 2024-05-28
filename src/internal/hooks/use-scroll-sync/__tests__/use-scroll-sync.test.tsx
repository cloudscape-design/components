// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { render, act } from '@testing-library/react';
import { useScrollSync } from '../index';

function Demo() {
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const handleScroll = useScrollSync([ref1, ref2]);

  return (
    <>
      <div data-testid="element1" ref={ref1} onScroll={handleScroll}>
        <div data-testid="element3" />
      </div>
      <div data-testid="element2" ref={ref2} onScroll={handleScroll} />
    </>
  );
}

function scroll(panel: any, scrollLeft: number) {
  act(() => {
    Object.defineProperty(panel, 'scrollLeft', { value: scrollLeft, writable: true });
    panel.dispatchEvent(new Event('scroll'));
  });
}

const timeout = async (duration = 100) => {
  await new Promise(resolve => setTimeout(resolve, duration));
};

describe('Sync scroll util', function () {
  it('initial scrolling position is equal to zero', () => {
    const { getByTestId } = render(<Demo />);
    expect(getByTestId('element1').scrollLeft).toEqual(0);
    expect(getByTestId('element1').scrollLeft).toEqual(0);
  });
  it('scrolling first container also scrolls the second', async () => {
    const { getByTestId } = render(<Demo />);
    scroll(getByTestId('element1'), 10);
    await timeout();
    expect(getByTestId('element2').scrollLeft).toEqual(10);
  });
  it('scrolling second container also scrolls the first', async () => {
    const { getByTestId } = render(<Demo />);
    scroll(getByTestId('element2'), 10);
    await timeout();
    expect(getByTestId('element1').scrollLeft).toEqual(10);
  });
  it('scroll child element should not affect synced element', async () => {
    const { getByTestId } = render(<Demo />);
    scroll(getByTestId('element1'), 30);
    await timeout();
    scroll(getByTestId('element3'), 10);
    await timeout();
    expect(getByTestId('element1').scrollLeft).toEqual(30);
  });
});
