// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';

import { SortableAreaProps } from '../internal/components/sortable-area/index.js';
import { NonCancelableEventHandler } from '../internal/events/index.js';

export interface ListProps<T = any> {
  /**
   * The items to display in the list.
   */
  items: ReadonlyArray<T>;

  /**
   * Render an item. The function should return an object with the following keys:
   * * `id` (string) - A unique identifier for the item.
   * * `content` (React.ReactNode) - The content of the item.
   * * `secondaryContent` (React.ReactNode) - (Optional) Secondary content, for example item description.
   * * `icon` (React.ReactNode) - (Optional) An icon, displayed at the start.
   * * `action` (React.ReactNode) - (Optional) Action button(s).
   * * `announcementLabel` (string) - (Optional) An announcement label for the item, used when sorting.
   *    By default, the `content` is used: a custom label should be provided if `content` is not a string.
   */
  renderItem: (item: T) => {
    id: string;
    content: ReactNode;
    secondaryContent?: ReactNode;
    icon?: ReactNode;
    action?: ReactNode;
    announcementLabel?: string;
  };

  /**
   * The HTML tag to render. By default `ul` is used for standard lists and `ol` for sortable lists.
   */
  tagOverride?: 'ol' | 'ul';

  /**
   * Adds an aria-label to the list.
   */
  ariaLabel?: string;
  /**
   * Adds an aria-labelledby to the list.
   */
  ariaLabelledby?: string;
  /**
   * Adds an aria-describedby to the list.
   */
  ariaDescribedby?: string;
  /**
   * Makes the list sortable by enabling drag and drop functionality.
   */
  sortable?: boolean;
  /**
   * Disables sorting drag handles. Use this to temporarily prevent users from reordering the list.
   */
  sortDisabled?: boolean;
  /**
   * Removes padding around and inside list items.
   */
  disableItemPaddings?: boolean;
  /**
   * Removes top and bottom padding around the list. Does not apply for sortable lists.
   */
  disablePaddings?: boolean;
  /**
   * Called when items are reordered in a sortable list.
   */
  onSortingChange?: NonCancelableEventHandler<ListProps.SortingState<T>>;
  /**
   * An object containing all the localized strings required by the component.
   *
   * - `liveAnnouncementDndStarted` ((position: number, total: number) => string) - (Optional) Adds a message to be announced by screen readers when an item is picked for reordering.
   * - `liveAnnouncementDndDiscarded` (string) - (Optional) Adds a message to be announced by screen readers when a reordering action is canceled.
   * - `liveAnnouncementDndItemReordered` ((initialPosition: number, currentPosition: number, total: number) => string) - (Optional) Adds a message to be announced by screen readers when an item is being moved.
   * - `liveAnnouncementDndItemCommitted` ((initialPosition: number, finalPosition: number, total: number) => string) - (Optional) Adds a message to be announced by screen readers when a reordering action is committed.
   * - `dragHandleAriaDescription` (string) - (Optional) Adds an ARIA description for the drag handle.
   * - `dragHandleAriaLabel` (string) - (Optional) Adds an ARIA label for the drag handle.
   *
   * @i18n
   */
  i18nStrings?: ListProps.I18nStrings;
}

export namespace ListProps {
  export interface SortingState<T> {
    items: ReadonlyArray<T>;
  }

  export type I18nStrings = SortableAreaProps.DndAreaI18nStrings;
}
