// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

import { InternalButton } from '../../../button/internal';
import { getDrawerStyles } from '../compute-layout';
import { AppLayoutInternals } from '../interfaces';

import sharedStyles from '../../resize/styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

interface AppLayoutNavigationImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  bottomDrawerReportedSize?: number;
}

export function AppLayoutNavigationImplementation({
  appLayoutInternals,
  bottomDrawerReportedSize,
}: AppLayoutNavigationImplementationProps) {
  const {
    ariaLabels,
    onNavigationToggle,
    isMobile,
    navigationOpen,
    navigationCollapsed,
    navigation,
    navigationFocusControl,
    placement,
    verticalOffsets,
  } = appLayoutInternals;

  const { drawerTopOffset, drawerHeight } = getDrawerStyles(
    verticalOffsets,
    isMobile,
    placement,
    isMobile ? 0 : (bottomDrawerReportedSize ?? 0)
  );

  const isCollapsedState = navigationCollapsed && !navigationOpen;
  // Always show the expand toggle in the collapsed rail
  const showToggleInCollapsedState = isCollapsedState;
  // On mobile with collapsed nav, use fixed overlay with backdrop when open
  const useMobileOverlay = isMobile && navigationCollapsed;

  // Close the Navigation drawer on mobile when a user clicks a link inside.
  const onNavigationClick = (event: React.MouseEvent) => {
    const hasLink = findUpUntil(
      event.target as HTMLElement,
      node => node.tagName === 'A' && !!(node as HTMLAnchorElement).href
    );
    if (hasLink && isMobile) {
      onNavigationToggle(false);
    }
  };

  return (
    <div
      className={clsx(styles['navigation-container'], sharedStyles['with-motion-horizontal'], {
        [styles['is-navigation-open']]: navigationOpen,
        [styles['is-navigation-collapsed']]: navigationCollapsed && !navigationOpen,
        [styles['navigation-container-mobile-overlay']]: useMobileOverlay,
      })}
      style={
        useMobileOverlay && navigationOpen
          ? undefined
          : {
              blockSize: drawerHeight,
              insetBlockStart: drawerTopOffset,
            }
      }
    >
      <nav
        aria-label={ariaLabels?.navigation ?? undefined}
        className={clsx(
          styles.navigation,
          {
            [testutilStyles['drawer-closed']]: !navigationOpen,
          },
          testutilStyles.navigation
        )}
        aria-hidden={!navigationOpen && !navigationCollapsed}
        onClick={onNavigationClick}
      >
        <div
          className={clsx(styles['hide-navigation'], {
            [styles['show-navigation-toggle']]: showToggleInCollapsedState,
          })}
        >
          <InternalButton
            ariaLabel={
              isCollapsedState
                ? (ariaLabels?.navigationToggle ?? undefined)
                : (ariaLabels?.navigationClose ?? undefined)
            }
            ariaExpanded={navigationCollapsed ? navigationOpen : undefined}
            iconName={isCollapsedState ? 'angle-right' : isMobile ? 'close' : 'angle-left'}
            onClick={() => onNavigationToggle(!navigationOpen)}
            variant="icon"
            formAction="none"
            className={testutilStyles['navigation-close']}
            ref={navigationFocusControl.refs.close}
            analyticsAction={isCollapsedState ? 'open' : 'close'}
          />
        </div>
        {navigation}
      </nav>
    </div>
  );
}
