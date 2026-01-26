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

function renderUseVirtual(options: { items: TestItem[]; firstItemSticky?: boolean }) {
  let hookResult: ReturnType<typeof useVirtual<TestItem>>;
  const { rerender } = render(<Test onResult={r => (hookResult = r)} {...options} />);
  return [
    hookResult!,
    {
      rerender: (newOptions: { items: TestItem[]; firstItemSticky?: boolean }) =>
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

  test('computes totalSize', () => {
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

    const [result] = renderUseVirtual({ items: [], firstItemSticky: true });

    // totalSize = 160 - firstItemSize = 160 - 60 = 100
    expect(result.totalSize).toBe(100);
  });
});
