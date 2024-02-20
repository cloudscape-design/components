// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from './styles.css.js';

export interface ApplicationRef {
  focus(): void;
}

export interface ApplicationControllerProps {
  activeElementKey: null | string | number | boolean;
  activeElementRef?: React.RefObject<SVGGElement>;
  onFocus?: (event: React.FocusEvent<SVGGElement>) => void;
  onBlur?: (event: React.FocusEvent<SVGGElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<SVGGElement>) => void;
}

export default forwardRef(ApplicationController);

function ApplicationController(
  { activeElementKey, activeElementRef, onFocus, onBlur, onKeyDown }: ApplicationControllerProps,
  ref: React.Ref<ApplicationRef>
) {
  const containerRef = useRef<SVGGElement>(null);
  const applicationRef = useRef<SVGGElement>(null);
  const focusTransitionRef = useRef(false);
  const [isFocused, setFocused] = useState(false);

  // Calls provided onFocus handler when the application obtains focus, ignoring internal focus juggling.
  const onApplicationFocus = useCallback(
    (event: React.FocusEvent<SVGGElement>) => {
      if (focusTransitionRef.current === false) {
        setFocused(true);
        onFocus && onFocus(event);
      } else {
        focusTransitionRef.current = false;
      }
    },
    [onFocus]
  );
  // Calls provided onBlur handler when the application loses focus, ignoring internal focus juggling.
  const onApplicationBlur = useCallback(
    (event: React.FocusEvent<SVGGElement>) => {
      if (focusTransitionRef.current === false) {
        setFocused(false);
        onBlur && onBlur(event);
        // The application controller can only be focused programmatically.
        muteApplication(applicationRef.current!);
      }
    },
    [onBlur]
  );
  const onApplicationKeyDown = onKeyDown;

  useImperativeHandle(
    ref,
    () => ({
      focus: () => focusApplication(applicationRef.current!, activeElementRef?.current || null),
    }),
    [activeElementRef]
  );

  // Re-attaches and re-focuses the application for screen readers to treat it as an update.
  useEffect(() => {
    // Skip if not focused or if the transition is already happening.
    if (!isFocused || focusTransitionRef.current === true) {
      return;
    }
    focusTransitionRef.current = true;
    containerRef.current!.removeChild(applicationRef.current!);
    containerRef.current!.appendChild(applicationRef.current!);
    focusApplication(applicationRef.current!, activeElementRef?.current || null);
  }, [isFocused, activeElementKey, activeElementRef]);

  return (
    <g ref={containerRef}>
      <g
        tabIndex={-1}
        ref={applicationRef}
        onFocus={onApplicationFocus}
        onBlur={onApplicationBlur}
        onKeyDown={onApplicationKeyDown}
        className={styles.application}
      ></g>
    </g>
  );
}

// Focuses application but before copies aria-attributes from the target.
function focusApplication(app: SVGGElement, target: null | SVGGElement) {
  // Remove prev attributes.
  for (const attributeName of getAttributeNames(app)) {
    if (attributeName === 'role' || attributeName.slice(0, 4) === 'aria') {
      app.removeAttribute(attributeName);
    }
  }

  // Copy new attributes.
  if (target) {
    for (const attributeName of getAttributeNames(target)) {
      if (attributeName === 'role' || attributeName.slice(0, 4) === 'aria') {
        const attributeValue = target.getAttribute(attributeName);
        attributeValue && app.setAttribute(attributeName, attributeValue);
      }
    }
  }

  // Make app focusable.
  app.tabIndex = 0;
  app.setAttribute('focusable', 'true');
  app.setAttribute('aria-hidden', 'false');

  // Focus app.
  app.focus({ preventScroll: true });
}

// The application is to be only focused programmatically.
function muteApplication(app: SVGGElement) {
  // Remove prev attributes.
  for (const attributeName of getAttributeNames(app)) {
    if (attributeName === 'role' || attributeName.slice(0, 4) === 'aria') {
      app.removeAttribute(attributeName);
    }
  }

  // Make app non-focusable.
  app.tabIndex = -1;
  app.setAttribute('focusable', 'false');
  app.setAttribute('aria-hidden', 'true');
}

// Polyfill for element.getAttributeNames(), IE11
// https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames#polyfill
function getAttributeNames(element: Element) {
  const attributes = element.attributes;
  const result = new Array(attributes.length);
  for (let i = 0; i < attributes.length; i++) {
    result[i] = attributes[i].name;
  }
  return result;
}
