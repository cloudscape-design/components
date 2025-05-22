// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type UapActionInteractionStateValue = 'uap-action-start' | 'uap-action-end';
export type DndInteractionStateValue = 'dnd-start' | 'dnd-active' | 'dnd-end';
export type InteractionState = null | UapActionInteractionStateValue | DndInteractionStateValue;

export type StateTransitionCallbacks<T = void> =
  | { type: 'onDndStart'; payload: PointerEvent; metadata?: T }
  | { type: 'onDndActive'; payload: PointerEvent }
  | { type: 'onDndEnd' }
  | { type: 'onUapActionStart'; metadata?: T }
  | { type: 'onUapActionEnd' };

export interface DragHandleInteractionState<T = void> {
  value: InteractionState;
  eventData?: PointerEvent; // Only relevant for dnd states
  metadata?: T;
  transitionCallbacks?: StateTransitionCallbacks<T>[];
}

export interface UseDragHandleInteractionStateProps<T = void> {
  onDndStartAction?: (event: PointerEvent, metadata?: T) => void;
  onDndActiveAction?: (event: PointerEvent) => void;
  onDndEndAction?: () => void;
  onUapActionStartAction?: (metadata?: T) => void;
  onUapActionEndAction?: () => void;
}

interface DefaultActionPayload {
  nativeEvent: PointerEvent;
}

interface PointerDownActionPayload<T = void> extends DefaultActionPayload {
  metadata?: T;
}

interface KeyDownActionPayload<T = void> {
  key: string;
  metadata?: T;
}

export type Action<T = void> =
  | { type: 'POINTER_DOWN'; payload: PointerDownActionPayload<T> }
  | { type: 'POINTER_MOVE'; payload: DefaultActionPayload }
  | { type: 'POINTER_UP'; payload: DefaultActionPayload }
  | { type: 'POINTER_CANCEL' }
  | { type: 'KEY_DOWN'; payload: KeyDownActionPayload<T> }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'RESET_TO_IDLE' }
  | { type: 'CLEAR_CALLBACKS' };
