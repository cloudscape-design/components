// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState, useEffect } from 'react';
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

function setTabIndexForTabContent(tabContentElement: HTMLElement, isActive: boolean) {
  const focusableElements = tabContentElement.querySelectorAll('button, a');
  focusableElements.forEach(element => {
    const isFocusable = isActive || tabContentElement.classList.contains(`${styles['tabs-tab-disabled']}`);
    isFocusable ? element.setAttribute('tabIndex', '0') : element.setAttribute('tabIndex', '-1');
  });
}

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

  const [widthChange, containerRef] = useContainerQuery<number>(rect => rect.contentBoxWidth);
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

  useEffect(() => {
    const tabContentElements = document.querySelectorAll(`.${styles['tabs-tab-header-content']}`);
    tabContentElements.forEach(element => {
      const isActive = element.classList.contains(`${styles['tabs-tab-active']}`);
      setTabIndexForTabContent(element as HTMLElement, isActive);
    });
  }, [activeTabId]);

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
      <ul
        role="tablist"
        className={styles['tabs-header-list']}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        ref={headerBarRef}
        onScroll={onScroll}
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
  );

  function renderTabHeader(tab: TabsProps.Tab) {
    const enabledTabsWithCurrentTab = tabs.filter(tab => !tab.disabled || tab.id === activeTabId);
    const { dismissible, dismissLabel, action, onDismiss } = tab;

    const handleDismiss: ButtonProps['onClick'] = event => {
      onDismiss && onDismiss(event);
    };

    const highlightTab = function (enabledTabIndex: number) {
      const tab = enabledTabsWithCurrentTab[enabledTabIndex];
      if (tab.id === activeTabId) {
        return;
      }

      onChange({ activeTabId: tab.id, activeTabHref: tab.href });
    };

    const onKeyDown = function (
      event: React.KeyboardEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLButtonElement>
    ) {
      const { keyCode } = event;
      const specialKeys = [KeyCode.right, KeyCode.left, KeyCode.end, KeyCode.home, KeyCode.pageUp, KeyCode.pageDown];
      if (hasModifierKeys(event) || specialKeys.indexOf(keyCode) === -1) {
        return;
      }
      event.preventDefault();
      const activeIndex = enabledTabsWithCurrentTab.indexOf(tab);

      handleKey(event, {
        onEnd: () => highlightTab(enabledTabsWithCurrentTab.length - 1),
        onHome: () => highlightTab(0),
        onInlineEnd: () =>
          activeIndex + 1 === enabledTabsWithCurrentTab.length ? highlightTab(0) : highlightTab(activeIndex + 1),
        onInlineStart: () =>
          activeIndex === 0 ? highlightTab(enabledTabsWithCurrentTab.length - 1) : highlightTab(activeIndex - 1),
        onPageDown: () => inlineEndOverflow && onPaginationClick(headerBarRef, 'forward'),
        onPageUp: () => inlineStartOverflow && onPaginationClick(headerBarRef, 'backward'),
      });
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
      [styles['tabs-tab-link-only']]: action || dismissible,
      [styles['tabs-tab-disabled']]: tab.disabled,
    });

    const tabHeaderContentClasses = clsx({
      [styles['tabs-tab-header-content']]: true,
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

    if (tab.id === activeTabId) {
      commonProps.ref = activeTabHeaderRef;
      commonProps.tabIndex = 0;
      commonProps.onKeyDown = (
        event: React.KeyboardEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLButtonElement>
      ) => onKeyDown(event);
    } else {
      commonProps.tabIndex = -1;
    }

    let trigger = null;
    if (tab.href) {
      const anchorProps = commonProps as JSX.IntrinsicElements['a'];
      anchorProps.href = tab.href;
      trigger = <a {...anchorProps} />;
    } else {
      const buttonProps = commonProps as JSX.IntrinsicElements['button'];
      buttonProps.type = 'button';
      if (tab.disabled) {
        buttonProps.disabled = true;
      }
      trigger = <button {...buttonProps} />;
    }

    return (
      <li
        ref={element => tabRefs.current.set(tab.id, element as HTMLElement)}
        className={styles['tabs-tab']}
        role="presentation"
        key={tab.id}
      >
        <div className={tabHeaderContentClasses}>
          {trigger}
          {action && <span className={styles['tabs-tab-action']}> {action} </span>}
          {dismissible && (
            <span className={styles['tabs-tab-dismiss']}> {dismissButton(dismissLabel, handleDismiss)} </span>
          )}
        </div>
      </li>
    );
  }
}

export function getTabElementId({ namespace, tabId }: { namespace: string; tabId: string }) {
  return namespace + '-' + tabId;
}
