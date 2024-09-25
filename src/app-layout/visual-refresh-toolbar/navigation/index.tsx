// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

import { InternalButton } from '../../../button/internal';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutInternals } from '../interfaces';

import sharedStyles from '../../resize/styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

interface AppLayoutNavigationImplementationProps {
  appLayoutInternals: AppLayoutInternals;
}

export function AppLayoutNavigationImplementation({ appLayoutInternals }: AppLayoutNavigationImplementationProps) {
  const {
    ariaLabels,
    onNavigationToggle,
    isMobile,
    navigationOpen,
    navigation,
    navigationFocusControl,
    placement,
    verticalOffsets,
  } = appLayoutInternals;

  const drawersTopOffset = verticalOffsets.drawers ?? placement.insetBlockStart;

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
    <nav
      aria-label={ariaLabels?.navigation ?? undefined}
      className={clsx(
        styles.navigation,
        {
          [styles['is-navigation-open']]: navigationOpen,
          [testutilStyles['drawer-closed']]: !navigationOpen,
        },
        testutilStyles.navigation,
        sharedStyles['with-motion']
      )}
      aria-hidden={!navigationOpen}
      onClick={onNavigationClick}
      style={{
        blockSize: `calc(100vh - ${drawersTopOffset}px - ${placement.insetBlockEnd}px)`,
        insetBlockStart: drawersTopOffset,
      }}
    >
      <div className={clsx(styles['animated-content'])}>
        <div className={clsx(styles['hide-navigation'])}>
          <InternalButton
            ariaLabel={ariaLabels?.navigationClose ?? undefined}
            iconName={isMobile ? 'close' : 'angle-left'}
            onClick={() => onNavigationToggle(false)}
            variant="icon"
            formAction="none"
            className={testutilStyles['navigation-close']}
            ref={navigationFocusControl.refs.close}
          />
        </div>
        {navigation}
      </div>
    </nav>
  );
}

export const createWidgetizedAppLayoutNavigation = createWidgetizedComponent(AppLayoutNavigationImplementation);
