// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface DragHandleProps {
  variant?: DragHandleProps.Variant;
  size?: DragHandleProps.Size;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedby?: string;
  ariaValue?: DragHandleProps.AriaValue;
  active?: boolean;
  disabled?: boolean;
  className?: string;
  onPointerDown?: React.PointerEventHandler;
  onKeyDown?: React.KeyboardEventHandler;

  tooltipText?: string;
  directions?: Partial<Record<DragHandleProps.Direction, DragHandleProps.DirectionState>>;
  onDirectionClick?: (direction: DragHandleProps.Direction) => void;
  triggerMode?: DragHandleProps.TriggerMode;
  initialShowButtons?: boolean;
  /**
   * Hide the UAP buttons when dragging is active.
   */
  hideButtonsOnDrag?: boolean;
  /**
   * Max cursor movement (in pixels) that still counts as a press rather than
   * a drag. Small threshold needed for usability.
   */
  clickDragThreshold?: number;
}

export namespace DragHandleProps {
  export type Variant = 'drag-indicator' | 'resize-area' | 'resize-horizontal' | 'resize-vertical';

  export type Direction = 'block-start' | 'block-end' | 'inline-start' | 'inline-end';
  export type DirectionState = 'active' | 'disabled';
  export type TriggerMode = 'focus' | 'keyboard-activate';

  export type Size = 'small' | 'normal';

  export interface AriaValue {
    valueMin: number;
    valueMax: number;
    valueNow: number;
  }
}
