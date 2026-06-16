// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export interface WindowWithPendingCallbacks extends Window {
  __usePendingCallbacks: boolean;
  __pendingCallbacks: Array<() => void>;
  __flushOne: () => void;
  __flushAll: () => void;
}
declare const window: WindowWithPendingCallbacks;

window.__usePendingCallbacks = window.__usePendingCallbacks ?? false;
window.__pendingCallbacks = [];
window.__flushOne = () => {
  const nextCallback = window.__pendingCallbacks.shift();
  if (nextCallback) {
    nextCallback();
  } else {
    throw new Error('The callbacks queue is empty.');
  }
};
window.__flushAll = () => {
  while (window.__pendingCallbacks.length) {
    window.__flushOne();
  }
};

export const asyncCallback = (callback: () => void, delay: number) => {
  if (window.__usePendingCallbacks) {
    window.__pendingCallbacks.push(callback);
  } else {
    setTimeout(callback, delay);
  }
};
