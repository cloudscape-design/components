// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createRef, forwardRef, useImperativeHandle, useRef } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useVirtualScroll } from '../../../../../lib/components/internal/hooks/virtual-scroll';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

// The tests rely on window.innerHeight=768 (Jest default).

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

interface VirtualListRef {
  scrollToIndex(index: number): void;
}

const VirtualList = forwardRef(
  (
    {
      size = 100,
      defaultItemSize = 20,
      getItemSize = () => 25,
    }: { size?: number; defaultItemSize?: number; getItemSize?: (index: number) => number },
    ref: React.Ref<VirtualListRef>
  ) => {
    const containerRef = useRef<HTMLUListElement>(null);
    const { virtualItems, totalSize, scrollToIndex } = useVirtualScroll({ size, defaultItemSize, containerRef });
    useImperativeHandle(ref, () => ({ scrollToIndex }));
    return (
      <ul ref={containerRef} data-testid="scroll-container">
        <div data-testid="virtual-container" data-height={totalSize} data-options={virtualItems.length} />
        {virtualItems.map(({ index, start, measureRef }, renderedIndex) => (
          <li
            key={index}
            ref={node => {
              if (!node) {
                measureRef(null);
              } else {
                node.getBoundingClientRect = () => ({ height: getItemSize(index) } as unknown as DOMRect);
                measureRef(node);
              }
            }}
            data-testid={`option-${renderedIndex}`}
            data-index={index}
            data-start={start}
          >
            Option {index + 1}
          </li>
        ))}
      </ul>
    );
  }
);

function getFrameSize() {
  return parseInt(screen.getByTestId('virtual-container').dataset.options ?? '');
}

function getOptionIndex(renderedIndex: number) {
  return parseInt(screen.getByTestId(`option-${renderedIndex}`).dataset.index ?? '');
}

describe('useVirtualScroll', () => {
  const OriginalResizeObserver = typeof ResizeObserver !== 'undefined' ? ResizeObserver : (undefined as any);

  let resizeObserverCallback: ResizeObserverCallback = () => {};
  beforeEach(() => {
    global.ResizeObserver = class MockedResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeObserverCallback = callback;
      }
      observe = () => {};
      unobserve = () => {};
      disconnect = () => {};
    };
  });

  afterAll(() => {
    global.ResizeObserver = OriginalResizeObserver;
  });

  test('returns all options when no mocking', () => {
    global.ResizeObserver = OriginalResizeObserver;
    render(<VirtualList getItemSize={() => 0} />);
    expect(getFrameSize()).toBe(100);
  });

  test('adjusts frame size to item sizes and window height', () => {
    const { rerender } = render(<VirtualList defaultItemSize={5} getItemSize={() => 5} />);
    expect(getFrameSize()).toBe(100);

    // Expecting frame size to be 30:
    // (30) * 25 = 750 < 768
    // (31) * 25 = 775 > 768
    rerender(<VirtualList defaultItemSize={25} getItemSize={() => 25} />);
    expect(getFrameSize()).toBe(30);
  });

  test('updates visible frame on scroll', async () => {
    render(<VirtualList defaultItemSize={25} getItemSize={() => 25} />);
    expect(getOptionIndex(0)).toBe(0);

    const frameSize = getFrameSize();

    // Scroll 20 options down
    screen.getByTestId('scroll-container').scrollTop = 500;
    fireEvent(screen.getByTestId('scroll-container'), new CustomEvent('scroll'));

    await waitFor(() => {
      // Frame is moved 15 options down (20 - overscan)
      expect(getOptionIndex(0)).toBe(15);
      // Frame size now includes
      expect(getFrameSize()).toBe(frameSize + 5);
    });
  });

  test('updates sizes on window resize', async () => {
    let itemSize = 30;
    render(<VirtualList defaultItemSize={30} getItemSize={() => itemSize} />);
    const frameSize = getFrameSize();

    itemSize = 15;
    window.dispatchEvent(new UIEvent('resize'));

    await waitFor(() => expect(getFrameSize()).toBe(frameSize * 2));
  });

  test('updates sizes on container resize', async () => {
    let itemSize = 30;
    render(<VirtualList defaultItemSize={30} getItemSize={() => itemSize} />);
    const frameSize = getFrameSize();

    itemSize = 15;
    resizeObserverCallback(
      [{ borderBoxSize: [], contentBoxSize: [{ inlineSize: 50 }] } as unknown as ResizeObserverEntry],
      null as any
    );

    await waitFor(() => expect(getFrameSize()).toBe(frameSize * 2));
  });

  test('scroll to index updates scroll offset when index is before frame start', () => {
    const ref = createRef<VirtualListRef>();
    render(<VirtualList ref={ref} defaultItemSize={25} getItemSize={() => 25} />);

    // Scroll 20 options down
    screen.getByTestId('scroll-container').scrollTop = 500;
    fireEvent(screen.getByTestId('scroll-container'), new CustomEvent('scroll'));

    ref.current!.scrollToIndex(5);
    expect(screen.getByTestId('scroll-container').scrollTop).toBe(5 * 25);
  });

  test('scroll to index updates scroll offset when index is after frame end', () => {
    const ref = createRef<VirtualListRef>();
    render(<VirtualList ref={ref} defaultItemSize={25} getItemSize={() => 25} />);

    ref.current!.scrollToIndex(39);
    expect(screen.getByTestId('scroll-container').scrollTop).toBe(40 * 25);
  });

  test('killswitch warning appears when too many renders are issued over a short time', async () => {
    const { rerender } = render(<VirtualList defaultItemSize={0} getItemSize={() => 0} />);
    for (let i = 0; i < 100; i++) {
      rerender(<VirtualList defaultItemSize={0} getItemSize={() => 0} />);
    }
    await waitFor(() => {
      expect(warnOnce).toHaveBeenCalledWith('virtual-scroll', 'Reached safety counter, check for infinite loops.');
    });
  });
});
