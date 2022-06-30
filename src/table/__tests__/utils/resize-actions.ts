// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act } from '@testing-library/react';
import { ElementWrapper } from '../../../../lib/components/test-utils/dom';

export function fireMousedown(wrapper: ElementWrapper, button = 0) {
  act(() => {
    wrapper.fireEvent(new MouseEvent('mousedown', { button, bubbles: true }));
  });
}

function createMouseEvent(name: string, pageX: number) {
  const event = new MouseEvent(name, { bubbles: true });
  // pageX is not supported in JSDOM
  // https://github.com/jsdom/jsdom/issues/1911
  Object.defineProperty(event, 'pageX', { value: pageX });
  return event;
}

export function fireMouseMove(pageX: number) {
  act(() => {
    document.body.dispatchEvent(createMouseEvent('mousemove', pageX));
  });
}

export function fireMouseup(pageX: number) {
  act(() => {
    document.body.dispatchEvent(createMouseEvent('mouseup', pageX));
  });
}

// simulate DOMRect using inline styles
export function fakeBoundingClientRect(this: HTMLElement): DOMRect {
  const width = parseInt(this.style.width, 10);
  const rect = HTMLElement.prototype.getBoundingClientRect.call(this);
  return {
    ...rect,
    width: width,
    right: rect.left + width,
  };
}
