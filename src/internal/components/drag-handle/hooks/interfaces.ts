// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export type KeyboardInteractionStateValue = 'keyboard-start' | 'keyboard-end';
export type DndInteractionStateValue = 'dnd-start' | 'dnd-active' | 'dnd-end';
export type InteractionStateValue = null | KeyboardInteractionStateValue | DndInteractionStateValue;

export type CallbackType =
  | { type: 'onDndStart'; payload: PointerEvent }
  | { type: 'onDndActive'; payload: PointerEvent }
  | { type: 'onDndEnd' }
  | { type: 'onKeyboardStart' }
  | { type: 'onKeyboardEnd' };

export interface DragHandleInteractionState {
  state: InteractionStateValue;
  eventData?: PointerEvent; // Only relevant for dnd states
  pendingCallbacks?: CallbackType[];
}

export interface UseDragHandleInteractionStateProps {
  onDndStartAction?: (event: PointerEvent) => void;
  onDndActiveAction?: (event: PointerEvent) => void;
  onDndEndAction?: () => void;
  onKeyboardStartAction?: () => void;
  onKeyboardEndAction?: () => void;
}

interface PointerDownActionPayload {
  button: number;
  nativeEvent: PointerEvent;
}

interface PointerMoveActionPayload {
  nativeEvent: PointerEvent;
}

interface PointerUpActionPayload {
  nativeEvent: PointerEvent;
}

interface KeyDownActionPayload {
  key: string;
}

export type Action =
  | { type: 'POINTER_DOWN'; payload: PointerDownActionPayload }
  | { type: 'POINTER_MOVE'; payload: PointerMoveActionPayload }
  | { type: 'POINTER_UP'; payload: PointerUpActionPayload }
  | { type: 'KEY_DOWN'; payload: KeyDownActionPayload }
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'RESET_TO_IDLE' }
  | { type: 'CLEAR_CALLBACKS' };
