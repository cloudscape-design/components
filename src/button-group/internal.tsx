// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { ButtonProps } from '../button/interfaces';
import { getBaseProps } from '../internal/base-component';
import { getAllFocusables } from '../internal/components/focus-lock/utils';
import {
  SingleTabStopNavigationAPI,
  SingleTabStopNavigationProvider,
} from '../internal/context/single-tab-stop-navigation-context';
import { hasModifierKeys } from '../internal/events';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { KeyCode } from '../internal/keycode';
import { circleIndex } from '../internal/utils/circle-index';
import handleKey from '../internal/utils/handle-key';
import { ButtonGroupProps, InternalButtonGroupProps } from './interfaces';
import ItemElement from './item-element.js';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

const InternalButtonGroup = forwardRef(
  (
    {
      items = [],
      onItemClick,
      ariaLabel,
      dropdownExpandToViewport,
      __internalRootRef = null,
      ...props
    }: InternalButtonGroupProps,
    ref: React.Ref<ButtonGroupProps.Ref>
  ) => {
    const baseProps = getBaseProps(props);
    const focusedIdRef = useRef<null | string>(null);
    const navigationAPI = useRef<SingleTabStopNavigationAPI>(null);
    const containerObjectRef = useRef<HTMLDivElement>(null);
    const containerRef = useMergeRefs(containerObjectRef, __internalRootRef);
    const itemsRef = useRef<Record<string, ButtonProps.Ref | null>>({});
    const [tooltip, setTooltip] = useState<null | { item: string; feedback: boolean }>(null);

    useImperativeHandle(ref, () => ({
      focus: id => {
        itemsRef.current[id]?.focus();
      },
    }));

    function getNextFocusTarget(): null | HTMLElement {
      if (containerObjectRef.current) {
        const buttons: HTMLButtonElement[] = Array.from(
          containerObjectRef.current.querySelectorAll(`.${testUtilStyles.item}`)
        );
        const activeButtons = buttons.filter(button => !button.disabled);
        return activeButtons.find(button => button.dataset.itemid === focusedIdRef.current) ?? activeButtons[0] ?? null;
      }
      return null;
    }

    function onUnregisterActive(focusableElement: HTMLElement) {
      // Only refocus when the node is actually removed (no such ID anymore).
      const target = navigationAPI.current?.getFocusTarget();

      if (target && target.dataset.itemid !== focusableElement.dataset.itemid) {
        target.focus();
      }
    }

    useEffect(() => {
      navigationAPI.current?.updateFocusTarget();
    });

    function onFocus(event: React.FocusEvent) {
      if (event.target instanceof HTMLElement && event.target.dataset.itemid) {
        focusedIdRef.current = event.target.dataset.itemid;
      }

      navigationAPI.current?.updateFocusTarget();
    }

    function onBlur() {
      navigationAPI.current?.updateFocusTarget();
    }

    function onKeyDown(event: React.KeyboardEvent) {
      const focusTarget = navigationAPI.current?.getFocusTarget();
      const specialKeys = [KeyCode.right, KeyCode.left, KeyCode.end, KeyCode.home, KeyCode.pageUp, KeyCode.pageDown];
      if (hasModifierKeys(event) || specialKeys.indexOf(event.keyCode) === -1) {
        return;
      }
      if (!containerObjectRef.current || !focusTarget) {
        return;
      }
      // Ignore navigation when the focused element is not an item.
      if (document.activeElement && !document.activeElement.matches(`.${testUtilStyles.item}`)) {
        return;
      }
      event.preventDefault();

      const focusables = getFocusablesFrom(containerObjectRef.current);
      const activeIndex = focusables.indexOf(focusTarget);
      handleKey(event as any, {
        onHome: () => focusElement(focusables[0]),
        onEnd: () => focusElement(focusables[focusables.length - 1]),
        onInlineStart: () => focusElement(focusables[circleIndex(activeIndex - 1, [0, focusables.length - 1])]),
        onInlineEnd: () => focusElement(focusables[circleIndex(activeIndex + 1, [0, focusables.length - 1])]),
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
        if (element instanceof HTMLButtonElement) {
          return element.disabled;
        }

        return false;
      }

      return getAllFocusables(target).filter(el => isElementRegistered(el) && !isElementDisabled(el));
    }

    return (
      <div
        {...baseProps}
        className={clsx(styles.root, testUtilStyles['button-group'], baseProps.className)}
        ref={containerRef}
        role="toolbar"
        aria-label={ariaLabel}
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
          {items.map((itemOrGroup, index) => {
            const itemContent = (item: ButtonGroupProps.Item) => (
              <ItemElement
                key={item.id}
                item={item}
                dropdownExpandToViewport={dropdownExpandToViewport}
                tooltip={tooltip}
                setTooltip={setTooltip}
                onItemClick={onItemClick}
                ref={element => (itemsRef.current[item.id] = element)}
              />
            );

            const isGroupBefore = items[index - 1]?.type === 'group';
            const currentItem = items[index];
            const isGroupNow = currentItem?.type === 'group';
            const shouldAddDivider = isGroupBefore || (!isGroupBefore && isGroupNow && index !== 0);

            if (isGroupNow && currentItem.items.length === 0) {
              warnOnce('ButtonGroup', 'Empty group detected. Empty groups are not allowed.');
            }

            return (
              <React.Fragment key={itemOrGroup.type === 'group' ? index : itemOrGroup.id}>
                {shouldAddDivider && <div className={styles.divider} />}
                {itemOrGroup.type === 'group' ? (
                  <div key={index} role="group" aria-label={itemOrGroup.text} className={styles.group}>
                    {itemOrGroup.items.map(item => itemContent(item))}
                  </div>
                ) : (
                  itemContent(itemOrGroup)
                )}
              </React.Fragment>
            );
          })}
        </SingleTabStopNavigationProvider>
      </div>
    );
  }
);

export default InternalButtonGroup;
