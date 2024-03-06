// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from '../context';
import { InternalButton } from '../../../button/internal';
import { findUpUntil } from '../../../internal/utils/dom';
import styles from './styles.css.js';
import testutilStyles from '../../test-classes/styles.css.js';

export function Navigation() {
  const { ariaLabels, handleNavigationClick, isMobile, navigationOpen, navigation, navigationRefs, placement } =
    useAppLayoutInternals();

  // Close the Navigation drawer on mobile when a user clicks a link inside.
  const onNavigationClick = (event: React.MouseEvent) => {
    const hasLink = findUpUntil(
      event.target as HTMLElement,
      node => node.tagName === 'A' && !!(node as HTMLAnchorElement).href
    );
    if (hasLink && isMobile) {
      handleNavigationClick(false);
    }
  };

  return (
    <nav
      aria-label={ariaLabels?.navigation ?? undefined}
      className={clsx(
        styles.navigation,
        {
          [styles['is-navigation-open']]: navigationOpen,
        },
        testutilStyles.navigation
      )}
      aria-hidden={!navigationOpen}
      onClick={onNavigationClick}
      style={{
        blockSize: `calc(100vh - ${placement.insetBlockStart}px - ${placement.insetBlockEnd}px)`,
        insetBlockStart: placement.insetBlockStart,
      }}
    >
      <div className={clsx(styles['animated-content'])}>
        <div className={clsx(styles['hide-navigation'])}>
          <InternalButton
            ariaLabel={ariaLabels?.navigationClose ?? undefined}
            iconName={isMobile ? 'close' : 'angle-left'}
            onClick={() => handleNavigationClick(false)}
            variant="icon"
            formAction="none"
            className={testutilStyles['navigation-close']}
            ref={navigationRefs.close}
          />
        </div>
        {navigation}
      </div>
    </nav>
  );
}
