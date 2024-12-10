// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface DndContainerProps<Data> {
  items: readonly DndContainerItem<Data>[];
  renderItem: (props: RenderItemProps<Data>) => React.ReactNode;
  onItemsChange: (sortedOptions: readonly DndContainerItem<Data>[]) => void;
  i18nStrings: DndContainerI18nStrings;
  disableReorder?: boolean;
  dragOverlayClassName?: string;
}

export interface DndContainerItem<Data> {
  id: string;
  label: string;
  data: Data;
}

export interface RenderItemProps<Data> {
  ref?: React.RefCallback<HTMLElement>;
  item: DndContainerItem<Data>;
  style: React.CSSProperties;
  isDragging: boolean;
  isSorting: boolean;
  isActive: boolean;
  dragHandleAttributes: {
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-disabled'?: boolean;
  };
  dragHandleListeners?: {
    onPointerDown?: React.PointerEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
  };
}

export interface DndContainerI18nStrings {
  liveAnnouncementDndStarted?: (position: number, total: number) => string;
  liveAnnouncementDndItemReordered?: (initialPosition: number, currentPosition: number, total: number) => string;
  liveAnnouncementDndItemCommitted?: (initialPosition: number, finalPosition: number, total: number) => string;
  liveAnnouncementDndDiscarded?: string;
  dragHandleAriaLabel?: string;
  dragHandleAriaDescription?: string;
}
