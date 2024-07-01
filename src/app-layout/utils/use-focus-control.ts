// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useCallback, useEffect, useRef } from 'react';

export interface Focusable {
  focus(): void;
}

export interface FocusControlRefs {
  toggle: RefObject<Focusable>;
  close: RefObject<Focusable>;
  slider: RefObject<HTMLDivElement>;
}

export interface FocusControlState {
  refs: FocusControlRefs;
  setFocus: (force?: boolean) => void;
  loseFocus: () => void;
}

export function useFocusControl(
  isOpen: boolean,
  restoreFocus = false,
  activeDrawerId?: string | null
): FocusControlState {
  const refs = {
    toggle: useRef<Focusable>(null),
    close: useRef<Focusable>(null),
    slider: useRef<HTMLDivElement>(null),
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
      if (refs.slider.current) {
        refs.slider.current?.focus();
      } else {
        refs.close.current?.focus();
      }
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

  const setFocus = (force?: boolean) => {
    shouldFocus.current = true;
    if (force && isOpen) {
      doFocus();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(doFocus, [isOpen, activeDrawerId]);

  const loseFocus = useCallback(() => {
    previousFocusedElement.current = undefined;
  }, []);

  return {
    refs,
    setFocus,
    loseFocus,
  };
}
