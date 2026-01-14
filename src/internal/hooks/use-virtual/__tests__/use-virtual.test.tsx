// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { render } from '@testing-library/react';

import { useVirtual } from '../index';

jest.mock('../../../vendor/react-virtual', () => ({
  useVirtual: jest.fn(),
}));

import * as reactVirtualModule from '../../../vendor/react-virtual';

const mockUseVirtual = reactVirtualModule.useVirtual as jest.MockedFunction<any>;

interface TestItem {
  id: string;
}

function Test({
  onResult,
  ...options
}: {
  items: TestItem[];
  firstItemSticky?: boolean;
  itemOverlap?: number;
  onResult: (result: ReturnType<typeof useVirtual<TestItem>>) => void;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const result = useVirtual({
    ...options,
    parentRef,
    estimateSize: () => 50,
  });

  onResult(result);

  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      {result.virtualItems.map(item => (
        <div key={item.index} style={{ height: item.size }}>
          Item {item.index}
        </div>
      ))}
    </div>
  );
}

function renderUseVirtual(options: { items: TestItem[]; firstItemSticky?: boolean; itemOverlap?: number }) {
  let hookResult: ReturnType<typeof useVirtual<TestItem>>;
  const { rerender } = render(<Test onResult={r => (hookResult = r)} {...options} />);
  return [
    hookResult!,
    {
      rerender: (newOptions: { items: TestItem[]; firstItemSticky?: boolean; itemOverlap?: number }) =>
        rerender(<Test onResult={r => (hookResult = r)} {...newOptions} />),
    },
  ] as const;
}

describe('useVirtual', () => {
  const mockMeasureRef = jest.fn();
  const mockScrollToIndex = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('computes totalSize with itemOverlap=1', () => {
    // Mock react-virtual to return 3 items with size 50 each, total 150
    mockUseVirtual.mockReturnValue({
      virtualItems: [
        { index: 0, size: 50, start: 0, end: 50, measureRef: mockMeasureRef },
        { index: 1, size: 50, start: 50, end: 100, measureRef: mockMeasureRef },
        { index: 2, size: 50, start: 100, end: 150, measureRef: mockMeasureRef },
      ],
      totalSize: 150,
      scrollToIndex: mockScrollToIndex,
    });

    const [result] = renderUseVirtual({ items: [], itemOverlap: 1 });

    // totalSize = 150 - (maxRenderIndex * itemOverlap) = 150 - ((3-1) * 1) = 148
    expect(result.totalSize).toBe(148);
  });

  test('computes totalSize with itemOverlap=0', () => {
    mockUseVirtual.mockReturnValue({
      virtualItems: [
        { index: 0, size: 50, start: 0, end: 50, measureRef: mockMeasureRef },
        { index: 1, size: 50, start: 50, end: 100, measureRef: mockMeasureRef },
        { index: 2, size: 50, start: 100, end: 150, measureRef: mockMeasureRef },
      ],
      totalSize: 150,
      scrollToIndex: mockScrollToIndex,
    });

    const [result] = renderUseVirtual({ items: [] });

    // totalSize = 150 - (3 items * 0 overlap) = 150
    expect(result.totalSize).toBe(150);
  });

  test('subtracts sticky item size from totalSize', () => {
    mockUseVirtual.mockReturnValue({
      virtualItems: [
        { index: 0, size: 60, start: 0, end: 60, measureRef: mockMeasureRef },
        { index: 1, size: 50, start: 60, end: 110, measureRef: mockMeasureRef },
        { index: 2, size: 50, start: 110, end: 160, measureRef: mockMeasureRef },
      ],
      totalSize: 160,
      scrollToIndex: mockScrollToIndex,
    });

    const [result] = renderUseVirtual({ items: [], firstItemSticky: true, itemOverlap: 1 });

    // totalSize = 160 - (maxRenderIndex * itemOverlap) - firstItemSize = 160 - ((3-1) * 1) - 60 = 98
    expect(result.totalSize).toBe(98);
  });

  test('calculates item positions omitting itemOverlap', () => {
    mockUseVirtual.mockReturnValue({
      virtualItems: [
        { index: 0, size: 50, start: 0, end: 50, measureRef: mockMeasureRef },
        { index: 1, size: 50, start: 50, end: 100, measureRef: mockMeasureRef },
        { index: 2, size: 50, start: 100, end: 150, measureRef: mockMeasureRef },
      ],
      totalSize: 150,
      scrollToIndex: mockScrollToIndex,
    });

    const [result] = renderUseVirtual({ items: [] });

    expect(result.virtualItems[0].start).toBe(0);
    expect(result.virtualItems[1].start).toBe(50);
    expect(result.virtualItems[2].start).toBe(100);
  });

  test('calculates item positions with itemOverlap=1', () => {
    mockUseVirtual.mockReturnValue({
      virtualItems: [
        { index: 0, size: 50, start: 0, end: 50, measureRef: mockMeasureRef },
        { index: 1, size: 50, start: 50, end: 100, measureRef: mockMeasureRef },
        { index: 2, size: 50, start: 100, end: 150, measureRef: mockMeasureRef },
      ],
      totalSize: 150,
      scrollToIndex: mockScrollToIndex,
    });

    const [result] = renderUseVirtual({ items: [], itemOverlap: 1 });

    expect(result.virtualItems[0].start).toBe(0);
    expect(result.virtualItems[1].start).toBe(49);
    expect(result.virtualItems[2].start).toBe(98);
  });

  test('calculates item positions with sticky first item and itemOverlap=0', () => {
    mockUseVirtual.mockReturnValue({
      virtualItems: [
        { index: 0, size: 60, start: 0, end: 60, measureRef: mockMeasureRef },
        { index: 1, size: 50, start: 60, end: 110, measureRef: mockMeasureRef },
        { index: 2, size: 50, start: 110, end: 160, measureRef: mockMeasureRef },
      ],
      totalSize: 160,
      scrollToIndex: mockScrollToIndex,
    });

    const [result] = renderUseVirtual({ items: [], firstItemSticky: true });

    expect(result.virtualItems[0].start).toBe(0);
    // For non-first items with sticky: start - renderIndex * itemOverlap = 60 + 1 - 1*0 = 60
    expect(result.virtualItems[1].start).toBe(60);
    // For non-first items with sticky: start - renderIndex * itemOverlap = 110 + 1 - 2*0 = 110
    expect(result.virtualItems[2].start).toBe(110);
  });

  test('calculates item positions with sticky first item and itemOverlap=1', () => {
    mockUseVirtual.mockReturnValue({
      virtualItems: [
        { index: 0, size: 60, start: 0, end: 60, measureRef: mockMeasureRef },
        { index: 1, size: 50, start: 60, end: 110, measureRef: mockMeasureRef },
        { index: 2, size: 50, start: 110, end: 160, measureRef: mockMeasureRef },
      ],
      totalSize: 160,
      scrollToIndex: mockScrollToIndex,
    });

    const [result] = renderUseVirtual({ items: [], firstItemSticky: true, itemOverlap: 1 });

    // First item (index=0): start - renderIndex * itemOverlap = 0 - 0*1 = 0
    expect(result.virtualItems[0].start).toBe(0);
    // Non-first items with sticky: start - renderIndex * itemOverlap = 60 + 1 - 1*1 = 59
    expect(result.virtualItems[1].start).toBe(59);
    // Non-first items with sticky: start - renderIndex * itemOverlap = 110 - 2*1 = 108
    expect(result.virtualItems[2].start).toBe(108);
  });
});
