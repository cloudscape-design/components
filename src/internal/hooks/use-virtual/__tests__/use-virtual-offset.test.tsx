// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import { render } from '@testing-library/react';

import { useVirtual } from '../index';

// Mock the vendor react-virtual to avoid ES module issues
jest.mock('../../../vendor/react-virtual', () => ({
  useVirtual: jest.fn(),
}));

import * as reactVirtualModule from '../../../vendor/react-virtual';

const mockUseVirtual = reactVirtualModule.useVirtual as jest.MockedFunction<any>;

interface TestItem {
  id: string;
}

const TestComponent = ({
  items,
  firstItemSticky,
  itemOverlap,
  onResult,
}: {
  items: TestItem[];
  firstItemSticky?: boolean;
  itemOverlap?: number;
  onResult: (result: ReturnType<typeof useVirtual<TestItem>>) => void;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const result = useVirtual({
    items,
    parentRef,
    estimateSize: () => 50,
    firstItemSticky,
    itemOverlap,
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
};

describe('useVirtual', () => {
  const mockMeasureRef = jest.fn();
  const mockScrollToIndex = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('adjusts totalSize with itemOverlap', () => {
    const items: TestItem[] = [{ id: '1' }, { id: '2' }, { id: '3' }];

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

    let capturedResult: ReturnType<typeof useVirtual<TestItem>> | null = null;
    render(<TestComponent items={items} itemOverlap={1} onResult={result => (capturedResult = result)} />);

    expect(capturedResult).not.toBeNull();
    // totalSize = 150 - (3 items * 1 overlap) = 147
    expect(capturedResult!.totalSize).toBe(147);
  });

  test('adjusts totalSize with no itemOverlap', () => {
    const items: TestItem[] = [{ id: '1' }, { id: '2' }];

    mockUseVirtual.mockReturnValue({
      virtualItems: [
        { index: 0, size: 50, start: 0, end: 50, measureRef: mockMeasureRef },
        { index: 1, size: 50, start: 50, end: 100, measureRef: mockMeasureRef },
        { index: 2, size: 50, start: 100, end: 150, measureRef: mockMeasureRef },
      ],
      totalSize: 150,
      scrollToIndex: mockScrollToIndex,
    });

    let capturedResult: ReturnType<typeof useVirtual<TestItem>> | null = null;
    render(<TestComponent items={items} onResult={result => (capturedResult = result)} />);

    expect(capturedResult).not.toBeNull();
    // totalSize = 150 - (3 items * 0 overlap) = 150
    expect(capturedResult!.totalSize).toBe(150);
  });

  test('adjusts totalSize differently with firstItemSticky', () => {
    const items: TestItem[] = [{ id: '1' }, { id: '2' }, { id: '3' }];

    mockUseVirtual.mockReturnValue({
      virtualItems: [
        { index: 0, size: 60, start: 0, end: 60, measureRef: mockMeasureRef },
        { index: 1, size: 50, start: 60, end: 110, measureRef: mockMeasureRef },
        { index: 2, size: 50, start: 110, end: 160, measureRef: mockMeasureRef },
      ],
      totalSize: 160,
      scrollToIndex: mockScrollToIndex,
    });

    let capturedResult: ReturnType<typeof useVirtual<TestItem>> | null = null;
    render(
      <TestComponent
        items={items}
        firstItemSticky={true}
        itemOverlap={1}
        onResult={result => (capturedResult = result)}
      />
    );

    expect(capturedResult).not.toBeNull();
    // totalSize = 160 - (3 items * 1 overlap) - 60 (firstItemSize) + 2 = 99
    expect(capturedResult!.totalSize).toBe(99);
  });
});
