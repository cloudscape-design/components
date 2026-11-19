// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { runAllIntersectionObservers } from './mock-intersection-observer';

describe('IntersectionObserver mock', () => {
  it('runs the callback for observed elements', () => {
    const callback = jest.fn();
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    const element3 = document.createElement('div');

    const observer = new IntersectionObserver(callback);
    observer.observe(element1);
    observer.observe(element2);
    observer.observe(element3);
    observer.unobserve(element3);

    runAllIntersectionObservers([
      { target: element2, isIntersecting: true },
      { target: element1, isIntersecting: false },
      { target: element3, isIntersecting: true },
      { target: document.createElement('div'), isIntersecting: false },
    ]);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(
      [
        { target: element2, isIntersecting: true },
        { target: element1, isIntersecting: false },
      ],
      expect.anything()
    );
  });

  it('supports multiple instances', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');

    const observer1 = new IntersectionObserver(callback1);
    const observer2 = new IntersectionObserver(callback2);
    observer1.observe(element1);
    observer2.observe(element2);

    runAllIntersectionObservers([
      { target: element1, isIntersecting: true },
      { target: element2, isIntersecting: true },
    ]);

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(callback1).toHaveBeenCalledWith([{ target: element1, isIntersecting: true }], expect.anything());
    expect(callback2).toHaveBeenCalledWith([{ target: element2, isIntersecting: true }], expect.anything());
  });
});
