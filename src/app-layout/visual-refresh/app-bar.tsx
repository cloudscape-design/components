// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from './context';
import { InternalButton } from '../../button/internal';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import { useFocusControl } from '../utils/use-focus-control';

/**
 * The CSS class 'awsui-context-content-header' needs to be added to the root element so
 * that the design tokens used are overridden with the appropriate values.
 */
export default function AppBar() {
  const {
    ariaLabels,
    breadcrumbs,
    contentHeader,
    contentType,
    dynamicOverlapHeight,
    handleNavigationClick,
    handleToolsClick,
    hasNotificationsContent,
    hasStickyBackground,
    isMobile,
    navigationHide,
    isNavigationOpen,
    isToolsOpen,
    toolsHide,
    isAnyPanelOpen,
  } = useAppLayoutInternals();
  const { refs: focusRefsNav } = useFocusControl(isNavigationOpen);
  const { refs: focusRefsTools } = useFocusControl(isToolsOpen, true);

  if (navigationHide && !breadcrumbs && toolsHide) {
    return null;
  }

  return (
    <section
      aria-hidden={!isMobile && !breadcrumbs ? true : undefined}
      className={clsx(
        styles.appbar,
        {
          [styles['has-breadcrumbs']]: breadcrumbs,
          [styles.unfocusable]: isMobile && isAnyPanelOpen,
          [testutilStyles['mobile-bar']]: isMobile,
        },
        'awsui-context-content-header'
      )}
    >
      {!navigationHide && isMobile && (
        <nav
          className={clsx(styles['appbar-nav'], { [testutilStyles['drawer-closed']]: !isNavigationOpen })}
          aria-hidden={isNavigationOpen}
        >
          <InternalButton
            ariaLabel={ariaLabels?.navigationToggle ?? undefined}
            ariaExpanded={isNavigationOpen ? undefined : false}
            iconName="menu"
            formAction="none"
            onClick={() => handleNavigationClick(true)}
            variant="icon"
            className={testutilStyles['navigation-toggle']}
            ref={focusRefsNav.toggle}
            disabled={isAnyPanelOpen}
            __nativeAttributes={{ 'aria-haspopup': isNavigationOpen ? undefined : true }}
          />
        </nav>
      )}

      {breadcrumbs && (
        <div
          className={clsx(styles.breadcrumbs, styles[`content-type-${contentType}`], testutilStyles.breadcrumbs, {
            [styles['has-dynamic-overlap-height']]: dynamicOverlapHeight > 0,
            [styles['has-header']]: contentHeader,
            [styles['has-notifications-content']]: hasNotificationsContent,
            [styles['has-sticky-background']]: hasStickyBackground,
          })}
        >
          {breadcrumbs}
        </div>
      )}

      {!toolsHide && isMobile && (
        <aside
          className={clsx(styles['appbar-tools'], { [testutilStyles['drawer-closed']]: !isToolsOpen })}
          aria-hidden={isToolsOpen}
          aria-label={ariaLabels?.tools ?? undefined}
        >
          <InternalButton
            className={testutilStyles['tools-toggle']}
            ariaExpanded={isToolsOpen}
            disabled={isAnyPanelOpen}
            ariaLabel={ariaLabels?.toolsToggle ?? undefined}
            iconName="status-info"
            formAction="none"
            onClick={() => handleToolsClick(true)}
            variant="icon"
            ref={focusRefsTools.toggle}
            __nativeAttributes={{ 'aria-haspopup': true }}
          />
        </aside>
      )}
    </section>
  );
}
