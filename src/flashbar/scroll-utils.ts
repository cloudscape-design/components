// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// These functions need to be in a separate file in order to mock them.

export function isElementTopBeyondViewport(element: HTMLElement) {
  return element.getBoundingClientRect().top < 0;
}

export function isKeyboardInteraction(isFocusVisible: Record<string, boolean | unknown>) {
  return !!Object.keys(isFocusVisible).length;
}
