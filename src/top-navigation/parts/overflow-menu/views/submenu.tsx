// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import FocusLock from 'react-focus-lock';

import { useNavigate } from '../router';
import Header from '../header';
import { SubmenuItem } from '../menu-item';
import { useUniqueId } from '../../../../internal/hooks/use-unique-id';

import { TopNavigationProps } from '../../../interfaces';

import { View } from '..';
import styles from '../../../styles.css.js';
import { fireCancelableEvent } from '../../../../internal/events';

interface SubmenuViewProps extends View {
  definition: TopNavigationProps.MenuDropdownUtility;
  utilityIndex?: number;
}

const SubmenuView = ({
  onClose,
  utilityIndex,
  headerText,
  headerSecondaryText,
  dismissIconAriaLabel,
  backIconAriaLabel,
  definition,
}: SubmenuViewProps) => {
  const navigate = useNavigate();
  const headerId = useUniqueId('overflow-menu-header');

  return (
    <FocusLock returnFocus={true}>
      <Header
        secondaryText={headerSecondaryText}
        dismissIconAriaLabel={dismissIconAriaLabel}
        backIconAriaLabel={backIconAriaLabel}
        onClose={onClose}
        onBack={() => navigate('utilities', { utilityIndex })}
      >
        <span id={headerId}>{headerText}</span>
      </Header>
      <ul
        className={clsx(styles['overflow-menu-list'], styles['overflow-menu-list-submenu'])}
        aria-labelledby={headerId}
      >
        {(definition as TopNavigationProps.MenuDropdownUtility).items.map((item, index) => (
          <SubmenuItem
            key={index}
            {...item}
            onItemClick={item => {
              fireCancelableEvent(definition.onItemClick, { id: item.id, href: item.href, external: item.external });
              onClose?.();
            }}
          />
        ))}
      </ul>
    </FocusLock>
  );
};

export default SubmenuView;
