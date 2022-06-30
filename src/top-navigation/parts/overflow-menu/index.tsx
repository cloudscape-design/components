// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Router, { Route } from './router';
import UtilitiesView from './views/utilities';
import SubmenuView from './views/submenu';

import { HeaderProps } from './header';

import styles from '../../styles.css.js';
import { TopNavigationProps } from '../../interfaces';
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

const OverflowMenu = ({
  headerText,
  dismissIconAriaLabel,
  backIconAriaLabel,
  items = [],
  onClose,
}: OverflowMenuProps) => {
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
              headerText={headerText}
              items={items}
              focusIndex={data?.utilityIndex}
              dismissIconAriaLabel={dismissIconAriaLabel}
              backIconAriaLabel={backIconAriaLabel}
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
              dismissIconAriaLabel={dismissIconAriaLabel}
              backIconAriaLabel={backIconAriaLabel}
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
