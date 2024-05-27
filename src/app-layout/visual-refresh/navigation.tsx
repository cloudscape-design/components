// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from './context';
import { InternalButton } from '../../button/internal';
import TriggerButton from './trigger-button';
import styles from './styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import { Transition } from '../../internal/components/transition';
import { findUpUntil } from '../../internal/utils/dom';
import customCssProps from '../../internal/generated/custom-css-properties';

/**
 * The Navigation component consists of the following elements:
 * the container, or root element, that sits as a direct child to the Layout grid definition;
 * the show navigation form that contains the trigger for the drawer in large viewports;
 * the navigation, or drawer, that contains the hide navigation form and the children
 * passed through the API;
 */
export default function Navigation() {
  const {
    ariaLabels,
    disableBodyScroll,
    handleNavigationClick,
    hasDrawerViewportOverlay,
    isMobile,
    navigationOpen,
    isToolsOpen,
    navigation,
    navigationHide,
    navigationRefs,
    navigationWidth,
    toolsHide,
    headerVariant,
  } = useAppLayoutInternals();

  if (navigationHide) {
    return null;
  }

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

  const isUnfocusable = hasDrawerViewportOverlay && (!navigationOpen || (isToolsOpen && !toolsHide));

  return (
    <Transition in={navigationOpen}>
      {(state, transitionEventsRef) => (
        <div
          className={clsx(styles['navigation-container'], {
            [styles['disable-body-scroll']]: disableBodyScroll,
            [styles.unfocusable]: isUnfocusable,
            [testutilStyles['drawer-closed']]: !navigationOpen,
          })}
          style={{ [customCssProps.navigationWidth]: `${navigationWidth}px` }}
        >
          {!isMobile && (
            <nav
              aria-hidden={isMobile || navigationOpen}
              aria-label={ariaLabels?.navigation ?? undefined}
              className={clsx(styles['show-navigation'], {
                [styles.animating]: state === 'exiting',
                [styles['is-navigation-open']]: navigationOpen,
              })}
              ref={state === 'exiting' ? transitionEventsRef : undefined}
            >
              <TriggerButton
                ariaLabel={ariaLabels?.navigationToggle}
                ariaExpanded={navigationOpen ? undefined : false}
                iconName="menu"
                className={testutilStyles['navigation-toggle']}
                onClick={() => handleNavigationClick(true)}
                ref={navigationRefs.toggle}
                highContrastHeader={headerVariant === 'high-contrast'}
              />
            </nav>
          )}

          <nav
            aria-label={ariaLabels?.navigation ?? undefined}
            className={clsx(
              styles.navigation,
              {
                [styles.animating]: state === 'entering',
                [styles['is-navigation-open']]: navigationOpen,
              },
              testutilStyles.navigation
            )}
            ref={state !== 'exiting' ? transitionEventsRef : undefined}
            aria-hidden={!navigationOpen}
            onClick={event => {
              onNavigationClick && onNavigationClick(event);
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
        </div>
      )}
    </Transition>
  );
}
