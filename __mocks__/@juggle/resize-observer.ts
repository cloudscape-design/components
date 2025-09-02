/* eslint-env es6 */
/* eslint-disable header/header */
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const callbackField = Symbol();

const mockObserve = jest.fn(function (this: MockResizeObserver, el: HTMLElement) {
  // JSDOM does not support CSS. This mock allows to set element sizes via inline styles
  // and they will be passed into the handlers
  const { width, height } = el.style;
  const size = { inlineSize: parseInt(width) || 0, blockSize: parseInt(height) || 0 };
  const cb = this[callbackField];
  cb([{ borderBoxSize: [size], contentBoxSize: [size], target: el }], this);
});
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

class MockResizeObserver implements ResizeObserver {
  [callbackField]: (...args: any[]) => void;

  constructor(cb: (...args: any[]) => void) {
    this[callbackField] = cb;
  }

  get observe() {
    return mockObserve;
  }

  get unobserve() {
    return mockUnobserve;
  }

  get disconnect() {
    return mockDisconnect;
  }
}

class MockResizeObserverEntry implements ResizeObserverEntry {
  readonly borderBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly contentBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly contentRect: DOMRectReadOnly;
  readonly target: Element;

  constructor(target: Element) {
    this.target = target;
    const size = { inlineSize: 0, blockSize: 0 };
    this.borderBoxSize = [size];
    this.contentBoxSize = [size];
    this.devicePixelContentBoxSize = [size];
    // Create a simple DOMRectReadOnly mock for JSDOM compatibility
    this.contentRect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      toJSON: () => ({}),
    } as DOMRectReadOnly;
  }
}

export { MockResizeObserver as ResizeObserver };
export { MockResizeObserverEntry as ResizeObserverEntry };
