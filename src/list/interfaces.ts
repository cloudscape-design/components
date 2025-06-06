// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { StructuredItemProps } from '../internal/components/structured-item/interfaces';
import { NonCancelableEventHandler } from '../internal/events';

export interface ListProps<T = any> {
  items: ReadonlyArray<T>;
  renderItem: (item: T) => StructuredItemProps & { id: string; announcementLabel?: string };
  tag?: 'ol' | 'ul';
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
   *
   */
  sortDisabled?: boolean;
  /**
   * Removes padding around list items
   */
  disablePaddings?: boolean;
  /**
   * Called when items are reordered in a sortable list.
   */
  onSortingChange?: NonCancelableEventHandler<ListProps.SortingState<T>>;
  /**
   * Internationalization strings for the sortable functionality.
   */
  i18nStrings?: {
    /**
     * Aria label for the drag handle.
     */
    dragHandleAriaLabel?: string;
    /**
     * Aria description for the drag handle.
     */
    dragHandleAriaDescription?: string;
    /**
     * Announcement when drag and drop starts.
     */
    liveAnnouncementDndStarted?: (position: number, total: number) => string;
    /**
     * Announcement when an item is reordered during drag and drop.
     */
    liveAnnouncementDndItemReordered?: (initialPosition: number, currentPosition: number, total: number) => string;
    /**
     * Announcement when drag and drop is committed.
     */
    liveAnnouncementDndItemCommitted?: (initialPosition: number, finalPosition: number, total: number) => string;
    /**
     * Announcement when drag and drop is discarded.
     */
    liveAnnouncementDndDiscarded?: string;
  };
}

export namespace ListProps {
  export interface SortingState<T> {
    items: ReadonlyArray<T>;
  }
}
