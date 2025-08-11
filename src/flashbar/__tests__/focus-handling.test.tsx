// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar/index.js';
import createWrapper from '../../../lib/components/test-utils/dom/index.js';

describe('Flashbar focus handling on dismiss', () => {
  let mockMainElement: HTMLElement;
  let originalQuerySelector: typeof document.querySelector;

  beforeEach(() => {
    // Mock main element
    mockMainElement = document.createElement('main');
    mockMainElement.focus = jest.fn();
    document.body.appendChild(mockMainElement);

    // Mock document.querySelector for main element fallback
    originalQuerySelector = document.querySelector;
    document.querySelector = jest.fn(selector => {
      if (selector === 'main' || selector === '[role="main"]') {
        return mockMainElement;
      }
      return originalQuerySelector.call(document, selector);
    });
  });

  afterEach(() => {
    document.querySelector = originalQuerySelector;
    if (document.body.contains(mockMainElement)) {
      document.body.removeChild(mockMainElement);
    }
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

  const createDismissibleFlashbar = (items: FlashbarProps.MessageDefinition[]) => {
    const TestComponent = () => {
      const [flashItems, setFlashItems] = React.useState(items);

      const itemsWithHandlers = flashItems.map(item => ({
        ...item,
        onDismiss: () => {
          setFlashItems(prev => prev.filter(prevItem => prevItem.id !== item.id));
        },
      }));

      return <Flashbar items={itemsWithHandlers} />;
    };

    return TestComponent;
  };

  test('dismiss functionality works correctly', () => {
    const items = createTestItems(3);
    const TestComponent = createDismissibleFlashbar(items);
    const { container } = render(<TestComponent />);

    const wrapper = createWrapper(container).findFlashbar()!;

    expect(wrapper.findItems()).toHaveLength(3);
    wrapper.findItems()[0].findDismissButton()!.click();

    expect(wrapper.findItems()).toHaveLength(2);

    expect(wrapper.findItems()[0].getElement()).toHaveTextContent('Item 1');
  });

  test('dismissing middle item works correctly', () => {
    const items = createTestItems(5);
    const TestComponent = createDismissibleFlashbar(items);
    const { container } = render(<TestComponent />);

    const wrapper = createWrapper(container).findFlashbar()!;

    // Initially should have 5 items
    expect(wrapper.findItems()).toHaveLength(5);

    // Dismiss middle item (index 2)
    wrapper.findItems()[2].findDismissButton()!.click();

    // Should have 4 items remaining
    expect(wrapper.findItems()).toHaveLength(4);

    // Items should be reordered correctly
    const remainingItems = wrapper.findItems();
    expect(remainingItems[0].getElement()).toHaveTextContent('Item 0');
    expect(remainingItems[1].getElement()).toHaveTextContent('Item 1');
    expect(remainingItems[2].getElement()).toHaveTextContent('Item 3'); // Item 2 was removed
    expect(remainingItems[3].getElement()).toHaveTextContent('Item 4');
  });

  test('dismissing last item works correctly', () => {
    const items = createTestItems(3);
    const TestComponent = createDismissibleFlashbar(items);
    const { container } = render(<TestComponent />);

    const wrapper = createWrapper(container).findFlashbar()!;

    // Dismiss last item
    const flashItems = wrapper.findItems();
    flashItems[flashItems.length - 1].findDismissButton()!.click();

    // Should have 2 items remaining
    expect(wrapper.findItems()).toHaveLength(2);

    // Last item should now be Item 1
    const remainingItems = wrapper.findItems();
    expect(remainingItems[remainingItems.length - 1].getElement()).toHaveTextContent('Item 1');
  });

  test('dismissing all items works correctly', () => {
    const items = createTestItems(3);
    const TestComponent = createDismissibleFlashbar(items);
    const { container } = render(<TestComponent />);

    const wrapper = createWrapper(container).findFlashbar()!;

    // Dismiss items one by one
    for (let i = 0; i < 3; i++) {
      const flashItems = wrapper.findItems();
      if (flashItems.length > 0) {
        flashItems[0].findDismissButton()!.click();
      }
    }

    // Should have no items remaining
    expect(wrapper.findItems()).toHaveLength(0);
  });

  test('stackItems prop works correctly with dismissal', async () => {
    const items = createTestItems(5);
    const TestComponent = () => {
      const [flashItems, setFlashItems] = React.useState(items);

      const itemsWithHandlers = flashItems.map(item => ({
        ...item,
        onDismiss: () => {
          setFlashItems(prev => prev.filter(prevItem => prevItem.id !== item.id));
        },
      }));

      return <Flashbar items={itemsWithHandlers} stackItems={true} />;
    };

    const { container } = render(<TestComponent />);
    const wrapper = createWrapper(container).findFlashbar()!;

    // In stacked mode, should only show one item
    expect(wrapper.findItems()).toHaveLength(1);

    // Dismiss the visible item
    wrapper.findItems()[0].findDismissButton()!.click();

    await waitFor(() => {
      expect(wrapper.findItems()).toHaveLength(1);
    });

    // Content should have changed to the next item
    expect(wrapper.findItems()[0].getElement()).toHaveTextContent('Item 1');
  });

  test('handles items without IDs gracefully', () => {
    const items: FlashbarProps.MessageDefinition[] = [
      {
        type: 'info',
        header: 'Item without ID 1',
        content: 'Content 1',
        dismissible: true,
      },
      {
        type: 'info',
        header: 'Item without ID 2',
        content: 'Content 2',
        dismissible: true,
      },
    ];

    const TestComponent = () => {
      const [flashItems, setFlashItems] = React.useState(items);

      const itemsWithHandlers = flashItems.map((item, index) => ({
        ...item,
        onDismiss: () => {
          setFlashItems(prev => prev.filter((_, i) => i !== index));
        },
      }));

      return <Flashbar items={itemsWithHandlers} />;
    };

    const { container } = render(<TestComponent />);
    const wrapper = createWrapper(container).findFlashbar()!;

    // Should render both items
    expect(wrapper.findItems()).toHaveLength(2);

    // Should be able to dismiss items without errors
    wrapper.findItems()[0].findDismissButton()!.click();

    expect(wrapper.findItems()).toHaveLength(1);

    expect(wrapper.findItems()[0].getElement()).toHaveTextContent('Item without ID 2');
  });

  test('rapid dismissals work correctly', () => {
    const items = createTestItems(5);
    const TestComponent = createDismissibleFlashbar(items);
    const { container } = render(<TestComponent />);

    const wrapper = createWrapper(container).findFlashbar()!;

    // Dismiss first item
    wrapper.findItems()[0].findDismissButton()!.click();

    expect(wrapper.findItems()).toHaveLength(4);

    // Dismiss another item (was second, now first)
    wrapper.findItems()[0].findDismissButton()!.click();

    expect(wrapper.findItems()).toHaveLength(3);

    // Dismiss another item (was third, now first)
    wrapper.findItems()[0].findDismissButton()!.click();

    // Should have 2 items remaining
    expect(wrapper.findItems()).toHaveLength(2);

    // Remaining items should be Item 3 and Item 4
    const remainingItems = wrapper.findItems();
    expect(remainingItems[0].getElement()).toHaveTextContent('Item 3');
    expect(remainingItems[1].getElement()).toHaveTextContent('Item 4');
  });

  test('dismiss buttons are properly accessible', () => {
    const items = createTestItems(2).map(item => ({
      ...item,
      dismissLabel: `Dismiss ${item.header}`,
    }));
    const TestComponent = createDismissibleFlashbar(items);
    const { container } = render(<TestComponent />);

    const wrapper = createWrapper(container).findFlashbar()!;
    const flashItems = wrapper.findItems();

    // Each dismiss button should be accessible
    flashItems.forEach(item => {
      const dismissButton = item.findDismissButton();
      expect(dismissButton).toBeTruthy();
      expect(dismissButton!.getElement()).toBeInTheDocument();
      // The dismiss button should have either aria-label or aria-labelledby
      const element = dismissButton!.getElement();
      const hasAriaLabel = element.hasAttribute('aria-label');
      const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');
      expect(hasAriaLabel || hasAriaLabelledBy).toBe(true);
    });
  });

  test('focus behavior does not cause errors when main element is not present', () => {
    // Remove the mocked main element
    document.querySelector = jest.fn(() => null);

    const items = createTestItems(1);
    const TestComponent = createDismissibleFlashbar(items);
    const { container } = render(<TestComponent />);

    const wrapper = createWrapper(container).findFlashbar()!;

    // Should not throw when dismissing the only item (even with no main element)
    expect(() => {
      wrapper.findItems()[0].findDismissButton()!.click();
    }).not.toThrow();

    expect(wrapper.findItems()).toHaveLength(0);
  });
});
