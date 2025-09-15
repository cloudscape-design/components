// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export function sortByPriority<T extends { orderPriority?: number; id: string }>(items: Array<T>) {
  return items.slice().sort((a, b) => {
    if (b.orderPriority !== a.orderPriority) {
      return Math.sign((b.orderPriority ?? 0) - (a.orderPriority ?? 0));
    }
    return b.id < a.id ? 1 : -1;
  });
}

export class Defer<T = any> {
  public readonly promise: Promise<T>;
  public readonly resolve: (value?: T | PromiseLike<T>) => void;
  public readonly reject: (reason?: any) => void;

  constructor() {
    let _resolve: (value: T | PromiseLike<T>) => void;
    let _reject: (reason?: any) => void;

    this.promise = new Promise<T>((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    this.resolve = (value?: T | PromiseLike<T>) => _resolve(value as T | PromiseLike<T>);
    this.reject = _reject!;
  }
}
