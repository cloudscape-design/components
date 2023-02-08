// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { findNotificationBar, renderFlashbar } from './common';

jest.mock('../../../lib/components/flashbar/scroll-utils', () => {
  return {
    isElementTopBeyondViewport: () => true,
    isKeyboardInteraction: () => true,
  };
});

describe('Sticky stacking Flashbar', () => {
  describe('Focus behavior', () => {
    it('calls window.scrollTop when collapsing with the keyboard', () => {
      const spy = jest.spyOn(window, 'scrollTo').mockImplementation();
      const flashbar = renderFlashbar();
      findNotificationBar(flashbar)!.click();
      findNotificationBar(flashbar)!.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
