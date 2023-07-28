// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { FocusedCell } from './interfaces';

export function findFocusinCell(event: FocusEvent): null | FocusedCell {
  if (!(event.target instanceof Element)) {
    return null;
  }

  const closestCell = event.target.closest('td,th') as null | HTMLTableCellElement;
  const closestRow = closestCell?.closest('tr');

  if (!closestCell || !closestRow) {
    return null;
  }

  const colIndex = parseInt(closestCell.getAttribute('aria-colindex') ?? '');
  const rowIndex = parseInt(closestRow.getAttribute('aria-rowindex') ?? '');
  if (isNaN(colIndex)) {
    return null;
  }

  return { rowIndex: isNaN(rowIndex) ? 0 : rowIndex, colIndex, cellElement: closestCell, element: event.target };
}
