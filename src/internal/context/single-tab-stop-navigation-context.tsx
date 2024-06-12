// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';

export type FocusableChangeHandler = (isFocusable: boolean) => void;

export interface SingleTabStopNavigationOptions {
  tabIndex?: number;
}

export const defaultValue: {
  navigationActive: boolean;
  registerFocusable(focusable: HTMLElement, handler: FocusableChangeHandler): () => void;
} = {
  navigationActive: false,
  registerFocusable: () => () => {},
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
    tabIndex = !focusTargetActive ? -1 : options?.tabIndex ?? 0;
  }

  return { navigationActive, tabIndex };
}

export interface SingleTabStopNavigationProviderProps {
  navigationActive: boolean;
  children: React.ReactNode;
  getNextFocusTarget: () => null | HTMLElement;
  isElementSuppressed?(focusableElement: Element): boolean;
  onRegisterFocusable?(focusableElement: Element): void;
  onUnregisterFocusable?(focusableElement: Element): void;
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
      onUnregisterFocusable,
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

    // Register a focusable element to allow navigating into it.
    // The focusable element tabIndex is only set to 0 if the element matches the focus target.
    function registerFocusable(focusableElement: Element, changeHandler: FocusableChangeHandler) {
      focusables.current.add(focusableElement);
      focusHandlers.current.set(focusableElement, changeHandler);
      const isFocusable = !!focusablesState.current.get(focusableElement);
      const newIsFocusable = focusTarget.current === focusableElement || !!isElementSuppressed?.(focusableElement);
      if (newIsFocusable !== isFocusable) {
        focusablesState.current.set(focusableElement, newIsFocusable);
        changeHandler(newIsFocusable);
      }
      onRegisterFocusable?.(focusableElement);
      return () => unregisterFocusable(focusableElement);
    }
    function unregisterFocusable(focusableElement: Element) {
      focusables.current.delete(focusableElement);
      focusHandlers.current.delete(focusableElement);
      onUnregisterFocusable?.(focusableElement);
    }

    // Update focus target with next single focusable element and notify all registered focusables of a change.
    function updateFocusTarget() {
      focusTarget.current = getNextFocusTarget();
      for (const focusableElement of focusables.current) {
        const isFocusable = focusablesState.current.get(focusableElement) ?? false;
        const newIsFocusable = focusTarget.current === focusableElement || !!isElementSuppressed?.(focusableElement);
        if (newIsFocusable !== isFocusable) {
          focusablesState.current.set(focusableElement, newIsFocusable);
          focusHandlers.current.get(focusableElement)!(newIsFocusable);
        }
      }
    }

    function getFocusTarget() {
      return focusTarget.current;
    }

    function isRegistered(element: Element) {
      return focusables.current.has(element);
    }

    useImperativeHandle(ref, () => ({ updateFocusTarget, getFocusTarget, isRegistered }));

    return (
      <SingleTabStopNavigationContext.Provider value={{ navigationActive, registerFocusable }}>
        {children}
      </SingleTabStopNavigationContext.Provider>
    );
  }
);
