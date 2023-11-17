// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { getBaseProps } from '../internal/base-component';
import { fireCancelableEvent, isPlainLeftClick } from '../internal/events';
import VisualContext from '../internal/components/visual-context';
import Portal from '../internal/components/portal';
import { useEffectOnUpdate } from '../internal/hooks/use-effect-on-update';

import { TopNavigationProps } from './interfaces';
import { useTopNavigation } from './use-top-navigation.js';
import Utility from './parts/utility';
import OverflowMenu from './parts/overflow-menu';
import { ButtonTrigger } from '../internal/components/menu-dropdown';

import styles from './styles.css.js';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import { SomeRequired } from '../internal/types';
import { useInternalI18n } from '../i18n/context';

export type InternalTopNavigationProps = SomeRequired<TopNavigationProps, 'utilities'> & InternalBaseComponentProps;

export default function InternalTopNavigation({
  __internalRootRef,
  identity,
  i18nStrings,
  utilities,
  search,
  ...restProps
}: InternalTopNavigationProps) {
  checkSafeUrl('TopNavigation', identity.href);
  const baseProps = getBaseProps(restProps);
  const { mainRef, virtualRef, breakpoint, responsiveState, isSearchExpanded, onSearchUtilityClick } = useTopNavigation(
    { identity, search, utilities }
  );
  const [overflowMenuOpen, setOverflowMenuOpen] = useState(false);
  const overflowMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const isNarrowViewport = breakpoint === 'default';
  const isMediumViewport = breakpoint === 'xxs';
  const isLargeViewport = breakpoint === 's';
  const i18n = useInternalI18n('top-navigation');

  const onIdentityClick = (event: React.MouseEvent) => {
    if (isPlainLeftClick(event)) {
      fireCancelableEvent(identity.onFollow, {}, event);
    }
  };

  const toggleOverflowMenu = () => {
    setOverflowMenuOpen(overflowMenuOpen => !overflowMenuOpen);
  };

  const menuTriggerVisible = !isSearchExpanded && responsiveState.hideUtilities;

  useEffect(() => {
    setOverflowMenuOpen(false);
  }, [menuTriggerVisible]);

  useEffectOnUpdate(() => {
    if (!overflowMenuOpen) {
      overflowMenuTriggerRef.current?.focus();
    }
  }, [overflowMenuOpen]);

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
    const showMenuTrigger = isVirtual || menuTriggerVisible;

    return (
      <Wrapper
        ref={isVirtual ? virtualRef : mainRef}
        aria-hidden={isVirtual ? true : undefined}
        // Wrapper is an alias for "div" or "header".
        // eslint-disable-next-line react/forbid-component-props
        className={clsx(styles['top-navigation'], {
          [styles.virtual]: isVirtual,
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

          {showSearchSlot && (
            <div className={styles.inputs}>
              <div className={clsx(styles.search, !isVirtual && isSearchExpanded && styles['search-expanded'])}>
                {search}
              </div>
            </div>
          )}

          <div className={styles.utilities}>
            {showSearchUtility && (
              <div
                className={clsx(
                  styles['utility-wrapper'],
                  styles['utility-type-button'],
                  styles['utility-type-button-link'],
                  {
                    [styles.narrow]: isNarrowViewport,
                    [styles.medium]: isMediumViewport,
                  }
                )}
                data-utility-special="search"
              >
                <Utility
                  hideText={true}
                  definition={{
                    type: 'button',
                    iconName: isSearchExpanded ? 'close' : 'search',
                    ariaLabel: isSearchExpanded
                      ? i18n('i18nStrings.searchDismissIconAriaLabel', i18nStrings?.searchDismissIconAriaLabel)
                      : i18n('i18nStrings.searchIconAriaLabel', i18nStrings?.searchIconAriaLabel),
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
                  const isLast = (isVirtual || !showMenuTrigger) && i === utilities.length - 1;
                  const offsetRight = isLast && isLargeViewport ? 'xxl' : isLast ? 'l' : undefined;

                  return (
                    <div
                      key={i}
                      className={clsx(
                        styles['utility-wrapper'],
                        styles[`utility-type-${utility.type}`],
                        utility.type === 'button' && styles[`utility-type-button-${utility.variant ?? 'link'}`],
                        {
                          [styles.narrow]: isNarrowViewport,
                          [styles.medium]: isMediumViewport,
                        }
                      )}
                      data-utility-index={i}
                      data-utility-hide={`${hideText}`}
                    >
                      <Utility hideText={hideText} definition={utility} offsetRight={offsetRight} />
                    </div>
                  );
                })}

            {isVirtual &&
              utilities.map((utility, i) => {
                const hideText = !responsiveState.hideUtilityText;
                const isLast = !showMenuTrigger && i === utilities.length - 1;
                const offsetRight = isLast && isLargeViewport ? 'xxl' : isLast ? 'l' : undefined;

                return (
                  <div
                    key={i}
                    className={clsx(
                      styles['utility-wrapper'],
                      styles[`utility-type-${utility.type}`],
                      utility.type === 'button' && styles[`utility-type-button-${utility.variant ?? 'link'}`],
                      {
                        [styles.narrow]: isNarrowViewport,
                        [styles.medium]: isMediumViewport,
                      }
                    )}
                    data-utility-index={i}
                    data-utility-hide={`${hideText}`}
                  >
                    <Utility hideText={hideText} definition={utility} offsetRight={offsetRight} />
                  </div>
                );
              })}

            {showMenuTrigger && (
              <div
                className={clsx(styles['utility-wrapper'], styles['utility-type-menu-dropdown'], {
                  [styles.narrow]: isNarrowViewport,
                  [styles.medium]: isMediumViewport,
                })}
                data-utility-special="menu-trigger"
              >
                <ButtonTrigger
                  expanded={overflowMenuOpen}
                  onClick={toggleOverflowMenu}
                  offsetRight="l"
                  ref={!isVirtual ? overflowMenuTriggerRef : undefined}
                >
                  {i18n('i18nStrings.overflowMenuTriggerText', i18nStrings?.overflowMenuTriggerText)}
                </ButtonTrigger>
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
        {menuTriggerVisible && overflowMenuOpen && (
          <div className={styles['overflow-menu-drawer']}>
            <OverflowMenu
              headerText={i18nStrings?.overflowMenuTitleText}
              dismissIconAriaLabel={i18nStrings?.overflowMenuDismissIconAriaLabel}
              backIconAriaLabel={i18nStrings?.overflowMenuBackIconAriaLabel}
              items={utilities.filter(
                (utility, i) =>
                  (!responsiveState.hideUtilities || responsiveState.hideUtilities.indexOf(i) !== -1) &&
                  !utility.disableUtilityCollapse
              )}
              onClose={toggleOverflowMenu}
            />
          </div>
        )}
      </VisualContext>
    </div>
  );
}
