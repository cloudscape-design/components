// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { NonCancelableEventHandler } from '../../types/events';

export interface RowReorderingProps<T = any> {
  /**
   * Callback fired when the user finishes reordering a row.
   * `detail.items` is the new reordered array; `detail.movedItem` is the item that was dragged.
   */
  onRowReorder: NonCancelableEventHandler<RowReorderingProps.RowReorderDetail<T>>;
  /**
   * i18n strings required for accessibility announcements and the drag handle label.
   */
  i18nStrings?: RowReorderingProps.I18nStrings<T>;
}

export namespace RowReorderingProps {
  export interface RowReorderDetail<T> {
    items: T[];
    movedItem: T;
  }

  export interface I18nStrings<T = any> {
    /** Accessible label for the drag handle column header (screen readers). */
    dragHandleAriaLabel?: string;
    /** Accessible description for the drag handle (e.g. instructions). */
    dragHandleAriaDescription?: string;
    /** Called to build the live-region text when dragging starts. */
    liveAnnouncementDndStarted?: (position: number, total: number) => string;
    /** Called to build the live-region text when item is reordered mid-drag. */
    liveAnnouncementDndItemReordered?: (initialPosition: number, currentPosition: number, total: number) => string;
    /** Called to build the live-region text when drag is committed. */
    liveAnnouncementDndItemCommitted?: (initialPosition: number, finalPosition: number, total: number) => string;
    /** Live-region text when drag is cancelled. */
    liveAnnouncementDndDiscarded?: string;
    /** Aria label per row item (for the drag handle button). */
    dragHandleItemAriaLabel?: (item: T) => string;
  }
}
