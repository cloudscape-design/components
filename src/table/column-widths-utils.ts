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

export function setElementWidths(element: HTMLElement, styles: React.CSSProperties) {
  function setProperty(property: 'width' | 'minWidth' | 'maxWidth') {
    const value = styles[property];
    let widthCssValue = '';
    if (typeof value === 'number') {
      widthCssValue = value + 'px';
    }
    if (typeof value === 'string') {
      widthCssValue = value;
    }
    if (element.style[property] !== widthCssValue) {
      element.style[property] = widthCssValue;
    }
  }
  setProperty('width');
  setProperty('minWidth');
  setProperty('maxWidth');
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
