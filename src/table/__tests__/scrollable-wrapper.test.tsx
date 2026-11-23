// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, screen } from '@testing-library/react';

import Table from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

import tableStyles from '../../../lib/components/table/styles.css.js';

interface Item {
  id: number;
}

// Records observed elements so tests can emulate size changes of specific elements.
class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  private elements = new Set<Element>();

  constructor(private callback: ResizeObserverCallback) {
    FakeResizeObserver.instances.push(this);
  }

  observe(element: Element) {
    this.elements.add(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  static resize(element: Element, inlineSize: number) {
    const size = [{ inlineSize, blockSize: 0 }];
    const entry = { target: element, contentBoxSize: size, borderBoxSize: size } as unknown as ResizeObserverEntry;
    act(() => {
      for (const observer of FakeResizeObserver.instances) {
        if (observer.elements.has(element)) {
          observer.callback([entry], observer as unknown as ResizeObserver);
        }
      }
    });
  }
}

const originalResizeObserver = window.ResizeObserver;

beforeEach(() => {
  FakeResizeObserver.instances = [];
  window.ResizeObserver = FakeResizeObserver as unknown as typeof ResizeObserver;
});

afterEach(() => {
  window.ResizeObserver = originalResizeObserver;
});

function renderTable() {
  const cell = jest.fn((item: Item) => item.id);
  const { container } = render(
    <Table<Item>
      resizableColumns={true}
      columnDefinitions={[{ id: 'id', header: 'Id', cell, width: 150 }]}
      items={[{ id: 1 }, { id: 2 }, { id: 3 }]}
      ariaLabels={{ tableLabel: 'Items' }}
    />
  );
  const wrapper = createWrapper(container).findTable()!;
  const measure = wrapper.findByClassName(tableStyles['wrapper-content-measure'])!.getElement();
  const table = wrapper.find('table')!.getElement();
  return {
    cell,
    resizeContainer: (width: number) => FakeResizeObserver.resize(measure, width),
    resizeTable: (width: number) => FakeResizeObserver.resize(table, width),
  };
}

const findScrollableRegion = () => screen.queryByRole('region', { name: 'Items' });

test('makes the table wrapper a focusable region only when the table is wider than its container', () => {
  const { resizeContainer, resizeTable } = renderTable();
  resizeContainer(400);
  resizeTable(400);
  expect(findScrollableRegion()).toBeNull();

  resizeTable(500);
  expect(findScrollableRegion()).toHaveAttribute('tabindex', '0');

  resizeContainer(600);
  expect(findScrollableRegion()).toBeNull();
});

test('does not re-render body cells when the table width changes without changing scrollability', () => {
  const { cell, resizeContainer, resizeTable } = renderTable();
  resizeContainer(400);
  resizeTable(500);
  expect(findScrollableRegion()).not.toBeNull();

  const renderCount = cell.mock.calls.length;
  // Resizing a column changes the table width on every pointer move.
  for (let width = 501; width <= 520; width++) {
    resizeTable(width);
  }
  expect(cell).toHaveBeenCalledTimes(renderCount);
  expect(findScrollableRegion()).not.toBeNull();
});
