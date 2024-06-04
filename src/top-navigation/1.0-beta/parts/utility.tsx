// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { InternalButton } from '../../../button/internal';
import InternalLink from '../../../link/internal';
import InternalIcon from '../../../icon/internal';
import MenuDropdown, { MenuDropdownProps } from '../../../internal/components/menu-dropdown';

import { TopNavigationProps } from '../interfaces';

import styles from '../styles.css.js';
import { checkSafeUrl } from '../../../internal/utils/check-safe-url';
import { isLinkItem } from '../../../button-dropdown/utils/utils';

export interface UtilityProps {
  hideText: boolean;
  definition: TopNavigationProps.Utility;
  last?: boolean;
  isNarrowViewport?: boolean;
}

export default function Utility({ hideText, definition, last, isNarrowViewport }: UtilityProps) {
  const shouldHideText = hideText && !definition.disableTextCollapse && hasIcon(definition);
  const ariaLabel = definition.ariaLabel ?? definition.text;

  if (definition.type === 'button') {
    checkSafeUrl('TopNavigation', definition.href);
    if (definition.variant === 'primary-button') {
      return (
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
          className={clsx(last && styles['last-utility'])}
        >
          {shouldHideText ? null : (
            <>
              {definition.text}
              {definition.external && (
                <>
                  {' '}
                  <span
                    className={styles['utility-button-external-icon']}
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
      );
    } else {
      // Link
      return (
        <InternalLink
          variant="top-navigation"
          href={definition.href}
          external={definition.external}
          externalIconAriaLabel={definition.externalIconAriaLabel}
          onFollow={definition.onClick}
          ariaLabel={ariaLabel}
          className={clsx(last && styles['last-utility'])}
        >
          {hasIcon(definition) && (
            <span className={styles['utility-link-icon']}>
              <InternalIcon
                name={definition.iconName}
                url={definition.iconUrl}
                alt={definition.iconAlt}
                svg={definition.iconSvg}
                badge={definition.badge}
              />
            </span>
          )}
          {!shouldHideText && definition.text}
        </InternalLink>
      );
    }
  } else if (definition.type === 'menu-dropdown') {
    const paddingRight = isNarrowViewport ? 'l' : 'xxl';
    const title = definition.title || definition.text;
    const shouldShowTitle = shouldHideText || !definition.text;

    checkSafeUrlRecursively(definition.items);

    return (
      <MenuDropdown
        {...definition}
        title={shouldShowTitle ? title : ''}
        ariaLabel={ariaLabel}
        className={styles['utility-dropdown']}
        offsetRight={last ? paddingRight : undefined}
      >
        {!shouldHideText && definition.text}
      </MenuDropdown>
    );
  }

  return null;
}

function hasIcon(definition: TopNavigationProps.Utility): boolean {
  return !!definition.iconName || !!definition.iconUrl || !!definition.iconAlt || !!definition.iconSvg;
}

function checkSafeUrlRecursively(itemOrGroup: MenuDropdownProps['items']) {
  for (const item of itemOrGroup) {
    if (isLinkItem(item)) {
      checkSafeUrl('TopNavigation', item.href);
    }

    if ('items' in item) {
      checkSafeUrlRecursively(item.items);
    }
  }
}
