// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import { getAllFocusables } from '../internal/components/focus-lock/utils';
import Tooltip from '../internal/components/tooltip';
import {
  SingleTabStopNavigationAPI,
  SingleTabStopNavigationProvider,
  useSingleTabStopNavigation,
} from '../internal/context/single-tab-stop-navigation-context';
import { hasModifierKeys, isPlainLeftClick } from '../internal/events';
import useHiddenDescription from '../internal/hooks/use-hidden-description';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { KeyCode } from '../internal/keycode';
import { circleIndex } from '../internal/utils/circle-index';
import handleKey from '../internal/utils/handle-key';
import { TabsProps } from './interfaces';
import {
  hasHorizontalOverflow,
  hasInlineEndOverflow,
  hasInlineStartOverflow,
  onPaginationClick,
  scrollIntoView,
} from './scroll-utils';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

const tabSelector = `.${styles['tabs-tab-link']}`;
const focusedTabSelector = `[role="tab"].${styles['tabs-tab-focused']}`;
const focusableTabSelector = `.${styles['tabs-tab-focusable']}`;

function dismissButton({
  dismissLabel,
  dismissDisabled,
  onDismiss,
  tabId,
}: {
  dismissLabel?: string;
  dismissDisabled?: boolean;
  onDismiss: ButtonProps['onClick'];
  tabId: string;
}) {
  return (
    <InternalButton
      onClick={onDismiss}
      variant="icon"
      iconName="close"
      formAction="none"
      ariaLabel={dismissLabel}
      disabled={dismissDisabled}
      className={testUtilStyles['tab-dismiss-button']}
      data-testid={`awsui-tab-dismiss-button-${tabId}`}
    />
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
  const [focusedTabId, setFocusedTabId] = useState(activeTabId);
  const [previousActiveTabId, setPreviousActiveTabId] = useState<string | undefined>(activeTabId);
  const hasActionOrDismissible = tabs.some(tab => tab.action || tab.dismissible);
  const tabActionAttributes = hasActionOrDismissible
    ? {
        role: 'application',
        'aria-roledescription': i18n(
          'i18nStrings.tabsWithActionsAriaRoleDescription',
          i18nStrings?.tabsWithActionsAriaRoleDescription
        ),
      }
    : {
        role: 'tablist',
      };

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

  const navigationAPI = useRef<SingleTabStopNavigationAPI>(null);

  function getNextFocusTarget(): null | HTMLElement {
    if (!containerObjectRef.current) {
      return null;
    }
    const tabElements: HTMLButtonElement[] = Array.from(containerObjectRef.current.querySelectorAll(tabSelector));
    return tabElements.find(tab => tab.matches(focusedTabSelector)) ?? tabElements.find(tab => !tab.disabled) ?? null;
  }

  function onUnregisterActive(focusableElement: HTMLElement) {
    const isFocusableActionOrDismissible = !focusableElement.classList.contains(styles['tabs-tab-link']);
    if (!isFocusableActionOrDismissible) {
      const nextFocusTarget = navigationAPI.current?.getFocusTarget();
      const tabLinkButton = nextFocusTarget?.querySelector(`.${styles['tabs-tab-link']}`) as HTMLElement;
      tabLinkButton?.focus();
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
    const focusTarget = document.activeElement;
    const specialKeys = [KeyCode.right, KeyCode.left, KeyCode.end, KeyCode.home, KeyCode.pageUp, KeyCode.pageDown];
    const isActionOpen = document.querySelector(`.${styles['tabs-tab-action']} [aria-expanded="true"]`);
    const isDismissOrActionFocused = !focusTarget?.classList.contains(styles['tabs-tab-link']);

    if (isActionOpen) {
      return;
    }
    if (event.key === 'Tab' && !event.shiftKey && isDismissOrActionFocused) {
      event.preventDefault();
      const panelId = `${idNamespace}-${activeTabId}-panel`;
      const panel = document.getElementById(panelId);
      panel?.focus();
    }
    if (hasModifierKeys(event) || specialKeys.indexOf(event.keyCode) === -1) {
      return;
    }
    if (!containerObjectRef.current || !focusTarget) {
      return;
    }
    event.preventDefault();

    const focusables = getFocusablesFrom(containerObjectRef.current);
    const activeIndex = document.activeElement instanceof HTMLElement ? focusables.indexOf(document.activeElement) : -1;
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
    for (const [tabId, focusTargetTabTriggerElement] of tabRefs.current.entries()) {
      const focusTargetTabLabelElement = focusTargetTabTriggerElement?.querySelector(`.${styles['tabs-tab-link']}`);
      if (tabId !== activeTabId && focusTargetTabLabelElement === element) {
        setPreviousActiveTabId(tabId);
        setFocusedTabId(tabId);

        if (!tabsById.get(tabId)?.disabled) {
          onChange({ activeTabId: tabId, activeTabHref: tabsById.get(tabId)?.href });
        }
        break;
      }
    }
  }
  // List all non-disabled and registered focusables: those are eligible for keyboard navigation.
  function getFocusablesFrom(target: HTMLElement) {
    function isElementRegistered(element: HTMLElement) {
      return navigationAPI.current?.isRegistered(element) ?? false;
    }
    function isElementFocusable(element: HTMLElement) {
      if (element instanceof HTMLButtonElement) {
        return !element.disabled || element.closest(focusableTabSelector);
      }

      return element.matches(focusableTabSelector);
    }
    return getAllFocusables(target).filter(el => isElementRegistered(el) && isElementFocusable(el));
  }

  const TabList = hasActionOrDismissible ? 'div' : 'ul';

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
        onUnregisterActive={onUnregisterActive}
      >
        <TabList
          {...tabActionAttributes}
          className={styles['tabs-header-list']}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          ref={headerBarRef as never}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          {tabs.map(renderTabHeader)}
        </TabList>
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
    const { dismissible, dismissLabel, dismissDisabled, action, onDismiss } = tab;
    const isActive = activeTabId === tab.id && !tab.disabled;

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

      setFocusedTabId(tab.id);
      setPreviousActiveTabId(tab.id);
      onChange({ activeTabId: tab.id, activeTabHref: tab.href });
    };

    const classes = clsx({
      [styles['tabs-tab-link']]: true,
      [styles.refresh]: isVisualRefresh,
      [styles['tabs-tab-active']]: activeTabId === tab.id && !tab.disabled,
      [styles['tabs-tab-focused']]: focusedTabId === tab.id,
      [styles['tabs-tab-active']]: isActive,
      [styles['tabs-tab-disabled']]: tab.disabled,
      [styles['tabs-tab-focusable']]: !tab.disabled || (tab.disabled && !!tab.disabledReason),
    });

    const tabHeaderContainerClasses = clsx({
      [styles['tabs-tab-header-container']]: true,
      [styles.refresh]: isVisualRefresh,
      [styles['tabs-tab-active']]: isActive,
      [styles['tabs-tab-disabled']]: tab.disabled,
      [styles['tabs-tab-focusable']]: !tab.disabled || (tab.disabled && !!tab.disabledReason),
    });

    const tabActionClasses = clsx({
      [styles['tabs-tab-action']]: true,
      [styles['tabs-tab-active']]: isActive,
    });

    const commonProps: (JSX.IntrinsicElements['a'] | JSX.IntrinsicElements['button']) & { 'data-testid': string } = {
      className: classes,
      'aria-controls': `${idNamespace}-${tab.id}-panel`,
      'data-testid': tab.id,
      id: getTabElementId({ namespace: idNamespace, tabId: tab.id }),
      onClick: clickTab,
    };

    const tabHeaderContainerAriaProps = hasActionOrDismissible
      ? {
          role: 'group',
          'aria-labelledby': commonProps.id,
        }
      : {};

    if (!hasActionOrDismissible) {
      commonProps['aria-selected'] = activeTabId === tab.id;
      commonProps.role = 'tab';
    } else {
      commonProps['aria-expanded'] = activeTabId === tab.id;
    }

    if (tab.disabled) {
      commonProps['aria-disabled'] = 'true';
    }

    const setElement = (tabElement: null | HTMLElement) => {
      if (tab.id === activeTabId) {
        activeTabHeaderRef.current = tabElement;
      }
      tabRefs.current.set(tab.id, tabElement as HTMLElement);
    };

    const handleDismiss: ButtonProps['onClick'] = event => {
      if (!containerObjectRef.current || !onDismiss) {
        return;
      }
      const tabElements = getFocusablesFrom(containerObjectRef.current).filter(el =>
        el.classList.contains(styles['tabs-tab-link'])
      );
      const activeTabIndex = tabElements.findIndex(el => el.dataset.testid === tab.id);
      tabElements.splice(activeTabIndex, 1);
      let nextActive: HTMLElement | undefined;
      if (previousActiveTabId && previousActiveTabId !== tab.id) {
        nextActive = tabElements.find(el => el.dataset.testid === previousActiveTabId);
      } else {
        nextActive = tabElements[Math.min(tabElements.length - 1, activeTabIndex)];
      }
      if (nextActive && nextActive.dataset.testid) {
        onChange({ activeTabId: nextActive.dataset.testid });
        nextActive.focus();
      }
      onDismiss(event);
    };

    const TabItem = hasActionOrDismissible ? 'div' : 'li';
    return (
      <TabItem
        ref={(element: any) => tabRefs.current.set(tab.id, element as HTMLElement)}
        className={styles['tabs-tab']}
        role="presentation"
        key={tab.id}
      >
        <div className={tabHeaderContainerClasses} {...tabHeaderContainerAriaProps}>
          <TabTrigger ref={setElement} tab={tab} elementProps={commonProps} />
          {action && <span className={tabActionClasses}>{action}</span>}
          {dismissible && (
            <span className={styles['tabs-tab-dismiss']}>
              {dismissButton({ dismissLabel, dismissDisabled, onDismiss: handleDismiss, tabId: tab.id })}
            </span>
          )}
        </div>
      </TabItem>
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
    const tabLabelRefObject = useRef<HTMLElement>(null);
    const mergedRef = useMergeRefs(refObject, ref);
    const { tabIndex } = useSingleTabStopNavigation(refObject);
    const isDisabledWithReason = tab.disabled && !!tab.disabledReason;
    const [showTooltip, setShowTooltip] = useState(false);
    const { targetProps, descriptionEl } = useHiddenDescription(tab.disabledReason);
    const children = (
      <>
        <span className={styles['tabs-tab-label']} ref={tabLabelRefObject}>
          {tab.label}
        </span>
        {isDisabledWithReason && (
          <>
            {descriptionEl}
            {showTooltip && (
              <Tooltip
                className={styles['disabled-reason-tooltip']}
                trackRef={tabLabelRefObject}
                value={tab.disabledReason!}
              />
            )}
          </>
        )}
      </>
    );

    const handlers = {
      onFocus: () => setShowTooltip(true),
      onBlur: () => setShowTooltip(false),
      onMouseEnter: () => setShowTooltip(true),
      onMouseLeave: () => setShowTooltip(false),
    };

    const commonProps = {
      ...elementProps,
      ...(isDisabledWithReason ? targetProps : {}),
      ...(isDisabledWithReason ? handlers : {}),
      ref: mergedRef,
      tabIndex: tabIndex,
    };

    return tab.href ? (
      <a {...commonProps} href={tab.href}>
        {children}
      </a>
    ) : (
      <button {...commonProps} type="button" disabled={tab.disabled && !isDisabledWithReason}>
        {children}
      </button>
    );
  }
);

export function getTabElementId({ namespace, tabId }: { namespace: string; tabId: string }) {
  return namespace + '-' + tabId;
}
