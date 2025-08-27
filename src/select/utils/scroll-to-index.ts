// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export default function ({ index, menuEl }: { index: number; menuEl: HTMLElement }) {
  const item = menuEl.querySelector<HTMLElement>(`[data-mouse-target="${index}"]`);

  if (item) {
    // In edge case dropdown can be very small, scrolling can cause side effect AWSUI-60318
    if (menuEl.clientHeight !== undefined && menuEl.clientHeight > 15) {
      /* istanbul ignore next: clientHeight always returns 0 in JSDOM, the line is covered by integ tests */
      const menuRect = menuEl.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const offset = parseInt(menuEl.style.scrollPaddingBlockStart) || 0;
      if (itemRect.top < menuRect.top + offset) {
        console.log('scroll up', itemRect.top, menuRect.top);
        menuEl.scrollBy({ top: itemRect.top - menuRect.top - offset });
      } else if (itemRect.bottom > menuRect.bottom) {
        if (itemRect.height > menuRect.height) {
          console.log('scroll down partial', itemRect.bottom, menuRect.bottom, itemRect.height, menuRect.height);
        } else {
          console.log('scroll down', itemRect.bottom, menuRect.bottom);
          menuEl.scrollBy({ top: itemRect.bottom - menuRect.bottom });
        }
      }
    }
  }
}
