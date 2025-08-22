// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';
import {
  SingleTabStopNavigationAPI,
  SingleTabStopNavigationProvider,
} from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { getAllFocusables } from '../internal/components/focus-lock/utils';
import { hasModifierKeys } from '../internal/events';
import { KeyCode } from '../internal/keycode';
import { circleIndex } from '../internal/utils/circle-index';
import handleKey from '../internal/utils/handle-key';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { InternalNavigableGroupProps, NavigableGroupProps } from './interfaces';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

const InternalNavigableGroup = forwardRef(
  (
    {
      children,
      getItemId,
      loopFocus = false,
      direction = 'horizontal',
      nativeAttributes,
      __internalRootRef,
      ...props
    }: InternalNavigableGroupProps,
    ref: React.Ref<NavigableGroupProps.Ref>
  ) => {
    const baseProps = getBaseProps(props);
    const navigationAPI = useRef<SingleTabStopNavigationAPI>(null);
    const containerObjectRef = useRef<HTMLDivElement>(null);
    const containerRef = useMergeRefs(containerObjectRef, __internalRootRef);
    const focusedIdRef = useRef<string>();

    useImperativeHandle(ref, () => ({
      focus: () => {
        const target = getNextFocusTarget();
        if (target) {
          target.focus();
        }
      },
    }));

    function getNextFocusTarget(): null | HTMLElement {
      if (containerObjectRef.current) {
        const focusables = getFocusablesFrom(containerObjectRef.current);
        return focusables.find(button => getItemId(button) === focusedIdRef.current) ?? focusables[0] ?? null;
      }
      return null;
    }

    function onUnregisterActive(focusableElement: HTMLElement) {
      // Only refocus when the node is actually removed (no such element anymore).
      const target = navigationAPI.current?.getFocusTarget();

      if (target && getItemId(target) !== getItemId(focusableElement)) {
        target.focus();
      }
    }

    useEffect(() => {
      navigationAPI.current?.updateFocusTarget();
    });

    function onFocus(event: React.FocusEvent) {
      if (event.target instanceof HTMLElement && navigationAPI.current?.isRegistered(event.target)) {
        focusedIdRef.current = getItemId(event.target);
      }
      navigationAPI.current?.updateFocusTarget();
    }

    function onBlur() {
      navigationAPI.current?.updateFocusTarget();
    }

    function onKeyDown(event: React.KeyboardEvent) {
      const focusTarget = navigationAPI.current?.getFocusTarget();
      let specialKeys = [];
      switch (direction) {
        case 'horizontal':
          specialKeys = [KeyCode.right, KeyCode.left];
          break;
        case 'vertical':
          specialKeys = [KeyCode.down, KeyCode.up];
          break;
        case 'both':
          specialKeys = [KeyCode.right, KeyCode.left, KeyCode.down, KeyCode.up];
          break;
      }
      specialKeys.push(KeyCode.end, KeyCode.home, KeyCode.pageUp, KeyCode.pageDown);
      if (hasModifierKeys(event) || specialKeys.indexOf(event.keyCode) === -1) {
        return;
      }
      if (!containerObjectRef.current || !focusTarget) {
        return;
      }
      // Ignore navigation when the focused element is not a registered focusable.
      if (document.activeElement && !navigationAPI.current?.isRegistered(document.activeElement)) {
        return;
      }
      event.preventDefault();

      const focusables = getFocusablesFrom(containerObjectRef.current);
      const activeIndex = focusables.indexOf(focusTarget);
      const getNextIndex = (delta: number) => {
        const newIndex = activeIndex + delta;
        if (loopFocus) {
          return circleIndex(newIndex, [0, focusables.length - 1]);
        }
        return Math.max(0, Math.min(focusables.length - 1, newIndex));
      };

      handleKey(event as any, {
        onHome: () => focusElement(focusables[0]),
        onPageUp: () => focusElement(focusables[0]),
        onEnd: () => focusElement(focusables[focusables.length - 1]),
        onPageDown: () => focusElement(focusables[focusables.length - 1]),
        onInlineStart: () => focusElement(focusables[getNextIndex(-1)]),
        onBlockStart: () => focusElement(focusables[getNextIndex(-1)]),
        onInlineEnd: () => focusElement(focusables[getNextIndex(1)]),
        onBlockEnd: () => focusElement(focusables[getNextIndex(1)]),
      });
    }

    function focusElement(element: HTMLElement) {
      element.focus();
    }

    // List all non-disabled and registered focusables: those are eligible for keyboard navigation.
    function getFocusablesFrom(target: HTMLElement) {
      function isElementRegistered(element: HTMLElement) {
        return navigationAPI.current?.isRegistered(element) ?? false;
      }

      function isElementDisabled(element: HTMLElement) {
        if ('disabled' in element) {
          return element.disabled;
        }

        return false;
      }

      return getAllFocusables(target).filter(el => isElementRegistered(el) && !isElementDisabled(el));
    }

    return (
      <WithNativeAttributes<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>
        tag="div"
        nativeAttributes={nativeAttributes}
        {...baseProps}
        className={clsx(styles.root, testUtilStyles.root, baseProps.className)}
        ref={containerRef}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      >
        <SingleTabStopNavigationProvider
          ref={navigationAPI}
          navigationActive={true}
          getNextFocusTarget={getNextFocusTarget}
          onUnregisterActive={onUnregisterActive}
        >
          {children}
        </SingleTabStopNavigationProvider>
      </WithNativeAttributes>
    );
  }
);

export default InternalNavigableGroup;
