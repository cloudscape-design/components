// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { updatePosition } from '../../../../lib/components/table/sticky-scrollbar/use-sticky-scrollbar';

describe('updatePosition', () => {
  it('satisfies istanbul coverage', () => {
    const scrollbarRef = {
      current: document.createElement('div'),
    };
    const scrollbarContentRef = {
      current: document.createElement('div'),
    };
    const tableRef = {
      current: document.createElement('table'),
    };
    tableRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ width: 800 });
    const wrapperRef = {
      current: document.createElement('div'),
    };
    wrapperRef.current.getBoundingClientRect = jest.fn().mockReturnValue({ width: 600 });

    updatePosition(tableRef.current, wrapperRef.current, scrollbarRef.current, scrollbarContentRef.current, false, 30);
    expect(scrollbarRef.current.style.bottom).toBe('30px');
    expect(scrollbarRef.current.style.width).toBe('600px');
    expect(scrollbarContentRef.current.style.width).toBe('800px');
  });
});
