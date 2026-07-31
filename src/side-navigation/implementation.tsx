// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { useReducedMotion } from '@cloudscape-design/component-toolkit/internal';

import { useAppLayoutToolbarDesignEnabled } from '../app-layout/utils/feature-flags';
import { getBaseProps } from '../internal/base-component';
import { fireCancelableEvent, fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { isDevelopment } from '../internal/is-development';
import { createWidgetizedComponent } from '../internal/widgets';
import { SideNavigationProps } from './interfaces';
import { Header, NavigationItemsList } from './parts';
import {
  checkCollapsedIconSupport,
  checkDuplicateHrefs,
  generateExpandableItemsMapping,
  hasNavigationIcons,
} from './util';

import styles from './styles.css.js';

type SideNavigationInternalProps = SideNavigationProps & InternalBaseComponentProps;

export function SideNavigationImplementation({
  header,
  itemsControl,
  activeHref,
  items = [],
  onFollow,
  onChange,
  collapsed = false,
  __internalRootRef,
  ...props
}: SideNavigationInternalProps) {
  const baseProps = getBaseProps(props);
  const isToolbar = useAppLayoutToolbarDesignEnabled();
  const parentMap = useMemo(() => generateExpandableItemsMapping(items), [items]);
  const withIcons = useMemo(() => hasNavigationIcons(items), [items]);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // --- Content-settled flag ---
  // Mirrors the expandable-section pattern: settled=true ONLY when fully expanded
  // AND the expand transition has completed. Prevents text wrap-jank during expand.
  // On expand (collapsed true→false): settled is FALSE for the entire transition,
  // then becomes TRUE after ~300ms (the $link-enter-spatial-duration).
  // On collapse (false→true): settled is FALSE immediately.
  const listContainerRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion(listContainerRef);
  // Read reduced-motion via ref so the effect only re-fires on `collapsed` changes,
  // preventing the timer from being cancelled by unrelated MutationObserver re-evaluations.
  const isReducedMotionRef = useRef(isReducedMotion);
  isReducedMotionRef.current = isReducedMotion;
  const [contentSettled, setContentSettled] = useState<boolean>(() => !collapsed);
  const prevCollapsedRef = useRef(collapsed);

  useEffect(() => {
    const prevCollapsed = prevCollapsedRef.current;
    prevCollapsedRef.current = collapsed;

    if (collapsed) {
      // Collapsing: immediately unsettle (text stays nowrap).
      setContentSettled(false);
      return;
    }

    // Not an actual transition — either initial mount with collapsed=false or a
    // no-op re-render. Keep the current settled state (true on mount, unchanged otherwise).
    if (prevCollapsed === collapsed) {
      return;
    }

    // EXPAND START (collapsed was true, now false): unsettle immediately so text
    // stays nowrap during the width transition, preventing wrap-jank.
    setContentSettled(false);

    if (isReducedMotionRef.current) {
      // No CSS transition runs under reduced-motion — settle on next frame.
      const frameId = requestAnimationFrame(() => setContentSettled(true));
      return () => cancelAnimationFrame(frameId);
    }

    // Listen for the grid-template-columns transition to end on any descendant
    // .link-text-wrapper before allowing text wrap. This guarantees the column has
    // reached its final width (1fr) regardless of easing tail, rather than relying
    // on a fixed timer that may fire before the last paint frame.
    const container = listContainerRef.current;
    let settled = false;
    const settle = () => {
      if (!settled) {
        settled = true;
        setContentSettled(true);
      }
    };

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === 'grid-template-columns') {
        settle();
      }
    };

    if (container) {
      container.addEventListener('transitionend', handleTransitionEnd);
    }

    // Fallback: if transitionend doesn't fire (e.g., element removed, no transition
    // applied, or display:none), settle after a generous 500ms ceiling.
    const fallbackTimer = setTimeout(settle, 500);

    return () => {
      if (container) {
        container.removeEventListener('transitionend', handleTransitionEnd);
      }
      clearTimeout(fallbackTimer);
    };
  }, [collapsed]);

  if (isDevelopment) {
    // This code should be wiped in production anyway.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => checkDuplicateHrefs(items), [items]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => checkCollapsedIconSupport(items, collapsed), [items, collapsed]);
  }

  const onChangeHandler = useCallback(
    (item: SideNavigationProps.Section | SideNavigationProps.ExpandableLinkGroup, expanded: boolean) => {
      // generateExpandableItemsMapping walks through the entire tree, so we're certain about getting a value.
      fireNonCancelableEvent(onChange, { item, expanded: expanded, expandableParents: parentMap.get(item)! });
    },
    [onChange, parentMap]
  );

  const onFollowHandler = useCallback(
    (
      item:
        | SideNavigationProps.Link
        | SideNavigationProps.Header
        | SideNavigationProps.LinkGroup
        | SideNavigationProps.ExpandableLinkGroup,
      sourceEvent: React.SyntheticEvent | Event
    ) => {
      fireCancelableEvent(onFollow, item, sourceEvent);
    },
    [onFollow]
  );

  return (
    <div
      {...baseProps}
      className={clsx(
        styles.root,
        baseProps.className,
        isToolbar && styles['with-toolbar'],
        collapsed && styles['root--collapsed']
      )}
      ref={__internalRootRef}
    >
      {header && (
        <Header
          definition={header}
          activeHref={activeHref}
          fireChange={onChangeHandler}
          fireFollow={onFollowHandler}
          collapsed={collapsed}
        />
      )}
      {!collapsed && itemsControl && <div className={styles['items-control']}>{itemsControl}</div>}
      {items && (
        <div ref={listContainerRef} className={styles['list-container']}>
          <NavigationItemsList
            variant="root"
            items={items}
            fireFollow={onFollowHandler}
            fireChange={onChangeHandler}
            activeHref={activeHref}
            collapsed={collapsed}
            contentSettled={contentSettled}
            withIcons={withIcons}
            activeTooltip={activeTooltip}
            setActiveTooltip={setActiveTooltip}
          />
        </div>
      )}
    </div>
  );
}

export const createWidgetizedSideNavigation = createWidgetizedComponent(SideNavigationImplementation);
