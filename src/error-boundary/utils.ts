// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// The default refresh action reloads the top window to avoid iframe lifecycle getting out of sync with the parent page.
// This is not possible from cross-origin iframes, in which case the default refresh action must be hidden.
export function canUseRefresh(): boolean {
  try {
    // In cross-origin iframes, accessing top.location can throw a SecurityError.
    void getTopWindow().location.href;
    return true;
  } catch {
    return false;
  }
}

export function refreshPage(): void {
  try {
    getTopWindow().location.reload();
  } catch {
    // noop
  }
}

// In browsers, window.top is always defined, but it is treated as optional by our current DOM types.
function getTopWindow(): Window {
  return window.top ?? window;
}
