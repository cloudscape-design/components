// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar';
import { persistFlashbarDismiss, retrieveFlashbarDismiss } from '../../../lib/components/internal/persistence';
import createWrapper from '../../../lib/components/test-utils/dom';

jest.mock('../../../lib/components/internal/persistence');

const mockPersistFlashbarDismiss = persistFlashbarDismiss as jest.MockedFunction<typeof persistFlashbarDismiss>;
const mockRetrieveFlashbarDismiss = retrieveFlashbarDismiss as jest.MockedFunction<typeof retrieveFlashbarDismiss>;

const createItems = (withPersistence: boolean[], onDismissMocks?: jest.Mock[]): FlashbarProps.MessageDefinition[] => {
  return withPersistence.map((hasPersistence, index) => ({
    id: `item-${index}`,
    content: `Item ${index}`,
    type: 'info' as const,
    dismissible: true,
    dismissLabel: 'Dismiss',
    onDismiss: onDismissMocks?.[index] || jest.fn(),
    ...(hasPersistence && {
      persistenceConfig: { uniqueKey: `key-${index}` },
    }),
  }));
};

describe('Flashbar persistence', () => {
  beforeEach(() => {
    mockPersistFlashbarDismiss.mockClear();
    mockRetrieveFlashbarDismiss.mockClear();
  });

  describe('Non-collapsible flashbar', () => {
    it('shows persistent items when not dismissed', async () => {
      mockRetrieveFlashbarDismiss.mockResolvedValue(false);
      const items = createItems([true, false]);

      const { container } = render(<Flashbar items={items} />);
      const wrapper = createWrapper(container).findFlashbar()!;

      await waitFor(() => {
        expect(wrapper.findItems()).toHaveLength(2);
        expect(wrapper.findItems()[0].findContent()!.getElement()).toHaveTextContent('Item 0');
      });

      expect(mockRetrieveFlashbarDismiss).toHaveBeenCalledWith({ uniqueKey: 'key-0' });
    });

    it('hides persistent items when dismissed', async () => {
      mockRetrieveFlashbarDismiss.mockResolvedValue(true);
      const items = createItems([true, false]);

      const { container } = render(<Flashbar items={items} />);
      const wrapper = createWrapper(container).findFlashbar()!;

      await waitFor(() => {
        expect(wrapper.findItems()).toHaveLength(1);
        expect(wrapper.findItems()[0].findContent()!.getElement()).toHaveTextContent('Item 1');
      });
    });

    it('handles mixed persistent and non-persistent items', async () => {
      mockRetrieveFlashbarDismiss.mockImplementation(config => {
        if (config.uniqueKey === 'key-0') {
          return Promise.resolve(true);
        }
        if (config.uniqueKey === 'key-2') {
          return Promise.resolve(false);
        }
        throw new Error(`Unknown key ${config.uniqueKey}`);
      });

      const items = createItems([true, false, true]);

      const { container } = render(<Flashbar items={items} />);
      const wrapper = createWrapper(container).findFlashbar()!;

      await waitFor(() => {
        expect(wrapper.findItems()).toHaveLength(2);
        expect(wrapper.findItems()[0].findContent()!.getElement()).toHaveTextContent('Item 1');
        expect(wrapper.findItems()[1].findContent()!.getElement()).toHaveTextContent('Item 2');
      });
    });

    it('shows items as visible when retrieveFlashbarDismiss fails', async () => {
      mockRetrieveFlashbarDismiss.mockRejectedValue(new Error('Storage error'));
      const items = createItems([true, false]);

      const { container } = render(<Flashbar items={items} />);
      const wrapper = createWrapper(container).findFlashbar()!;

      await waitFor(() => {
        expect(wrapper.findItems()).toHaveLength(2);
        expect(wrapper.findItems()[0].findContent()!.getElement()).toHaveTextContent('Item 0');
        expect(wrapper.findItems()[1].findContent()!.getElement()).toHaveTextContent('Item 1');
      });
    });
  });

  describe('Collapsible flashbar', () => {
    it('shows persistent items when not dismissed in stacked mode', async () => {
      mockRetrieveFlashbarDismiss.mockResolvedValue(false);
      const items = createItems([true, false]);

      const { container } = render(<Flashbar items={items} stackItems={true} />);
      const wrapper = createWrapper(container).findFlashbar()!;

      await waitFor(() => {
        expect(wrapper.findItems()[0].findContent()!.getElement()).toHaveTextContent('Item 0');
      });
    });

    it('hides persistent items when dismissed in stacked mode', async () => {
      mockRetrieveFlashbarDismiss.mockResolvedValue(true);
      const items = createItems([true, false]);

      const { container } = render(<Flashbar items={items} stackItems={true} />);
      const wrapper = createWrapper(container).findFlashbar()!;

      await waitFor(() => {
        expect(wrapper.findItems()[0].findContent()!.getElement()).toHaveTextContent('Item 1');
      });
    });

    it('updates notification bar count based on visible items', async () => {
      mockRetrieveFlashbarDismiss.mockResolvedValue(true);
      const items = createItems([true, true, false]);

      const { container } = render(<Flashbar items={items} stackItems={true} />);
      const wrapper = createWrapper(container).findFlashbar()!;

      await waitFor(() => {
        expect(wrapper.findItems()).toHaveLength(1);
        expect(wrapper.findItems()[0].findContent()!.getElement()).toHaveTextContent('Item 2');
      });
    });
  });

  describe('Dismiss persistence', () => {
    it('calls persistFlashbarDismiss and onDismiss when dismissing persistent item', async () => {
      mockRetrieveFlashbarDismiss.mockResolvedValue(false);
      const onDismissMocks = [jest.fn(), jest.fn(), jest.fn()];
      const items = createItems([true, true, false], onDismissMocks);

      const { container } = render(<Flashbar items={items} />);
      const wrapper = createWrapper(container).findFlashbar()!;

      await waitFor(() => {
        expect(wrapper.findItems()).toHaveLength(3);
      });

      const item = wrapper.findItems()[0];
      item.findDismissButton()!.click();

      expect(mockPersistFlashbarDismiss).toHaveBeenCalledWith({ uniqueKey: 'key-0' });
      expect(onDismissMocks[0]).toHaveBeenCalled();
    });

    it('does not call persistFlashbarDismiss for non-persistent items but calls onDismiss', async () => {
      const onDismissMocks = [jest.fn(), jest.fn(), jest.fn()];
      const items = createItems([true, true, false], onDismissMocks);

      const { container } = render(<Flashbar items={items} />);
      const wrapper = createWrapper(container).findFlashbar()!;

      await waitFor(() => {
        expect(wrapper.findItems()).toHaveLength(3);
      });

      const item = wrapper.findItems()[2];
      item.findDismissButton()!.click();

      expect(mockPersistFlashbarDismiss).not.toHaveBeenCalled();
      expect(onDismissMocks[2]).toHaveBeenCalled();
    });
  });

  describe('Persistence caching', () => {
    it('does not re-check persistence for same items', async () => {
      mockRetrieveFlashbarDismiss.mockResolvedValue(false);
      const items = createItems([true]);

      const { rerender } = render(<Flashbar items={items} />);

      await waitFor(() => {
        expect(mockRetrieveFlashbarDismiss).toHaveBeenCalledTimes(1);
      });

      rerender(<Flashbar items={items} />);
      await waitFor(() => {
        expect(mockRetrieveFlashbarDismiss).toHaveBeenCalledTimes(1);
      });
    });

    it('checks persistence for new items only', async () => {
      mockRetrieveFlashbarDismiss.mockResolvedValue(false);
      const initialItems = createItems([true]);

      const { rerender } = render(<Flashbar items={initialItems} />);

      await waitFor(() => {
        expect(mockRetrieveFlashbarDismiss).toHaveBeenCalledTimes(1);
      });

      const newItems = [
        ...initialItems,
        ...createItems([true]).map(item => ({ ...item, id: 'new-item', persistenceConfig: { uniqueKey: 'new-key' } })),
      ];

      rerender(<Flashbar items={newItems} />);

      await waitFor(() => {
        expect(mockRetrieveFlashbarDismiss).toHaveBeenCalledTimes(2);
        expect(mockRetrieveFlashbarDismiss).toHaveBeenLastCalledWith({ uniqueKey: 'new-key' });
      });
    });

    it('checks persistence only for newly added items when start with empty array', async () => {
      mockRetrieveFlashbarDismiss.mockResolvedValue(false);

      // Start with empty array
      const { rerender } = render(<Flashbar items={[]} />);

      expect(mockRetrieveFlashbarDismiss).not.toHaveBeenCalled();

      // Add one item, check that mockRetrieveFlashbarDismiss was called with that item id
      const items = createItems([true]);
      rerender(<Flashbar items={items} />);

      await waitFor(() => {
        expect(mockRetrieveFlashbarDismiss).toHaveBeenCalledTimes(1);
        expect(mockRetrieveFlashbarDismiss).toHaveBeenCalledWith({ uniqueKey: 'key-0' });
      });

      mockRetrieveFlashbarDismiss.mockClear();

      // Add one more item, check that mockRetrieveFlashbarDismiss was called with only the 2nd item id
      const secondItem = { ...createItems([true])[0], id: 'item-1', persistenceConfig: { uniqueKey: 'key-1' } };
      rerender(<Flashbar items={[...items, secondItem]} />);

      await waitFor(() => {
        expect(mockRetrieveFlashbarDismiss).toHaveBeenCalledTimes(1);
        expect(mockRetrieveFlashbarDismiss).toHaveBeenCalledWith({ uniqueKey: 'key-1' });
      });
    });

    it('handles concurrent async calls without race conditions', async () => {
      let resolveFirst: (value: boolean) => void;
      let resolveSecond: (value: boolean) => void;

      const firstPromise = new Promise<boolean>(resolve => {
        resolveFirst = resolve;
      });
      const secondPromise = new Promise<boolean>(resolve => {
        resolveSecond = resolve;
      });

      mockRetrieveFlashbarDismiss.mockImplementation(config => {
        if (config.uniqueKey === 'key-0') {
          return firstPromise;
        }
        if (config.uniqueKey === 'key-2') {
          return secondPromise;
        }
        throw new Error(`Unknown key ${config.uniqueKey}`);
      });

      const initialItems = createItems([true, false]); // Create item 0 with persistence, item 1 without persistence
      const { rerender, container } = render(<Flashbar items={initialItems} />);

      // Add third item while first item still loading
      const updatedItems = [
        ...initialItems,
        { ...createItems([true])[0], content: 'Item 2', id: 'item-second', persistenceConfig: { uniqueKey: 'key-2' } },
      ];
      rerender(<Flashbar items={updatedItems} />);

      // Resolve second call first (race condition scenario)
      resolveSecond!(false); // Item 2 should be visible

      // Then resolve first call
      resolveFirst!(true); // Item 0 should be hidden

      const wrapper = createWrapper(container).findFlashbar()!;
      await waitFor(() => {
        const items = wrapper.findItems();
        expect(items).toHaveLength(2);
        expect(items[0].findContent()!.getElement()).toHaveTextContent('Item 1');
        expect(items[1].findContent()!.getElement()).toHaveTextContent('Item 2');
      });
    });

    it('sets all items to visible when Promise.all fails', async () => {
      // Mock Promise.all to fail
      const originalPromiseAll = Promise.all;
      Promise.all = jest.fn().mockRejectedValue(new Error('Promise.all failed'));

      const items = createItems([true, true]);
      const { container } = render(<Flashbar items={items} />);
      const wrapper = createWrapper(container).findFlashbar()!;

      await waitFor(() => {
        expect(wrapper.findItems()).toHaveLength(2);
        expect(wrapper.findItems()[0].findContent()!.getElement()).toHaveTextContent('Item 0');
        expect(wrapper.findItems()[1].findContent()!.getElement()).toHaveTextContent('Item 1');
      });

      Promise.all = originalPromiseAll;
    });
  });
});
