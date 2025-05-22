// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useImperativeHandle, useState } from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import {
  calculateNextState,
  getCallbacksForTransition,
} from '../../../../../../lib/components/internal/components/drag-handle/hooks/use-drag-handle-interaction-state';
import {
  useInternalDragHandleInteractionState,
  UseInternalDragHandleInteractionStateProps,
} from '../../../../../../lib/components/internal/do-not-use/drag-handle';
import type { Action, DragHandleInteractionState } from '../interfaces';

interface TestComponentProps extends UseInternalDragHandleInteractionStateProps {
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
    processPointerCancel,
    processKeyDown,
    processFocus,
    processBlur,
  } = useInternalDragHandleInteractionState(hookProps, { debug: debug || false });

  // Exposed for testing
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
        case 'POINTER_CANCEL':
          processPointerCancel();
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
      onPointerCancel={processPointerCancel}
      onKeyDown={processKeyDown}
      onFocus={processFocus}
      onBlur={processBlur}
    >
      Drag Handle
    </div>
  );
});

// PointerEvent is not available in JSDOM env
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

const KEY_CODES_TO_TOGGLE_UAP_ACTION = ['Enter', ' '];

describe('Drag Handle Hooks', () => {
  describe('Helper Functions', () => {
    describe('calculateNextState', () => {
      const mockPointerEvent = createPointerEvent('pointerdown');

      test('should transition from idle to dnd-start on POINTER_DOWN', () => {
        const state: DragHandleInteractionState = { value: null };
        const action: Action = {
          type: 'POINTER_DOWN',
          payload: { nativeEvent: mockPointerEvent },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.value).toBe('dnd-start');
        expect(nextState.eventData).toBe(mockPointerEvent);
      });

      test('should transition from dnd-start to dnd-active on POINTER_MOVE', () => {
        const state: DragHandleInteractionState = {
          value: 'dnd-start',
          eventData: mockPointerEvent,
        };
        const moveEvent = createPointerEvent('pointermove');
        const action: Action = {
          type: 'POINTER_MOVE',
          payload: { nativeEvent: moveEvent },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.value).toBe('dnd-active');
        expect(nextState.eventData).toBe(moveEvent);
      });

      test('should transition from dnd-start to dnd-end on POINTER_CANCEL', () => {
        const state: DragHandleInteractionState = {
          value: 'dnd-start',
          eventData: mockPointerEvent,
        };
        const action: Action = {
          type: 'POINTER_CANCEL',
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.value).toBe('dnd-end');
      });

      test('should stay in dnd-active on POINTER_MOVE', () => {
        const state: DragHandleInteractionState = {
          value: 'dnd-active',
          eventData: mockPointerEvent,
        };
        const moveEvent = createPointerEvent('pointermove');
        const action: Action = {
          type: 'POINTER_MOVE',
          payload: { nativeEvent: moveEvent },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.value).toBe('dnd-active');
        expect(nextState.eventData).toBe(moveEvent);
      });

      test('should transition from dnd-start to uap-action-start on POINTER_UP', () => {
        const state: DragHandleInteractionState = {
          value: 'dnd-start',
          eventData: mockPointerEvent,
        };
        const action: Action = {
          type: 'POINTER_UP',
          payload: { nativeEvent: createPointerEvent('pointerup') },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.value).toBe('uap-action-start');
        expect(nextState.eventData).toBeUndefined();
      });

      test('should transition from dnd-active to dnd-end on POINTER_UP', () => {
        const state: DragHandleInteractionState = {
          value: 'dnd-active',
          eventData: mockPointerEvent,
        };
        const action: Action = {
          type: 'POINTER_UP',
          payload: { nativeEvent: createPointerEvent('pointerup') },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.value).toBe('dnd-end');
        expect(nextState.eventData).toBe(mockPointerEvent);
      });

      test('should transition from dnd-active to dnd-end on POINTER_CANCEL', () => {
        const state: DragHandleInteractionState = {
          value: 'dnd-active',
          eventData: mockPointerEvent,
        };
        const action: Action = {
          type: 'POINTER_CANCEL',
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.value).toBe('dnd-end');
      });

      test.each(KEY_CODES_TO_TOGGLE_UAP_ACTION)(
        'should transition to uap-action-start on "%s" key press from idle',
        key => {
          const state: DragHandleInteractionState = { value: null };
          const action: Action = {
            type: 'KEY_DOWN',
            payload: { key },
          };

          const nextState = calculateNextState(state, action);
          expect(nextState.value).toBe('uap-action-start');
        }
      );

      test.each(KEY_CODES_TO_TOGGLE_UAP_ACTION)(
        'should transition from uap-action-start to uap-action-end on "%s" key press',
        key => {
          const state: DragHandleInteractionState = { value: 'uap-action-start' };
          const action: Action = {
            type: 'KEY_DOWN',
            payload: { key },
          };

          const nextState = calculateNextState(state, action);
          expect(nextState.value).toBe('uap-action-end');
        }
      );

      test('should transition from uap-action-start to uap-action-end on Escape key press', () => {
        const state: DragHandleInteractionState = { value: 'uap-action-start' };
        const action: Action = {
          type: 'KEY_DOWN',
          payload: { key: 'Escape' },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState.value).toBe('uap-action-end');
      });

      test('should transition from uap-action-start to uap-action-end on BLUR', () => {
        const state: DragHandleInteractionState = { value: 'uap-action-start' };
        const action: Action = { type: 'BLUR' };

        const nextState = calculateNextState(state, action);
        expect(nextState.value).toBe('uap-action-end');
      });

      test('should return state on FOCUS action', () => {
        const state: DragHandleInteractionState = { value: 'uap-action-start' };
        const action: Action = { type: 'FOCUS' };

        const nextState = calculateNextState(state, action);
        expect(nextState).toBe(state);
      });

      test('should return state on FOCUS action with null state', () => {
        const state: DragHandleInteractionState = { value: null };
        const action: Action = { type: 'FOCUS' };

        const nextState = calculateNextState(state, action);
        expect(nextState).toBe(state);
      });

      test('should throw an error on unknown action type', () => {
        const state: DragHandleInteractionState = { value: 'uap-action-start' };
        const action: Action = { type: 'UNKNOWN' as any };

        const nextState = () => {
          calculateNextState(state, action);
        };
        expect(nextState).toThrow('The given action type [UNKNOWN] is not supported.');
      });

      test.each(KEY_CODES_TO_TOGGLE_UAP_ACTION)(
        'should transition from dnd-start to uap-action-start on "%s" key press',
        key => {
          const state: DragHandleInteractionState = { value: 'dnd-start' };
          const action: Action = {
            type: 'KEY_DOWN',
            payload: { key },
          };

          const nextState = calculateNextState(state, action);
          expect(nextState.value).toBe('uap-action-start');
        }
      );

      test.each(KEY_CODES_TO_TOGGLE_UAP_ACTION)(
        'should transition from dnd-active to uap-action-start on "%s" key press',
        key => {
          const state: DragHandleInteractionState = { value: 'dnd-active' };
          const action: Action = {
            type: 'KEY_DOWN',
            payload: { key },
          };

          const nextState = calculateNextState(state, action);
          expect(nextState.value).toBe('uap-action-start');
        }
      );

      test('should not change state on non-Enter/non-Escape key press in uap-action-end state', () => {
        const state: DragHandleInteractionState = { value: 'uap-action-end' };
        const action: Action = {
          type: 'KEY_DOWN',
          payload: { key: 'A' },
        };

        const nextState = calculateNextState(state, action);
        expect(nextState).toBe(state);
      });
    });

    describe('getCallbacksForTransition', () => {
      const mockPointerEvent = createPointerEvent('pointerdown');

      test('should generate onDndStart callback for transition to dnd-start', () => {
        const prevState: DragHandleInteractionState = { value: null };
        const nextState: DragHandleInteractionState = {
          value: 'dnd-start',
          eventData: mockPointerEvent,
        };

        const callbacks = getCallbacksForTransition(prevState, nextState);
        expect(callbacks).toHaveLength(1);
        expect(callbacks[0]).toEqual({
          type: 'onDndStart',
          payload: mockPointerEvent,
        });
      });

      test('should generate onDndActive callback for transition to dnd-active', () => {
        const prevState: DragHandleInteractionState = {
          value: 'dnd-start',
          eventData: mockPointerEvent,
        };
        const nextState: DragHandleInteractionState = {
          value: 'dnd-active',
          eventData: mockPointerEvent,
        };

        const callbacks = getCallbacksForTransition(prevState, nextState);
        expect(callbacks).toHaveLength(1);
        expect(callbacks[0]).toEqual({
          type: 'onDndActive',
          payload: mockPointerEvent,
        });
      });

      test('should generate onDndEnd callback for transition from dnd-active to dnd-end', () => {
        const prevState: DragHandleInteractionState = {
          value: 'dnd-active',
          eventData: mockPointerEvent,
        };
        const nextState: DragHandleInteractionState = {
          value: 'dnd-end',
          eventData: mockPointerEvent,
        };

        const callbacks = getCallbacksForTransition(prevState, nextState);
        expect(callbacks).toHaveLength(1);
        expect(callbacks[0]).toEqual({ type: 'onDndEnd' });
      });

      test('should generate onUapActionStart callback for transition to uap-action-start', () => {
        const prevState: DragHandleInteractionState = { value: null };
        const nextState: DragHandleInteractionState = { value: 'uap-action-start' };

        const callbacks = getCallbacksForTransition(prevState, nextState);
        expect(callbacks).toHaveLength(1);
        expect(callbacks[0]).toEqual({ type: 'onUapActionStart' });
      });

      test('should generate onUapActionEnd callback for transition from uap-action-start to uap-action-end', () => {
        const prevState: DragHandleInteractionState = { value: 'uap-action-start' };
        const nextState: DragHandleInteractionState = { value: 'uap-action-end' };

        const callbacks = getCallbacksForTransition(prevState, nextState);
        expect(callbacks).toHaveLength(1);
        expect(callbacks[0]).toEqual({ type: 'onUapActionEnd' });
      });

      test('should generate multiple callbacks for complex transitions', () => {
        const prevState: DragHandleInteractionState = {
          value: 'dnd-start',
          eventData: mockPointerEvent,
        };
        const nextState: DragHandleInteractionState = { value: 'uap-action-start' };

        const callbacks = getCallbacksForTransition(prevState, nextState);
        expect(callbacks).toHaveLength(2);
        expect(callbacks).toContainEqual({ type: 'onDndEnd' });
        expect(callbacks).toContainEqual({ type: 'onUapActionStart' });
      });
    });
  });

  describe('useInternalDragHandleInteractionState hook', () => {
    describe('Initial State', () => {
      test('should initialize with idle state', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);
        expect(ref.current?.interaction.value).toBeNull();
      });
    });

    describe('Event Handlers', () => {
      test('should handle pointer down event', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { nativeEvent: createPointerEvent('pointerdown') },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-start');
      });

      test('should handle pointer move event after pointer down', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { nativeEvent: createPointerEvent('pointerdown') },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-start');

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_MOVE',
            payload: { nativeEvent: createPointerEvent('pointermove') },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-active');
      });

      test('should handle pointer cancel event after pointer down', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { nativeEvent: createPointerEvent('pointerdown') },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-start');

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_CANCEL',
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-end');
      });

      test('should handle pointer up event after pointer down', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { nativeEvent: createPointerEvent('pointerdown') },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-start');

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_UP',
            payload: { nativeEvent: createPointerEvent('pointerup') },
          });
        });
        expect(ref.current?.interaction.value).toBe('uap-action-start');
      });

      test('should handle pointer up event after pointer move', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { nativeEvent: createPointerEvent('pointerdown') },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-start');

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_MOVE',
            payload: { nativeEvent: createPointerEvent('pointermove') },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-active');

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_UP',
            payload: { nativeEvent: createPointerEvent('pointerup') },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-end');
      });

      test('should handle pointer cancel event after pointer move', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { nativeEvent: createPointerEvent('pointerdown') },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-start');

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_MOVE',
            payload: { nativeEvent: createPointerEvent('pointermove') },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-active');

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_CANCEL',
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-end');
      });

      test.each(KEY_CODES_TO_TOGGLE_UAP_ACTION)('should handle "%s" key press', key => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.keyDown(element, { key });
        expect(ref.current?.interaction.value).toBe('uap-action-start');
      });

      test.each(KEY_CODES_TO_TOGGLE_UAP_ACTION)(
        'should handle "%s" key press toggle in uap-action-start state',
        key => {
          const ref = React.createRef<TestComponentRef>();
          const { getByTestId } = render(<TestComponent ref={ref} />);
          const element = getByTestId('drag-handle');

          fireEvent.keyDown(element, { key: key });
          expect(ref.current?.interaction.value).toBe('uap-action-start');

          fireEvent.keyDown(element, { key: key });
          expect(ref.current?.interaction.value).toBe('uap-action-end');
        }
      );

      test('should handle Escape key press in uap-action-start state', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.keyDown(element, { key: 'Enter' });
        expect(ref.current?.interaction.value).toBe('uap-action-start');

        fireEvent.keyDown(element, { key: 'Escape' });
        expect(ref.current?.interaction.value).toBe('uap-action-end');
      });

      test('should handle blur event in uap-action-start state', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.keyDown(element, { key: 'Enter' });
        expect(ref.current?.interaction.value).toBe('uap-action-start');

        fireEvent.blur(element);
        expect(ref.current?.interaction.value).toBe('uap-action-end');
      });

      test('should handle focus event', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.focus(element);
        expect(ref.current?.interaction.value).toBeNull();
      });
    });

    describe('Callbacks', () => {
      test('should call onDndStartAction on dnd-start', () => {
        const onDndStartAction = jest.fn();
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} onDndStartAction={onDndStartAction} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { nativeEvent: createPointerEvent('pointerdown') },
          });
        });
        expect(onDndStartAction).toHaveBeenCalledTimes(1);
        expect(onDndStartAction).toHaveBeenCalledWith(expect.any(MockPointerEvent), undefined);
      });

      test('should pass metadata to onDndStartAction', () => {
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
            const { processPointerDown } = useInternalDragHandleInteractionState<TestMetadata>({
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

      test('should call onDndActiveAction on dnd-active', () => {
        const onDndActiveAction = jest.fn();
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} onDndActiveAction={onDndActiveAction} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { nativeEvent: createPointerEvent('pointerdown') },
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

      test('should call onDndEndAction on dnd-end', () => {
        const onDndEndAction = jest.fn();
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} onDndEndAction={onDndEndAction} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { nativeEvent: createPointerEvent('pointerdown') },
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

      test('should call onUapActionStartAction on uap-action-start', () => {
        const onUapActionStartAction = jest.fn();
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} onUapActionStartAction={onUapActionStartAction} />);
        const element = getByTestId('drag-handle');

        fireEvent.keyDown(element, { key: 'Enter' });
        expect(onUapActionStartAction).toHaveBeenCalledTimes(1);
        expect(onUapActionStartAction).toHaveBeenCalledWith(undefined);
      });

      test('should pass metadata to onUapActionStartAction when transitioning from dnd-start', () => {
        interface TestMetadata {
          id: string;
        }

        const TestComponentWithMetadata = React.forwardRef(
          (props: { onUapActionStartAction?: (metadata?: TestMetadata) => void }, ref: React.Ref<any>) => {
            const { processPointerDown, processPointerUp } = useInternalDragHandleInteractionState<TestMetadata>({
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

      test('should call onUapActionEndAction on uap-action-end', () => {
        const onUapActionEndAction = jest.fn();
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} onUapActionEndAction={onUapActionEndAction} />);
        const element = getByTestId('drag-handle');

        fireEvent.keyDown(element, { key: 'Enter' });
        fireEvent.keyDown(element, { key: 'Enter' });
        expect(onUapActionEndAction).toHaveBeenCalledTimes(1);
      });

      test('should call multiple callbacks for complex transitions', () => {
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
            payload: { nativeEvent: createPointerEvent('pointerdown') },
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
      test('should ignore pointer move when not in dnd state', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.pointerMove(element);
        expect(ref.current?.interaction.value).toBeNull();
      });

      test('should ignore pointer up when not in dnd state', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.pointerUp(element);
        expect(ref.current?.interaction.value).toBeNull();
      });

      test('should ignore non-Enter/Escape key presses', () => {
        const ref = React.createRef<TestComponentRef>();
        const { getByTestId } = render(<TestComponent ref={ref} />);
        const element = getByTestId('drag-handle');

        fireEvent.keyDown(element, { key: 'A' });
        expect(ref.current?.interaction.value).toBeNull();
      });

      test('should ignore non-Enter/Escape key presses in a non-null state', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { nativeEvent: createPointerEvent('pointerdown') },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-start');

        // Dispatch a non-Enter/Escape key press
        act(() => {
          ref.current?.dispatchAction({
            type: 'KEY_DOWN',
            payload: { key: 'A' },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-start');
      });

      test('should ignore blur event in non-uap-action-start state', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: { nativeEvent: createPointerEvent('pointerdown') },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-start');

        act(() => {
          ref.current?.dispatchAction({ type: 'BLUR' });
        });
        expect(ref.current?.interaction.value).toBe('dnd-start');
      });

      test('should correctly process a click and not re-invoke callbacks due to self-triggered re-renders', () => {
        type TestMetadata = 'drag' | 'resize';

        interface HostComponentProps {
          onDndStartAction: () => void;
          onDndEndAction: () => void;
          onUapActionStartAction: () => void;
        }

        interface HostComponentRef {
          interaction: DragHandleInteractionState<TestMetadata>;
          processPointerDown: (event: PointerEvent, metadata?: TestMetadata) => void;
          processPointerUp: (event: PointerEvent) => void;
        }

        const DragHandleInteractionHost = React.forwardRef<HostComponentRef, HostComponentProps>(
          ({ onDndStartAction, onDndEndAction, onUapActionStartAction }, ref) => {
            // State to trigger a re-render
            const [, setInteractionTriggeredState] = useState(0);

            // trigger a re-render on state changes
            const hookProps: UseInternalDragHandleInteractionStateProps<TestMetadata> = {
              onDndStartAction: () => {
                setInteractionTriggeredState(s => s + 1);
                onDndStartAction();
              },
              onDndEndAction: () => {
                setInteractionTriggeredState(s => s + 1);
                onDndEndAction();
              },
              onUapActionStartAction: () => {
                setInteractionTriggeredState(s => s + 1);
                onUapActionStartAction();
              },
            };

            const { processPointerDown, processPointerUp, interaction } =
              useInternalDragHandleInteractionState<TestMetadata>(hookProps);

            useImperativeHandle(ref, () => ({
              interaction,
              processPointerDown,
              processPointerUp,
            }));

            return <div />;
          }
        );

        const hostRef = React.createRef<HostComponentRef>();
        const mockOnDndStartAction = jest.fn();
        const mockOnDndEndAction = jest.fn();
        const mockOnUapActionStartAction = jest.fn();
        render(
          <DragHandleInteractionHost
            ref={hostRef}
            onDndStartAction={mockOnDndStartAction}
            onDndEndAction={mockOnDndEndAction}
            onUapActionStartAction={mockOnUapActionStartAction}
          />
        );

        act(() => {
          hostRef.current?.processPointerDown(createPointerEvent('pointerdown'), 'drag');
        });
        expect(mockOnDndStartAction).toHaveBeenCalledTimes(1);
        expect(hostRef.current?.interaction.value).toBe('dnd-start');
        // onDndStartAction has been called, and triggered a re-render in DragHandleInteractionHost,
        // The hook should not have re-processed onDndStartAction.

        act(() => {
          hostRef.current?.processPointerUp(createPointerEvent('pointerup'));
        });
        expect(hostRef.current?.interaction.value).toBe('uap-action-start');
        expect(mockOnDndEndAction).toHaveBeenCalledTimes(1);
        expect(mockOnUapActionStartAction).toHaveBeenCalledTimes(1);
        expect(mockOnDndStartAction).toHaveBeenCalledTimes(1);
      });
    });

    describe('Direct Action Dispatch', () => {
      test('should handle direct action dispatch', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: {
              nativeEvent: createPointerEvent('pointerdown'),
            },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-start');

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_MOVE',
            payload: {
              nativeEvent: createPointerEvent('pointermove'),
            },
          });
        });
        expect(ref.current?.interaction.value).toBe('dnd-active');
      });

      test('should update event data without changing state', () => {
        const ref = React.createRef<TestComponentRef>();
        render(<TestComponent ref={ref} />);

        // First set state to dnd-active
        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: {
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
        expect(ref.current?.interaction.value).toBe('dnd-active');
        expect(ref.current?.interaction.eventData).not.toBe(initialEventData);
        expect(ref.current?.interaction.eventData).toBe(newEventData);
      });

      test('should not update state when event data is the same', () => {
        const mockEvent = createPointerEvent('pointermove');
        const state: DragHandleInteractionState = {
          value: 'dnd-active',
          eventData: mockEvent,
        };

        const result = calculateNextState(state, {
          type: 'POINTER_MOVE',
          payload: { nativeEvent: mockEvent },
        });
        expect(result.value).toBe('dnd-active');
        expect(result.eventData).toBe(mockEvent);
      });
    });

    describe('Debug Option', () => {
      test('should enable debug logging when debug option set to true', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        const ref = React.createRef<TestComponentRef>();

        render(<TestComponent ref={ref} debug={true} />);

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_DOWN',
            payload: {
              nativeEvent: createPointerEvent('pointerdown'),
            },
          });
        });
        expect(consoleSpy).toHaveBeenCalledWith('State transition: null -> dnd-start', expect.any(Object));
        consoleSpy.mockReset();

        act(() => {
          ref.current?.dispatchAction({
            type: 'POINTER_UP',
            payload: {
              nativeEvent: createPointerEvent('pointerdown'),
            },
          });
        });
        expect(consoleSpy).toHaveBeenCalledWith('State transition: dnd-start -> uap-action-start', expect.any(Object));
        consoleSpy.mockRestore();
      });
    });
  });
});
