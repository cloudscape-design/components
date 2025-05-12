// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useImperativeHandle } from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import type { Action, DragHandleInteractionState, UseDragHandleInteractionStateProps } from '../interfaces';
import useDragHandleInteractionState, {
  calculateNextState,
  getCallbacksForTransition,
  isDndState,
  isIdle,
} from '../use-drag-handle-interaction-state';

interface TestComponentProps extends UseDragHandleInteractionStateProps {
  debug?: boolean;
}

interface TestComponentRef {
  interaction: DragHandleInteractionState;
  dispatchAction: (action: Action) => void;
}

const TestComponent = React.forwardRef((props: TestComponentProps, ref: React.Ref<TestComponentRef>) => {
  const { debug, ...hookProps } = props;
  const {
    interaction,
    processPointerDown,
    processPointerMove,
    processPointerUp,
    processKeyDown,
    processFocus,
    processBlur,
  } = useDragHandleInteractionState(hookProps, { debug });

  // Expose for testing
  useImperativeHandle(ref, () => ({
    interaction,
    dispatchAction: (action: Action) => {
      switch (action.type) {
        case 'POINTER_DOWN':
          processPointerDown(action.payload.nativeEvent, action.payload.metadata);
          break;
        case 'POINTER_MOVE':
          processPointerMove(action.payload.nativeEvent);
          break;
        case 'POINTER_UP':
          processPointerUp(action.payload.nativeEvent);
          break;
        case 'KEY_DOWN':
          processKeyDown({ key: action.payload.key } as React.KeyboardEvent, action.payload.metadata);
          break;
        case 'FOCUS':
          processFocus();
          break;
        case 'BLUR':
          processBlur();
          break;
        case 'RESET_TO_IDLE': // Handled by the reducer directly
          break;
      }
    },
  }));

  return (
    <div
      data-testid="drag-handle"
      tabIndex={0}
      onPointerDown={e => processPointerDown(e.nativeEvent, undefined)}
      onPointerMove={e => processPointerMove(e.nativeEvent)}
      onPointerUp={e => processPointerUp(e.nativeEvent)}
      onKeyDown={processKeyDown}
      onFocus={processFocus}
      onBlur={processBlur}
    >
      Drag Handle
    </div>
  );
});

// Mock PointerEvent - not available in JSDOM environment
class MockPointerEvent {
  type: string;
  bubbles: boolean;
  cancelable: boolean;
  button: number;

  [key: string]: any;

  constructor(type: string, init: any = {}) {
    this.type = type;
    this.bubbles = init.bubbles || false;
    this.cancelable = init.cancelable || false;
    this.button = init.button !== undefined ? init.button : 0;

    Object.keys(init).forEach(key => {
      if (!['type', 'bubbles', 'cancelable', 'button'].includes(key)) {
        this[key] = init[key];
      }
    });
  }
}

function createPointerEvent(type: string, overrides: Partial<any> = {}): any {
  return new MockPointerEvent(type, {
    bubbles: true,
    cancelable: true,
    ...overrides,
  });
}

describe('Drag Handle Hooks', () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('Helper Functions', () => {
    describe('isIdle', () => {
      it('should return true when state is null', () => {
        expect(isIdle({ state: null })).toBe(true);
      });

      it('should return false when state is not null', () => {
        expect(isIdle({ state: 'dnd-start' })).toBe(false);
        expect(isIdle({ state: 'dnd-active' })).toBe(false);
        expect(isIdle({ state: 'dnd-end' })).toBe(false);
        expect(isIdle({ state: 'uap-action-start' })).toBe(false);
        expect(isIdle({ state: 'uap-action-end' })).toBe(false);
      });
    });

    describe('isDndState', () => {
      it('should return true for dnd states', () => {
        expect(isDndState({ state: 'dnd-start' })).toBe(true);
        expect(isDndState({ state: 'dnd-active' })).toBe(true);
        expect(isDndState({ state: 'dnd-end' })).toBe(true);
      });

      it('should return false for non-dnd states', () => {
        expect(isDndState({ state: null })).toBe(false);
        expect(isDndState({ state: 'uap-action-start' })).toBe(false);
        expect(isDndState({ state: 'uap-action-end' })).toBe(false);
      });
    });

    describe('calculateNextState', () => {
      const mockPointerEvent = createPointerEvent('pointerdown');

      it('should transition from idle to dnd-start on POINTER_DOWN', () => {
        const state: DragHandleInteractionState = { state: null };
        const action: Action = {
          type: 'POINTER_DOWN',
          payload: { button: 0, nativeEvent: mockPointerEvent },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.state).toBe('dnd-start');
        expect(nextState.eventData).toBe(mockPointerEvent);
      });

      it('should not transition on non-left button click', () => {
        const state: DragHandleInteractionState = { state: null };
        const action: Action = {
          type: 'POINTER_DOWN',
          payload: { button: 1, nativeEvent: mockPointerEvent },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState).toBe(state);
      });

      it('should transition from dnd-start to dnd-active on POINTER_MOVE', () => {
        const state: DragHandleInteractionState = {
          state: 'dnd-start',
          eventData: mockPointerEvent,
        };
        const moveEvent = createPointerEvent('pointermove');
        const action: Action = {
          type: 'POINTER_MOVE',
          payload: { nativeEvent: moveEvent },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.state).toBe('dnd-active');
        expect(nextState.eventData).toBe(moveEvent);
      });

      it('should transition from dnd-active to dnd-active on POINTER_MOVE', () => {
        const state: DragHandleInteractionState = {
          state: 'dnd-active',
          eventData: mockPointerEvent,
        };
        const moveEvent = createPointerEvent('pointermove');
        const action: Action = {
          type: 'POINTER_MOVE',
          payload: { nativeEvent: moveEvent },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.state).toBe('dnd-active');
        expect(nextState.eventData).toBe(moveEvent);
      });

      it('should transition from dnd-start to uap-action-start on POINTER_UP', () => {
        const state: DragHandleInteractionState = {
          state: 'dnd-start',
          eventData: mockPointerEvent,
        };
        const action: Action = {
          type: 'POINTER_UP',
          payload: { nativeEvent: createPointerEvent('pointerup') },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.state).toBe('uap-action-start');
        expect(nextState.eventData).toBeUndefined();
      });

      it('should transition from dnd-active to dnd-end on POINTER_UP', () => {
        const state: DragHandleInteractionState = {
          state: 'dnd-active',
          eventData: mockPointerEvent,
        };
        const action: Action = {
          type: 'POINTER_UP',
          payload: { nativeEvent: createPointerEvent('pointerup') },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.state).toBe('dnd-end');
        expect(nextState.eventData).toBe(mockPointerEvent);
      });

      it('should transition to uap-action-start on Enter key press from idle', () => {
        const state: DragHandleInteractionState = { state: null };
        const action: Action = {
          type: 'KEY_DOWN',
          payload: { key: 'Enter' },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.state).toBe('uap-action-start');
      });

      it('should transition from uap-action-start to uap-action-end on Enter key press', () => {
        const state: DragHandleInteractionState = { state: 'uap-action-start' };
        const action: Action = {
          type: 'KEY_DOWN',
          payload: { key: 'Enter' },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.state).toBe('uap-action-end');
      });

      it('should transition from uap-action-start to uap-action-end on Escape key press', () => {
        const state: DragHandleInteractionState = { state: 'uap-action-start' };
        const action: Action = {
          type: 'KEY_DOWN',
          payload: { key: 'Escape' },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.state).toBe('uap-action-end');
      });

      it('should transition from uap-action-start to uap-action-end on BLUR', () => {
        const state: DragHandleInteractionState = { state: 'uap-action-start' };
        const action: Action = { type: 'BLUR' };

        const nextState = calculateNextState(state, action);
        expect(nextState.state).toBe('uap-action-end');
      });

      it('should reset to idle on RESET_TO_IDLE from uap-action-end', () => {
        const state: DragHandleInteractionState = { state: 'uap-action-end' };
        const action: Action = { type: 'RESET_TO_IDLE' };

        const nextState = calculateNextState(state, action);
        expect(nextState.state).toBe(null);
      });

      it('should reset to idle on RESET_TO_IDLE from dnd-end', () => {
        const state: DragHandleInteractionState = { state: 'dnd-end' };
        const action: Action = { type: 'RESET_TO_IDLE' };

        const nextState = calculateNextState(state, action);
        expect(nextState.state).toBe(null);
      });

      it('should not reset to idle on RESET_TO_IDLE from active states', () => {
        const dndStartState: DragHandleInteractionState = { state: 'dnd-start' };
        const dndActiveState: DragHandleInteractionState = { state: 'dnd-active' };
        const uapActionStartState: DragHandleInteractionState = { state: 'uap-action-start' };
        const action: Action = { type: 'RESET_TO_IDLE' };

        expect(calculateNextState(dndStartState, action)).toBe(dndStartState);
        expect(calculateNextState(dndActiveState, action)).toBe(dndActiveState);
        expect(calculateNextState(uapActionStartState, action)).toBe(uapActionStartState);
      });

      it('should reset to idle on RESET_TO_IDLE from idle state', () => {
        const idleState: DragHandleInteractionState = { state: null };
        const action: Action = { type: 'RESET_TO_IDLE' };

        const nextState = calculateNextState(idleState, action);
        expect(nextState.state).toBeNull();
      });

      it('should return state on FOCUS action', () => {
        const state: DragHandleInteractionState = { state: 'uap-action-start' };
        const action: Action = { type: 'FOCUS' };

        const nextState = calculateNextState(state, action);
        expect(nextState).toBe(state);
      });

      it('should return state on FOCUS action with null state', () => {
        const state: DragHandleInteractionState = { state: null };
        const action: Action = { type: 'FOCUS' };

        const nextState = calculateNextState(state, action);
        expect(nextState).toBe(state);
      });

      it('should return state on unknown action type', () => {
        const state: DragHandleInteractionState = { state: 'uap-action-start' };
        const action: Action = { type: 'UNKNOWN' as any };

        const nextState = calculateNextState(state, action);
        expect(nextState).toBe(state);
      });

      it('should transition from dnd-start to uap-action-start on Enter key press', () => {
        const state: DragHandleInteractionState = { state: 'dnd-start' };
        const action: Action = {
          type: 'KEY_DOWN',
          payload: { key: 'Enter' },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.state).toBe('uap-action-start');
      });

      it('should transition from dnd-active to uap-action-start on Enter key press', () => {
        const state: DragHandleInteractionState = { state: 'dnd-active' };
        const action: Action = {
          type: 'KEY_DOWN',
          payload: { key: 'Enter' },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.state).toBe('uap-action-start');
      });
    });

    describe('getCallbacksForTransition', () => {
      const mockPointerEvent = createPointerEvent('pointerdown');

      it('should generate onDndStart callback for transition to dnd-start', () => {
        const prevState: DragHandleInteractionState = { state: null };
        const nextState: DragHandleInteractionState = {
          state: 'dnd-start',
          eventData: mockPointerEvent,
        };

        const callbacks = getCallbacksForTransition(prevState, nextState);
        expect(callbacks).toHaveLength(1);
        expect(callbacks[0]).toEqual({
          type: 'onDndStart',
          payload: mockPointerEvent,
        });
      });

      it('should generate onDndActive callback for transition to dnd-active', () => {
        const prevState: DragHandleInteractionState = {
          state: 'dnd-start',
          eventData: mockPointerEvent,
        };
        const nextState: DragHandleInteractionState = {
          state: 'dnd-active',
          eventData: mockPointerEvent,
        };

        const callbacks = getCallbacksForTransition(prevState, nextState);
        expect(callbacks).toHaveLength(1);
        expect(callbacks[0]).toEqual({
          type: 'onDndActive',
          payload: mockPointerEvent,
        });
      });

      it('should generate onDndEnd callback for transition from dnd-active to dnd-end', () => {
        const prevState: DragHandleInteractionState = {
          state: 'dnd-active',
          eventData: mockPointerEvent,
        };
        const nextState: DragHandleInteractionState = {
          state: 'dnd-end',
          eventData: mockPointerEvent,
        };

        const callbacks = getCallbacksForTransition(prevState, nextState);
        expect(callbacks).toHaveLength(1);
        expect(callbacks[0]).toEqual({ type: 'onDndEnd' });
      });

      it('should generate onUapActionStart callback for transition to uap-action-start', () => {
        const prevState: DragHandleInteractionState = { state: null };
        const nextState: DragHandleInteractionState = { state: 'uap-action-start' };

        const callbacks = getCallbacksForTransition(prevState, nextState);
        expect(callbacks).toHaveLength(1);
        expect(callbacks[0]).toEqual({ type: 'onUapActionStart' });
      });

      it('should generate onUapActionEnd callback for transition from uap-action-start to uap-action-end', () => {
        const prevState: DragHandleInteractionState = { state: 'uap-action-start' };
        const nextState: DragHandleInteractionState = { state: 'uap-action-end' };

        const callbacks = getCallbacksForTransition(prevState, nextState);
        expect(callbacks).toHaveLength(1);
        expect(callbacks[0]).toEqual({ type: 'onUapActionEnd' });
      });

      it('should generate multiple callbacks for complex transitions', () => {
        const prevState: DragHandleInteractionState = {
          state: 'dnd-start',
          eventData: mockPointerEvent,
        };
        const nextState: DragHandleInteractionState = { state: 'uap-action-start' };

        const callbacks = getCallbacksForTransition(prevState, nextState);
        expect(callbacks).toHaveLength(2);
        expect(callbacks).toContainEqual({ type: 'onDndEnd' });
        expect(callbacks).toContainEqual({ type: 'onUapActionStart' });
      });
    });
  });

  describe('useDragHandleInteractionState hook', () => {
    describe('Initial State', () => {
      it('should initialize with idle state', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        expect(ref.current?.interaction.state).toBeNull();
      });
    });

    describe('Event Handlers', () => {
      it('should handle pointer down event', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { button: 0, nativeEvent: createPointerEvent('pointerdown') },
          });
        });

        expect(ref.current?.interaction.state).toBe('dnd-start');
      });

      it('should handle pointer move event after pointer down', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { button: 0, nativeEvent: createPointerEvent('pointerdown') },
          });
        });

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_MOVE',
            payload: { nativeEvent: createPointerEvent('pointermove') },
          });
        });

        expect(ref.current?.interaction.state).toBe('dnd-active');
      });

      it('should handle pointer up event after pointer down', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { button: 0, nativeEvent: createPointerEvent('pointerdown') },
          });
        });

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_UP',
            payload: { nativeEvent: createPointerEvent('pointerup') },
          });
        });

        expect(ref.current?.interaction.state).toBe('uap-action-start');
      });

      it('should handle pointer up event after pointer move', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { button: 0, nativeEvent: createPointerEvent('pointerdown') },
          });
        });

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_MOVE',
            payload: { nativeEvent: createPointerEvent('pointermove') },
          });
        });

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_UP',
            payload: { nativeEvent: createPointerEvent('pointerup') },
          });
        });

        expect(ref.current?.interaction.state).toBe('dnd-end');
      });

      it('should handle Enter key press', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.keyDown(element, { key: 'Enter' });

        expect(ref.current?.interaction.state).toBe('uap-action-start');
      });

      it('should handle Enter key press in uap-action-start state', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.keyDown(element, { key: 'Enter' });
        expect(ref.current?.interaction.state).toBe('uap-action-start');

        fireEvent.keyDown(element, { key: 'Enter' });
        expect(ref.current?.interaction.state).toBe('uap-action-end');
      });

      it('should handle Escape key press in uap-action-start state', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.keyDown(element, { key: 'Enter' });
        expect(ref.current?.interaction.state).toBe('uap-action-start');

        fireEvent.keyDown(element, { key: 'Escape' });
        expect(ref.current?.interaction.state).toBe('uap-action-end');
      });

      it('should handle blur event in uap-action-start state', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.keyDown(element, { key: 'Enter' });
        expect(ref.current?.interaction.state).toBe('uap-action-start');

        fireEvent.blur(element);
        expect(ref.current?.interaction.state).toBe('uap-action-end');
      });

      it('should handle focus event', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.focus(element);
        expect(ref.current?.interaction.state).toBeNull();
      });
    });

    describe('Callbacks', () => {
      it('should call onDndStartAction on dnd-start', () => {
        const onDndStartAction = jest.fn();
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} onDndStartAction={onDndStartAction} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { button: 0, nativeEvent: createPointerEvent('pointerdown') },
          });
        });

        expect(onDndStartAction).toHaveBeenCalledTimes(1);
        expect(onDndStartAction).toHaveBeenCalledWith(expect.any(MockPointerEvent), undefined);
      });

      it('should pass metadata to onDndStartAction', () => {
        interface TestMetadata {
          id: string;
        }

        const TestComponentWithMetadata = React.forwardRef(
          (
            props: {
              onDndStartAction?: (event: PointerEvent, metadata?: TestMetadata) => void;
            },
            ref: React.Ref<any>
          ) => {
            const { processPointerDown } = useDragHandleInteractionState<TestMetadata>({
              onDndStartAction: props.onDndStartAction,
            });
            useImperativeHandle(ref, () => ({
              processPointerDown,
            }));
            return <div data-testid="typed-drag-handle" />;
          }
        );

        const onDndStartAction = jest.fn();
        const ref = React.createRef<{ processPointerDown: (event: PointerEvent, metadata?: TestMetadata) => void }>();
        render(<TestComponentWithMetadata ref={ref} onDndStartAction={onDndStartAction} />);

        const metadata: TestMetadata = { id: 'test-metadata' };
        const event = createPointerEvent('pointerdown');

        act(() => {
          ref.current?.processPointerDown(event, metadata);
        });

        expect(onDndStartAction).toHaveBeenCalledTimes(1);
        expect(onDndStartAction).toHaveBeenCalledWith(expect.any(MockPointerEvent), metadata);
      });

      it('should call onDndActiveAction on dnd-active', () => {
        const onDndActiveAction = jest.fn();
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} onDndActiveAction={onDndActiveAction} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { button: 0, nativeEvent: createPointerEvent('pointerdown') },
          });
        });

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_MOVE',
            payload: { nativeEvent: createPointerEvent('pointermove') },
          });
        });

        expect(onDndActiveAction).toHaveBeenCalledTimes(1);
        expect(onDndActiveAction).toHaveBeenCalledWith(expect.any(MockPointerEvent));
      });

      it('should call onDndEndAction on dnd-end', () => {
        const onDndEndAction = jest.fn();
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} onDndEndAction={onDndEndAction} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { button: 0, nativeEvent: createPointerEvent('pointerdown') },
          });
        });

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_MOVE',
            payload: { nativeEvent: createPointerEvent('pointermove') },
          });
        });

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_UP',
            payload: { nativeEvent: createPointerEvent('pointerup') },
          });
        });

        expect(onDndEndAction).toHaveBeenCalledTimes(1);
      });

      it('should call onUapActionStartAction on uap-action-start', () => {
        const onUapActionStartAction = jest.fn();
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} onUapActionStartAction={onUapActionStartAction} />);
        const element = getByTestId('drag-handle');

        fireEvent.keyDown(element, { key: 'Enter' });

        expect(onUapActionStartAction).toHaveBeenCalledTimes(1);
        expect(onUapActionStartAction).toHaveBeenCalledWith(undefined);
      });

      it('should pass metadata to onUapActionStartAction when transitioning from dnd-start', () => {
        interface TestMetadata {
          id: string;
        }

        const TestComponentWithMetadata = React.forwardRef(
          (props: { onUapActionStartAction?: (metadata?: TestMetadata) => void }, ref: React.Ref<any>) => {
            const { processPointerDown, processPointerUp } = useDragHandleInteractionState<TestMetadata>({
              onUapActionStartAction: props.onUapActionStartAction,
            });
            useImperativeHandle(ref, () => ({
              processPointerDown,
              processPointerUp,
            }));
            return <div data-testid="typed-drag-handle" />;
          }
        );

        const onUapActionStartAction = jest.fn();
        const ref = React.createRef<{
          processPointerDown: (event: PointerEvent, metadata?: TestMetadata) => void;
          processPointerUp: (event: PointerEvent) => void;
        }>();

        render(<TestComponentWithMetadata ref={ref} onUapActionStartAction={onUapActionStartAction} />);
        const metadata: TestMetadata = { id: 'test-metadata' };

        act(() => {
          ref.current?.processPointerDown(createPointerEvent('pointerdown'), metadata);
          ref.current?.processPointerUp(createPointerEvent('pointerup'));
        });

        expect(onUapActionStartAction).toHaveBeenCalledTimes(1);
        expect(onUapActionStartAction).toHaveBeenCalledWith(metadata);
      });

      it('should call onUapActionEndAction on uap-action-end', () => {
        const onUapActionEndAction = jest.fn();
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} onUapActionEndAction={onUapActionEndAction} />);
        const element = getByTestId('drag-handle');

        fireEvent.keyDown(element, { key: 'Enter' });
        fireEvent.keyDown(element, { key: 'Enter' });

        expect(onUapActionEndAction).toHaveBeenCalledTimes(1);
      });

      it('should call multiple callbacks for complex transitions', () => {
        const onDndStartAction = jest.fn();
        const onDndEndAction = jest.fn();
        const onUapActionStartAction = jest.fn();
        const ref = React.createRef<TestComponentRef>();

        render(
          <TestComponent
            ref={ref}
            onDndStartAction={onDndStartAction}
            onDndEndAction={onDndEndAction}
            onUapActionStartAction={onUapActionStartAction}
          />
        );

        // dnd-start -> uap-action-start transition
        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { button: 0, nativeEvent: createPointerEvent('pointerdown') },
          });
        });

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_UP',
            payload: { nativeEvent: createPointerEvent('pointerup') },
          });
        });

        expect(onDndStartAction).toHaveBeenCalledTimes(1);
        expect(onDndEndAction).toHaveBeenCalledTimes(1);
        expect(onUapActionStartAction).toHaveBeenCalledTimes(1);
      });
    });

    describe('Edge Cases', () => {
      it('should not change state on non-left button click', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.pointerDown(element, { button: 1 }); // Right button

        expect(ref.current?.interaction.state).toBeNull();
      });

      it('should ignore pointer move when not in dnd state', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.pointerMove(element);

        expect(ref.current?.interaction.state).toBeNull();
      });

      it('should ignore pointer up when not in dnd state', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.pointerUp(element);

        expect(ref.current?.interaction.state).toBeNull();
      });

      it('should ignore non-Enter/Escape key presses', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.keyDown(element, { key: 'A' });

        expect(ref.current?.interaction.state).toBeNull();
      });

      it('should handle RESET_TO_IDLE action directly', () => {
        const state: DragHandleInteractionState = { state: 'uap-action-end' };
        const action: Action = { type: 'RESET_TO_IDLE' };
        const nextState = calculateNextState(state, action);
        expect(nextState.state).toBeNull();
      });
    });

    describe('Direct Action Dispatch', () => {
      it('should handle direct action dispatch', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: {
              button: 0,
              nativeEvent: createPointerEvent('pointerdown'),
            },
          });
        });

        expect(ref.current?.interaction.state).toBe('dnd-start');

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_MOVE',
            payload: {
              nativeEvent: createPointerEvent('pointermove'),
            },
          });
        });

        expect(ref.current?.interaction.state).toBe('dnd-active');
      });

      it('should update event data without changing state', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        // First set state to dnd-active
        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: {
              button: 0,
              nativeEvent: createPointerEvent('pointerdown'),
            },
          });
        });

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_MOVE',
            payload: {
              nativeEvent: createPointerEvent('pointermove'),
            },
          });
        });

        // Then dispatch another POINTER_MOVE with different event data
        const initialEventData = ref.current?.interaction.eventData;
        const newEventData = createPointerEvent('pointermove', { clientX: 100, clientY: 100 });

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_MOVE',
            payload: {
              nativeEvent: newEventData,
            },
          });
        });

        // State should still be dnd-active and event data should be updated
        expect(ref.current?.interaction.state).toBe('dnd-active');
        expect(ref.current?.interaction.eventData).not.toBe(initialEventData);
        expect(ref.current?.interaction.eventData).toBe(newEventData);
      });
    });

    describe('Debug Option', () => {
      it('should enable debug logging when debug option is true', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const ref = React.createRef<TestComponentRef>();

        render(<TestComponent ref={ref} debug={true} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: {
              button: 0,
              nativeEvent: createPointerEvent('pointerdown'),
            },
          });
        });

        expect(consoleSpy).toHaveBeenCalled();

        consoleSpy.mockRestore();
      });
    });
  });
});
