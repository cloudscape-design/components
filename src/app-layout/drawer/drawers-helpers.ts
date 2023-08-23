// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function splitItems<T extends { id: string }>(
  maybeItems: Array<T> | undefined,
  splitIndex: number,
  activeId: string | null | undefined,
  isMobile = false
) {
  const items = maybeItems ?? [];
  let visibleItems = items.slice(0, splitIndex);
  let overflowItems = items.slice(splitIndex, items.length);

  if (overflowItems.length === 1) {
    visibleItems = items.slice(0, splitIndex + 1);
    overflowItems = [];
  }

  if (isMobile && items.length === 3) {
    splitIndex = splitIndex + 1;
  }

  if (activeId && overflowItems.length > 0 && visibleItems.length > 0) {
    const activeInOverflow = overflowItems.find(item => item.id === activeId);
    if (activeInOverflow) {
      overflowItems.splice(overflowItems.indexOf(activeInOverflow), 1);
      overflowItems.unshift(visibleItems.pop()!);
      visibleItems.push(activeInOverflow);
    }
  }
  return { visibleItems, overflowItems };
}
