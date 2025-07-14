// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef } from 'react';

import { DropdownStatusProps } from '../../internal/components/dropdown-status/index.js';
import { OptionDefinition, OptionGroup } from '../../internal/components/option/interfaces.js';
import { fireNonCancelableEvent } from '../../internal/events/index.js';
import { SelectProps } from '../interfaces.js';

interface UseLoadItemsProps {
  onLoadItems: SelectProps['onLoadItems'];
  options: ReadonlyArray<OptionDefinition | OptionGroup>;
  statusType: DropdownStatusProps.StatusType;
}

export const useLoadItems = ({ onLoadItems, options, statusType }: UseLoadItemsProps) => {
  const prevFilteringText = useRef<string | undefined>(undefined);

  const fireLoadItems = (filteringText: string) => {
    if (prevFilteringText.current === filteringText) {
      return;
    }
    prevFilteringText.current = filteringText;
    fireNonCancelableEvent(onLoadItems, { filteringText, firstPage: true, samePage: false });
  };

  const handleLoadMore = () => {
    const firstPage = options.length === 0;
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
