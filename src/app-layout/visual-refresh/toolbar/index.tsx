// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from '../context';
import styles from './styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import { DrawerTriggers } from './drawer-triggers';
import TriggerButton from './trigger-button';
import { ToolbarContainer } from '../../skeleton/containers';

export function Toolbar() {
  const {
    ariaLabels,
    breadcrumbs,
    drawers,
    toolbarRef,
    verticalOffsets,
    onNavigationToggle,
    isMobile,
    toolbarState,
    setToolbarState,
    navigationOpen,
    navigation,
    navigationFocusControl,
    splitPanelToggleConfig,
  } = useAppLayoutInternals();
  // TODO: expose configuration property
  const pinnedToolbar = false;

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      if (pinnedToolbar) {
        setToolbarState('show');
        return;
      }
      const scrollY = window.scrollY;
      // 80 is an arbitrary number to have a pause before the toolbar scrolls out of view at the top of the page
      const direction = scrollY > lastScrollY && scrollY > 80 ? 'hide' : 'show';
      // 2 as a buffer to avoid mistaking minor accidental mouse moves as scroll
      if (direction !== toolbarState && (scrollY - lastScrollY > 2 || scrollY - lastScrollY < -2)) {
        setToolbarState(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, [pinnedToolbar, setToolbarState, toolbarState]);

  const toolbarHidden = toolbarState === 'hide' && !pinnedToolbar;

  return (
    <ToolbarContainer
      ref={toolbarRef}
      className={clsx(styles['universal-toolbar'], {
        [testutilStyles['mobile-bar']]: isMobile,
        [styles['toolbar-hidden']]: toolbarHidden,
      })}
      style={{
        insetBlockStart: toolbarHidden ? '-60px' : verticalOffsets.toolbar,
      }}
    >
      <div className={styles['toolbar-container']}>
        {navigation && !navigationOpen && (
          <nav
            aria-hidden={navigationOpen}
            className={clsx(styles['universal-toolbar-nav'], { [testutilStyles['drawer-closed']]: !navigationOpen })}
          >
            <TriggerButton
              ariaLabel={ariaLabels?.navigationToggle ?? undefined}
              ariaExpanded={navigationOpen ? undefined : false}
              iconName="menu"
              className={testutilStyles['navigation-toggle']}
              onClick={() => onNavigationToggle(!navigationOpen)}
              ref={navigationFocusControl.refs.toggle}
              selected={navigationOpen}
            />
          </nav>
        )}
        {breadcrumbs && (
          <div className={clsx(styles['universal-toolbar-breadcrumbs'], testutilStyles.breadcrumbs)}>{breadcrumbs}</div>
        )}
        {(drawers.length > 0 || splitPanelToggleConfig.displayed) && (
          <span className={clsx(styles['universal-toolbar-drawers'])}>{<DrawerTriggers />}</span>
        )}
      </div>
    </ToolbarContainer>
  );
}
