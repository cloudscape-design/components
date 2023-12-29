// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useRef, useState } from 'react';
import { AutosuggestProps } from '~components/autosuggest';

interface PendingRequest {
  resolve: (value: APIResponse) => void;
  reject: (reason: any) => void;
  params: {
    filteringText: string;
    pageNumber: number;
  };
}

interface APIResponse {
  items: NonNullable<unknown[]>;
  hasNextPage: boolean;
}

// Pending requests are used to override the result programmatically in integration tests:
// > window.__pendingRequests.shift().resolve({ items, hasNextPage });
interface ExtendedWindow extends Window {
  __pendingRequests: Array<PendingRequest>;
}
declare const window: ExtendedWindow;
const pendingRequests: Array<PendingRequest> = (window.__pendingRequests = []);

export interface OptionsLoaderProps<Item> {
  pageSize?: number;
  sourceItems?: readonly Item[];
  randomErrors?: boolean;
}

export interface OptionsLoaderState<Item> {
  data: readonly Item[];
  status: AutosuggestProps.StatusType;
}

export interface FetchItemsProps {
  firstPage: boolean;
  filteringText: string;
}

export function useOptionsLoader<Item>({ pageSize = 25, sourceItems, randomErrors = false }: OptionsLoaderProps<Item>) {
  const [items, setItems] = useState(new Array<Item>());
  const [status, setStatus] = useState<'pending' | 'loading' | 'finished' | 'error'>('pending');
  const filteringTextRef = useRef('');
  const pageNumberRef = useRef(0);

  function fetchSourceItems() {
    if (!sourceItems) {
      throw new Error('Invariant violation: no source items.');
    }
    return new Promise<APIResponse>((resolve, reject) =>
      setTimeout(() => {
        if (randomErrors && Math.random() < 0.3) {
          reject();
        } else {
          const pageNumber = pageNumberRef.current;
          const items = sourceItems.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
          const hasNextPage = items[items.length - 1] !== sourceItems[sourceItems.length - 1];
          resolve({ items, hasNextPage });
        }
      }, 1000)
    );
  }

  async function fetchItems({ firstPage, filteringText }: FetchItemsProps) {
    try {
      if (firstPage) {
        setItems([]);
        filteringTextRef.current = filteringText;
        pageNumberRef.current = 0;
      }
      if (filteringTextRef.current !== filteringText) {
        // There is another request in progress, discard the result of this one.
        return;
      }
      if (items.length === sourceItems?.length) {
        // All items are loaded.
        return;
      }

      setStatus('loading');

      const pageNumber = pageNumberRef.current;
      const response = await (sourceItems
        ? fetchSourceItems()
        : new Promise<APIResponse>((resolve, reject) =>
            pendingRequests.push({ resolve, reject, params: { filteringText, pageNumber } })
          ));

      pageNumberRef.current += 1;

      setItems(prev => [...prev, ...(response.items as Item[])]);
      setStatus(response.hasNextPage ? 'pending' : 'finished');
    } catch (error) {
      setStatus('error');
    }
  }

  return { items, status, fetchItems };
}
