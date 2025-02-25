// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ButtonDropdownProps } from '../../../button-dropdown/interfaces';
import { useInternalI18n } from '../../../i18n/context';
import { TopNavigationProps } from '../../interfaces';
import { HeaderProps } from './header';
import Router, { Route } from './router';
import SubmenuView from './views/submenu';
import UtilitiesView from './views/utilities';

import styles from '../../styles.css.js';
interface OverflowMenuProps {
  headerText?: string;
  items?: TopNavigationProps['utilities'];
  dismissIconAriaLabel?: HeaderProps['dismissIconAriaLabel'];
  backIconAriaLabel?: HeaderProps['backIconAriaLabel'];
  onClose?: HeaderProps['onClose'];
}

export interface View extends Omit<OverflowMenuProps, 'items'> {
  headerSecondaryText?: HeaderProps['secondaryText'];
}

function transformButtonDropdownItems(items: ButtonDropdownProps.Items, index: number): ButtonDropdownProps.Items {
  return items.map(item => {
    const itemCopy = { ...item, id: `${index}__${item.id || ''}` };
    if ('items' in itemCopy) {
      itemCopy.items = transformButtonDropdownItems(itemCopy.items, index);
    }
    return itemCopy;
  });
}

export function transformUtility(utility: TopNavigationProps.Utility, index: number): ButtonDropdownProps.ItemOrGroup {
  const title = utility.title || utility.text || '';

  const commonProps: Partial<ButtonDropdownProps.ItemOrGroup> = {
    // Encode index into the ID, so we can pick out the right handler.
    id: `${index}__`,
    text: title,
    iconName: utility.iconName,
    iconUrl: utility.iconUrl,
    iconAlt: utility.iconAlt,
    iconSvg: utility.iconSvg,
  };

  if (utility.type === 'menu-dropdown') {
    return {
      ...commonProps,
      items: transformButtonDropdownItems(utility.items, index),
      description: utility.description,
    } as ButtonDropdownProps.ItemGroup;
  } else {
    return {
      ...commonProps,
      href: utility.href,
      external: utility.external,
      externalIconAriaLabel: utility.externalIconAriaLabel,
    } as ButtonDropdownProps.Item;
  }
}

const OverflowMenu = ({
  headerText,
  dismissIconAriaLabel,
  backIconAriaLabel,
  items = [],
  onClose,
}: OverflowMenuProps) => {
  const i18n = useInternalI18n('top-navigation');
  const renderedDismissIconAriaLabel = i18n('i18nStrings.overflowMenuDismissIconAriaLabel', dismissIconAriaLabel);
  const renderedBackIconAriaLabel = i18n('i18nStrings.overflowMenuBackIconAriaLabel', backIconAriaLabel);

  return (
    <div
      className={styles['overflow-menu']}
      onKeyUp={event => {
        if (event.key === 'Escape') {
          onClose?.();
        }
      }}
    >
      <Router>
        <Route
          view="utilities"
          element={data => (
            <UtilitiesView
              headerText={i18n('i18nStrings.overflowMenuTitleText', headerText)}
              items={items}
              focusIndex={data?.utilityIndex}
              dismissIconAriaLabel={renderedDismissIconAriaLabel}
              backIconAriaLabel={renderedBackIconAriaLabel}
              onClose={onClose}
            />
          )}
        />
        <Route
          view="dropdown-menu"
          element={data => (
            <SubmenuView
              headerText={data?.headerText}
              headerSecondaryText={data?.headerSecondaryText}
              dismissIconAriaLabel={renderedDismissIconAriaLabel}
              backIconAriaLabel={renderedBackIconAriaLabel}
              definition={data?.definition}
              utilityIndex={data?.utilityIndex}
              onClose={onClose}
            />
          )}
        />
      </Router>
    </div>
  );
};

export default OverflowMenu;
