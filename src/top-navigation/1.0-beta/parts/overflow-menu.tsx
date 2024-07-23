// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ButtonDropdownProps } from '../../../button-dropdown/interfaces';
import { BaseComponentProps } from '../../../internal/base-component';
import MenuDropdown from '../../../internal/components/menu-dropdown';
import { fireCancelableEvent } from '../../../internal/events';
import { TopNavigationProps } from '../interfaces';

import styles from '../styles.css.js';

export interface OverflowMenuProps extends BaseComponentProps {
  utilities: ReadonlyArray<TopNavigationProps.Utility>;

  isNarrowViewport?: boolean;

  /**
   * Text displayed in the button dropdown trigger.
   * @displayname text
   */
  children?: React.ReactNode;
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

export default function OverflowMenu({ children, utilities, isNarrowViewport }: OverflowMenuProps) {
  const onClick = (isFollow: boolean, event: CustomEvent<ButtonDropdownProps.ItemClickDetails>) => {
    const [index, ...rest] = event.detail.id.split('__');
    const utility = utilities[parseInt(index)];
    let defaultPrevented = false;
    if ('onItemClick' in utility) {
      defaultPrevented = fireCancelableEvent(utility.onItemClick, { ...event.detail, id: rest.join('__') });
    } else if ('onClick' in utility && (isFollow || !utility.href)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...baseNavigationalDetail } = event.detail;
      defaultPrevented = fireCancelableEvent(utility.onClick, baseNavigationalDetail);
    }
    if (defaultPrevented) {
      event.preventDefault();
    }
  };

  return (
    <MenuDropdown
      items={utilities.map(transformUtility)}
      offsetRight={isNarrowViewport ? 'l' : 'xxl'}
      className={styles.trigger}
      expandableGroups={true}
      onItemClick={onClick.bind(null, false)}
      onItemFollow={onClick.bind(null, true)}
    >
      {children}
    </MenuDropdown>
  );
}
