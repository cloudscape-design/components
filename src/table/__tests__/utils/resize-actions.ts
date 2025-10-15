// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act } from '@testing-library/react';

import { PointerEventMock } from '../../../../lib/components/internal/utils/pointer-events-mock';
import { ElementWrapper } from '../../../../lib/components/test-utils/dom';

beforeAll(() => {
  (window as any).PointerEvent ??= PointerEventMock;
});

export function firePointerdown(wrapper: ElementWrapper, button = 0) {
  act(() => {
    wrapper.fireEvent(new PointerEvent('pointerdown', { pointerType: 'mouse', button, bubbles: true }));
  });
}

export function firePointermove(pageX: number) {
  act(() => {
    document.body.dispatchEvent(createPointerEvent('pointermove', pageX));
  });
}

export function firePointerup(pageX: number) {
  act(() => {
    document.body.dispatchEvent(createPointerEvent('pointerup', pageX));
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

function createPointerEvent(name: string, pageX: number) {
  const event = new PointerEvent(name, { pointerType: 'mouse', bubbles: true });
  // pageX is not supported in JSDOM
  // https://github.com/jsdom/jsdom/issues/1911
  Object.defineProperty(event, 'pageX', { value: pageX });
  return event;
}
