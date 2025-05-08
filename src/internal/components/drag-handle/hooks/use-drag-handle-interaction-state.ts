// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useCallback, useEffect, useReducer, useRef } from 'react';

import type {
  Action,
  CallbackType,
  DragHandleInteractionState,
  UseDragHandleInteractionStateProps,
} from './interfaces';

export { UseDragHandleInteractionStateProps };

const initialState: DragHandleInteractionState = {
  state: null,
};

export function isIdle(state: DragHandleInteractionState): boolean {
  return state.state === null;
}

export function isDndState(state: DragHandleInteractionState): boolean {
  return state.state === 'dnd-start' || state.state === 'dnd-active' || state.state === 'dnd-end';
}

export function calculateNextState(state: DragHandleInteractionState, action: Action): DragHandleInteractionState {
  switch (action.type) {
    case 'POINTER_DOWN': {
      const { button, nativeEvent } = action.payload;
      if (button !== 0) {
        return state;
      }

      return {
        state: 'dnd-start',
        eventData: nativeEvent,
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
            state: 'keyboard-start',
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
      const { key } = action.payload;

      if (key === 'Enter') {
        if (isIdle(state) || state.state === 'keyboard-end' || state.state === 'dnd-end') {
          return {
            state: 'keyboard-start',
          };
        } else if (state.state === 'keyboard-start') {
          return {
            state: 'keyboard-end',
          };
        } else if (state.state === 'dnd-start' || state.state === 'dnd-active') {
          return {
            state: 'keyboard-start',
          };
        }
      } else if (key === 'Escape') {
        if (state.state === 'keyboard-start') {
          return {
            state: 'keyboard-end',
          };
        }
      }
      return state;
    }

    case 'FOCUS':
      return state;

    case 'BLUR':
      if (state.state === 'keyboard-start') {
        return {
          state: 'keyboard-end',
        };
      }
      return state;

    case 'RESET_TO_IDLE':
      if (state.state === 'keyboard-end' || state.state === 'dnd-end' || isIdle(state)) {
        return initialState;
      }
      return state;

    default:
      return state;
  }
}

export function getCallbacksForTransition(
  prevState: DragHandleInteractionState,
  nextState: DragHandleInteractionState
): CallbackType[] {
  const callbacks: CallbackType[] = [];

  // Transitions from dnd-start or dnd-active to any other state
  if (
    (prevState.state === 'dnd-start' || prevState.state === 'dnd-active') &&
    nextState.state !== 'dnd-start' &&
    nextState.state !== 'dnd-active'
  ) {
    callbacks.push({ type: 'onDndEnd' });
  }

  // Transitions to keyboard-start
  if (nextState.state === 'keyboard-start') {
    callbacks.push({ type: 'onKeyboardStart' });
  }

  // From keyboard-start to keyboard-end directly
  if (prevState.state === 'keyboard-start' && nextState.state === 'keyboard-end') {
    callbacks.push({ type: 'onKeyboardEnd' });
  }

  // Transitions to dnd-start
  if (nextState.state === 'dnd-start') {
    callbacks.push({ type: 'onDndStart', payload: nextState.eventData! });
  }

  // Transitions to dnd-active
  if (nextState.state === 'dnd-active') {
    callbacks.push({ type: 'onDndActive', payload: nextState.eventData! });
  }

  return callbacks;
}

function interactionReducer(state: DragHandleInteractionState, action: Action): DragHandleInteractionState {
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

// TODO remove after all test have been added
function useStateLogger(state: DragHandleInteractionState, debug: boolean = false) {
  const prevStateRef = useRef<DragHandleInteractionState>(state);
  useEffect(() => {
    if (state.state !== prevStateRef.current.state) {
      console.log(`State transition: ${prevStateRef.current.state} -> ${state.state}`, {
        prevState: prevStateRef.current,
        nextState: state,
      });
    }
    prevStateRef.current = state;
  }, [state, debug]);
}

function useCallbackHandler(
  pendingCallbacks: CallbackType[] | undefined,
  props: UseDragHandleInteractionStateProps,
  dispatch: React.Dispatch<Action>
) {
  useEffect(() => {
    if (!pendingCallbacks?.length) {
      return;
    }
    pendingCallbacks.forEach(callback => {
      switch (callback.type) {
        case 'onDndStart':
          props.onDndStartAction?.(callback.payload);
          break;
        case 'onDndActive':
          props.onDndActiveAction?.(callback.payload);
          break;
        case 'onDndEnd':
          props.onDndEndAction?.();
          break;
        case 'onKeyboardStart':
          props.onKeyboardStartAction?.();
          break;
        case 'onKeyboardEnd':
          props.onKeyboardEndAction?.();
          break;
      }
    });

    dispatch({ type: 'CLEAR_CALLBACKS' });
  }, [pendingCallbacks, props, dispatch]);
}

function useEventHandlers(dispatch: React.Dispatch<Action>) {
  const processPointerDown = useCallback(
    (event: PointerEvent) => {
      dispatch({
        type: 'POINTER_DOWN',
        payload: { button: event.button, nativeEvent: event },
      });
    },
    [dispatch]
  );

  const processPointerMove = useCallback(
    (event: PointerEvent) => {
      dispatch({
        type: 'POINTER_MOVE',
        payload: { nativeEvent: event },
      });
    },
    [dispatch]
  );

  const processPointerUp = useCallback(
    (event: PointerEvent) => {
      dispatch({
        type: 'POINTER_UP',
        payload: { nativeEvent: event },
      });
    },
    [dispatch]
  );

  const processKeyDown = useCallback(
    (event: React.KeyboardEvent<Element>) => {
      const key = event.key;
      if (key === 'Enter' || key === 'Escape') {
        dispatch({
          type: 'KEY_DOWN',
          payload: { key },
        });
      }
    },
    [dispatch]
  );

  const processFocus = useCallback(() => {
    dispatch({ type: 'FOCUS' });
  }, [dispatch]);

  const processBlur = useCallback(() => {
    dispatch({ type: 'BLUR' });
  }, [dispatch]);

  return {
    processPointerDown,
    processPointerMove,
    processPointerUp,
    processKeyDown,
    processFocus,
    processBlur,
  };
}

export const useDragHandleInteractionState = (
  props: UseDragHandleInteractionStateProps = {},
  options: { debug?: boolean } = {}
) => {
  const propsRef = useRef<UseDragHandleInteractionStateProps>(props);
  propsRef.current = props;

  const [interaction, dispatch] = useReducer(interactionReducer, initialState);
  const debugEnabled = options.debug || false;
  useStateLogger(interaction, debugEnabled);
  useCallbackHandler(interaction.pendingCallbacks, propsRef.current, dispatch);
  const eventHandlers = useEventHandlers(dispatch);
  return {
    interaction,
    ...eventHandlers,
  };
};
