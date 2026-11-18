// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef } from 'react';

import { OptionsLoadItemsDetail } from '../../../dropdown/interfaces';
import { DropdownStatusProps } from '../../../types/dropdown-status';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../events';

interface UseLoadItemsProps {
  onLoadItems: NonCancelableEventHandler<OptionsLoadItemsDetail> | undefined;
  isEmpty: boolean;
  statusType: DropdownStatusProps.StatusType | undefined;
}

export const useLoadItems = ({ onLoadItems, isEmpty, statusType }: UseLoadItemsProps) => {
  const prevFilteringText = useRef<string | undefined>(undefined);

  const fireLoadItems = (filteringText: string) => {
    if (prevFilteringText.current === filteringText) {
      return;
    }
    prevFilteringText.current = filteringText;
    fireNonCancelableEvent(onLoadItems, { filteringText, firstPage: true, samePage: false });
  };

  const handleLoadMore = () => {
    if (statusType === 'pending') {
      fireNonCancelableEvent(onLoadItems, {
        firstPage: isEmpty,
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
