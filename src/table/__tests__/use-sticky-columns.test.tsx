// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useStickyColumns } from '../use-sticky-columns';
import { TableProps } from '../interfaces';
import { renderHook } from '../../__tests__/render-hook';

describe('useStickyColumns', () => {
  const containerWidth = 500;
  const stickyColumns: TableProps.StickyColumns = { first: 1, last: 1 };

  const tableElement = document.createElement('table');
  tableElement.style.width = '50px';
  tableElement.style.paddingLeft = '10px';

  const defaultProps = {
    containerWidth,
    hasSelection: false,
    isWrapperScrollable: true,
    stickyColumns,
    visibleColumnsLength: 3,
    tableRefObject: {
      current: tableElement,
    },
    wrapperRefObject: { current: document.createElement('div') },
  };

  test('should disable sticky columns if no sticky columns are provided', () => {
    const { result } = renderHook(() => useStickyColumns({ ...defaultProps, stickyColumns: undefined }));

    expect(result.current.shouldDisableStickyColumns).toBe(true);
  });

  test('should disable sticky columns if wrapper is not scrollable', () => {
    const { result } = renderHook(() => useStickyColumns({ ...defaultProps, isWrapperScrollable: false }));

    expect(result.current.shouldDisableStickyColumns).toBe(true);
  });

  test('should return correct sticky column properties', () => {
    const { result } = renderHook(() => useStickyColumns(defaultProps));

    const stickyColumnProperties = result.current.getStickyColumnProperties(0);
    expect(stickyColumnProperties).toEqual({
      isSticky: true,
      isLastStickyLeft: true,
      isLastStickyRight: false,
      stickyStyles: {
        sticky: {},
        stuck: { paddingLeft: '10px' },
      },
    });
  });
});
