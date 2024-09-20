// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createRef, RefObject, useCallback, useEffect, useRef } from 'react';

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

export interface FocusControlMultipleStates {
  refs: Record<string, FocusControlRefs>;
  setFocus: (params?: { force?: boolean; drawerId?: string; open?: boolean }) => void;
  loseFocus: () => void;
}

export function useMultipleFocusControl(
  restoreFocus: boolean,
  activeDrawersIds: Array<string>
): FocusControlMultipleStates {
  const refs = useRef<Record<string, FocusControlRefs>>({});

  activeDrawersIds.forEach(drawerId => {
    if (!refs.current[drawerId]) {
      refs.current[drawerId] = {
        toggle: createRef<Focusable>(),
        close: createRef<Focusable>(),
        slider: createRef<HTMLDivElement>(),
      };
    }
  });

  const doFocus = useCallback(
    (drawerId: string, open = true) => {
      if (!shouldFocus.current) {
        return;
      }
      const ref = refs.current[drawerId];
      if (open) {
        previousFocusedElement.current =
          document.activeElement !== document.body ? (document.activeElement as HTMLElement) : undefined;
        if (ref?.slider?.current) {
          ref.slider.current?.focus();
        } else {
          ref?.close?.current?.focus();
        }
      } else {
        if (restoreFocus && previousFocusedElement.current && document.contains(previousFocusedElement.current)) {
          previousFocusedElement.current.focus();
          previousFocusedElement.current = undefined;
        } else {
          ref?.toggle?.current?.focus();
        }
      }
      shouldFocus.current = false;
    },
    [refs, restoreFocus]
  );

  const setFocus = (params?: { force?: boolean; drawerId?: string; open?: boolean }) => {
    const { force = false, drawerId = null, open = true } = params || {};
    shouldFocus.current = true;
    if (force && (!drawerId || activeDrawersIds.includes(drawerId))) {
      doFocus(drawerId!, open);
    }
  };

  const loseFocus = useCallback(() => {
    previousFocusedElement.current = undefined;
  }, []);

  const previousFocusedElement = useRef<HTMLElement>();
  const shouldFocus = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    doFocus(activeDrawersIds[0]);
  }, [activeDrawersIds, doFocus]);

  return {
    refs: refs.current,
    setFocus,
    loseFocus,
  };
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
