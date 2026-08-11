// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef } from 'react';

import { fireNonCancelableEvent } from '../../internal/events';
import { DropdownStatusProps } from '../../types/dropdown-status';
import { ButtonDropdownProps } from '../interfaces';

interface UseLoadItemsProps {
  onLoadItems: ButtonDropdownProps['onLoadItems'];
  items: ButtonDropdownProps.Items;
  statusType: DropdownStatusProps.StatusType;
}

export const useLoadItems = ({ onLoadItems, items, statusType }: UseLoadItemsProps) => {
  const prevFilteringText = useRef<string | undefined>(undefined);

  const fireLoadItems = (filteringText: string) => {
    if (prevFilteringText.current === filteringText) {
      return;
    }
    prevFilteringText.current = filteringText;
    fireNonCancelableEvent(onLoadItems, { filteringText, firstPage: true, samePage: false });
  };

  const handleLoadMore = () => {
    const firstPage = items.length === 0;
    if (statusType === 'pending') {
      fireNonCancelableEvent(onLoadItems, {
        firstPage,
        samePage: false,
        filteringText: prevFilteringText.current || '',
      });
    }
  };

  const handleRecoveryClick = () =>
    fireNonCancelableEvent(onLoadItems, {
      firstPage: false,
      samePage: true,
      filteringText: prevFilteringText.current || '',
    });

  return {
    fireLoadItems,
    handleLoadMore,
    handleRecoveryClick,
  };
};
