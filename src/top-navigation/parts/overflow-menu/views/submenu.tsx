// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import FocusLock from '../../../../internal/components/focus-lock/index.js';
import { fireCancelableEvent, isPlainLeftClick } from '../../../../internal/events/index.js';
import { TopNavigationProps } from '../../../interfaces.js';
import { View } from '..';
import Header from '../header.js';
import { SubmenuItem } from '../menu-item.js';
import { useNavigate } from '../router.js';

import styles from '../../../styles.css.js';

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
    <FocusLock autoFocus={true}>
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
            onClick={(event, item) => {
              if (item.href && isPlainLeftClick(event)) {
                fireCancelableEvent(
                  definition.onItemFollow,
                  { id: item.id, href: item.href, external: item.external },
                  event
                );
              }

              fireCancelableEvent(
                definition.onItemClick,
                { id: item.id, href: item.href, external: item.external },
                event
              );
              onClose?.();
            }}
          />
        ))}
      </ul>
    </FocusLock>
  );
};

export default SubmenuView;
