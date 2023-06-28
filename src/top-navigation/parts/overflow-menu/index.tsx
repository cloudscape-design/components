// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Router, { Route } from './router';
import UtilitiesView from './views/utilities';
import SubmenuView from './views/submenu';

import { HeaderProps } from './header';

import styles from '../../styles.css.js';
import { TopNavigationProps } from '../../interfaces';
import { useInternalI18n } from '../../../internal/i18n/context';
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
