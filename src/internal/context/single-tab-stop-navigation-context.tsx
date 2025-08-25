// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {
  createContext,
  forwardRef,
  useContext,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { useEffectOnUpdate } from '../hooks/use-effect-on-update';
import { nodeBelongs } from '../utils/node-belongs';

export type FocusableChangeHandler = (isFocusable: boolean) => void;

export const defaultValue: {
  navigationActive: boolean;
  registerFocusable(focusable: HTMLElement, handler: FocusableChangeHandler): () => void;
  resetFocusTarget(): void;
} = {
  navigationActive: false,
  registerFocusable: () => () => {},
  resetFocusTarget: () => {},
};

/**
 * Single tab stop navigation context is used together with keyboard navigation that requires a single tab stop.
 * It instructs interactive elements to override tab indices for just a single one to remain user-focusable.
 */
export const SingleTabStopNavigationContext = createContext(defaultValue);

export function useSingleTabStopNavigation(
  focusable: null | React.RefObject<HTMLElement>,
  options?: { tabIndex?: number }
) {
  const { navigationActive: contextNavigationActive, registerFocusable } = useContext(SingleTabStopNavigationContext);
  const [focusTargetActive, setFocusTargetActive] = useState(false);
  const navigationDisabled = options?.tabIndex && options?.tabIndex < 0;
  const navigationActive = contextNavigationActive && !navigationDisabled;

  useLayoutEffect(() => {
    if (navigationActive && focusable && focusable.current) {
      const unregister = registerFocusable(focusable.current, isFocusable => setFocusTargetActive(isFocusable));
      return () => unregister();
    }
  });

  let tabIndex = options?.tabIndex;
  if (navigationActive) {
    tabIndex = !focusTargetActive ? -1 : (options?.tabIndex ?? 0);
  }

  return { navigationActive, tabIndex };
}

interface SingleTabStopNavigationProviderProps {
  navigationActive: boolean;
  children: React.ReactNode;
  getNextFocusTarget: () => null | HTMLElement;
  isElementSuppressed?(focusableElement: Element): boolean;
  onRegisterFocusable?(focusableElement: Element): void;
  onUnregisterActive?(focusableElement: Element): void;
}

export interface SingleTabStopNavigationAPI {
  updateFocusTarget(): void;
  getFocusTarget(): null | HTMLElement;
  isRegistered(element: Element): boolean;
}

export const SingleTabStopNavigationProvider = forwardRef(
  (
    {
      navigationActive,
      children,
      getNextFocusTarget,
      isElementSuppressed,
      onRegisterFocusable,
      onUnregisterActive,
    }: SingleTabStopNavigationProviderProps,
    ref: React.Ref<SingleTabStopNavigationAPI>
  ) => {
    // A set of registered focusable elements that can use keyboard navigation.
    const focusables = useRef(new Set<Element>());
    // A map of registered focusable element handlers to update the respective tab indices.
    const focusHandlers = useRef(new Map<Element, FocusableChangeHandler>());
    // A map of focusable element states to avoid issuing unnecessary updates to registered elements.
    const focusablesState = useRef(new WeakMap<Element, boolean>());
    // A reference to the currently focused element.
    const focusTarget = useRef<null | HTMLElement>(null);

    function onUnregisterFocusable(focusableElement: Element) {
      const isUnregisteringFocusedNode = nodeBelongs(focusableElement, document.activeElement);
      if (isUnregisteringFocusedNode) {
        // Wait for unmounted node to get removed from the DOM.
        setTimeout(() => onUnregisterActive?.(focusableElement), 0);
      }
    }

    // Register a focusable element to allow navigating into it.
    // The focusable element tabIndex is only set to 0 if the element matches the focus target.
    function registerFocusable(focusableElement: HTMLElement, changeHandler: FocusableChangeHandler) {
      // In case the contexts are nested, we must that the components register to all of them,
      // so that switching between contexts dynamically is possible.
      const parentUnregister = parentContext.registerFocusable(focusableElement, changeHandler);

      focusables.current.add(focusableElement);
      focusHandlers.current.set(focusableElement, changeHandler);
      const isFocusable = !!focusablesState.current.get(focusableElement);
      const newIsFocusable = focusTarget.current === focusableElement || !!isElementSuppressed?.(focusableElement);
      if (newIsFocusable !== isFocusable) {
        focusablesState.current.set(focusableElement, newIsFocusable);
        changeHandler(newIsFocusable);
      }
      onRegisterFocusable?.(focusableElement);

      return () => {
        parentUnregister();
        unregisterFocusable(focusableElement);
      };
    }
    function unregisterFocusable(focusableElement: Element) {
      focusables.current.delete(focusableElement);
      focusHandlers.current.delete(focusableElement);
      onUnregisterFocusable?.(focusableElement);
    }

    // Update focus target with next single focusable element and notify all registered focusables of a change.
    function updateFocusTarget(forceUpdate = false) {
      focusTarget.current = getNextFocusTarget();
      for (const focusableElement of focusables.current) {
        const isFocusable = focusablesState.current.get(focusableElement) ?? false;
        const newIsFocusable = focusTarget.current === focusableElement || !!isElementSuppressed?.(focusableElement);
        if (newIsFocusable !== isFocusable || forceUpdate) {
          focusablesState.current.set(focusableElement, newIsFocusable);
          focusHandlers.current.get(focusableElement)!(newIsFocusable);
        }
      }
    }
    function resetFocusTarget() {
      updateFocusTarget(true);
    }
    function getFocusTarget() {
      return focusTarget.current;
    }
    function isRegistered(element: Element) {
      return focusables.current.has(element);
    }
    useImperativeHandle(ref, () => ({ updateFocusTarget, getFocusTarget, isRegistered }));

    // Only one STSN context should be active at a time.
    // The outer context is preferred over the inners. The components using STSN
    // must either work with either outer or inner context, or an explicit switch mechanism
    // needs to be implemented (that turns the outer context on and off based on user interaction).
    const parentContext = useContext(SingleTabStopNavigationContext);
    const value = parentContext.navigationActive
      ? parentContext
      : { navigationActive, registerFocusable, updateFocusTarget, resetFocusTarget };

    // When contexts switching occurs, it is essential that the now-active one updates the focus target
    // to ensure the tab indices are correctly set.
    useEffectOnUpdate(() => {
      if (parentContext.navigationActive) {
        parentContext.resetFocusTarget();
      } else {
        resetFocusTarget();
      }
      // The updateFocusTarget and its dependencies must be pure.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parentContext.navigationActive]);

    return <SingleTabStopNavigationContext.Provider value={value}>{children}</SingleTabStopNavigationContext.Provider>;
  }
);
