// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { applyScroll } from '../scroll';

describe('applyScroll', () => {
  const element = document.createElement('div');
  jest.spyOn(element, 'clientHeight', 'get').mockImplementation(() => 10);
  jest.spyOn(element, 'scrollHeight', 'get').mockImplementation(() => 20);
  jest.spyOn(element, 'scrollTop', 'get').mockImplementation(() => 0);
  element.scrollTo = jest.fn();
  element.getBoundingClientRect = jest.fn(
    () =>
      ({
        x: 0,
        y: 0,
        width: 10,
        height: 20,
        top: 0,
        right: 0,
        bottom: 10,
        left: 0,
      }) as DOMRect
  );
  const currentCoordinates = { x: 0, y: 0 };
  const newCoordinates = { x: 0, y: 10 };

  it('returns true if scroll was applied', () => {
    expect(
      applyScroll({ currentCoordinates, direction: 'ArrowDown', newCoordinates, scrollableAncestors: [element] })
    ).toBe(true);
  });

  it('returns false if scroll was not applied', () => {
    expect(
      applyScroll({ currentCoordinates, direction: 'ArrowUp', newCoordinates, scrollableAncestors: [element] })
    ).toBe(false);
  });
});
