// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import { getFirstScrollableParent, scrollRectangleIntoView } from '../scrollable-containers';

const originalScrollBy = window.scrollBy;

beforeEach(() => {
  window.scrollBy = jest.fn();
  window.innerHeight = 500;
});
afterEach(() => {
  window.scrollBy = originalScrollBy;
});

describe('scrollRectangleIntoView', () => {
  test("scrolls up until the rectangle's top position fits the viewport top, if the rectangle's top position was further up", () => {
    scrollRectangleIntoView({ top: -50, height: 100, width: 100, left: 0 });
    expect(window.scrollBy).toHaveBeenCalledWith(0, -50);
  });
  test("scrolls down until the rectangle's bottom position fits the viewport bottom, if the rectangle's bottom position was further down", () => {
    scrollRectangleIntoView({ top: 300, height: 300, width: 100, left: 0 });
    expect(window.scrollBy).toHaveBeenCalledWith(0, 100);
  });
  test("scrolls down only until the rectangle's top position fits the viewport top, if the rectangle's bottom position was further down but it is taller than the viewport", () => {
    scrollRectangleIntoView({ top: 300, height: 600, width: 100, left: 0 });
    expect(window.scrollBy).toHaveBeenCalledWith(0, 300);
  });
});

describe('getFirstScrollableParent', () => {
  const { container } = render(
    <div id="outer">
      <div id="inner" />
    </div>
  );
  const outer = container.querySelector('#outer')!;
  const inner: HTMLElement = container.querySelector('#inner')!;

  let clientHeightSpy: jest.SpyInstance;
  let scrollHeightSpy: jest.SpyInstance;
  const originalGetComputedStyle = window.getComputedStyle;

  afterEach(() => {
    clientHeightSpy.mockRestore();
    scrollHeightSpy.mockRestore();
    window.getComputedStyle = originalGetComputedStyle;
  });

  test('returns first scrollable parent', () => {
    clientHeightSpy = jest.spyOn(outer, 'clientHeight', 'get').mockImplementation(() => 10);
    scrollHeightSpy = jest.spyOn(outer, 'scrollHeight', 'get').mockImplementation(() => 20);
    const fakeGetComputedStyle: Window['getComputedStyle'] = (...args) => {
      const result = originalGetComputedStyle(...args);
      result.overflowY = 'scroll';
      return result;
    };
    window.getComputedStyle = fakeGetComputedStyle;

    expect(getFirstScrollableParent(inner)).toBe(outer);
  });
  test('returns null if no scrollable parent is found', () => {
    expect(getFirstScrollableParent(inner)).toBe(null);
  });
});
