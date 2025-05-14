// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useEffect, useReducer, useRef } from 'react';

import type {
  Action,
  DragHandleInteractionState,
  StateTransitionCallbacks,
  UseDragHandleInteractionStateProps,
} from './interfaces';

export { UseDragHandleInteractionStateProps };

export function calculateNextState<T = void>(
  state: DragHandleInteractionState<T>,
  action: Action<T>
): DragHandleInteractionState<T> {
  switch (action.type) {
    case 'POINTER_DOWN': {
      const { nativeEvent, metadata } = action.payload;
      return {
        state: 'dnd-start',
        eventData: nativeEvent,
        metadata,
      };
    }

    case 'POINTER_MOVE': {
      const { nativeEvent } = action.payload;
      if (state.state === 'dnd-start' || state.state === 'dnd-active') {
        return {
          ...state,
          state: 'dnd-active',
          eventData: nativeEvent,
        };
      }
      return state;
    }

    case 'POINTER_UP': {
      if (state.state === 'dnd-start' || state.state === 'dnd-active') {
        const dndSubStateBeforeUp = state.state;
        if (dndSubStateBeforeUp === 'dnd-start') {
          return {
            state: 'uap-action-start',
            metadata: state.metadata, // Preserve metadata when transitioning from dnd-start to uap-action-start
          };
        } else {
          return {
            state: 'dnd-end',
            eventData: state.eventData,
          };
        }
      }
      return state;
    }

    case 'KEY_DOWN': {
      const { key, metadata } = action.payload;

      if (key === 'Enter' || key === ' ') {
        if (state.state === null || state.state === 'uap-action-end' || state.state === 'dnd-end') {
          return {
            state: 'uap-action-start',
            metadata,
          };
        } else if (state.state === 'uap-action-start') {
          return {
            state: 'uap-action-end',
          };
        } else if (state.state === 'dnd-start' || state.state === 'dnd-active') {
          return {
            state: 'uap-action-start',
            metadata,
          };
        }
      } else if (key === 'Escape') {
        if (state.state === 'uap-action-start') {
          return {
            state: 'uap-action-end',
          };
        }
      }
      return state;
    }

    case 'FOCUS':
      return state;

    case 'BLUR':
      if (state.state === 'uap-action-start') {
        return {
          state: 'uap-action-end',
        };
      }
      return state;

    case 'RESET_TO_IDLE':
      if (state.state === 'uap-action-end' || state.state === 'dnd-end' || state.state === null) {
        return {
          state: null,
        };
      }
      return state;

    default:
      return state;
  }
}

export function getCallbacksForTransition<T = void>(
  prevState: DragHandleInteractionState<T>,
  nextState: DragHandleInteractionState<T>
): StateTransitionCallbacks<T>[] {
  const callbacks: StateTransitionCallbacks<T>[] = [];

  // Transitions from dnd-start or dnd-active to any other state
  if (
    (prevState.state === 'dnd-start' || prevState.state === 'dnd-active') &&
    nextState.state !== 'dnd-start' &&
    nextState.state !== 'dnd-active'
  ) {
    callbacks.push({ type: 'onDndEnd' });
  }

  // From uap-action-start to uap-action-end directly
  if (prevState.state === 'uap-action-start' && nextState.state === 'uap-action-end') {
    callbacks.push({ type: 'onUapActionEnd' });
  }

  // Transitions to dnd-start
  if (nextState.state === 'dnd-start') {
    callbacks.push({
      type: 'onDndStart',
      payload: nextState.eventData!,
      metadata: nextState.metadata,
    });
  }

  // Transitions to dnd-active
  if (nextState.state === 'dnd-active' && prevState.state === 'dnd-start') {
    callbacks.push({
      type: 'onDndActive',
      payload: nextState.eventData!,
    });
  }

  // Transitions to uap-action-start
  if (nextState.state === 'uap-action-start') {
    callbacks.push({
      type: 'onUapActionStart',
      metadata: nextState.metadata,
    });
  }

  return callbacks;
}

function interactionReducer<T = void>(
  state: DragHandleInteractionState<T>,
  action: Action<T>
): DragHandleInteractionState<T> {
  if (action.type === 'CLEAR_CALLBACKS') {
    return {
      ...state,
      pendingCallbacks: undefined,
    };
  }

  const nextState = calculateNextState(state, action);

  // Special handling for POINTER_MOVE to always trigger onDndActive callback
  if (action.type === 'POINTER_MOVE' && action.payload.nativeEvent) {
    const transitionCallbacks = getCallbacksForTransition(state, nextState);
    // Check if there's already an onDndActive callback from the transition
    const hasOnDndActiveCallback = transitionCallbacks.some(callback => callback.type === 'onDndActive');
    const callbacks = hasOnDndActiveCallback
      ? transitionCallbacks
      : [...transitionCallbacks, { type: 'onDndActive' as const, payload: action.payload.nativeEvent }];

    return {
      ...nextState,
      pendingCallbacks: callbacks,
    };
  }

  // Return current state if state didn't change
  const isDndState = (state: DragHandleInteractionState<T>) => {
    return state.state === 'dnd-start' || state.state === 'dnd-active' || state.state === 'dnd-end';
  };
  if (nextState.state === state.state) {
    if (isDndState(nextState) && isDndState(state)) {
      if (nextState.eventData === state.eventData) {
        return state;
      }
    } else {
      return state;
    }
  }

  const callbacks = getCallbacksForTransition(state, nextState);
  return {
    ...nextState,
    pendingCallbacks: callbacks.length > 0 ? callbacks : undefined,
  };
}

function useStateLogger<T = void>(state: DragHandleInteractionState<T>, isEnabled: boolean) {
  const prevStateRef = useRef<DragHandleInteractionState<T>>(state);
  useEffect(() => {
    if (state.state !== prevStateRef.current.state && isEnabled) {
      console.log(`State transition: ${prevStateRef.current.state} -> ${state.state}`, {
        prevState: prevStateRef.current,
        nextState: state,
      });
    }
    prevStateRef.current = state;
  }, [state, isEnabled]);
}

function useCallbackHandler<T = void>(
  pendingCallbacks: StateTransitionCallbacks<T>[] | undefined,
  props: UseDragHandleInteractionStateProps<T>,
  dispatch: React.Dispatch<Action<T>>
) {
  useEffect(() => {
    if (!pendingCallbacks?.length) {
      return;
    }
    pendingCallbacks.forEach(callback => {
      switch (callback.type) {
        case 'onDndStart':
          props.onDndStartAction?.(callback.payload, callback.metadata);
          break;
        case 'onDndActive':
          props.onDndActiveAction?.(callback.payload);
          break;
        case 'onDndEnd':
          props.onDndEndAction?.();
          break;
        case 'onUapActionStart':
          props.onUapActionStartAction?.(callback.metadata);
          break;
        case 'onUapActionEnd':
          props.onUapActionEndAction?.();
          break;
      }
    });

    dispatch({ type: 'CLEAR_CALLBACKS' });
  }, [pendingCallbacks, props, dispatch]);
}

/**
 * Manages interaction states for drag handle components.
 *
 * The hook implements a state machine for drag handles that supports:
 * - Pointer-based drag-and-drop (DnD) interactions
 * - Keyboard-based universal access pattern (UAP) interactions
 * - State transitions with appropriate callbacks
 * - Metadata passing between states
 *
 * States:
 * - null: Idle state with no active interaction
 * - dnd-start: Initial pointer down, beginning of potential drag
 * - dnd-active: Active dragging with pointer movement
 * - dnd-end: Completed drag operation
 * - uap-action-start: Keyboard/accessibility action initiated
 * - uap-action-end: Keyboard/accessibility action completed
 */
export default function useDragHandleInteractionState<T = void>(
  props: UseDragHandleInteractionStateProps<T> = {},
  options = { debug: false }
) {
  const propsRef = useRef<UseDragHandleInteractionStateProps<T>>(props);
  propsRef.current = props;

  const [interaction, dispatch] = useReducer(interactionReducer<T>, { state: null } as DragHandleInteractionState<T>);
  useStateLogger(interaction, options.debug);
  useCallbackHandler(interaction.pendingCallbacks, propsRef.current, dispatch);
  return {
    interaction,
    processPointerDown: (event: PointerEvent, metadata?: T) => {
      dispatch({
        type: 'POINTER_DOWN',
        payload: { nativeEvent: event, metadata },
      });
    },
    processPointerMove: (event: PointerEvent) => {
      dispatch({
        type: 'POINTER_MOVE',
        payload: { nativeEvent: event },
      });
    },
    processPointerUp: (event: PointerEvent) => {
      dispatch({
        type: 'POINTER_UP',
        payload: { nativeEvent: event },
      });
    },
    processKeyDown: (event: React.KeyboardEvent<Element>, metadata?: T) => {
      const key = event.key;
      if (key === 'Enter' || key === 'Escape' || key === ' ') {
        dispatch({
          type: 'KEY_DOWN',
          payload: { key, metadata },
        });
      }
    },
    processFocus: () => {
      dispatch({ type: 'FOCUS' });
    },
    processBlur: () => {
      dispatch({ type: 'BLUR' });
    },
  };
}
