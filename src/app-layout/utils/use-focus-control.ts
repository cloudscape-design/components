// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useLayoutEffect, useRef } from 'react';
import { ButtonProps } from '../../button/interfaces';

export interface FocusControlState {
  refs: {
    toggle: RefObject<ButtonProps.Ref>;
    close: RefObject<ButtonProps.Ref>;
  };
  setFocus: () => void;
  loseFocus: () => void;
}

export function useFocusControl(isOpen: boolean, restoreFocus = false): FocusControlState {
  const refs = {
    toggle: useRef<ButtonProps.Ref>(null),
    close: useRef<ButtonProps.Ref>(null),
  };
  const previousFocusedElement = useRef<HTMLElement>();

  const setFocus = () => {
    // due to mounting/remounting, this hook gets called multiple times for a single change,
    // so we ignore any calls where the refs are undefined
    if (!(refs.toggle.current || refs.close.current)) {
      return;
    }
    if (isOpen) {
      previousFocusedElement.current = document.activeElement as HTMLElement;
      refs.close.current?.focus();
    } else {
      if (restoreFocus && previousFocusedElement.current && document.contains(previousFocusedElement.current)) {
        previousFocusedElement.current.focus();
        previousFocusedElement.current = undefined;
      } else {
        refs.toggle.current?.focus();
      }
    }
  };

  const loseFocus = () => {
    previousFocusedElement.current = undefined;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(setFocus, [isOpen, restoreFocus]);

  return { refs, setFocus, loseFocus };
}
