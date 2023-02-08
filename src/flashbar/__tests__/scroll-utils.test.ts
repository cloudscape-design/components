// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { isElementTopBeyondViewport, isKeyboardInteraction } from '../scroll-utils';

describe('Scroll utils', () => {
  describe('isElementTopBeyondViewport', () => {
    beforeAll(() => {
      jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => ({
        width: 100,
        height: 100,
        top,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: top,
        toJSON: () => null,
      }));
    });
    afterAll(() => {
      jest.restoreAllMocks();
    });
    let top = 0;
    const element = document.createElement('div');

    it('returns true when element top is negative', () => {
      top = -1;
      expect(isElementTopBeyondViewport(element)).toBe(true);
    });

    it('returns false when element top is positive', () => {
      top = 1;
      expect(isElementTopBeyondViewport(element)).toBe(false);
    });

    it('returns false when element top is zero', () => {
      top = 0;
      expect(isElementTopBeyondViewport(element)).toBe(false);
    });
  });

  describe('isKeyboardInteraction', () => {
    it('returns true when isFocusVisible is not empty', () => {
      expect(isKeyboardInteraction({ 'data-awsui-focus-visible': true })).toBe(true);
    });
    it('returns true when isFocusVisible is empty', () => {
      expect(isKeyboardInteraction({})).toBe(false);
    });
  });
});
