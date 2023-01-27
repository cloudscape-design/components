// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import customCssProps from '../../internal/generated/custom-css-properties';
import { findUpUntil } from '../../internal/utils/dom';
import { InternalButton } from '../../button/internal';
import TriggerButton from './trigger-button';
import { useAppLayoutInternals } from './context';
import { useFocusControl } from '../utils/use-focus-control';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';

/**
 *
 */
export default function Navigation() {
  const { navigationHide } = useAppLayoutInternals();

  if (navigationHide) {
    return null;
  }

  return (
    <>
      <NavigationOpenButton />
      <NavigationDrawer />
    </>
  );
}

/**
 *
 */
function NavigationOpenButton() {
  const { ariaLabels, handleNavigationClick, hasNotificationsContent, isMobile, isNavigationOpen } =
    useAppLayoutInternals();

  const { refs: focusRefs } = useFocusControl(isNavigationOpen);

  if (isMobile) {
    return null;
  }

  return (
    <nav
      aria-hidden={isMobile || isNavigationOpen ? true : false}
      aria-label={ariaLabels?.navigation ?? undefined}
      className={clsx(styles['navigation-trigger-container'], {
        [styles['has-notifications-content']]: hasNotificationsContent,
        [styles['is-navigation-open']]: isNavigationOpen,
      })}
    >
      <TriggerButton
        ariaLabel={ariaLabels?.navigationToggle}
        iconName="menu"
        className={clsx(styles['navigation-trigger'], testutilStyles['navigation-toggle'])}
        onClick={() => handleNavigationClick(true)}
        ref={focusRefs.toggle}
      />
    </nav>
  );
}

/**
 *
 */
function NavigationDrawer() {
  const {
    ariaLabels,
    handleNavigationClick,
    isAnyPanelOpen,
    isMobile,
    isNavigationOpen,
    isToolsOpen,
    navigation,
    navigationWidth,
    toolsHide,
  } = useAppLayoutInternals();

  const { refs: focusRefs } = useFocusControl(isNavigationOpen);
  const isUnfocusable = isMobile && isAnyPanelOpen && isToolsOpen && !toolsHide;

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
      aria-hidden={!isNavigationOpen}
      className={clsx(
        styles['navigation-drawer'],
        {
          [testutilStyles['drawer-closed']]: !isNavigationOpen,
          [styles['is-navigation-open']]: isNavigationOpen,
          [styles.unfocusable]: isUnfocusable,
        },
        testutilStyles.navigation
      )}
      onClick={event => {
        onNavigationClick && onNavigationClick(event);
      }}
      // Overwrite the navigation width custom property if the `navigationWidth` property is set
      style={{
        ...(navigationWidth && { [customCssProps.navigationWidth]: `${navigationWidth}px` }),
      }}
    >
      <div className={styles['navigation-close-button']}>
        <InternalButton
          ariaLabel={ariaLabels?.navigationClose ?? undefined}
          className={testutilStyles['navigation-close']}
          formAction="none"
          iconName={isMobile ? 'close' : 'angle-left'}
          onClick={() => handleNavigationClick(false)}
          ref={focusRefs.close}
          variant="icon"
        />
      </div>

      <div className={styles['navigation-content']}>{navigation}</div>
    </nav>
  );
}
