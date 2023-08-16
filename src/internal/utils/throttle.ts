// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

export interface ThrottledFunction<F extends (...args: any) => any> {
  (...args: Parameters<F>): void;
  cancel(): void;
}

export function throttle<F extends (...args: any) => any>(
  func: F,
  delay: number,
  { trailing = true }: ThrottleOptions = {}
): ThrottledFunction<F> {
  let pending: null | { this: any; args: any } = null;
  let lastInvokeTime: null | number = null;
  let timerId: null | number = null;

  // Runs on every animation frame until timer stopped.
  function pendingFunc() {
    if (pending === null || lastInvokeTime === null) {
      return;
    }

    const invokeTime = Date.now();
    const shouldInvoke = invokeTime - lastInvokeTime >= delay;

    if (shouldInvoke) {
      func.apply(pending.this, pending.args);
      lastInvokeTime = invokeTime;
      pending = null;
      timerId = null;
    } else if (trailing) {
      startTimer();
    }
  }

  function startTimer() {
    if (timerId) {
      cancelAnimationFrame(timerId);
    }
    timerId = requestAnimationFrame(pendingFunc);
  }

  // Decorated client function with delay mechanism.
  function throttled(this: unknown, ...args: unknown[]) {
    if (lastInvokeTime === null) {
      lastInvokeTime = Date.now();
      func.apply(this, args);
    } else {
      pending = { this: this, args };
      startTimer();
    }
  }

  // Prevents delayed function from execution when no longer needed.
  throttled.cancel = () => {
    if (timerId) {
      cancelAnimationFrame(timerId);
    }
    pending = null;
    lastInvokeTime = null;
    timerId = null;
  };

  return throttled;
}
