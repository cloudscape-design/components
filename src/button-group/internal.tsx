// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef, forwardRef, useEffect } from 'react';
import { getBaseProps } from '../internal/base-component';
import { ButtonGroupProps, InternalButtonGroupProps } from './interfaces';
import { ButtonProps } from '../button/interfaces';
import ItemElement from './item-element.js';
import styles from './styles.css.js';
import clsx from 'clsx';
import { ButtonDropdownProps } from '../button-dropdown/interfaces';
import {
  SingleTabStopNavigationAPI,
  SingleTabStopNavigationProvider,
} from '../internal/context/single-tab-stop-navigation-context';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { KeyCode } from '../internal/keycode';
import { hasModifierKeys } from '../internal/events';
import { circleIndex } from '../internal/utils/circle-index';
import { getAllFocusables } from '../internal/components/focus-lock/utils';
import { nodeBelongs } from '../internal/utils/node-belongs';
import handleKey from '../internal/utils/handle-key';

const InternalButtonGroup = forwardRef(
  (
    {
      items = [],
      onItemClick,
      ariaLabel,
      ariaLabelledby,
      __internalRootRef = null,
      ...props
    }: InternalButtonGroupProps,
    ref: React.Ref<ButtonGroupProps.Ref>
  ) => {
    const baseProps = getBaseProps(props);
    const focusedItemIdRef = useRef<null | string>(null);
    const navigationAPI = useRef<SingleTabStopNavigationAPI>(null);
    const containerObjectRef = useRef<HTMLDivElement>(null);
    const containerRef = useMergeRefs(containerObjectRef, __internalRootRef);
    const itemsRef = useRef<Record<string, ButtonProps.Ref | null>>({});

    useImperativeHandle(ref, () => ({
      focus: id => {
        itemsRef.current[id]?.focus();
      },
    }));

    const onSetButtonRef = (item: ButtonGroupProps.Item, element: ButtonProps.Ref | null) => {
      const isItemGroup = (item: ButtonDropdownProps.ItemOrGroup): item is ButtonDropdownProps.ItemGroup => {
        return 'items' in item;
      };

      const getAllIdsItemOrGroup = (item: ButtonDropdownProps.ItemOrGroup): string[] => {
        if (isItemGroup(item)) {
          const values = item.items.flatMap(getAllIdsItemOrGroup);
          if (typeof item.id !== 'undefined') {
            values.push(item.id);
          }

          return values;
        } else {
          return [item.id];
        }
      };

      const getAllIds = (item: ButtonGroupProps.Item) => {
        if (item.type === 'icon-button') {
          return [item.id];
        } else {
          const values = getAllIdsItemOrGroup(item);
          if (typeof item.id !== 'undefined') {
            values.push(item.id);
          }

          return values;
        }
      };

      getAllIds(item).forEach(id => {
        itemsRef.current[id] = element;
      });
    };

    function getNextFocusTarget(): null | HTMLElement {
      const nextTarget = (() => {
        if (!containerObjectRef.current) {
          return null;
        }

        if (document.activeElement && containerObjectRef.current.contains(document.activeElement)) {
          return document.activeElement as HTMLElement;
        }
        const buttons: HTMLButtonElement[] = Array.from(containerObjectRef.current.querySelectorAll(`.${styles.item}`));
        const activeButtons = buttons.filter(button => !button.disabled);

        return (
          activeButtons.find(button => button.dataset.testid === focusedItemIdRef.current) ?? activeButtons[0] ?? null
        );
      })();

      if (nextTarget) {
        focusedItemIdRef.current = nextTarget.dataset.testid ?? null;
      }

      return nextTarget;
    }

    function onUnregisterFocusable(focusableElement: HTMLElement) {
      const isUnregisteringFocusedNode = nodeBelongs(focusableElement, document.activeElement);
      if (isUnregisteringFocusedNode) {
        // Wait for unmounted node to get removed from the DOM.
        setTimeout(() => navigationAPI.current?.getFocusTarget()?.focus(), 0);
      }
    }

    useEffect(() => {
      navigationAPI.current?.updateFocusTarget();
    });

    function onFocus() {
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
        className={clsx(styles.root, baseProps.className)}
        ref={containerRef}
        role="toolbar"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      >
        <SingleTabStopNavigationProvider
          ref={navigationAPI}
          navigationActive={true}
          getNextFocusTarget={getNextFocusTarget}
          onUnregisterFocusable={onUnregisterFocusable}
        >
          {items.map((itemOrGroup, index) => {
            const content =
              itemOrGroup.type === 'group' ? (
                <div key={index} role="group" aria-label={itemOrGroup.text} className={styles.group}>
                  {itemOrGroup.items.map(item => (
                    <ItemElement
                      key={item.id}
                      item={item}
                      onItemClick={onItemClick}
                      ref={element => onSetButtonRef(item, element)}
                    />
                  ))}
                </div>
              ) : (
                <ItemElement
                  item={itemOrGroup}
                  onItemClick={onItemClick}
                  ref={element => onSetButtonRef(itemOrGroup, element)}
                />
              );

            const isGroupBefore = items[index - 1]?.type === 'group';
            const isGroupNow = items[index]?.type === 'group';
            const shouldAddDivider = isGroupBefore || (!isGroupBefore && isGroupNow && index !== 0);

            return (
              <React.Fragment key={itemOrGroup.type === 'group' ? index : itemOrGroup.id}>
                {shouldAddDivider && <div className={styles.divider} />}
                {content}
              </React.Fragment>
            );
          })}
        </SingleTabStopNavigationProvider>
      </div>
    );
  }
);

export default InternalButtonGroup;
