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
}

export namespace SortableAreaProps {
  export interface ItemDefinition<Item> {
    id: (item: Item) => string;
    label: (item: Item) => string;
    borderRadius?: BorderRadiusVariant;
  }

  export type BorderRadiusVariant = 'item' | 'container';

  export type Direction = 'vertical' | 'horizontal';

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
