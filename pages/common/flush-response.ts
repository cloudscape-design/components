// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface WindowWithFlushResponse extends Window {
  __pendingCallbacks: Array<() => void>;
  __flushServerResponse: () => void;
}
declare const window: WindowWithFlushResponse;

export function enhanceWindow() {
  window.__pendingCallbacks = [];
  window.__flushServerResponse = () => {
    for (const cb of window.__pendingCallbacks) {
      cb();
    }
    window.__pendingCallbacks = [];
  };
}
