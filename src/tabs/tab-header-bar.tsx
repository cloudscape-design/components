// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { TabsProps } from './interfaces';
import { ButtonProps } from '../button/interfaces';
import clsx from 'clsx';
import styles from './styles.css.js';
import { InternalButton } from '../button/internal';
import handleKey from '../internal/utils/handle-key';
import { KeyCode } from '../internal/keycode';
import {
  onPaginationClick,
  hasHorizontalOverflow,
  hasInlineStartOverflow,
  hasInlineEndOverflow,
  scrollIntoView,
} from './scroll-utils';
import { hasModifierKeys, isPlainLeftClick } from '../internal/events';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { useInternalI18n } from '../i18n/context';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import {
  FocusableChangeHandler,
  SingleTabStopNavigationContext,
  useSingleTabStopNavigation,
} from '../internal/context/single-tab-stop-navigation-context';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { getAllFocusables } from '../internal/components/focus-lock/utils';
import { nodeBelongs } from '../internal/utils/node-belongs';

function dismissButton(dismissLabel: TabsProps.Tab['dismissLabel'], onDismiss: TabsProps.Tab['onDismiss']) {
  return (
    <InternalButton onClick={onDismiss} variant="icon" iconName="close" formAction="none" ariaLabel={dismissLabel} />
  );
}

export interface TabHeaderBarProps {
  onChange: (changeDetail: TabsProps.ChangeDetail) => void;
  activeTabId: TabsProps['activeTabId'];
  tabs: TabsProps['tabs'];
  variant: TabsProps['variant'];
  idNamespace: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  i18nStrings?: TabsProps.I18nStrings;
}

export function TabHeaderBar({
  onChange,
  activeTabId,
  tabs,
  variant,
  idNamespace,
  ariaLabel,
  ariaLabelledby,
  i18nStrings,
}: TabHeaderBarProps) {
  const headerBarRef = useRef<HTMLUListElement>(null);
  const activeTabHeaderRef = useRef<HTMLAnchorElement>(null);
  const inlineStartOverflowButton = useRef<HTMLElement>(null);
  const i18n = useInternalI18n('tabs');

  const isVisualRefresh = useVisualRefresh();

  const containerObjectRef = useRef<HTMLDivElement>(null);
  const [widthChange, containerMeasureRef] = useContainerQuery<number>(rect => rect.contentBoxWidth);
  const containerRef = useMergeRefs(containerObjectRef, containerMeasureRef);
  const tabRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [horizontalOverflow, setHorizontalOverflow] = useState(false);
  const [inlineStartOverflow, setInlineStartOverflow] = useState(false);
  const [inlineEndOverflow, setInlineEndOverflow] = useState(false);

  useEffect(() => {
    if (headerBarRef.current) {
      setHorizontalOverflow(hasHorizontalOverflow(headerBarRef.current, inlineStartOverflowButton));
      setInlineStartOverflow(hasInlineStartOverflow(headerBarRef.current));
      setInlineEndOverflow(hasInlineEndOverflow(headerBarRef.current));
    }
  }, [widthChange, tabs]);

  const scrollIntoViewIfPossible = (smooth: boolean) => {
    if (!activeTabId) {
      return;
    }
    const activeTabRef = tabRefs.current.get(activeTabId);
    if (activeTabRef && headerBarRef.current) {
      scrollIntoView(activeTabRef, headerBarRef.current, smooth);
    }
  };

  useEffect(() => {
    // Delay scrollIntoView as the position is depending on parent elements
    // (effects are called inside-out in the component tree).
    // Wait one frame to allow parents to complete it's calculation.
    requestAnimationFrame(() => {
      scrollIntoViewIfPossible(false);
    });
    // Non-smooth scrolling should not be called upon activeId change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [horizontalOverflow, widthChange, tabs.length]);

  useEffect(() => {
    scrollIntoViewIfPossible(true);
    // Smooth scrolling should only be called upon activeId change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTabId]);

  useEffect(() => {
    /*
     When the selected tab changes and we are currently already focused on a tab,
     move the focus to the newly selected tab.
    */
    if (headerBarRef.current?.contains(document.activeElement)) {
      if (document.activeElement !== activeTabHeaderRef.current) {
        activeTabHeaderRef.current?.focus({ preventScroll: true });
      }
    }
  }, [activeTabId]);

  const onScroll = () => {
    if (headerBarRef.current) {
      setInlineStartOverflow(hasInlineStartOverflow(headerBarRef.current));
      setInlineEndOverflow(hasInlineEndOverflow(headerBarRef.current));
    }
  };

  const classes = clsx({
    [styles['tabs-header']]: true,
    [styles['tabs-header-with-divider']]: variant === 'default' || isVisualRefresh,
  });

  const leftButtonClasses = clsx({
    [styles['pagination-button']]: true,
    [styles['pagination-button-left']]: true,
    [styles['pagination-button-left-scrollable']]: inlineStartOverflow,
  });

  const rightButtonClasses = clsx({
    [styles['pagination-button']]: true,
    [styles['pagination-button-right']]: true,
    [styles['pagination-button-right-scrollable']]: inlineEndOverflow,
  });

  // The code below is largely taken from src/table/table-role/grid-navigation
  // There is an opportunity to reuse the large part of it instead of copying

  const focusables = useRef(new Set<Element>());
  const focusHandlers = useRef(new Map<Element, FocusableChangeHandler>());
  const focusablesState = useRef(new WeakMap<Element, boolean>());
  const focusTarget = useRef<null | Element>(null);

  function registerFocusable(focusableElement: Element, changeHandler: FocusableChangeHandler) {
    focusables.current.add(focusableElement);
    focusHandlers.current.set(focusableElement, changeHandler);
    const isFocusable = !!focusablesState.current.get(focusableElement);
    const newIsFocusable = focusTarget.current === focusableElement;
    if (newIsFocusable !== isFocusable) {
      focusablesState.current.set(focusableElement, newIsFocusable);
      changeHandler(newIsFocusable);
    }
    return () => unregisterFocusable(focusableElement);
  }

  function unregisterFocusable(focusable: Element) {
    focusables.current.delete(focusable);
    focusHandlers.current.delete(focusable);

    const isUnregisteringFocusedNode = nodeBelongs(focusable, document.activeElement);
    if (isUnregisteringFocusedNode) {
      // Wait for unmounted node to get removed from the DOM.
      setTimeout(() => updateAndRefocus(), 0);
    }
  }

  function updateAndRefocus() {
    if (
      !containerObjectRef.current ||
      !focusTarget.current ||
      nodeBelongs(containerObjectRef.current, focusTarget.current)
    ) {
      return;
    }
    updateFocusTarget();
    if (focusTarget.current instanceof HTMLElement) {
      focusTarget.current.focus();
    }
  }

  function updateFocusTarget() {
    focusTarget.current = getSingleFocusable();
    for (const focusableElement of focusables.current) {
      const isFocusable = focusablesState.current.get(focusableElement) ?? false;
      const newIsFocusable = focusTarget.current === focusableElement;
      if (newIsFocusable !== isFocusable) {
        focusablesState.current.set(focusableElement, newIsFocusable);
        focusHandlers.current.get(focusableElement)!(newIsFocusable);
      }
    }
  }

  function getSingleFocusable(): null | Element {
    if (!containerObjectRef.current) {
      return null;
    }
    const activeElement = document.activeElement;
    if (activeElement && containerObjectRef.current.contains(activeElement) && focusables.current.has(activeElement)) {
      return document.activeElement;
    }
    const activeStyle = styles['tabs-tab-active'];
    const activeTab = containerObjectRef.current.querySelector(`a.${activeStyle},button.${activeStyle}`);
    if (activeTab) {
      return activeTab;
    }
    const firstTab = containerObjectRef.current.querySelector(`a[role="tab"],button[role="tab"]`);
    return firstTab;
  }

  useEffect(() => {
    // Timeout ensures the newly rendered content elements are registered.
    setTimeout(() => updateFocusTarget(), 0);
  });

  function focusElement(element: HTMLElement) {
    element.focus();

    // TODO: should we decouple navigation and activation by requiring Space/Enter keypress to select a tab?
    if (element.role === 'tab' && element.dataset.testid) {
      onChange({ activeTabId: element.dataset.testid, activeTabHref: element.getAttribute('href') ?? undefined });
    }
  }

  const onKeyDown = function (event: React.KeyboardEvent) {
    const specialKeys = [KeyCode.right, KeyCode.left, KeyCode.end, KeyCode.home, KeyCode.pageUp, KeyCode.pageDown];
    if (hasModifierKeys(event) || specialKeys.indexOf(event.keyCode) === -1) {
      return;
    }
    if (!containerObjectRef.current || !focusTarget.current) {
      return;
    }
    event.preventDefault();

    const focusables = getFocusablesFrom(containerObjectRef.current);
    const activeIndex = focusables.indexOf(focusTarget.current as HTMLElement);
    handleKey(event as any, {
      onHome: () => focusElement(focusables[0]),
      onEnd: () => focusElement(focusables[focusables.length - 1]),
      onInlineStart: () => focusElement(focusables[Math.max(0, activeIndex - 1)]),
      onInlineEnd: () => focusElement(focusables[Math.min(focusables.length - 1, activeIndex + 1)]),
      onPageDown: () => inlineEndOverflow && onPaginationClick(headerBarRef, 'forward'),
      onPageUp: () => inlineStartOverflow && onPaginationClick(headerBarRef, 'backward'),
    });
  };

  function getFocusablesFrom(target: HTMLElement) {
    return getAllFocusables(target).filter(el => focusables.current.has(el) && !isElementDisabled(el));
  }

  function isElementDisabled(element: HTMLElement) {
    if (element instanceof HTMLButtonElement) {
      return element.disabled;
    }
    return false;
  }

  return (
    <SingleTabStopNavigationContext.Provider value={{ navigationActive: true, registerFocusable }}>
      {/* converted span to div as list should not be a child of span for HTML validation */}
      <div className={classes} ref={containerRef}>
        {horizontalOverflow && (
          <span ref={inlineStartOverflowButton} className={leftButtonClasses}>
            <InternalButton
              formAction="none"
              variant="icon"
              iconName="angle-left"
              disabled={!inlineStartOverflow}
              __focusable={true}
              onClick={() => onPaginationClick(headerBarRef, 'backward')}
              ariaLabel={i18n('i18nStrings.scrollLeftAriaLabel', i18nStrings?.scrollLeftAriaLabel)}
            />
          </span>
        )}
        <ul
          role="tablist"
          className={styles['tabs-header-list']}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          ref={headerBarRef}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          onFocus={() => updateFocusTarget()}
          onBlur={() => updateFocusTarget()}
        >
          {tabs.map(renderTabHeader)}
        </ul>
        {horizontalOverflow && (
          <span className={rightButtonClasses}>
            <InternalButton
              formAction="none"
              variant="icon"
              iconName="angle-right"
              disabled={!inlineEndOverflow}
              __focusable={true}
              onClick={() => onPaginationClick(headerBarRef, 'forward')}
              ariaLabel={i18n('i18nStrings.scrollRightAriaLabel', i18nStrings?.scrollRightAriaLabel)}
            />
          </span>
        )}
      </div>
    </SingleTabStopNavigationContext.Provider>
  );

  function renderTabHeader(tab: TabsProps.Tab) {
    const { dismissible, dismissLabel, action, onDismiss } = tab;

    const handleDismiss: ButtonProps['onClick'] = event => {
      if (!containerObjectRef.current) {
        return;
      }

      const tabElements = getFocusablesFrom(containerObjectRef.current).filter(el => el.role === 'tab');
      const activeTabIndex = tabElements.findIndex(el => el.dataset.testid === tab.id);
      tabElements.splice(activeTabIndex, 1);
      const nextActive = tabElements[Math.min(tabElements.length - 1, activeTabIndex)];
      const nextActiveId = nextActive && nextActive.dataset.testid;
      if (nextActiveId) {
        onChange({ activeTabId: nextActiveId });
      }
      onDismiss?.(event);
    };

    const clickTab = (event: React.MouseEvent) => {
      if (tab.disabled) {
        event.preventDefault();
        return;
      }

      // if the primary mouse button is clicked with a modifier key, the browser will handle opening a new tab
      const specialKey = !isPlainLeftClick(event);
      if (specialKey && tab.href) {
        return;
      }

      event.preventDefault();
      // for browsers that do not focus buttons on button click
      if (!tab.href) {
        const clickedTabRef = tabRefs.current.get(tab.id);
        if (clickedTabRef) {
          const childElement = clickedTabRef.firstChild as HTMLButtonElement;
          if (childElement && childElement !== document.activeElement) {
            childElement.focus({ preventScroll: true });
          }
        }
      }

      if (tab.id === activeTabId) {
        return;
      }

      onChange({ activeTabId: tab.id, activeTabHref: tab.href });
    };

    const classes = clsx({
      [styles['tabs-tab-link']]: true,
      [styles.refresh]: isVisualRefresh,
      [styles['tabs-tab-active']]: activeTabId === tab.id && !tab.disabled,
      [styles['tabs-tab-disabled']]: tab.disabled,
    });

    const tabHeaderContainerClasses = clsx({
      [styles['tabs-tab-header-container']]: true,
      [styles.refresh]: isVisualRefresh,
      [styles['tabs-tab-active']]: activeTabId === tab.id && !tab.disabled,
      [styles['tabs-tab-disabled']]: tab.disabled,
    });

    const commonProps: (JSX.IntrinsicElements['a'] | JSX.IntrinsicElements['button']) & { 'data-testid': string } = {
      className: classes,
      role: 'tab',
      'aria-selected': activeTabId === tab.id,
      'aria-expanded': activeTabId === tab.id,
      'aria-controls': `${idNamespace}-${tab.id}-panel`,
      'data-testid': tab.id,
      id: getTabElementId({ namespace: idNamespace, tabId: tab.id }),
      children: <span className={styles['tabs-tab-label']}>{tab.label}</span>,
    };

    if (tab.disabled) {
      commonProps['aria-disabled'] = 'true';
    } else {
      commonProps.onClick = clickTab;
    }

    let trigger = null;
    if (tab.href) {
      const anchorProps = commonProps as JSX.IntrinsicElements['a'];
      anchorProps.href = tab.href;
      trigger = <TriggerA {...anchorProps} ref={tab.id === activeTabId ? activeTabHeaderRef : undefined} />;
    } else {
      const buttonProps = commonProps as JSX.IntrinsicElements['button'];
      buttonProps.type = 'button';
      if (tab.disabled) {
        buttonProps.disabled = true;
      }
      trigger = <TriggerB {...buttonProps} ref={tab.id === activeTabId ? activeTabHeaderRef : undefined} />;
    }

    return (
      <li
        ref={element => tabRefs.current.set(tab.id, element as HTMLElement)}
        className={styles['tabs-tab']}
        role="presentation"
        key={tab.id}
      >
        <div className={tabHeaderContainerClasses} role="group" aria-labelledby={commonProps.id}>
          {trigger}
          {action && (
            <span className={styles['tabs-tab-action']} aria-label="More Actions" aria-haspopup="true">
              {action}
            </span>
          )}
          {dismissible && (
            <span className={styles['tabs-tab-dismiss']}> {dismissButton(dismissLabel, handleDismiss)} </span>
          )}
        </div>
      </li>
    );
  }
}

const TriggerA = forwardRef((props: React.HTMLAttributes<HTMLAnchorElement>, ref: React.Ref<HTMLElement>) => {
  const triggerRef = useRef(null);
  const mergedRef = useMergeRefs(triggerRef, ref);
  const { tabIndex: triggerTabIndex } = useSingleTabStopNavigation(triggerRef);
  return <a ref={mergedRef} {...props} tabIndex={triggerTabIndex} />;
});
const TriggerB = forwardRef((props: React.HTMLAttributes<HTMLButtonElement>, ref: React.Ref<HTMLElement>) => {
  const triggerRef = useRef(null);
  const mergedRef = useMergeRefs(triggerRef, ref);
  const { tabIndex: triggerTabIndex } = useSingleTabStopNavigation(triggerRef);
  return <button ref={mergedRef} {...props} tabIndex={triggerTabIndex} />;
});
export function getTabElementId({ namespace, tabId }: { namespace: string; tabId: string }) {
  return namespace + '-' + tabId;
}
