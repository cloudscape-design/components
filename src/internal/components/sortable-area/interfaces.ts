// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { NonCancelableEventHandler } from '../../events';
import { DragHandleProps } from '../drag-handle/interfaces';

export interface SortableAreaProps<Item> {
  items: readonly Item[];
  itemDefinition: SortableAreaProps.ItemDefinition<Item>;
  renderItem: (props: SortableAreaProps.RenderItemProps<Item>) => React.ReactNode;
  onItemsChange?: NonCancelableEventHandler<SortableAreaProps.ItemsChangeDetail<Item>>;
  i18nStrings?: SortableAreaProps.DndAreaI18nStrings;
  disableReorder?: boolean;
}

export namespace SortableAreaProps {
  export interface ItemDefinition<Item> {
    id: (item: Item) => string;
    label: (item: Item) => string;
    borderRadius?: BorderRadiusVariant;
  }

  export type BorderRadiusVariant = 'item' | 'container';

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

  export interface DndAreaI18nStrings {
    liveAnnouncementDndStarted?: (position: number, total: number) => string;
    liveAnnouncementDndItemReordered?: (initialPosition: number, currentPosition: number, total: number) => string;
    liveAnnouncementDndItemCommitted?: (initialPosition: number, finalPosition: number, total: number) => string;
    liveAnnouncementDndDiscarded?: string;
    dragHandleAriaLabel?: string;
    dragHandleAriaDescription?: string;
  }
}
