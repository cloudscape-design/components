// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { handleFlashDismissedInternal } from '../../../lib/components/flashbar/common';
import { FlashbarProps } from '../../../lib/components/flashbar/interfaces';

// Mock the focus utility function
jest.mock('../../../lib/components/flashbar/flash', () => ({
  ...jest.requireActual('../../../lib/components/flashbar/flash'),
  focusFlashFocusableArea: jest.fn(),
}));

import { focusFlashFocusableArea } from '../../../lib/components/flashbar/flash';
const mockFocusFlashFocusableArea = focusFlashFocusableArea as jest.MockedFunction<typeof focusFlashFocusableArea>;

import styles from '../../../lib/components/flashbar/styles.css.js';

describe('handleFlashDismissedInternal', () => {
  let mockH1Element: HTMLElement;
  let originalQuerySelector: typeof document.querySelector;
  let originalSetTimeout: typeof setTimeout;

  beforeEach(() => {
    jest.clearAllMocks();

    mockH1Element = document.createElement('h1');
    mockH1Element.focus = jest.fn();

    originalQuerySelector = document.querySelector;
    document.querySelector = jest.fn(selector => {
      if (selector === 'h1') {
        return mockH1Element;
      }
      return null;
    });

    originalSetTimeout = global.setTimeout;
    global.setTimeout = jest.fn((callback: any) => {
      callback();
      return 0 as any;
    }) as any;
  });

  afterEach(() => {
    document.querySelector = originalQuerySelector;
    global.setTimeout = originalSetTimeout;
  });

  const createTestItems = (count: number): FlashbarProps.MessageDefinition[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `item-${i}`,
      type: 'info' as const,
      header: `Item ${i}`,
      content: `Content ${i}`,
      dismissible: true,
    }));
  };

  test('does nothing when items is undefined', () => {
    const mockRef = document.createElement('div');
    const flashRefs = {};

    handleFlashDismissedInternal('item-1', undefined, mockRef, flashRefs);

    expect(mockFocusFlashFocusableArea).not.toHaveBeenCalled();
    expect(mockH1Element.focus).not.toHaveBeenCalled();
  });

  test('does nothing when dismissedId is undefined', () => {
    const items = createTestItems(2);
    const mockRef = document.createElement('div');
    const flashRefs = {};

    handleFlashDismissedInternal(undefined, items, mockRef, flashRefs);

    expect(mockFocusFlashFocusableArea).not.toHaveBeenCalled();
    expect(mockH1Element.focus).not.toHaveBeenCalled();
  });

  test('does nothing when refCurrent is null', () => {
    const items = createTestItems(2);
    const flashRefs = {};

    handleFlashDismissedInternal('item-1', items, null, flashRefs);

    expect(mockFocusFlashFocusableArea).not.toHaveBeenCalled();
    expect(mockH1Element.focus).not.toHaveBeenCalled();
  });

  test('does nothing when dismissed item is not found', () => {
    const items = createTestItems(2);
    const mockRef = document.createElement('div');
    const flashRefs = {};

    handleFlashDismissedInternal('non-existent-item', items, mockRef, flashRefs);

    expect(mockFocusFlashFocusableArea).not.toHaveBeenCalled();
    expect(mockH1Element.focus).not.toHaveBeenCalled();
  });

  test('focuses on next item when dismissing first item', () => {
    const items = createTestItems(3);
    const mockRef = document.createElement('div');
    const mockNextElement = document.createElement('div');
    const flashRefs = {
      'item-1': mockNextElement,
    };

    handleFlashDismissedInternal('item-0', items, mockRef, flashRefs);

    expect(mockFocusFlashFocusableArea).toHaveBeenCalledWith(mockNextElement);
    expect(mockH1Element.focus).not.toHaveBeenCalled();
  });

  test('focuses on previous item when dismissing last item', () => {
    const items = createTestItems(3);
    const mockRef = document.createElement('div');
    const mockPrevElement = document.createElement('div');
    const flashRefs = {
      'item-1': mockPrevElement,
    };

    handleFlashDismissedInternal('item-2', items, mockRef, flashRefs);

    expect(mockFocusFlashFocusableArea).toHaveBeenCalledWith(mockPrevElement);
    expect(mockH1Element.focus).not.toHaveBeenCalled();
  });

  test('focuses on h1 element when dismissing only item', () => {
    const items = createTestItems(1);
    const mockRef = document.createElement('div');
    const flashRefs = {};

    handleFlashDismissedInternal('item-0', items, mockRef, flashRefs);

    expect(mockFocusFlashFocusableArea).not.toHaveBeenCalled();
    expect(mockH1Element.focus).toHaveBeenCalled();
  });

  test('focuses on notification bar button when next flash element is not available', () => {
    const items = createTestItems(2);
    const mockRef = document.createElement('div');
    const mockNotificationButton = document.createElement('button');
    mockNotificationButton.focus = jest.fn();
    mockNotificationButton.className = styles.button;

    mockRef.querySelector = jest.fn(selector => {
      if (selector === `.${styles.button}`) {
        return mockNotificationButton;
      }
      return null;
    });

    const flashRefs = {};

    handleFlashDismissedInternal('item-0', items, mockRef, flashRefs);

    expect(mockFocusFlashFocusableArea).not.toHaveBeenCalled();
    expect(mockNotificationButton.focus).toHaveBeenCalled();
    expect(mockH1Element.focus).not.toHaveBeenCalled();
  });

  test('falls back to h1 element when neither next flash element nor notification button is available', () => {
    const items = createTestItems(2);
    const mockRef = document.createElement('div');

    mockRef.querySelector = jest.fn(() => null);

    const flashRefs = {};

    handleFlashDismissedInternal('item-0', items, mockRef, flashRefs);

    expect(mockFocusFlashFocusableArea).not.toHaveBeenCalled();
    expect(mockH1Element.focus).toHaveBeenCalled();
  });

  test('focuses on middle item correctly', () => {
    const items = createTestItems(5);
    const mockRef = document.createElement('div');
    const mockNextElement = document.createElement('div');
    const flashRefs = {
      'item-3': mockNextElement,
    };

    handleFlashDismissedInternal('item-2', items, mockRef, flashRefs);

    expect(mockFocusFlashFocusableArea).toHaveBeenCalledWith(mockNextElement);
  });

  test('setTimeout is called to defer focus operation', () => {
    const items = createTestItems(2);
    const mockRef = document.createElement('div');
    const mockNextElement = document.createElement('div');
    const flashRefs = {
      'item-1': mockNextElement,
    };

    handleFlashDismissedInternal('item-0', items, mockRef, flashRefs);

    expect(global.setTimeout).toHaveBeenCalledTimes(1);
    expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 0);
  });

  test('handles empty items array', () => {
    const items: FlashbarProps.MessageDefinition[] = [];
    const mockRef = document.createElement('div');
    const flashRefs = {};

    handleFlashDismissedInternal('item-0', items, mockRef, flashRefs);

    expect(mockFocusFlashFocusableArea).not.toHaveBeenCalled();
    expect(mockH1Element.focus).not.toHaveBeenCalled();
  });

  test('handles dismissing item at various positions', () => {
    const items = createTestItems(4);
    const mockRef = document.createElement('div');

    const mockNextElement = document.createElement('div');
    const flashRefs = { 'item-2': mockNextElement };

    handleFlashDismissedInternal('item-1', items, mockRef, flashRefs);

    expect(mockFocusFlashFocusableArea).toHaveBeenCalledWith(mockNextElement);
  });

  test('handles case when h1 element is not available', () => {
    const items = createTestItems(1);
    const mockRef = document.createElement('div');
    const flashRefs = {};

    document.querySelector = jest.fn(selector => {
      if (selector === 'h1') {
        return null;
      }
      return null;
    });

    handleFlashDismissedInternal('item-0', items, mockRef, flashRefs);

    expect(mockFocusFlashFocusableArea).not.toHaveBeenCalled();
    // No focus should be called when h1 is not available
  });
});
