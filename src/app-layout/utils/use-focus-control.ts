// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useCallback, useEffect, useRef } from 'react';
import { ButtonProps } from '../../button/interfaces';

export interface FocusControlRefs {
  toggle: RefObject<ButtonProps.Ref>;
  close: RefObject<ButtonProps.Ref>;
}

interface FocusControlState {
  refs: FocusControlRefs;
  setFocus: (force?: boolean) => void;
  loseFocus: () => void;
}

export function useFocusControl(isOpen: boolean, restoreFocus = false): FocusControlState {
  const refs = {
    toggle: useRef<ButtonProps.Ref>(null),
    close: useRef<ButtonProps.Ref>(null),
  };
  const previousFocusedElement = useRef<HTMLElement>();
  const shouldFocus = useRef(false);

  const doFocus = () => {
    if (!shouldFocus.current) {
      return;
    }
    if (isOpen) {
      previousFocusedElement.current =
        document.activeElement !== document.body ? (document.activeElement as HTMLElement) : undefined;
      refs.close.current?.focus();
    } else {
      if (restoreFocus && previousFocusedElement.current && document.contains(previousFocusedElement.current)) {
        previousFocusedElement.current.focus();
        previousFocusedElement.current = undefined;
      } else {
        refs.toggle.current?.focus();
      }
    }
    shouldFocus.current = false;
  };

  // We explictly want this effect to run when only `isOpen` changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(doFocus, [isOpen]);

  const loseFocus = useCallback(() => {
    previousFocusedElement.current = undefined;
  }, []);

  return {
    refs,
    setFocus: force => {
      shouldFocus.current = true;
      if (force && isOpen) {
        doFocus();
      }
    },
    loseFocus,
  };
}
