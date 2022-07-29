// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export interface TabTrapProps {
  focusNextCallback: FocusNextElement;
  disabled?: boolean;
}

export interface FocusNextElement {
  (): void;
}

// This component handles focus-forwarding when navigating through the calendar grid.
// When the customer focuses that component the `next` callback function is called
// with forwards the focus.
const TabTrap = ({ focusNextCallback, disabled = false }: TabTrapProps) => {
  return <div tabIndex={disabled ? -1 : 0} onFocus={focusNextCallback} />;
};

export const TabTrapBefore = ({
  containerRef,
  disabled = false,
}: {
  containerRef: React.RefObject<HTMLElement>;
  disabled?: boolean;
}) => {
  const focusLastElement = () =>
    containerRef.current && (getLastFocusableElement(containerRef.current) as HTMLElement)?.focus();

  return <TabTrap disabled={disabled} focusNextCallback={focusLastElement} />;
};

export const TabTrapAfter = ({
  containerRef,
  disabled = false,
}: {
  containerRef: React.RefObject<HTMLElement>;
  disabled?: boolean;
}) => {
  const focusLastElement = () =>
    containerRef.current && (getFirstFocusableElement(containerRef.current) as HTMLElement)?.focus();

  return <TabTrap disabled={disabled} focusNextCallback={focusLastElement} />;
};

function getFirstFocusableElement(container: HTMLElement) {
  const focusableElements = getFocusableElements(container);
  return focusableElements[0];
}

function getLastFocusableElement(container: HTMLElement) {
  const focusableElements = getFocusableElements(container);
  return focusableElements[focusableElements.length - 1];
}

function getFocusableElements(container: HTMLElement) {
  return container.querySelectorAll('button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])');
}

export default TabTrap;
