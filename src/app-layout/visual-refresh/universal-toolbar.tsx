// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { DrawerTriggers } from './drawers';
import { useAppLayoutInternals } from './context';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import TriggerButton from './trigger-button';

export default function UniversalToolbar() {
  const {
    ariaLabels,
    breadcrumbs,
    disableBodyScroll,
    drawers,
    drawersTriggerCount,
    __embeddedViewMode,
    handleNavigationClick,
    hasDrawerViewportOverlay,
    isMobile,
    isNavigationOpen,
    isToolsOpen,
    navigationHide,
    navigationRefs,
    splitPanel,
    toolsHide,
    toolbarRef,
    pinnedToolbar,
  } = useAppLayoutInternals();

  function useScrollDirection() {
    const [scrollDirection, setScrollDirection] = useState('show');

    useEffect(() => {
      let lastScrollY = window.scrollY;

      const updateScrollDirection = () => {
        const scrollY = window.scrollY;
        // 80 is an arbitrary number to have a pause before the toolbar scrolls out of view at the top of the page
        const direction = scrollY > lastScrollY && scrollY > 80 ? 'hide' : 'show';
        // 2 as a buffer to avoid mistaking minor accidental mouse moves as scroll
        if (direction !== scrollDirection && (scrollY - lastScrollY > 2 || scrollY - lastScrollY < -2)) {
          setScrollDirection(direction);
        }
        lastScrollY = scrollY > 0 ? scrollY : 0;
        // console.log(lastScrollY, scrollY, direction, toolbarHeight);
      };

      window.addEventListener('scroll', updateScrollDirection);
      return () => {
        window.removeEventListener('scroll', updateScrollDirection);
      };
    }, [scrollDirection]);

    return scrollDirection;
  }

  const scrollDirection = useScrollDirection();

  if (__embeddedViewMode || (navigationHide && !breadcrumbs && toolsHide && (!drawers || drawers.length === 0))) {
    return null;
  }

  return (
    <section
      id="toolbar"
      ref={toolbarRef}
      className={clsx(styles['universal-toolbar'], {
        [styles['has-breadcrumbs']]: breadcrumbs,
        [styles.unfocusable]: hasDrawerViewportOverlay,
        [testutilStyles['mobile-bar']]: isMobile,
        [styles['disable-body-scroll']]: disableBodyScroll,
        [styles['toolbar-hidden']]:
          (scrollDirection === 'hide' && !pinnedToolbar) ||
          // when the toolbar does not have anything to show inside, don't show it at all, but leave it rendered in case triggers come back
          ((navigationHide || isNavigationOpen) &&
            !breadcrumbs &&
            (toolsHide || isToolsOpen) &&
            (!drawers || drawers.length === 0)),
      })}
    >
      <div className={styles['toolbar-container']}>
        {!navigationHide && !isNavigationOpen && (
          <nav
            aria-hidden={isNavigationOpen}
            className={clsx(styles['universal-toolbar-nav'], { [testutilStyles['drawer-closed']]: !isNavigationOpen })}
          >
            <TriggerButton
              ariaLabel={ariaLabels?.navigationToggle ?? undefined}
              ariaExpanded={isNavigationOpen ? undefined : false}
              iconName="menu"
              className={testutilStyles['navigation-toggle']}
              onClick={() => handleNavigationClick(!isNavigationOpen)}
              ref={navigationRefs.toggle}
              selected={isNavigationOpen}
            />
          </nav>
        )}
        {breadcrumbs && (
          <div className={clsx(styles['universal-toolbar-breadcrumbs'], testutilStyles.breadcrumbs)}>{breadcrumbs}</div>
        )}
        {(drawersTriggerCount > 0 || !!splitPanel) && (
          <span className={clsx(styles['universal-toolbar-drawers'])}>{<DrawerTriggers />}</span>
        )}
      </div>
    </section>
  );
}
