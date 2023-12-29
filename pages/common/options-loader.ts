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

export interface OptionsLoaderProps {
  pageSize?: number;
  timeout?: number;
  randomErrors?: boolean;
}

export interface OptionsLoaderState<Item> {
  data: readonly Item[];
  status: AutosuggestProps.StatusType;
}

export interface FetchItemsProps<Item> {
  firstPage: boolean;
  filteringText: string;
  sourceItems?: readonly Item[];
}

export function useOptionsLoader<Item>({ pageSize = 25, timeout = 1000, randomErrors = false }: OptionsLoaderProps) {
  const [items, setItems] = useState(new Array<Item>());
  const [status, setStatus] = useState<'pending' | 'loading' | 'finished' | 'error'>('pending');
  const [filteringText, setFilteringText] = useState('');
  const requestsRef = useRef(new Array<FakeRequest<APIResponse>>());

  function cancelRequests() {
    requestsRef.current.forEach(rq => (rq.cancelled = true));
    requestsRef.current = [];
  }

  function hasPendingRequest() {
    return requestsRef.current.some(rq => !rq.resolved && !rq.rejected);
  }

  function getNextPageNumber() {
    const resolvedRequests = requestsRef.current.filter(rq => rq.resolved);
    const lastResolved = resolvedRequests[resolvedRequests.length - 1];
    return !lastResolved ? 0 : lastResolved.pageNumber + 1;
  }

  function fetchSourceItems(pageNumber: number, sourceItems: readonly Item[]) {
    return new FakeRequest<APIResponse>(pageNumber, (resolve, reject) =>
      setTimeout(() => {
        if (randomErrors && Math.random() < 0.3) {
          reject();
        } else {
          const nextItems = sourceItems.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
          resolve({ items: nextItems, hasNextPage: items.length + nextItems.length < sourceItems.length });
        }
      }, timeout)
    );
  }

  function issuePendingRequest(pageNumber: number, filteringText: string) {
    const params = { filteringText, pageNumber };
    return new FakeRequest<APIResponse>(pageNumber, (resolve, reject) =>
      pendingRequests.push({ resolve, reject, params })
    );
  }

  function fetchItems({ sourceItems, firstPage, filteringText: nextFilteringText }: FetchItemsProps<Item>) {
    if (firstPage) {
      setItems([]);
      setFilteringText(nextFilteringText);
      cancelRequests();
    }

    if (hasPendingRequest()) {
      return;
    }

    setStatus('loading');

    const pageNumber = getNextPageNumber();
    const request = sourceItems
      ? fetchSourceItems(pageNumber, sourceItems)
      : issuePendingRequest(pageNumber, nextFilteringText);
    requestsRef.current.push(request);

    request.promise
      .then(response => {
        setItems(prev => [...prev, ...(response.items as Item[])]);
        setStatus(response.hasNextPage ? 'pending' : 'finished');
      })
      .catch(() => {
        setStatus('error');
      });
  }

  return { items, status, filteringText, fetchItems };
}

class FakeRequest<T> {
  pageNumber: number;
  promise: Promise<T>;
  cancelled = false;
  resolved = false;
  rejected = false;

  constructor(pageNumber: number, onResolve: (resolve: (value: T) => void, reject: () => void) => void) {
    this.pageNumber = pageNumber;
    this.promise = new Promise((resolve, reject) => {
      if (!this.cancelled) {
        onResolve(
          value => {
            this.resolved = true;
            resolve(value);
          },
          () => {
            this.rejected = true;
            reject();
          }
        );
      }
    });
  }
}
