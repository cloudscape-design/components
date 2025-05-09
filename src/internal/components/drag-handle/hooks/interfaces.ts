// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type KeyboardInteractionStateValue = 'keyboard-start' | 'keyboard-end';
export type DndInteractionStateValue = 'dnd-start' | 'dnd-active' | 'dnd-end';
export type InteractionStateValue = null | KeyboardInteractionStateValue | DndInteractionStateValue;

export type CallbackType<T = void> =
  | { type: 'onDndStart'; payload: PointerEvent; metadata?: T }
  | { type: 'onDndActive'; payload: PointerEvent }
  | { type: 'onDndEnd' }
  | { type: 'onKeyboardStart'; metadata?: T }
  | { type: 'onKeyboardEnd' };

export interface DragHandleInteractionState<T = void> {
  state: InteractionStateValue;
  eventData?: PointerEvent; // Only relevant for dnd states
  metadata?: T;
  pendingCallbacks?: CallbackType<T>[];
}

export interface UseDragHandleInteractionStateProps<T = void> {
  onDndStartAction?: (event: PointerEvent, metadata?: T) => void;
  onDndActiveAction?: (event: PointerEvent) => void;
  onDndEndAction?: () => void;
  onKeyboardStartAction?: (metadata?: T) => void;
  onKeyboardEndAction?: () => void;
}

interface PointerDownActionPayload<T = void> {
  button: number;
  nativeEvent: PointerEvent;
  metadata?: T;
}

interface PointerMoveActionPayload {
  nativeEvent: PointerEvent;
}

interface PointerUpActionPayload {
  nativeEvent: PointerEvent;
}

interface KeyDownActionPayload<T = void> {
  key: string;
  metadata?: T;
}

export type Action<T = void> =
  | { type: 'POINTER_DOWN'; payload: PointerDownActionPayload<T> }
  | { type: 'POINTER_MOVE'; payload: PointerMoveActionPayload }
  | { type: 'POINTER_UP'; payload: PointerUpActionPayload }
  | { type: 'KEY_DOWN'; payload: KeyDownActionPayload<T> }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'RESET_TO_IDLE' }
  | { type: 'CLEAR_CALLBACKS' };
