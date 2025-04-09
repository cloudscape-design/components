// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { runAllIntersectionObservers } from '../../../utils/__tests__/mock-intersection-observer';

jest.useFakeTimers();

function isInViewport(element: Element, callback: (inViewport: boolean) => void) {
  // We need to import the function dynamically so that it picks up the mocked IntersectionObserver.

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return jest.requireActual('../is-in-viewport').isInViewport(element, callback);
}

beforeEach(() => jest.resetAllMocks());

describe('isInViewport', () => {
  it('calls the callback with `true` if the element is visible', () => {
    const callback = jest.fn();
    const element = document.createElement('div');

    isInViewport(element, callback);

    runAllIntersectionObservers([{ target: element, isIntersecting: true }]);

    jest.runAllTimers();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(true);
  });

  it('calls the callback with `false` if the element is not visible', () => {
    const callback = jest.fn();
    const element = document.createElement('div');

    isInViewport(element, callback);

    runAllIntersectionObservers([{ target: element, isIntersecting: false }]);

    jest.runAllTimers();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(false);
  });

  it('calls the callback with `false` if the IntersectionObserver does not fire in reasonable time', () => {
    const callback = jest.fn();
    const element = document.createElement('div');

    isInViewport(element, callback);

    jest.runAllTimers();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(false);
  });

  it('calls the callback with a delay', () => {
    const callback = jest.fn();
    const element = document.createElement('div');

    isInViewport(element, callback);

    runAllIntersectionObservers([{ target: element, isIntersecting: false }]);

    expect(callback).not.toHaveBeenCalled();

    jest.runAllTimers();
    expect(callback).toHaveBeenCalled();
  });

  it('calls different callbacks for different elements', () => {
    const callback1 = jest.fn();
    const element1 = document.createElement('div');
    const callback2 = jest.fn();
    const element2 = document.createElement('div');

    isInViewport(element1, callback1);
    isInViewport(element2, callback2);

    runAllIntersectionObservers([
      { target: element2, isIntersecting: false },
      { target: element1, isIntersecting: true },
    ]);

    jest.runAllTimers();

    expect(callback1).toHaveBeenCalledWith(true);
    expect(callback2).toHaveBeenCalledWith(false);
  });

  it('does not call the callback if the cleanup function is run', () => {
    const callback = jest.fn();
    const element = document.createElement('div');

    const cleanup = isInViewport(element, callback);

    runAllIntersectionObservers([{ target: element, isIntersecting: false }]);

    cleanup();

    jest.runAllTimers();

    expect(callback).not.toHaveBeenCalled();
  });
});
