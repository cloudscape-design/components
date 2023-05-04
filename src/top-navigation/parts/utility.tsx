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
import { fireCancelableEvent } from '../../internal/events';

export interface UtilityProps {
  hideText: boolean;
  definition: TopNavigationProps.Utility;
  offsetRight?: MenuDropdownProps['offsetRight'];
}

export default function Utility({ hideText, definition, offsetRight }: UtilityProps) {
  const hasIcon = !!definition.iconName || !!definition.iconUrl || !!definition.iconAlt || !!definition.iconSvg;
  const shouldHideText = hideText && !definition.disableTextCollapse && hasIcon;
  let ariaLabel = definition.ariaLabel ?? definition.text;

  if (definition.type === 'button') {
    ariaLabel = definition.ariaLabel
      ? definition.ariaLabel
      : joinStrings(definition.text, definition.externalIconAriaLabel);
    checkSafeUrl('TopNavigation', definition.href);
    if (definition.variant === 'primary-button') {
      return (
        <span className={styles[`offset-right-${offsetRight}`]}>
          <InternalButton
            variant="primary"
            href={definition.href}
            target={definition.external ? '_blank' : undefined}
            onClick={definition.onClick}
            onFollow={definition.onFollow}
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
            target={definition.target}
            rel={definition.rel}
            external={definition.external}
            onFollow={evt => {
              fireCancelableEvent(
                definition.onFollow,
                { href: definition.href, target: definition.target, external: definition.external },
                evt
              );
              fireCancelableEvent(
                definition.onClick,
                { href: definition.href, target: definition.target, external: definition.external },
                evt
              );
            }}
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
