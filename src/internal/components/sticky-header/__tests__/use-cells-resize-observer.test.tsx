// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook } from '../../../../__tests__/render-hook';
import { useCellsResizeObserver } from '../use-cells-resize-observer';

const observers: Array<{ callback: () => void; elements: Set<Element> }> = [];
const OriginalResizeObserver = window.ResizeObserver;

beforeEach(() => {
  observers.length = 0;
  window.ResizeObserver = class {
    private entry: { callback: () => void; elements: Set<Element> };
    constructor(callback: () => void) {
      this.entry = { callback, elements: new Set() };
      observers.push(this.entry);
    }
    observe(element: Element) {
      this.entry.elements.add(element);
    }
    unobserve(element: Element) {
      this.entry.elements.delete(element);
    }
    disconnect() {
      this.entry.elements.clear();
    }
  } as unknown as typeof ResizeObserver;
});

afterEach(() => {
  window.ResizeObserver = OriginalResizeObserver;
});

function resize(element: Element) {
  observers.filter(observer => observer.elements.has(element)).forEach(observer => observer.callback());
}

function renderCells(initialCells: HTMLElement[]) {
  const onResize = jest.fn();
  const { rerender, unmount } = renderHook((cells: HTMLElement[]) => useCellsResizeObserver(() => cells, onResize), {
    initialProps: initialCells,
  });
  return { onResize, rerender, unmount };
}

test('reports a resize of any observed cell', () => {
  const cells = [document.createElement('th'), document.createElement('th')];
  const { onResize } = renderCells(cells);

  resize(cells[1]);

  expect(onResize).toHaveBeenCalledTimes(1);
});

test('reports resizes of a cell that replaced another between renders', () => {
  const first = document.createElement('th');
  const remounted = document.createElement('th');
  const { onResize, rerender } = renderCells([first]);

  rerender([remounted]);
  resize(first);
  expect(onResize).not.toHaveBeenCalled();

  resize(remounted);
  expect(onResize).toHaveBeenCalledTimes(1);
});

test('calls the latest callback', () => {
  const cell = document.createElement('th');
  const first = jest.fn();
  const latest = jest.fn();
  const { rerender } = renderHook((onResize: () => void) => useCellsResizeObserver(() => [cell], onResize), {
    initialProps: first,
  });

  rerender(latest);
  resize(cell);

  expect(first).not.toHaveBeenCalled();
  expect(latest).toHaveBeenCalledTimes(1);
});

test('stops reporting after unmount', () => {
  const cell = document.createElement('th');
  const { onResize, unmount } = renderCells([cell]);

  unmount();
  resize(cell);

  expect(onResize).not.toHaveBeenCalled();
});
