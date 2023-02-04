// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from './context';
import { InternalButton } from '../../button/internal';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import { useFocusControl } from '../utils/use-focus-control';

export default function MobileToolbar() {
  const {
    ariaLabels,
    breadcrumbs,
    handleNavigationClick,
    handleToolsClick,
    isMobile,
    navigationHide,
    isNavigationOpen,
    isToolsOpen,
    toolsHide,
    isAnyPanelOpen,
  } = useAppLayoutInternals();

  const { refs: focusRefsNav } = useFocusControl(isNavigationOpen);
  const { refs: focusRefsTools } = useFocusControl(isToolsOpen, true);

  if (!isMobile || (navigationHide && !breadcrumbs && toolsHide)) {
    return null;
  }

  return (
    <section
      className={clsx(
        styles['mobile-toolbar'],
        {
          [styles.unfocusable]: isAnyPanelOpen,
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
            ref={focusRefsNav.toggle}
            disabled={isAnyPanelOpen}
            __nativeAttributes={{ 'aria-haspopup': isNavigationOpen ? undefined : true }}
          />
        </nav>
      )}

      {breadcrumbs && (
        <div className={clsx(styles['mobile-toolbar-breadcrumbs'], testutilStyles.breadcrumbs)}>{breadcrumbs}</div>
      )}

      {!toolsHide && (
        <aside
          aria-hidden={isToolsOpen}
          aria-label={ariaLabels?.tools ?? undefined}
          className={clsx(styles['mobile-toolbar-tools'], { [testutilStyles['drawer-closed']]: !isToolsOpen })}
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
