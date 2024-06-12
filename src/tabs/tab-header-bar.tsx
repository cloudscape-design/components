// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { TabsProps } from './interfaces';
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
  SingleTabStopNavigationAPI,
  SingleTabStopNavigationProvider,
  useSingleTabStopNavigation,
} from '../internal/context/single-tab-stop-navigation-context';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { getAllFocusables } from '../internal/components/focus-lock/utils';

const tabSelector = '[role="tab"]';
const activeTabSelector = '[role="tab"][aria-selected="true"]';

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
  const activeTabHeaderRef = useRef<null | HTMLElement>(null);
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
    if (activeTabRef && activeTabRef.parentElement && headerBarRef.current) {
      scrollIntoView(activeTabRef.parentElement, headerBarRef.current, smooth);
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

  const navigationAPI = useRef<SingleTabStopNavigationAPI>(null);

  function getNextFocusTarget(): null | HTMLElement {
    if (!containerObjectRef.current) {
      return null;
    }
    const tabElements: HTMLButtonElement[] = Array.from(containerObjectRef.current.querySelectorAll(tabSelector));
    return tabElements.find(tab => tab.matches(activeTabSelector)) ?? tabElements.find(tab => !tab.disabled) ?? null;
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
      onPageDown: () => inlineEndOverflow && onPaginationClick(headerBarRef, 'forward'),
      onPageUp: () => inlineStartOverflow && onPaginationClick(headerBarRef, 'backward'),
    });
  }
  function focusElement(element: HTMLElement) {
    element.focus();
    // If focusable element is a tab - fire the onChange for it.
    const tabsById = tabs.reduce((map, tab) => map.set(tab.id, tab), new Map<string, TabsProps.Tab>());
    for (const [tabId, tabTriggerElement] of tabRefs.current.entries()) {
      if (tabId !== activeTabId && tabTriggerElement === element) {
        onChange({ activeTabId: tabId, activeTabHref: tabsById.get(tabId)?.href });
        break;
      }
    }
  }
  // List all non-disabled and registered focusables: those are eligible for keyboard navigation.
  function getFocusablesFrom(target: HTMLElement) {
    function isElementRegistered(element: HTMLElement) {
      return navigationAPI.current?.isRegistered(element) ?? false;
    }
    function isElementDisabled(element: HTMLElement) {
      if (element instanceof HTMLButtonElement) {
        return element.disabled && element.getAttribute('aria-selected') !== 'true';
      }
      return false;
    }
    return getAllFocusables(target).filter(el => isElementRegistered(el) && !isElementDisabled(el));
  }

  return (
    //converted span to div as list should not be a child of span for HTML validation
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
      <SingleTabStopNavigationProvider
        ref={navigationAPI}
        navigationActive={true}
        getNextFocusTarget={getNextFocusTarget}
      >
        <ul
          role="tablist"
          className={styles['tabs-header-list']}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          ref={headerBarRef}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          {tabs.map(renderTabHeader)}
        </ul>
      </SingleTabStopNavigationProvider>
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
  );

  function renderTabHeader(tab: TabsProps.Tab) {
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
        const clickedTabRef = tabRefs.current.get(tab.id) as undefined | HTMLButtonElement;
        if (clickedTabRef) {
          if (clickedTabRef && clickedTabRef !== document.activeElement) {
            clickedTabRef.focus({ preventScroll: true });
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

    const commonProps: (JSX.IntrinsicElements['a'] | JSX.IntrinsicElements['button']) & { 'data-testid': string } = {
      className: classes,
      role: 'tab',
      'aria-selected': tab.id === activeTabId,
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

    const setElement = (tabElement: null | HTMLElement) => {
      if (tab.id === activeTabId) {
        activeTabHeaderRef.current = tabElement;
      }
      tabRefs.current.set(tab.id, tabElement as HTMLElement);
    };

    return (
      <li className={styles['tabs-tab']} role="presentation" key={tab.id}>
        <TabTrigger ref={setElement} tab={tab} elementProps={commonProps} />
      </li>
    );
  }
}

const TabTrigger = forwardRef(
  (
    {
      tab,
      elementProps,
    }: { tab: TabsProps.Tab; elementProps: React.HTMLAttributes<HTMLAnchorElement | HTMLButtonElement> },
    ref: React.Ref<HTMLElement>
  ) => {
    const refObject = useRef<HTMLElement>(null);
    const mergedRef = useMergeRefs(refObject, ref);
    const { tabIndex } = useSingleTabStopNavigation(refObject);
    return tab.href ? (
      <a {...elementProps} href={tab.href} ref={mergedRef} tabIndex={tabIndex} />
    ) : (
      <button {...elementProps} type="button" disabled={tab.disabled} ref={mergedRef} tabIndex={tabIndex} />
    );
  }
);

export function getTabElementId({ namespace, tabId }: { namespace: string; tabId: string }) {
  return namespace + '-' + tabId;
}

function circleIndex(index: number, [from, to]: [number, number]): number {
  if (index < from) {
    return to;
  }
  if (index > to) {
    return from;
  }
  return index;
}
