// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { scrollElementIntoView } from '../../internal/utils/scrollable-containers';

export default function ({ index, menuEl }: { index: number; menuEl: HTMLElement }) {
  const stickyItem = menuEl.querySelector<HTMLElement>(`[data-mouse-target="0"]`);
  const item = menuEl.querySelector<HTMLElement>(`[data-mouse-target="${index}"]`);

  if (stickyItem) {
    menuEl.style.scrollPaddingBlockStart = stickyItem.clientHeight + 'px';
  }
  if (item) {
    // In edge case dropdown can be very small, scrolling can cause side effect AWSUI-60318
    if (menuEl.clientHeight !== undefined && menuEl.clientHeight > 15) {
      /* istanbul ignore next: clientHeight always returns 0 in JSDOM, the line is covered by integ tests */
      scrollElementIntoView(item);
    }
  }
}
