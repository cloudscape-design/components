// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { fireNonCancelableEvent } from '../../internal/events';
import { useLoadItems as useBaseLoadItems } from '../../select/utils/use-load-items';
import { ButtonDropdownProps } from '../interfaces';

interface UseLoadItemsProps {
  onLoadItems: ButtonDropdownProps['onLoadItems'];
  items: ButtonDropdownProps.Items;
  statusType: ButtonDropdownProps.AsyncLoadingStatusType | undefined;
}

export const useLoadItems = ({ onLoadItems, items, statusType }: UseLoadItemsProps) => {
  const base = useBaseLoadItems({ onLoadItems, options: items, statusType });

  const fireLoadItems = (filteringText: string) => {
    if (onLoadItems) {
      base.fireLoadItems(filteringText);
    }
  };

  const handleRecoveryClick = (expandedGroupId?: string) =>
    expandedGroupId
      ? fireNonCancelableEvent(onLoadItems, { firstPage: false, samePage: true, filteringText: '', expandedGroupId })
      : base.handleRecoveryClick();

  const fireGroupLoadItems = (expandedGroupId: string) =>
    fireNonCancelableEvent(onLoadItems, { filteringText: '', firstPage: true, samePage: false, expandedGroupId });

  return {
    fireLoadItems,
    handleLoadMore: base.handleLoadMore,
    handleRecoveryClick,
    fireGroupLoadItems,
  };
};
