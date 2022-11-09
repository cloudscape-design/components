// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';

export interface ForwardFocusRef {
  focus(): void;
}

/**
 * Focus forwarding helper for radio groups where only the first selected
 * child element should be focused.
 */
export default function useRadioGroupForwardFocus(
  forwardedRef: React.Ref<ForwardFocusRef>,
  items: ReadonlyArray<{ value: string }> | undefined,
  value: string | null
): [React.Ref<HTMLInputElement>, number] {
  const itemRef = useRef<HTMLInputElement | null>(null);
  const itemIndex = items && findIndex(items, item => item.value === value);
  useImperativeHandle(forwardedRef, () => ({
    focus() {
      itemRef.current?.focus();
    },
  }));

  return [itemRef, itemIndex !== undefined && itemIndex !== -1 ? itemIndex : 0];
}

function findIndex<T>(items: ReadonlyArray<T>, predicate: (t: T) => any): number {
  for (let i = 0; i < items.length; i++) {
    if (predicate(items[i])) {
      return i;
    }
  }
  return -1;
}
