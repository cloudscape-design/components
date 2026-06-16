// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { useMemo, useRef, useState } from 'react';

import { MultiselectProps } from '@cloudscape-design/components/multiselect';

import { ContentOriginsResource } from '../../resources/types';

interface RequestParams {
  filteringText?: string;
  currentPageIndex: number;
}

interface LoadItemsDetail {
  filteringText: string;
  firstPage: boolean;
  samePage: boolean;
}

interface Handlers {
  onLoadItems: (args: { detail: LoadItemsDetail }) => void;
}

export default function useContentOrigins(): [
  {
    options: ContentOriginsResource[];
    filteringText: string | undefined;
    status: MultiselectProps['statusType'];
  },
  Handlers,
] {
  const requestParams = useRef<RequestParams>({ currentPageIndex: 1 });
  const [options, setOptions] = useState<ContentOriginsResource[]>([]);
  const [status, setStatus] = useState<MultiselectProps['statusType']>('finished');

  async function doRequest({ filteringText, currentPageIndex }: RequestParams): Promise<void> {
    setStatus('loading');
    try {
      const { origins, hasNextPage } = await window.FakeServer.fetchContentOrigins({
        filteringText: filteringText!,
        currentPageIndex,
      });
      if (filteringText !== requestParams.current.filteringText) {
        return;
      }
      if (currentPageIndex === 1) {
        setOptions(origins);
      } else {
        setOptions(oldOptions => [...oldOptions, ...origins]);
      }
      setStatus(hasNextPage ? 'pending' : 'finished');
    } catch (error) {
      setStatus('error');
    }
  }

  const handlers = useMemo(() => {
    return {
      onLoadItems({ detail: { filteringText, firstPage, samePage } }: { detail: LoadItemsDetail }) {
        if (firstPage) {
          requestParams.current = {
            filteringText,
            currentPageIndex: 1,
          };
          setOptions([]);
        } else if (!samePage) {
          requestParams.current = {
            ...requestParams.current,
            currentPageIndex: requestParams.current.currentPageIndex + 1,
          };
        }
        doRequest(requestParams.current);
      },
    };
  }, []);

  return [{ options, filteringText: requestParams.current.filteringText, status }, handlers];
}
