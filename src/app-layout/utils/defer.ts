// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export class Deferred<T> {
  private readonly _promise: Promise<T>;
  private _resolve?: (value?: any) => void;
  private _reject?: (reason?: any) => void;

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  get promise(): Promise<T> {
    return this._promise;
  }

  resolve = (value?: T | PromiseLike<T>): void => {
    this._resolve?.(value);
  };

  reject = (reason?: any): void => {
    this._reject?.(reason);
  };
}
