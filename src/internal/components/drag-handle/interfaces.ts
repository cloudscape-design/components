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
  disabled?: boolean;
  className?: string;
  onPointerDown?: React.PointerEventHandler;
  onKeyDown?: React.KeyboardEventHandler;

  tooltipText?: string;
  directions?: Partial<Record<DragHandleProps.Direction, DragHandleProps.DirectionState>>;
  onDirectionClick?: (direction: DragHandleProps.Direction) => void;
  triggerMode?: TriggerMode;
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
