// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';

import { DropdownStatusProps } from '../../internal/components/dropdown-status/interfaces';
import { PromptInputProps } from '../interfaces';

interface UseMenuLoadMoreProps {
  menu: PromptInputProps.MenuDefinition;
  statusType: DropdownStatusProps.StatusType;
  onLoadItems: (detail: PromptInputProps.MenuLoadItemsDetail) => void;
  onLoadMoreItems?: () => void;
}

interface MenuLoadMoreHandlers {
  fireLoadMoreOnScroll(): void;
  fireLoadMoreOnRecoveryClick(): void;
  fireLoadMoreOnMenuOpen(): void;
  fireLoadMoreOnInputChange(filteringText: string): void;
}

export const useMenuLoadMore = ({
  menu,
  statusType,
  onLoadItems,
  onLoadMoreItems,
}: UseMenuLoadMoreProps): MenuLoadMoreHandlers => {
  const lastFilteringText = useRef<string | null>(null);

  const fireLoadMore = (firstPage: boolean, samePage: boolean, filteringText?: string) => {
    if (filteringText !== undefined && filteringText !== lastFilteringText.current) {
      lastFilteringText.current = filteringText;
    }

    if (filteringText === undefined || lastFilteringText.current !== filteringText) {
      onLoadItems({
        menuId: menu.id,
        filteringText: lastFilteringText.current ?? '',
        firstPage,
        samePage,
      });
    }
  };

  const fireLoadMoreOnScroll = () => {
    if (menu.options.length > 0 && statusType === 'pending') {
      onLoadMoreItems ? onLoadMoreItems() : fireLoadMore(false, false);
    }
  };

  const fireLoadMoreOnRecoveryClick = () => fireLoadMore(false, true);

  const fireLoadMoreOnMenuOpen = () => fireLoadMore(true, false, lastFilteringText.current ?? '');

  const fireLoadMoreOnInputChange = (filteringText: string) => fireLoadMore(true, false, filteringText);

  return { fireLoadMoreOnScroll, fireLoadMoreOnRecoveryClick, fireLoadMoreOnMenuOpen, fireLoadMoreOnInputChange };
};
