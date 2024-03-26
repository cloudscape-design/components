// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { DesktopTriggers as DrawersToolbarTriggers } from './drawers';
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
    __embeddedViewMode,
    handleNavigationClick,
    handleToolsClick,
    hasDrawerViewportOverlay,
    isMobile,
    isNavigationOpen,
    isSplitPanelOpen,
    isToolsOpen,
    navigationHide,
    navigationRefs,
    splitPanel,
    splitPanelDisplayed,
    splitPanelPosition,
    toolsControlId,
    toolsHide,
    toolsRefs,
    toolbarRef,
    toolbarHeight,
    pinnedToolbar,
  } = useAppLayoutInternals();

  const hasSplitPanel = !!splitPanel && getSplitPanelStatus(splitPanelDisplayed, splitPanelPosition);
  const showToolsTrigger = getTriggerStatus(hasSplitPanel, isSplitPanelOpen, isToolsOpen, toolsHide);

  /**
   * This simple function returns the presence of the split panel as a child of the
   * Tools component. It must exist and be in side position.
   */
  function getSplitPanelStatus(splitPanelDisplayed: boolean, splitPanelPosition: string) {
    return splitPanelDisplayed && splitPanelPosition === 'side' ? true : false;
  }

  function getTriggerStatus(
    hasSplitPanel: boolean,
    isSplitPanelOpen?: boolean,
    isToolsOpen?: boolean,
    toolsHide?: boolean
  ) {
    let hasToolsForm = false;

    // Both the Split Panel and Tools button are needed
    if (hasSplitPanel && !toolsHide) {
      hasToolsForm = true;
    }

    // The Split Panel button is needed
    if (hasSplitPanel && !isSplitPanelOpen && toolsHide) {
      hasToolsForm = true;
    }

    // The Tools button is needed
    if (!hasSplitPanel && !toolsHide && !isToolsOpen) {
      hasToolsForm = true;
    }

    // Both Tools and Split Panel exist and one or both is open
    if (hasSplitPanel && !toolsHide && (isSplitPanelOpen || isToolsOpen)) {
      hasToolsForm = true;
    }

    return hasToolsForm;
  }

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
        console.log(lastScrollY, scrollY, direction, toolbarHeight);
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

        <span className={clsx(styles['universal-toolbar-drawers'])}>
          {!toolsHide && showToolsTrigger && !drawers && (
            <aside
              aria-hidden={!hasSplitPanel && !toolsHide && !isToolsOpen}
              aria-label={ariaLabels?.tools ?? undefined}
              className={clsx(styles['universal-toolbar-tools'], { [testutilStyles['drawer-closed']]: !isToolsOpen })}
            >
              <TriggerButton
                className={testutilStyles['tools-toggle']}
                ariaExpanded={isToolsOpen}
                ariaLabel={ariaLabels?.toolsToggle}
                ariaControls={toolsControlId}
                iconName="status-info"
                onClick={() => handleToolsClick(!isToolsOpen)}
                ref={toolsRefs.toggle}
                selected={hasSplitPanel && isToolsOpen}
              />
            </aside>
          )}
          {<DrawersToolbarTriggers />}
        </span>
      </div>
    </section>
  );
}
