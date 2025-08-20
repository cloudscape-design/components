// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {
  Direction as WrapperDirection,
  DirectionState as WrapperDirectionState,
  TriggerMode,
} from '../drag-handle-wrapper/interfaces';

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
  onClick?: React.MouseEventHandler;

  tooltipText?: string;
  directions?: Partial<Record<DragHandleProps.Direction, DragHandleProps.DirectionState>>;
  onDirectionClick?: (direction: DragHandleProps.Direction) => void;
  triggerMode?: TriggerMode;
  initialShowButtons?: boolean;
  controlledShowButtons?: boolean;
  /**
   * Hide the UAP buttons when dragging is active.
   */
  hideButtonsOnDrag?: boolean;
  /**
   * Max cursor movement (in pixels) that still counts as a press rather than
   * a drag. Small threshold needed for usability.
   */
  clickDragThreshold?: number;
  ref?: React.RefObject<HTMLElement>;
}

export namespace DragHandleProps {
  export type Variant = 'drag-indicator' | 'resize-area' | 'resize-horizontal' | 'resize-vertical';

  export type Direction = WrapperDirection;
  export type DirectionState = WrapperDirectionState;

  export type Size = 'small' | 'normal';

  export interface AriaValue {
    valueMin: number;
    valueMax: number;
    valueNow: number;
  }
}
