// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef, forwardRef, useEffect } from 'react';
import { getBaseProps } from '../internal/base-component';
import { ButtonGroupProps, InternalButtonGroupProps } from './interfaces';
import { ButtonProps } from '../button/interfaces';
import ItemElement from './item-element';
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
import handleKey from '../internal/utils/handle-key';
import { getAllFocusables } from '../internal/components/focus-lock/utils';

const InternalButtonGroup = forwardRef(
  (
    {
      ariaLabel,
      items = [],
      onItemClick,
      __internalRootRef = null,
      dropdownExpandToViewport,
      ...props
    }: InternalButtonGroupProps,
    ref: React.Ref<ButtonGroupProps.Ref>
  ) => {
    const containerObjectRef = useRef<HTMLDivElement>(null);
    const containerRef = useMergeRefs(containerObjectRef, __internalRootRef);
    const itemsRef = useRef<Record<string, ButtonProps.Ref | null>>({});
    const baseProps = getBaseProps(props);

    useImperativeHandle(ref, () => ({
      focus: id => {
        itemsRef.current[id]?.focus();
      },
    }));

    const onSetButtonRef = (
      item: ButtonGroupProps.IconButton | ButtonGroupProps.MenuDropdown,
      element: ButtonProps.Ref | null
    ) => {
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

      const getAllIds = (item: ButtonGroupProps.IconButton | ButtonGroupProps.MenuDropdown) => {
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

    const navigationAPI = useRef<SingleTabStopNavigationAPI>(null);

    function getNextFocusTarget(): null | HTMLElement {
      if (!containerObjectRef.current) {
        return null;
      }
      if (containerObjectRef.current.contains(document.activeElement)) {
        return document.activeElement as HTMLElement;
      }
      const items: HTMLButtonElement[] = Array.from(containerObjectRef.current.querySelectorAll(`.${styles.item}`));
      return items.filter(item => !item.disabled)[0];
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
      if (!document.activeElement || !navigationAPI.current?.isRegistered(document.activeElement)) {
        return;
      }
      event.preventDefault();

      const focusables = getFocusablesFrom(containerObjectRef.current);
      const activeIndex = focusables.indexOf(focusTarget);
      handleKey(event as any, {
        onHome: () => focusItem(focusables[0]),
        onEnd: () => focusItem(focusables[focusables.length - 1]),
        onInlineStart: () => focusItem(focusables[circleIndex(activeIndex - 1, [0, focusables.length - 1])]),
        onInlineEnd: () => focusItem(focusables[circleIndex(activeIndex + 1, [0, focusables.length - 1])]),
      });
    }
    function focusItem(element?: HTMLElement) {
      element?.focus();
    }
    // List all non-disabled and registered focusables: those are eligible for keyboard navigation.
    function getFocusablesFrom(target: HTMLElement) {
      function isElementRegistered(element: HTMLElement) {
        return navigationAPI.current?.isRegistered(element) ?? false;
      }
      function isElementDisabled(element: HTMLElement) {
        return element instanceof HTMLButtonElement ? element.disabled : false;
      }
      return getAllFocusables(target).filter(el => isElementRegistered(el) && !isElementDisabled(el));
    }

    return (
      <div
        {...baseProps}
        className={clsx(styles.root, baseProps.className)}
        role="toolbar"
        aria-label={ariaLabel}
        ref={containerRef}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      >
        <SingleTabStopNavigationProvider
          ref={navigationAPI}
          navigationActive={true}
          getNextFocusTarget={getNextFocusTarget}
        >
          {items.map((itemOrGroup, index) => {
            const content =
              itemOrGroup.type === 'group' ? (
                <div key={itemOrGroup.text} role="group" aria-label={itemOrGroup.text} className={styles.group}>
                  {itemOrGroup.items.map(item => (
                    <ItemElement
                      key={item.id}
                      item={item}
                      onItemClick={onItemClick}
                      dropdownExpandToViewport={dropdownExpandToViewport}
                      ref={element => onSetButtonRef(item, element)}
                    />
                  ))}
                </div>
              ) : (
                <ItemElement
                  item={itemOrGroup}
                  onItemClick={onItemClick}
                  dropdownExpandToViewport={dropdownExpandToViewport}
                  ref={element => onSetButtonRef(itemOrGroup, element)}
                />
              );
            return (
              <React.Fragment key={itemOrGroup.type === 'group' ? itemOrGroup.text : itemOrGroup.id}>
                {items[index - 1]?.type === 'group' && <div className={styles.divider} />}
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
