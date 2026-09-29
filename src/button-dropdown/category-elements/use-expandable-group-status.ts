// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../../i18n/context';
import { DropdownStatusResult, useDropdownStatus } from '../../internal/components/dropdown-status';
import { ButtonDropdownProps } from '../interfaces';
import { CategoryProps } from '../internal-interfaces';

type UseExpandableGroupStatusProps = Pick<
  CategoryProps,
  'item' | 'asyncLoadingProps' | 'getExpandableItemsAsyncLoadingState' | 'onGroupRecoveryClick' | 'filteringEnabled'
> & {
  // Focused after the recovery action in menu (non-filtering) mode, where focus sits on the group header.
  triggerRef: React.RefObject<HTMLElement>;
};

interface ExpandableGroupStatus {
  status: DropdownStatusResult;
  footerId: string;
  hasGroupItems: boolean;
}

/**
 * Derives the async loading status UI of an expandable group from `getExpandableItemsAsyncLoadingState`.
 * Shared by the desktop (fly-out) and mobile (inline) expandable category elements so both render the
 * same loading, error, empty, and finished states.
 */
export function useExpandableGroupStatus({
  item,
  asyncLoadingProps,
  getExpandableItemsAsyncLoadingState,
  onGroupRecoveryClick,
  filteringEnabled,
  triggerRef,
}: UseExpandableGroupStatusProps): ExpandableGroupStatus {
  const groupId = item.id;
  const footerId = useUniqueId('awsui-button-dropdown__group-footer');
  const hasGroupItems = !!item.items && item.items.length > 0;

  // A group is loaded as a whole, so `pending` (more pages available) has no meaning here.
  const reportedStatus = groupId ? getExpandableItemsAsyncLoadingState?.({ item }) : undefined;
  const statusType: ButtonDropdownProps.AsyncLoadingStatusType | undefined =
    reportedStatus === 'pending' ? 'finished' : (reportedStatus ?? undefined);

  const i18n = useInternalI18n('button-dropdown');
  const recoveryText = i18n('recoveryText', asyncLoadingProps?.recoveryText);
  const errorIconAriaLabel = i18n('errorIconAriaLabel', asyncLoadingProps?.errorIconAriaLabel);

  const status = useDropdownStatus({
    statusType,
    empty: asyncLoadingProps?.empty?.(groupId),
    loadingText: asyncLoadingProps?.loadingText?.(groupId),
    finishedText: asyncLoadingProps?.finishedText?.(groupId),
    errorText: asyncLoadingProps?.errorText?.(groupId),
    recoveryText,
    errorIconAriaLabel,
    isEmpty: !hasGroupItems,
    isNoMatch: false,
    hasRecoveryCallback: !!onGroupRecoveryClick,
    onRecoveryClick: () => {
      if (groupId) {
        onGroupRecoveryClick?.(groupId);
      }
      // The recovery button disappears once loading starts. In menu mode keep focus on the group
      // header so the dropdown stays open; in filtering mode the root moves focus back to the filter.
      if (!filteringEnabled) {
        triggerRef.current?.focus();
      }
    },
  });

  return { status, footerId, hasGroupItems };
}
