// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import { ButtonTrigger } from '../internal/components/menu-dropdown';
import VisualContext from '../internal/components/visual-context';
import { fireCancelableEvent, isPlainLeftClick } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useEffectOnUpdate } from '../internal/hooks/use-effect-on-update';
import { SomeRequired } from '../internal/types';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import { TopNavigationProps } from './interfaces';
import OverflowMenu from './parts/overflow-menu';
import Utility from './parts/utility';
import { useTopNavigation } from './use-top-navigation.js';

import styles from './styles.css.js';

type InternalTopNavigationProps = SomeRequired<TopNavigationProps, 'utilities'> & InternalBaseComponentProps;

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
  const { mainRef, virtualRef, responsiveState, isSearchExpanded, onSearchUtilityClick } = useTopNavigation({
    identity,
    search,
    utilities,
  });
  const [overflowMenuOpen, setOverflowMenuOpen] = useState(false);
  const overflowMenuTriggerRef = useRef<HTMLButtonElement>(null);
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
        className={clsx(styles['top-navigation'], {
          [styles.virtual]: isVirtual,
          [styles.hidden]: isVirtual,
        })}
      >
        <div className={styles['padding-box']}>
          {showIdentity && (
            <div className={clsx(styles.identity, !identity.logo && styles['no-logo'])}>
              <a className={styles['identity-link']} href={identity.href} onClick={onIdentityClick}>
                {identity.logo && (
                  <img role="img" src={identity.logo?.src} alt={identity.logo?.alt} className={styles.logo} />
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
                  styles['utility-type-button-link']
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
                .map((utility, i) => (
                  <div
                    key={i}
                    className={clsx(
                      styles['utility-wrapper'],
                      styles[`utility-type-${utility.type}`],
                      utility.type === 'button' && styles[`utility-type-button-${utility.variant ?? 'link'}`]
                    )}
                    data-utility-index={i}
                    data-utility-hide={`${!!responsiveState.hideUtilityText}`}
                  >
                    <Utility hideText={!!responsiveState.hideUtilityText} definition={utility} />
                  </div>
                ))}

            {isVirtual &&
              utilities.map((utility, i) => (
                <div
                  key={i}
                  className={clsx(
                    styles['utility-wrapper'],
                    styles[`utility-type-${utility.type}`],
                    utility.type === 'button' && styles[`utility-type-button-${utility.variant ?? 'link'}`]
                  )}
                  data-utility-index={i}
                  data-utility-hide={`${!responsiveState.hideUtilityText}`}
                >
                  <Utility hideText={!responsiveState.hideUtilityText} definition={utility} />
                </div>
              ))}

            {showMenuTrigger && (
              <div
                className={clsx(styles['utility-wrapper'], styles['utility-type-menu-dropdown'])}
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
        {/* Render virtual content first to ensure React refs for content will be assigned on the actual nodes. */}
        {content(true)}

        {content(false)}

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
