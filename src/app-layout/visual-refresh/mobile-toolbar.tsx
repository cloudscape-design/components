// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { InternalButton } from '../../button/internal';
import { MobileTriggers as DrawersMobileTriggers } from './drawers';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

export default function MobileToolbar() {
  const {
    ariaLabels,
    breadcrumbs,
    drawers,
    handleNavigationClick,
    handleToolsClick,
    hasDrawerViewportOverlay,
    isMobile,
    isNavigationOpen,
    isToolsOpen,
    navigationHide,
    navigationRefs,
    toolsHide,
    toolsRefs,
  } = useAppLayoutInternals();

  if (!isMobile || (navigationHide && !breadcrumbs && toolsHide && (!drawers || drawers.length === 0))) {
    return null;
  }

  return (
    <section
      className={clsx(
        styles['mobile-toolbar'],
        [testutilStyles['mobile-bar']],
        {
          [styles['has-breadcrumbs']]: breadcrumbs,
          [styles.unfocusable]: hasDrawerViewportOverlay,
        },
        testutilStyles['mobile-bar'],
        'awsui-context-content-header'
      )}
    >
      {!navigationHide && (
        <nav
          aria-hidden={isNavigationOpen}
          className={clsx(styles['mobile-toolbar-nav'], { [testutilStyles['drawer-closed']]: !isNavigationOpen })}
        >
          <InternalButton
            ariaLabel={ariaLabels?.navigationToggle ?? undefined}
            ariaExpanded={isNavigationOpen ? undefined : false}
            iconName="menu"
            formAction="none"
            onClick={() => handleNavigationClick(true)}
            variant="icon"
            className={testutilStyles['navigation-toggle']}
            ref={navigationRefs.toggle}
            disabled={hasDrawerViewportOverlay}
            __nativeAttributes={{ 'aria-haspopup': isNavigationOpen ? undefined : true }}
          />
        </nav>
      )}

      {breadcrumbs && (
        <div className={clsx(styles['mobile-toolbar-breadcrumbs'], testutilStyles.breadcrumbs)}>{breadcrumbs}</div>
      )}

      {drawers ? (
        <DrawersMobileTriggers />
      ) : (
        !toolsHide && (
          <aside
            aria-hidden={isToolsOpen}
            aria-label={ariaLabels?.tools ?? undefined}
            className={clsx(styles['mobile-toolbar-tools'], { [testutilStyles['drawer-closed']]: !isToolsOpen })}
          >
            <InternalButton
              className={testutilStyles['tools-toggle']}
              ariaExpanded={isToolsOpen}
              disabled={hasDrawerViewportOverlay}
              ariaLabel={ariaLabels?.toolsToggle ?? undefined}
              iconName="status-info"
              formAction="none"
              onClick={() => handleToolsClick(true)}
              variant="icon"
              ref={toolsRefs.toggle}
              __nativeAttributes={{ 'aria-haspopup': true }}
            />
          </aside>
        )
      )}
    </section>
  );
}
