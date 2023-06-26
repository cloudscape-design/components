// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DependencyList, RefObject, useEffect, useRef, useCallback } from 'react';
import { ButtonProps } from '../../button/interfaces';

export type DrawerLastInteraction = { type: 'open' } | { type: 'close' };

export interface DrawerFocusControlRefs {
  toggle: RefObject<ButtonProps.Ref>;
  close: RefObject<ButtonProps.Ref>;
  slider: RefObject<HTMLDivElement>;
}

interface FocusControlState {
  refs: DrawerFocusControlRefs;
  setFocus: (force?: boolean) => void;
  loseFocus: () => void;
  setLastInteraction: (interaction: DrawerLastInteraction) => void;
}

export function useDrawerFocusControl(
  dependencies: DependencyList,
  isOpen: boolean,
  restoreFocus = false
): FocusControlState {
  const refs = {
    toggle: useRef<ButtonProps.Ref>(null),
    close: useRef<ButtonProps.Ref>(null),
    slider: useRef<HTMLDivElement>(null),
  };
  const previousFocusedElement = useRef<HTMLElement>();
  const shouldFocus = useRef(false);
  const lastInteraction = useRef<DrawerLastInteraction | null>(null);

  useEffect(() => {
    switch (lastInteraction.current?.type) {
      case 'open':
        if (refs.slider.current) {
          refs.slider.current?.focus();
        } else {
          refs.close.current?.focus();
        }
        break;
      case 'close':
        refs.toggle.current?.focus();
        break;
    }
    lastInteraction.current = null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

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
    setLastInteraction: (interaction: DrawerLastInteraction) => (lastInteraction.current = interaction),
  };
}
