// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { render } from '@testing-library/react';
import { getResizerElements, getHeaderWidth } from '../../../../lib/components/table/resizer/resizer-lookup';
import tableStyles from '../../../../lib/components/table/styles.css.js';
import resizerStyles from '../../../../lib/components/table/resizer/styles.css.js';
import React from 'react';

jest.mock('../../../../lib/components/internal/utils/scrollable-containers', () => ({
  getOverflowParents: jest.fn(() => {
    const overflowParent = document.querySelector('[data-testid="scroll-parent"]')!;
    return [overflowParent];
  }),
}));

test('getHeaderWidth returns header bounding rect width', () => {
  const header = document.createElement('th');
  const originalGetBoundingClientRect = header.getBoundingClientRect;
  header.getBoundingClientRect = () => ({ ...originalGetBoundingClientRect.apply(header), width: 100 });
  const resizer = document.createElement('span');
  header.append(resizer);

  expect(getHeaderWidth(resizer)).toBe(100);
});

test('getHeaderWidth returns 0 when no header provided', () => {
  expect(getHeaderWidth(null)).toBe(0);
});

test('getHeaderWidth returns 0 when no header found', () => {
  const resizer = document.createElement('span');
  expect(getHeaderWidth(resizer)).toBe(0);
});

test('getResizerElements returns elements required for resizer computations', () => {
  const { container } = render(
    <div className={tableStyles.root}>
      <table>
        <th>
          <span data-testid="resizer" />
        </th>
      </table>
      <div data-testid="tracker" className={resizerStyles.tracker} />
      <div data-testid="scroll-parent" />
    </div>
  );

  const elements = getResizerElements(container.querySelector('[data-testid="resizer"]')!);
  expect(elements?.header).toBe(document.querySelector('th')!);
  expect(elements?.table).toBe(document.querySelector('table')!);
  expect(elements?.tracker).toBe(document.querySelector('[data-testid="tracker"]')!);
  expect(elements?.scrollParent).toBe(document.querySelector('[data-testid="scroll-parent"]')!);
});

test('getResizerElements return null when no resizer', () => {
  expect(getResizerElements(null)).toBe(null);
});

test('getResizerElements return null when no header', () => {
  const { container } = render(
    <div className={tableStyles.root}>
      <table>
        <td>
          <span data-testid="resizer" />
        </td>
      </table>
      <div data-testid="tracker" className={resizerStyles.tracker} />
      <div data-testid="scroll-parent" />
    </div>
  );
  expect(getResizerElements(container.querySelector('[data-testid="resizer"]')!)).toBe(null);
});

test('getResizerElements return null when no table root', () => {
  const { container } = render(
    <div>
      <table>
        <th>
          <span data-testid="resizer" />
        </th>
      </table>
      <div data-testid="tracker" className={resizerStyles.tracker} />
      <div data-testid="scroll-parent" />
    </div>
  );
  expect(getResizerElements(container.querySelector('[data-testid="resizer"]')!)).toBe(null);
});

test('getResizerElements return null when no table', () => {
  const { container } = render(
    <div className={tableStyles.root}>
      <div>
        <th>
          <span data-testid="resizer" />
        </th>
      </div>
      <div data-testid="tracker" className={resizerStyles.tracker} />
      <div data-testid="scroll-parent" />
    </div>
  );
  expect(getResizerElements(container.querySelector('[data-testid="resizer"]')!)).toBe(null);
});

test('getResizerElements return null when no tracker', () => {
  const { container } = render(
    <div className={tableStyles.root}>
      <table>
        <th>
          <span data-testid="resizer" />
        </th>
      </table>
      <div data-testid="scroll-parent" />
    </div>
  );
  expect(getResizerElements(container.querySelector('[data-testid="resizer"]')!)).toBe(null);
});

test('getResizerElements return null when no overflow parent', () => {
  const { container } = render(
    <div className={tableStyles.root}>
      <table>
        <th>
          <span data-testid="resizer" />
        </th>
      </table>
      <div data-testid="tracker" className={resizerStyles.tracker} />
    </div>
  );
  expect(getResizerElements(container.querySelector('[data-testid="resizer"]')!)).toBe(null);
});
