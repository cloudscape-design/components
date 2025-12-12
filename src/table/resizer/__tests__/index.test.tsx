// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { Resizer } from '../../../../lib/components/table/resizer';
import * as resizerLookup from '../../../../lib/components/table/resizer/resizer-lookup';
import InternalDragHandleWrapper from '../../../../lib/components/test-utils/dom/internal/drag-handle';

function findDragHandle() {
  return new InternalDragHandleWrapper(document.body);
}

describe('Resizer component', () => {
  const mockOnWidthUpdate = jest.fn();
  const mockOnWidthUpdateCommit = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('resizeColumn handles null getResizerElements', () => {
    jest.spyOn(resizerLookup, 'getResizerElements').mockReturnValue(null);

    const { container } = render(
      <table>
        <thead>
          <tr>
            <th>
              <Resizer
                onWidthUpdate={mockOnWidthUpdate}
                onWidthUpdateCommit={mockOnWidthUpdateCommit}
                minWidth={80}
                isBorderless={false}
              />
            </th>
          </tr>
        </thead>
      </table>
    );

    const resizerButton = container.querySelector('button');

    fireEvent.pointerDown(resizerButton!, { button: 0 });
    // pointerMove calls resizeColumn internally
    fireEvent.pointerMove(document, { clientX: 200 });
    // pointerUp also calls resizeColumn
    fireEvent.pointerUp(document, { clientX: 200 });

    // If resizeColumn didn't return early, it would call updateColumnWidth -> onWidthUpdate)
    expect(mockOnWidthUpdate).not.toHaveBeenCalled();
  });

  test('onDirectionClick handles null getResizerElements', () => {
    jest.spyOn(resizerLookup, 'getResizerElements').mockReturnValue(null);

    const { container } = render(
      <table>
        <thead>
          <tr>
            <th>
              <Resizer
                onWidthUpdate={mockOnWidthUpdate}
                onWidthUpdateCommit={mockOnWidthUpdateCommit}
                minWidth={80}
                isBorderless={false}
              />
            </th>
          </tr>
        </thead>
      </table>
    );

    const resizerButton = container.querySelector('button');
    fireEvent.click(resizerButton!);

    const dragHandle = findDragHandle();
    fireEvent.click(dragHandle.findVisibleDirectionButtonInlineStart()!.getElement());
    fireEvent.click(dragHandle.findVisibleDirectionButtonInlineEnd()!.getElement());

    // Callbacks are not called when getResizerElements returns null (updateColumnWidth -> onWidthUpdate)
    expect(mockOnWidthUpdate).not.toHaveBeenCalled();
    expect(mockOnWidthUpdateCommit).not.toHaveBeenCalled();
  });
});
