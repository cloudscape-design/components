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
import { getAllFocusables } from '../internal/components/focus-lock/utils';
import handleKey from '../internal/utils/handle-key';
import { hasModifierKeys } from '../internal/events';
import { KeyCode } from '../internal/keycode';

const InternalButtonGroup = forwardRef(
  (
    {
      items = [],
      onItemClick,
      ariaLabel,
      ariaLabelledby,
      dropdownExpandToViewport,
      __internalRootRef = null,
      ...props
    }: InternalButtonGroupProps,
    ref: React.Ref<ButtonGroupProps.Ref>
  ) => {
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

    const containerObjectRef = useRef<HTMLDivElement>(null);
    const containerRef = useMergeRefs(containerObjectRef, __internalRootRef);
    const navigationAPI = useRef<SingleTabStopNavigationAPI>(null);
    function getNextFocusTarget(): null | HTMLElement {
      if (!containerObjectRef.current) {
        return null;
      }
      if (document.activeElement && containerObjectRef.current.contains(document.activeElement)) {
        return document.activeElement as HTMLElement;
      }
      const buttons: HTMLButtonElement[] = Array.from(containerObjectRef.current.querySelectorAll('button'));
      return buttons.find(button => !button.disabled) ?? null;
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
      // TODO: allow for disabled with feedback text
      function isElementDisabled(element: HTMLElement) {
        if (element instanceof HTMLButtonElement) {
          return element.disabled;
        }
        return false;
      }
      return getAllFocusables(target).filter(el => isElementRegistered(el));
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

            const isGroupBefore = items[index - 1]?.type === 'group';
            const isGroupNow = items[index]?.type === 'group';
            const shouldAddDivider = isGroupBefore || (!isGroupBefore && isGroupNow && index !== 0);

            return (
              <React.Fragment key={itemOrGroup.type === 'group' ? itemOrGroup.text : itemOrGroup.id}>
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

function circleIndex(index: number, [from, to]: [number, number]): number {
  if (index < from) {
    return to;
  }
  if (index > to) {
    return from;
  }
  return index;
}

export default InternalButtonGroup;
