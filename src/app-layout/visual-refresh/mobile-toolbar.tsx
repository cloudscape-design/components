// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { highContrastHeaderClassName } from '../../internal/utils/content-header-utils';
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
    hasDrawerViewportOverlay,
    isMobile,
    navigationOpen,
    __embeddedViewMode,
    navigationHide,
    navigationRefs,
    toolsHide,
    headerVariant,
  } = useAppLayoutInternals();

  if (!isMobile || __embeddedViewMode || (navigationHide && !breadcrumbs && toolsHide && drawers.length === 0)) {
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
          [highContrastHeaderClassName]: headerVariant === 'high-contrast',
        },
        testutilStyles['mobile-bar'],
        headerVariant !== 'high-contrast' && styles['remove-high-contrast-header']
      )}
    >
      {!navigationHide && (
        <nav
          aria-hidden={navigationOpen}
          className={clsx(styles['mobile-toolbar-nav'], { [testutilStyles['drawer-closed']]: !navigationOpen })}
        >
          <InternalButton
            ariaLabel={ariaLabels?.navigationToggle ?? undefined}
            ariaExpanded={navigationOpen ? undefined : false}
            iconName="menu"
            formAction="none"
            onClick={() => handleNavigationClick(true)}
            variant="icon"
            className={testutilStyles['navigation-toggle']}
            ref={navigationRefs.toggle}
            disabled={hasDrawerViewportOverlay}
            __nativeAttributes={{ 'aria-haspopup': navigationOpen ? undefined : true }}
          />
        </nav>
      )}

      {breadcrumbs && (
        <div className={clsx(styles['mobile-toolbar-breadcrumbs'], testutilStyles.breadcrumbs)}>{breadcrumbs}</div>
      )}

      <DrawersMobileTriggers />
    </section>
  );
}
