// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// default delay for components defined by UX
export const DEBOUNCE_DEFAULT_DELAY = 200;

// instead of using this function directly, consider using useDebounceCallback hook
export default function debounce<CallbackType extends (...args: unknown[]) => void>(
  func: CallbackType,
  delay: number = DEBOUNCE_DEFAULT_DELAY
): CallbackType {
  let timeout: ReturnType<typeof setTimeout> | null;

  return function (...args: unknown[]) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      timeout = null;
      func(...args);
    }, delay);
  } as CallbackType;
}
