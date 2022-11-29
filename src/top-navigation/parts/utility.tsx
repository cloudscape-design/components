// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalButton } from '../../button/internal';
import InternalLink from '../../link/internal';
import InternalIcon from '../../icon/internal';
import MenuDropdown, { MenuDropdownProps } from '../../internal/components/menu-dropdown';

import { TopNavigationProps } from '../interfaces';

import styles from '../styles.css.js';
import { checkSafeUrl } from '../../internal/utils/check-safe-url';
import { joinStrings } from '../../internal/utils/strings';

export interface UtilityProps {
  hideText: boolean;
  definition: TopNavigationProps.Utility;
  offsetRight?: MenuDropdownProps['offsetRight'];
}

export default function Utility({ hideText, definition, offsetRight }: UtilityProps) {
  const hasIcon = !!definition.iconName || !!definition.iconUrl || !!definition.iconAlt || !!definition.iconSvg;
  const shouldHideText = hideText && !definition.disableTextCollapse && hasIcon;
  const ariaLabel = definition.ariaLabel
    ? definition.ariaLabel
    : joinStrings(definition.text, definition.externalIconAriaLabel);

  if (definition.type === 'button') {
    checkSafeUrl('TopNavigation', definition.href);
    if (definition.variant === 'primary-button') {
      return (
        <span className={styles[`offset-right-${offsetRight}`]}>
          <InternalButton
            variant="primary"
            href={definition.href}
            target={definition.external ? '_blank' : undefined}
            onClick={definition.onClick}
            ariaLabel={ariaLabel}
            iconName={definition.iconName}
            iconUrl={definition.iconUrl}
            iconAlt={definition.iconAlt}
            iconSvg={definition.iconSvg}
          >
            {shouldHideText ? null : (
              <>
                {definition.text}
                {definition.external && (
                  <>
                    {' '}
                    <span
                      className={clsx(styles['utility-button-external-icon'], styles[`offset-right-${offsetRight}`])}
                      aria-label={definition.externalIconAriaLabel}
                      role={definition.externalIconAriaLabel ? 'img' : undefined}
                    >
                      <InternalIcon name="external" />
                    </span>
                  </>
                )}
              </>
            )}
          </InternalButton>
        </span>
      );
    } else {
      // Link
      return (
        <span className={styles[`offset-right-${offsetRight}`]}>
          <InternalLink
            variant="top-navigation"
            href={definition.href}
            external={true}
            onFollow={definition.onClick}
            ariaLabel={ariaLabel}
          >
            {hasIcon && (
              <InternalIcon
                name={definition.iconName}
                url={definition.iconUrl}
                alt={definition.iconAlt}
                svg={definition.iconSvg}
                badge={definition.badge}
              />
            )}
            {!shouldHideText && definition.text && (
              <span className={hasIcon ? styles['utility-link-icon'] : undefined}>{definition.text}</span>
            )}
            {/* HACK: The link component uses size="inherit", and Firefox scales up SVGs massively on the first render */}
            {definition.external && (
              <>
                {' '}
                <span
                  role={definition.externalIconAriaLabel ? 'img' : undefined}
                  aria-label={definition.externalIconAriaLabel}
                >
                  <InternalIcon name="external" size="normal" />
                </span>
              </>
            )}
          </InternalLink>
        </span>
      );
    }
  } else if (definition.type === 'menu-dropdown') {
    const title = definition.title || definition.text;
    const shouldShowTitle = shouldHideText || !definition.text;

    checkSafeUrlRecursively(definition.items);

    return (
      <MenuDropdown
        {...definition}
        title={shouldShowTitle ? title : ''}
        ariaLabel={ariaLabel}
        offsetRight={offsetRight}
      >
        {!shouldHideText && definition.text}
      </MenuDropdown>
    );
  }

  return null;
}

function checkSafeUrlRecursively(itemOrGroup: MenuDropdownProps['items']) {
  for (const item of itemOrGroup) {
    checkSafeUrl('TopNavigation', item.href);

    if ('items' in item) {
      checkSafeUrlRecursively(item.items);
    }
  }
}
