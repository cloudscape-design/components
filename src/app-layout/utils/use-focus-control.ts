// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { RefObject, useCallback, useEffect, useMemo, useRef } from 'react';

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

export function useMultipleFocusControl(
  restoreFocus = false,
  activeDrawersIds: Array<string>
): Record<string, FocusControlState> {
  const isOpen = activeDrawersIds.length > 0;

  const refs: Record<string, FocusControlRefs> = useMemo(() => {
    return activeDrawersIds.reduce((acc, activeDrawerId) => {
      return {
        ...acc,
        [activeDrawerId]: {
          toggle: React.createRef<Focusable>(),
          close: React.createRef<Focusable>(),
          slider: React.createRef<HTMLDivElement>(),
        },
      };
    }, {});
  }, [activeDrawersIds]);

  const doFocus = useCallback(
    (drawerId: string | null) => {
      if (!shouldFocus.current) {
        return;
      }
      if (drawerId) {
        const ref = refs[drawerId];
        previousFocusedElement.current =
          document.activeElement !== document.body ? (document.activeElement as HTMLElement) : undefined;
        if (ref.slider.current) {
          ref.slider.current?.focus();
        } else {
          ref.close.current?.focus();
        }
      } else {
        if (restoreFocus && previousFocusedElement.current && document.contains(previousFocusedElement.current)) {
          previousFocusedElement.current.focus();
          previousFocusedElement.current = undefined;
        } else {
          // TODO: need to clarify what is it for
          // ref.toggle.current?.focus();
        }
      }
      shouldFocus.current = false;
    },
    [refs, restoreFocus]
  );

  const setFocus = useCallback(
    (drawerId: string) => (force?: boolean) => {
      shouldFocus.current = true;
      if (force) {
        doFocus(drawerId);
      }
    },
    [doFocus]
  );

  const loseFocus = useCallback(() => {
    previousFocusedElement.current = undefined;
  }, []);

  const returns = useMemo(() => {
    return activeDrawersIds.reduce((acc, activeDrawerId) => {
      return {
        ...acc,
        [activeDrawerId]: {
          refs: refs[activeDrawerId],
          setFocus: setFocus(activeDrawerId),
          loseFocus,
        },
      };
    }, {});
  }, [activeDrawersIds, refs, loseFocus, setFocus]);

  const previousFocusedElement = useRef<HTMLElement>();
  const shouldFocus = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    doFocus(activeDrawersIds[0]);
  }, [isOpen, activeDrawersIds, doFocus]);

  return returns;
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
