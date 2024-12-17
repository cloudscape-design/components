// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface DndAreaProps<Data> {
  items: readonly DndAreaItem<Data>[];
  renderItem: (props: RenderItemProps<Data>) => React.ReactNode;
  onItemsChange: (sortedOptions: readonly DndAreaItem<Data>[]) => void;
  i18nStrings: DndAreaI18nStrings;
  disableReorder?: boolean;
  borderRadiusVariant?: 'item' | 'container';
}

export interface DndAreaItem<Data> {
  id: string;
  label: string;
  data: Data;
}

export interface RenderItemProps<Data> {
  ref?: React.RefCallback<HTMLElement>;
  item: DndAreaItem<Data>;
  style: React.CSSProperties;
  className?: string;
  isDragging: boolean;
  isSorting: boolean;
  isActive: boolean;
  dragHandleProps: {
    ariaLabel: string;
    ariaDescribedby?: string;
    disabled?: boolean;
    onPointerDown?: React.PointerEventHandler;
    onKeyDown?: React.KeyboardEventHandler;
  };
}

export interface DndAreaI18nStrings {
  liveAnnouncementDndStarted?: (position: number, total: number) => string;
  liveAnnouncementDndItemReordered?: (initialPosition: number, currentPosition: number, total: number) => string;
  liveAnnouncementDndItemCommitted?: (initialPosition: number, finalPosition: number, total: number) => string;
  liveAnnouncementDndDiscarded?: string;
  dragHandleAriaLabel?: string;
  dragHandleAriaDescription?: string;
}
