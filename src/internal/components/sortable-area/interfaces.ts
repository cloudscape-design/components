// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { NonCancelableEventHandler } from '../../../types/events';
import { DndAreaI18nStrings as SharedDndAreaI18nStrings } from '../../../types/sortable-area';
import { DragHandleProps } from '../drag-handle/interfaces';

export interface SortableAreaProps<Item> {
  items: readonly Item[];
  itemDefinition: SortableAreaProps.ItemDefinition<Item>;
  renderItem: (props: SortableAreaProps.RenderItemProps<Item>) => React.ReactNode;
  onItemsChange?: NonCancelableEventHandler<SortableAreaProps.ItemsChangeDetail<Item>>;
  i18nStrings?: SortableAreaProps.DndAreaI18nStrings;
  disableReorder?: boolean;
  /**
   * Orientation of the sortable list. Defaults to `'vertical'`.
   * Use `'horizontal'` for horizontally-laid-out consumers (e.g. a tab strip);
   * it switches the sorting strategy and maps ArrowLeft/ArrowRight (RTL-aware) to reordering.
   */
  direction?: SortableAreaProps.Direction;
  /**
   * Fired when a pointer/keyboard drag starts inside this area's own `DndContext`.
   * Used by cross-list coordinators (e.g. Tabs reorder groups) to begin tracking a drag.
   */
  onReorderStart?: (activeItemId: string) => void;
  /**
   * Fired on every drag move with the dragged item's current translated rectangle
   * (viewport coordinates), or `null` if unavailable. Used to hit-test against sibling lists.
   */
  onReorderMove?: (activeItemId: string, rect: SortableAreaProps.DragRect | null) => void;
  /**
   * Fired when a drag ends, before the default within-list reorder is applied. Return `true`
   * to signal the drop was consumed by an external (cross-list) target, which suppresses the
   * within-list reorder for this drag.
   */
  onReorderEnd?: (activeItemId: string) => boolean;
  /**
   * Fired when a drag is cancelled (e.g. via Escape).
   */
  onReorderCancel?: () => void;
}

export namespace SortableAreaProps {
  export interface ItemDefinition<Item> {
    id: (item: Item) => string;
    label: (item: Item) => string;
    borderRadius?: BorderRadiusVariant;
  }

  export type BorderRadiusVariant = 'item' | 'container';

  export type Direction = 'vertical' | 'horizontal';

  /** Minimal viewport-coordinate rectangle used by cross-list drag hit-testing. */
  export interface DragRect {
    left: number;
    top: number;
    width: number;
    height: number;
  }

  export interface RenderItemProps<Item> {
    ref?: React.RefCallback<HTMLElement>;
    item: Item;
    id: string;
    style: React.CSSProperties;
    className?: string;
    isDropPlaceholder: boolean;
    isSortingActive: boolean;
    isDragGhost: boolean;
    dragHandleProps: DragHandleProps;
  }

  export interface ItemsChangeDetail<Item> {
    items: Item[];
    movedItem: Item;
  }

  export type DndAreaI18nStrings = SharedDndAreaI18nStrings;
}
