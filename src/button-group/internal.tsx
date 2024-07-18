// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef, forwardRef, useEffect, useState } from 'react';
import { getBaseProps } from '../internal/base-component';
import { ButtonGroupProps, InternalButtonGroupProps } from './interfaces';
import { ButtonProps } from '../button/interfaces';
import { ClickDetail, fireCancelableEvent } from '../internal/events/index.js';
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
import ItemElement from './item-element.js';
import testUtilStyles from './test-classes/styles.css.js';
import handleKey from '../internal/utils/handle-key';
import Tooltip from '../internal/components/tooltip/index.js';
import LiveRegion from '../internal/components/live-region/index.js';
import clsx from 'clsx';
import styles from './styles.css.js';

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
    const [focusedItemId, setFocusedItemId] = useState<null | string>(null);
    const navigationAPI = useRef<SingleTabStopNavigationAPI>(null);
    const containerObjectRef = useRef<HTMLDivElement>(null);
    const containerRef = useMergeRefs(containerObjectRef, __internalRootRef);
    const itemsRef = useRef<Record<string, ButtonProps.Ref | null>>({});
    const itemsDataRef = useRef<Record<string, ButtonGroupProps.Item>>({});
    const itemWrappersRef = useRef<Record<string, HTMLDivElement | null>>({});
    const [tooltipItemId, setTooltipItemId] = useState<string | null>(null);
    const [isFeedbackTooltip, setIsFeedbackTooltip] = useState(false);

    useImperativeHandle(ref, () => ({
      focus: id => {
        itemsRef.current[id]?.focus();
      },
    }));

    const onSetItemRef = (item: ButtonGroupProps.Item, element: ButtonProps.Ref | null) => {
      itemsDataRef.current[item.id] = item;
      itemsRef.current[item.id] = element;
    };

    function getNextFocusTarget(): null | HTMLElement {
      if (containerObjectRef.current) {
        const buttons: HTMLButtonElement[] = Array.from(containerObjectRef.current.querySelectorAll(`.${styles.item}`));
        const activeButtons = buttons.filter(button => !button.disabled);
        return activeButtons.find(button => button.dataset.testid === focusedItemId) ?? activeButtons[0] ?? null;
      }
      return null;
    }

    function onUnregisterFocusable(focusableElement: HTMLElement) {
      const isUnregisteringFocusedNode = nodeBelongs(focusableElement, document.activeElement);
      if (isUnregisteringFocusedNode) {
        // Wait for unmounted node to get removed from the DOM.
        // Only refocus when the node is actually removed (no such ID anymore).
        setTimeout(() => {
          const target = navigationAPI.current?.getFocusTarget();
          if (target && target.dataset.testid !== focusableElement.dataset.testid) {
            target.focus();
          }
        }, 0);
      }
    }

    useEffect(() => {
      navigationAPI.current?.updateFocusTarget();
    });

    function onFocus(event: React.FocusEvent) {
      if (event.target instanceof HTMLElement && event.target.dataset.testid) {
        setFocusedItemId(event.target.dataset.testid);
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

    useEffect(() => {
      if (!tooltipItemId) {
        return;
      }

      const close = () => {
        setTooltipItemId(null);
        setIsFeedbackTooltip(false);
      };

      const handlePointerDownEvent = (event: PointerEvent) => {
        if (
          event.target &&
          (itemWrappersRef.current[tooltipItemId] as HTMLElement)?.contains(event.target as HTMLElement)
        ) {
          return;
        }

        close();
      };

      const handleKeyDownEvent = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          close();
        }
      };

      window.addEventListener('pointerdown', handlePointerDownEvent);
      window.addEventListener('keydown', handleKeyDownEvent);

      return () => {
        window.removeEventListener('pointerdown', handlePointerDownEvent);
        window.removeEventListener('keydown', handleKeyDownEvent);
      };
    }, [tooltipItemId]);

    const onClickHandler = (itemId: string, event: CustomEvent<ButtonGroupProps.ItemClickDetails | ClickDetail>) => {
      const tooltipItem = itemsDataRef.current[itemId];
      const popoverFeedback = tooltipItem && 'popoverFeedback' in tooltipItem && tooltipItem.popoverFeedback;

      if (popoverFeedback) {
        setTooltipItemId(itemId);
        setIsFeedbackTooltip(true);
      } else {
        setTooltipItemId(null);
        setIsFeedbackTooltip(false);
      }

      fireCancelableEvent(onItemClick, { id: 'id' in event.detail ? event.detail.id : itemId }, event);
    };

    const onShowTooltip = (itemId: string | null, show: boolean) => {
      if (isFeedbackTooltip && tooltipItemId && itemsRef.current[tooltipItemId]) {
        return;
      }

      if (tooltipItemId !== itemId) {
        if (show) {
          setTooltipItemId(itemId);
        }
      } else {
        if (!show) {
          setTooltipItemId(null);
        }
      }

      setIsFeedbackTooltip(false);
    };

    const tooltipItem = tooltipItemId ? itemsDataRef.current[tooltipItemId] : undefined;

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
          onUnregisterFocusable={onUnregisterFocusable}
        >
          {items.map((itemOrGroup, index) => {
            const itemContent = (item: ButtonGroupProps.Item) => (
              <div
                key={item.id}
                className={styles['item-wrapper']}
                ref={element => (itemWrappersRef.current[item.id] = element)}
                onPointerEnter={() => onShowTooltip(item.id, true)}
                onPointerLeave={() => onShowTooltip(item.id, false)}
                onFocus={() => onShowTooltip(item.id, true)}
                onBlur={() => onShowTooltip(item.id, false)}
              >
                <ItemElement
                  item={item}
                  dropdownExpandToViewport={dropdownExpandToViewport}
                  onItemClick={event => onClickHandler(item.id, event)}
                  ref={element => onSetItemRef(item, element)}
                />
              </div>
            );

            const isGroupBefore = items[index - 1]?.type === 'group';
            const isGroupNow = items[index]?.type === 'group';
            const shouldAddDivider = isGroupBefore || (!isGroupBefore && isGroupNow && index !== 0);

            return (
              <React.Fragment key={itemOrGroup.type === 'group' ? index : itemOrGroup.id}>
                {shouldAddDivider && <div className={styles.divider} />}
                {itemOrGroup.type === 'group' ? (
                  <div key={index} role="group" aria-label={itemOrGroup.text} className={styles.group}>
                    {itemOrGroup.items.map(item => (
                      <React.Fragment key={item.id}>{itemContent(item)}</React.Fragment>
                    ))}
                  </div>
                ) : (
                  <React.Fragment key={itemOrGroup.id}>{itemContent(itemOrGroup)}</React.Fragment>
                )}
              </React.Fragment>
            );
          })}
        </SingleTabStopNavigationProvider>
        {tooltipItemId &&
          itemWrappersRef.current[tooltipItemId] &&
          tooltipItem &&
          !(tooltipItem.type === 'menu-dropdown') &&
          (!isFeedbackTooltip || ('popoverFeedback' in tooltipItem && tooltipItem.popoverFeedback)) && (
            <Tooltip
              trackRef={{ current: itemWrappersRef.current[tooltipItemId] }}
              trackKey={tooltipItemId}
              value={
                (isFeedbackTooltip && <LiveRegion visible={true}>{tooltipItem.popoverFeedback}</LiveRegion>) ||
                tooltipItem.text
              }
              className={clsx(styles.tooltip, testUtilStyles['button-group-tooltip'])}
            />
          )}
      </div>
    );
  }
);

export default InternalButtonGroup;
