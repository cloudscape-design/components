// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type Direction = 'block-start' | 'block-end' | 'inline-start' | 'inline-end';
export type DirectionState = 'active' | 'disabled';
export type TriggerMode = 'focus' | 'keyboard-activate' | 'controlled';

export interface DragHandleWrapperProps {
  directions: Partial<Record<Direction, DirectionState>>;
  onDirectionClick?: (direction: Direction) => void;
  tooltipText?: string;
  children: React.ReactNode;
  triggerMode?: TriggerMode;
  initialShowButtons?: boolean;
  controlledShowButtons?: boolean;
  hideButtonsOnDrag: boolean;
  clickDragThreshold: number;
}
