// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface DndContainerProps<Option> {
  options: readonly Option[];
  getOptionId(option: Option): string;
  disableReorder?: boolean;
  onReorder: (sortedOptions: readonly Option[]) => void;
  renderOption: (props: RenderOptionProps<Option>) => React.ReactNode;
  renderContent?: (content: React.ReactNode) => React.ReactNode;
  i18nStrings: ReorderI18n;
  dragOverlayClassName?: string;
}

export interface RenderOptionProps<Option> {
  ref?: React.RefCallback<HTMLElement>;
  option: Option;
  dragHandleAriaLabel?: string;
  listeners: { onPointerDown?: React.PointerEventHandler; onKeyDown?: React.KeyboardEventHandler };
  style: React.CSSProperties;
  isDragging: boolean;
  isSorting: boolean;
  isActive: boolean;
  attributes: { 'aria-disabled'?: boolean };
}

export interface ReorderOptions<Option> {
  options: readonly Option[];
  getOptionId(option: Option): string;
}

export interface ReorderI18n {
  liveAnnouncementDndStarted?: (position: number, total: number) => string;
  liveAnnouncementDndItemReordered?: (initialPosition: number, currentPosition: number, total: number) => string;
  liveAnnouncementDndItemCommitted?: (initialPosition: number, finalPosition: number, total: number) => string;
  liveAnnouncementDndDiscarded?: string;
  dragHandleAriaLabel?: string;
  dragHandleAriaDescription?: string;
}
