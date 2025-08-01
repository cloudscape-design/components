// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { focusFlashById, focusFlashFocusableArea } from '../../../lib/components/flashbar/flash';

import styles from '../../../lib/components/flashbar/styles.css.js';

describe('Flash utility functions', () => {
  describe('focusFlashFocusableArea', () => {
    test('does nothing when flash element is null', () => {
      expect(() => focusFlashFocusableArea(null)).not.toThrow();
    });

    test('focuses on dismiss button when available', () => {
      const flashElement = document.createElement('div');
      const dismissButton = document.createElement('button');
      dismissButton.className = styles['dismiss-button'];
      dismissButton.focus = jest.fn();

      const focusContainer = document.createElement('div');
      focusContainer.className = styles['flash-focus-container'];
      focusContainer.focus = jest.fn();

      flashElement.appendChild(dismissButton);
      flashElement.appendChild(focusContainer);

      focusFlashFocusableArea(flashElement);

      expect(dismissButton.focus).toHaveBeenCalled();
      expect(focusContainer.focus).not.toHaveBeenCalled();
    });

    test('focuses on focus container when dismiss button is not available', () => {
      const flashElement = document.createElement('div');
      const focusContainer = document.createElement('div');
      focusContainer.className = styles['flash-focus-container'];
      focusContainer.focus = jest.fn();

      flashElement.appendChild(focusContainer);

      focusFlashFocusableArea(flashElement);

      expect(focusContainer.focus).toHaveBeenCalled();
    });

    test('does nothing when neither dismiss button nor focus container is available', () => {
      const flashElement = document.createElement('div');

      expect(() => focusFlashFocusableArea(flashElement)).not.toThrow();
    });
  });

  describe('focusFlashById', () => {
    test('does nothing when element is null', () => {
      expect(() => focusFlashById(null, 'test-id')).not.toThrow();
    });

    test('does nothing when flash element with itemId is not found', () => {
      const container = document.createElement('div');

      focusFlashById(container, 'non-existent-id');

      expect(container.querySelector).toBeTruthy();
    });

    test('does nothing when flash element has no focus container', () => {
      const container = document.createElement('div');
      const flashElement = document.createElement('div');
      flashElement.setAttribute('data-itemid', 'test-id');

      container.appendChild(flashElement);

      expect(() => focusFlashById(container, 'test-id')).not.toThrow();
    });

    test('function exists and is callable', () => {
      expect(typeof focusFlashById).toBe('function');
      expect(() => focusFlashById(null, 'test')).not.toThrow();
    });
  });
});
