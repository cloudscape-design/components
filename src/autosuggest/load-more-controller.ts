// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';

import { OptionsLoadItemsDetail } from '../internal/components/dropdown/interfaces';
import { DropdownStatusProps } from '../internal/components/dropdown-status/interfaces';
import { AutosuggestProps } from './interfaces';

export interface UseAutosuggestLoadMoreProps {
  options?: AutosuggestProps.Options;
  statusType: DropdownStatusProps.StatusType;
  onLoadItems: (detail: OptionsLoadItemsDetail) => void;
}

export interface AutosuggestLoadMoreHandlers {
  fireLoadMoreOnScroll(): void;
  fireLoadMoreOnRecoveryClick(): void;
  fireLoadMoreOnInputFocus(): void;
  fireLoadMoreOnInputChange(filteringText: string): void;
}

export const useAutosuggestLoadMore = ({
  options = [],
  statusType,
  onLoadItems,
}: UseAutosuggestLoadMoreProps): AutosuggestLoadMoreHandlers => {
  const lastFilteringText = useRef<string | null>(null);

  const fireLoadMore = ({
    firstPage,
    samePage,
    filteringText,
  }: {
    firstPage: boolean;
    samePage: boolean;
    filteringText?: string;
  }) => {
    if (filteringText === undefined || lastFilteringText.current !== filteringText) {
      if (filteringText !== undefined) {
        lastFilteringText.current = filteringText;
      }
      onLoadItems({ filteringText: lastFilteringText.current ?? '', firstPage, samePage });
    }
  };

  const fireLoadMoreOnScroll = () => {
    options.length > 0 && statusType === 'pending' && fireLoadMore({ firstPage: false, samePage: false });
  };

  const fireLoadMoreOnRecoveryClick = () => fireLoadMore({ firstPage: false, samePage: true });

  const fireLoadMoreOnInputFocus = () => fireLoadMore({ firstPage: true, samePage: false, filteringText: '' });

  const fireLoadMoreOnInputChange = (filteringText: string) =>
    fireLoadMore({ firstPage: true, samePage: false, filteringText });

  return { fireLoadMoreOnScroll, fireLoadMoreOnRecoveryClick, fireLoadMoreOnInputFocus, fireLoadMoreOnInputChange };
};
