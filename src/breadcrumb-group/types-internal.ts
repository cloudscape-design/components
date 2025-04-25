// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { LinkItem } from '../button-dropdown/interfaces';
import { CancelableEventHandler } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { BreadcrumbGroupProps } from './interfaces';
import * as types from './types-public';

export type InternalBreadcrumbGroupProps<T extends types.Item = types.Item> = BreadcrumbGroupProps<T> &
  InternalBaseComponentProps & {
    __injectAnalyticsComponentMetadata?: boolean;
  };

export interface BreadcrumbItemProps<T extends types.Item> {
  item: T;
  itemIndex: number;
  totalCount: number;
  isTruncated?: boolean;
  isGhost?: boolean;
  onClick?: CancelableEventHandler<types.ClickDetail<T>>;
  onFollow?: CancelableEventHandler<types.ClickDetail<T>>;
}

export interface EllipsisDropdownProps {
  ariaLabel?: BreadcrumbGroupProps['expandAriaLabel'];
  dropdownItems: ReadonlyArray<LinkItem>;
  onDropdownItemClick: CancelableEventHandler<{ id: string }>;
  onDropdownItemFollow: CancelableEventHandler<{ id: string }>;
  visible?: boolean;
}
