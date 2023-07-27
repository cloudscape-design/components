// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { MutableRefObject, useCallback, useRef } from 'react';
import {
  Transition as ReactTransitionGroupTransition,
  TransitionStatus as ReactTransitionGroupTransitionStatus,
} from 'react-transition-group';
import { useReducedMotion } from '@cloudscape-design/component-toolkit/internal';

export type TransitionStatus = ReactTransitionGroupTransitionStatus | 'enter' | 'exit';

export interface TransitionProps {
  in: boolean;
  exit?: boolean;

  disabled?: boolean;

  children: (state: TransitionStatus, transitioningElementRef: MutableRefObject<any>) => React.ReactNode;
  onStatusChange?: (status: TransitionStatus) => void;
  transitionChangeDelay?: { entering?: number };
}

/**
 * This component is a wrapper around the CSSTransition component.
 *
 * It provides a second parameter in its rendering function that must be
 * attached to the node that is transitioning.
 */
export function Transition({
  in: isIn,
  children,
  exit = true,
  onStatusChange = () => void 0,
  disabled = false,
  transitionChangeDelay,
  ...rest
}: TransitionProps) {
  const transitionRootElement = useRef<HTMLElement>(null);
  // the initial state of the transition should be either 'exited' or 'entered' depending
  // on the `in` property, this mimicks how internally the Transition component works here:
  // https://github.com/reactjs/react-transition-group/blob/6cbd6aaedaf8e9472007640b429ddb48c6c24158/src/Transition.js#L121
  const [transitionState, setTransitionState] = useState<TransitionStatus>(isIn ? 'entered' : 'exited');
  const motionDisabled = useReducedMotion(transitionRootElement) || disabled;

  const addTransitionEndListener = useCallback((done: () => void) => {
    const node = transitionRootElement.current;

    if (node === null) {
      return;
    }
    const listener = (e: TransitionEvent | AnimationEvent) => {
      if (e.target === node) {
        node.removeEventListener('transitionend', listener);
        node.removeEventListener('animationend', listener);
        done();
      }
    };
    node.addEventListener('transitionend', listener);
    node.addEventListener('animationend', listener);
  }, []);

  return (
    <ReactTransitionGroupTransition
      addEndListener={addTransitionEndListener}
      timeout={motionDisabled ? 0 : undefined}
      in={isIn}
      nodeRef={transitionRootElement}
      exit={exit}
      onEnter={isAppearing => {
        if (!isAppearing) {
          setTransitionState('enter');
          onStatusChange('enter');
        }
      }}
      onEntering={isAppearing => {
        if (!isAppearing) {
          // This line forces the browser to recalculate the layout because we want the starting state in the 'enter' style
          // to be applied before the animation starts.
          void transitionRootElement.current?.offsetHeight;

          if (transitionChangeDelay?.entering) {
            setTimeout(() => {
              setTransitionState('entering');
              onStatusChange('entering');
            }, transitionChangeDelay?.entering);
          } else {
            setTransitionState('entering');
            onStatusChange('entering');
          }
        }
      }}
      onEntered={isAppearing => {
        if (!isAppearing) {
          setTransitionState('entered');
          onStatusChange('entered');
        }
      }}
      onExit={() => {
        setTransitionState('exit');
        onStatusChange('exit');
      }}
      onExiting={() => {
        setTransitionState('exiting');
        onStatusChange('exiting');
      }}
      onExited={() => {
        setTransitionState('exited');
        onStatusChange('exited');
      }}
      {...rest}
    >
      {() => children(transitionState, transitionRootElement)}
    </ReactTransitionGroupTransition>
  );
}
