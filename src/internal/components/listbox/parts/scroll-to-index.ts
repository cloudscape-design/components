// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export default function ({ index, menuEl }: { index: number; menuEl: HTMLElement }) {
  const item = menuEl.querySelector<HTMLElement>(`[data-mouse-target="${index}"]`);

  if (item) {
    // In edge case dropdown can be very small, scrolling can cause side effect AWSUI-60318
    if (menuEl.clientHeight !== undefined && menuEl.clientHeight > 15) {
      // We only want the menu element to scroll, as scrolling any further parent elements can
      // cause the screen to jump, resulting in a select item being "clicked" while opening the select.
      // Therefore, we scroll manually rather than using `scrollIntoView`.
      const menuRect = menuEl.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const offset = parseInt(menuEl.style.scrollPaddingBlockStart) || 0;
      if (itemRect.top < menuRect.top + offset || itemRect.height > menuRect.height - offset) {
        menuEl.scrollBy({ top: itemRect.top - menuRect.top - offset });
      } else if (itemRect.bottom > menuRect.bottom) {
        menuEl.scrollBy({ top: itemRect.bottom - menuRect.bottom });
      }
    }
  }
}
