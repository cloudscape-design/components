// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { TableProps } from './interfaces';

export function checkColumnWidths(columnDefinitions: ReadonlyArray<TableProps.ColumnDefinition<any>>) {
  for (const column of columnDefinitions) {
    checkProperty(column, 'minWidth');
    checkProperty(column, 'width');
  }
}

export function setElementWidth(
  element: undefined | HTMLElement,
  property: 'width' | 'minWidth' | 'maxWidth',
  width: undefined | number | string
) {
  let widthCssValue = '';
  if (typeof width === 'number') {
    widthCssValue = width + 'px';
  }
  if (typeof width === 'string') {
    widthCssValue = width;
  }
  if (element && element.style[property] !== widthCssValue) {
    element.style[property] = widthCssValue;
  }
}

function checkProperty(column: TableProps.ColumnDefinition<any>, name: 'width' | 'minWidth') {
  const value = column[name];
  if (typeof value !== 'number' && typeof value !== 'undefined') {
    warnOnce(
      'Table',
      `resizableColumns feature requires ${name} property to be a number, got ${value}. The component may work incorrectly.`
    );
  }
}
