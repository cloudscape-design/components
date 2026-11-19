// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from 'react';

import bodyCellStyles from './body-cell/styles.css.js';

const stickyCellSelector = `.${bodyCellStyles['sticky-cell']}`;

// The scroll lock timeout value was determined empirically.
// It is small enough to not interfere with sequential user events, and long enough
// to ensure the browser-triggered scroll event occurs.
const scrollLockTimeout = 50;

// The function provides a workaround for a Chrome issue causing unexpected scroll when clicking on interactive elements
// inside sticky table cells.
// When an interactive element (cell editor button, row selector, or a custom interactive button or link) is clicked, it receives
// focus. The browser then tries to ensure the focused element is visible on screen, and it scrolls the element into view as needed.
// In Chrome, this scrolling also occurs when clicking an interactive element inside a sticky cell, despite it being fully visible.
// This causes an unneeded and unexpected scroll of the table wrapper towards the sticky element (on the left or on the right).
//
// Note: If moving focus to an interactive element using the keyboard, the automatic scroll still happens.
// That is because the implemented workaround is not suitable for focusin events due to a difference in events order.
export function usePreventStickyClickScroll(wrapperRefObject: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    if (wrapperRefObject.current) {
      const wrapperEl = wrapperRefObject.current;
      const scrollLock = new ScrollLock();

      // For click events inside sticky cells we capture the table wrapper scroll offset.
      // This is used to reset the browser-enforced scrolling that is to follow.
      // The scroll lock is automatically cleared after a short delay.
      const onClick = (event: Event) => {
        if (
          event.target &&
          event.target instanceof HTMLElement &&
          (event.target.matches(stickyCellSelector) || event.target.closest(stickyCellSelector))
        ) {
          scrollLock.set(wrapperEl.scrollLeft);
        }
      };
      wrapperEl.addEventListener('click', onClick);

      // We cannot prevent the browser-issued scroll events from happening, and cannot cancel the default behavior.
      // Instead, if we detect a scroll event that immediately follows a click inside a sticky cell, we negate the
      // effect of it by resetting the wrapper scroll offset to its previous value.
      const onScroll = () => {
        if (scrollLock.active) {
          wrapperEl.scrollLeft = scrollLock.scrollLeft;
          scrollLock.clear();
        }
      };
      wrapperEl.addEventListener('scroll', onScroll);

      return () => {
        wrapperEl.removeEventListener('click', onClick);
        wrapperEl.removeEventListener('scroll', onScroll);
      };
    }
  }, [wrapperRefObject]);
}

class ScrollLock {
  #timeoutId = setTimeout(() => {}, 0);
  #scrollLeft = 0;
  #active = false;

  public set(scrollLeft: number) {
    if (!this.#active) {
      this.#active = true;
      this.#scrollLeft = scrollLeft;
      this.#timeoutId = setTimeout(() => (this.#active = false), scrollLockTimeout);
    }
  }

  public clear() {
    this.#active = false;
    clearTimeout(this.#timeoutId);
  }

  public get active() {
    return this.#active;
  }

  public get scrollLeft() {
    return this.#scrollLeft;
  }
}
