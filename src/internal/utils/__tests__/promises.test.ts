// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { makeCancellable, PromiseCancelledSignal } from '../promises';

const waitForPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('makeCancellable', () => {
  test('cancels resolved promise', async () => {
    const onResolve = jest.fn();
    const onCancel = jest.fn();
    const { promise, cancel } = makeCancellable(Promise.resolve());
    promise.then(onResolve, onCancel);
    cancel();
    await waitForPromises();
    expect(onResolve).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledWith(expect.any(PromiseCancelledSignal));
  });

  test('cancels rejected promise', async () => {
    const onResolve = jest.fn();
    const onCancel = jest.fn();
    const { promise, cancel } = makeCancellable(Promise.reject(new Error('For testing')));
    promise.then(onResolve, onCancel);
    cancel();
    await waitForPromises();
    expect(onResolve).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledWith(expect.any(PromiseCancelledSignal));
  });

  test('resolves the promise', async () => {
    const onResolve = jest.fn();
    const onCancel = jest.fn();
    const { promise } = makeCancellable(Promise.resolve('success'));
    promise.then(onResolve, onCancel);
    await waitForPromises();
    expect(onResolve).toHaveBeenCalledWith('success');
    expect(onCancel).not.toHaveBeenCalled();
  });

  test('rejects the promise', async () => {
    const onResolve = jest.fn();
    const onCancel = jest.fn();
    const { promise } = makeCancellable(Promise.reject(new Error('For testing')));
    promise.then(onResolve, onCancel);
    await waitForPromises();
    expect(onResolve).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledWith(new Error('For testing'));
  });

  test('exposes isCancelled state', async () => {
    const onCancel = jest.fn();
    const { promise, isCancelled, cancel } = makeCancellable(Promise.resolve());
    promise.catch(onCancel);
    expect(isCancelled()).toEqual(false);
    cancel();
    expect(isCancelled()).toEqual(true);
    await waitForPromises();
    expect(onCancel).toHaveBeenCalledWith(expect.any(PromiseCancelledSignal));
  });
});
