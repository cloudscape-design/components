// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalBaseComponentProps } from '../../internal/hooks/use-base-component';
import { getBaseProps } from '../../internal/base-component';
import { fireCancelableEvent, isPlainLeftClick } from '../../internal/events';
import VisualContext from '../../internal/components/visual-context';
import Portal from '../../internal/components/portal';

import { TopNavigationProps } from './interfaces';
import { useTopNavigation } from './use-top-navigation.js';
import Utility from './parts/utility';
import OverflowMenu from './parts/overflow-menu';

import styles from './styles.css.js';
import { checkSafeUrl } from '../../internal/utils/check-safe-url';

export type InternalTopNavigationProps = TopNavigationProps & InternalBaseComponentProps;

export default function InternalTopNavigation({
  __internalRootRef,
  identity,
  i18nStrings,
  utilities = [],
  search,
  ...restProps
}: InternalTopNavigationProps) {
  checkSafeUrl('TopNavigation', identity.href);
  const baseProps = getBaseProps(restProps);
  const { ref, virtualRef, breakpoint, responsiveState, isSearchExpanded, onSearchUtilityClick } = useTopNavigation({
    __internalRootRef,
    identity,
    search,
    utilities,
  });

  const isNarrowViewport = breakpoint === 'default';
  const isMediumViewport = breakpoint === 'xxs';

  const onIdentityClick = (event: React.MouseEvent) => {
    if (isPlainLeftClick(event)) {
      fireCancelableEvent(identity.onFollow, {}, event);
    }
  };

  // Render the top nav twice; once as the top nav that users can see, and another
  // "virtual" top nav used just for calculations. The virtual top nav doesn't react to
  // layout changes and renders two sets of utilities: one with labels and one without.
  const content = (isVirtual: boolean) => {
    const Wrapper = isVirtual ? 'div' : 'header';
    const showIdentity = isVirtual || !isSearchExpanded;
    const showTitle = isVirtual || !responsiveState.hideTitle;
    const showSearchSlot = search && (isVirtual || !responsiveState.hideSearch || isSearchExpanded);
    const showSearchUtility = isVirtual || (search && responsiveState.hideSearch);
    const showUtilities = isVirtual || !isSearchExpanded;
    const showMenuTrigger = isVirtual || (!isSearchExpanded && responsiveState.hideUtilities);

    return (
      <Wrapper
        ref={isVirtual ? virtualRef : ref}
        aria-hidden={isVirtual ? true : undefined}
        // False positive, "Wrapper" is either a "div" or a "header"
        // eslint-disable-next-line react/forbid-component-props
        className={clsx(styles['top-navigation'], {
          [styles.hidden]: isVirtual,
          [styles.narrow]: isNarrowViewport,
          [styles.medium]: isMediumViewport,
        })}
      >
        <div className={styles['padding-box']}>
          {showIdentity && (
            <div className={clsx(styles.identity, !identity.logo && styles['no-logo'])}>
              <a className={styles['identity-link']} href={identity.href} onClick={onIdentityClick}>
                {identity.logo && (
                  <img
                    role="img"
                    src={identity.logo?.src}
                    alt={identity.logo?.alt}
                    className={clsx(styles.logo, {
                      [styles.narrow]: isNarrowViewport,
                    })}
                  />
                )}
                {showTitle && <span className={styles.title}>{identity.title}</span>}
              </a>
            </div>
          )}

          <div className={styles.inputs}>
            {showSearchSlot && (
              <div className={clsx(styles.search, !isVirtual && isSearchExpanded && styles['search-expanded'])}>
                {search}
              </div>
            )}
          </div>

          <div className={styles.utilities}>
            {showSearchUtility && (
              <div
                className={clsx(
                  styles['utility-wrapper'],
                  styles['utility-type-button'],
                  styles['utility-type-button-link']
                )}
                data-utility-special="search"
              >
                <Utility
                  hideText={true}
                  isNarrowViewport={isNarrowViewport}
                  definition={{
                    type: 'button',
                    iconName: isSearchExpanded ? 'close' : 'search',
                    ariaLabel: isSearchExpanded
                      ? i18nStrings.searchDismissIconAriaLabel
                      : i18nStrings.searchIconAriaLabel,
                    onClick: onSearchUtilityClick,
                  }}
                />
              </div>
            )}

            {showUtilities &&
              utilities
                .filter(
                  (_utility, i) =>
                    isVirtual || !responsiveState.hideUtilities || responsiveState.hideUtilities.indexOf(i) === -1
                )
                .map((utility, i) => {
                  const hideText = !!responsiveState.hideUtilityText;
                  const last = (isVirtual || !showMenuTrigger) && i === utilities.length - 1;
                  return (
                    <div
                      key={i}
                      className={clsx(
                        styles['utility-wrapper'],
                        styles[`utility-type-${utility.type}`],
                        last && styles['utility-wrapper-last'],
                        utility.type === 'button' && styles[`utility-type-button-${utility.variant ?? 'link'}`]
                      )}
                      data-utility-index={i}
                      data-utility-hide={`${hideText}`}
                    >
                      <Utility
                        hideText={hideText}
                        definition={utility}
                        last={last}
                        isNarrowViewport={isNarrowViewport}
                      />
                    </div>
                  );
                })}

            {isVirtual &&
              utilities.map((utility, i) => {
                const hideText = !responsiveState.hideUtilityText;
                const last = !showMenuTrigger && i === utilities.length - 1;
                return (
                  <div
                    key={i}
                    className={clsx(
                      styles['utility-wrapper'],
                      styles[`utility-type-${utility.type}`],
                      last && styles['utility-wrapper-last'],
                      utility.type === 'button' && styles[`utility-type-button-${utility.variant ?? 'link'}`]
                    )}
                    data-utility-index={i}
                    data-utility-hide={`${hideText}`}
                  >
                    <Utility hideText={hideText} definition={utility} last={last} isNarrowViewport={isNarrowViewport} />
                  </div>
                );
              })}

            {showMenuTrigger && (
              <div
                className={clsx(
                  styles['utility-wrapper'],
                  styles['utility-type-menu-dropdown'],
                  styles['utility-wrapper-last']
                )}
                data-utility-special="menu-trigger"
              >
                <OverflowMenu
                  utilities={responsiveState.hideUtilities?.map(i => utilities[i]) ?? []}
                  isNarrowViewport={isNarrowViewport}
                >
                  {i18nStrings.overflowMenuTriggerText}
                </OverflowMenu>
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    );
  };

  return (
    <div {...baseProps} ref={__internalRootRef}>
      <VisualContext contextName="top-navigation">
        {content(false)}
        <Portal>{content(true)}</Portal>
      </VisualContext>
    </div>
  );
}
