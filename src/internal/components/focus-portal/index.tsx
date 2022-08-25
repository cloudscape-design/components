// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import Portal from '../portal';
import FocusDetector from '../focus-detector';
import { getFirstTabbable, getLastTabbable, getTabbables } from '../../utils/tabbables';

export interface FocusPortalProps {
  container?: Element;
  children?: React.ReactNode;
}

export default function FocusPortal({ container, children }: FocusPortalProps) {
  // Fallback to focus the first focusable element in the DOM.
  const focusStartofDOM = () => {
    const element = getFirstTabbable(document.documentElement);
    if (element) {
      // Potential infinite loop if proxy is first or only tabbable element.
      element.focus();
      return true;
    }
    document.body.focus();
    return true;
  };

  // Focus the element before this component in the DOM tree.
  const beforeSelfRef = useRef<HTMLDivElement | null>(null);
  const focusBeforeSelf = () => {
    const allTabbableElements = getTabbables(document.documentElement);
    const beforeIndex = beforeSelfRef.current ? allTabbableElements.indexOf(beforeSelfRef.current) : -1;
    if (beforeIndex !== -1 && beforeIndex !== 0) {
      allTabbableElements[beforeIndex - 1].focus();
    } else {
      document.body.focus();
    }
  };

  // Focus the element after this component in the DOM tree.
  const afterSelfRef = useRef<HTMLDivElement | null>(null);
  const focusAfterSelf = () => {
    if (afterSelfRef.current) {
      const allTabbableElements = getTabbables(document.documentElement);
      const anchorIndex = allTabbableElements.indexOf(afterSelfRef.current);
      if (anchorIndex !== -1 && anchorIndex !== allTabbableElements.length - 1) {
        allTabbableElements[anchorIndex + 1].focus();
        return true;
      }
    }
    return focusStartofDOM();
  };

  // Focus the first (or last) element in the children slot.
  const childrenWrapperRef = useRef<HTMLDivElement | null>(null);
  const focusInsideChildren = (backwards = false) => {
    if (childrenWrapperRef.current) {
      const element = backwards
        ? getLastTabbable(childrenWrapperRef.current)
        : getFirstTabbable(childrenWrapperRef.current);
      if (element) {
        element.focus();
        return true;
      }
      return false;
    }
  };

  // Focus the element before the children slot in the DOM tree.
  // This is the element before the portal.
  const beforeChildrenRef = useRef<HTMLDivElement | null>(null);
  const focusBeforeChildren = () => {
    if (beforeChildrenRef.current) {
      const allTabbableElements = getTabbables(document.documentElement);
      const anchorIndex = allTabbableElements.indexOf(beforeChildrenRef.current);
      if (anchorIndex !== -1 && anchorIndex !== 0) {
        allTabbableElements[anchorIndex - 1].focus();
        return true;
      }
    }
    return focusStartofDOM();
  };

  // Focus the element before the children slot in the DOM tree.
  // This is the element after the portal.
  const afterChildrenRef = useRef<HTMLDivElement | null>(null);
  const focusAfterChildren = () => {
    if (afterChildrenRef.current) {
      const allTabbableElements = getTabbables(document.documentElement);
      const anchorIndex = allTabbableElements.indexOf(afterChildrenRef.current);
      if (anchorIndex !== -1 && anchorIndex !== allTabbableElements.length - 1) {
        allTabbableElements[anchorIndex + 1].focus();
        return true;
      }
    }
    return focusStartofDOM();
  };

  return (
    <>
      {/*
        Traps typical forward focus and moves it into the children. If there
        aren't any focusable elements inside the children, we skip past the
        portal and "emulate" standard browser behavior.
      */}
      <FocusDetector
        ref={beforeSelfRef}
        disabled={!children}
        onFocus={() => {
          focusInsideChildren() || focusAfterSelf();
        }}
      />

      <Portal container={container}>
        {/*
          Most likely, this was triggered by a Shift+Tab inside the portal.
          If it was, we move to the element before this one in the tab order.
          If not, we came here "organically", meaning we tabbed all the way to
          the end of the DOM and stumbled into the portal. If that's the case,
          we skip past the portal.
        */}
        <FocusDetector
          ref={beforeChildrenRef}
          disabled={!children}
          onFocus={event => {
            if (childrenWrapperRef.current?.contains(event.relatedTarget)) {
              focusBeforeSelf();
            } else {
              focusAfterChildren();
            }
          }}
        />

        {/*
          This is where the portal-ed children are rendered. A wrapper is
          needed so that we can go through it and determine the first/last
          focusable elements.
        */}
        <div ref={childrenWrapperRef}>{children}</div>

        {/*
          Most likely, this was triggered by a Tab past the end of the portal.
          If it was, we move back into the non-portal DOM tree and tab forward.
          If not, we came here "organically", meaning we tabbed backwards from
          the end of the document to here . If that's the case, we skip past
          to the element before the portal.
        */}
        <FocusDetector
          disabled={!children}
          ref={afterChildrenRef}
          onFocus={event => {
            if (childrenWrapperRef.current?.contains(event.relatedTarget)) {
              focusAfterSelf();
            } else {
              focusBeforeChildren();
            }
          }}
        />
      </Portal>

      {/*
        Lastly, this can only be triggered by a Shift+Tab from after the
        component. So we move focus into the last element inside the portal.
      */}
      <FocusDetector
        disabled={!children}
        ref={afterSelfRef}
        onFocus={() => {
          focusInsideChildren(true);
        }}
      />
    </>
  );
}
