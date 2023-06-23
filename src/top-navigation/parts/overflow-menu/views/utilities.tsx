// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import FocusLock from '../../../../internal/components/focus-lock';

import Header from '../header';
import { UtilityMenuItem } from '../menu-item';

import { TopNavigationProps } from '../../../interfaces';

import { View } from '..';
import styles from '../../../styles.css.js';
import { useUniqueId } from '../../../../internal/hooks/use-unique-id';

interface UtilitiesViewProps extends View {
  items: TopNavigationProps['utilities'];
  focusIndex?: number;
}

const UtilitiesView = ({ headerText, dismissIconAriaLabel, onClose, items = [], focusIndex }: UtilitiesViewProps) => {
  const headerId = useUniqueId('overflow-menu-header');
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useEffect(() => {
    // A focus index is used to set the focus back to the submenu trigger
    // returning from a submenu.
    if (typeof focusIndex === 'number') {
      ref.current?.focus();
    }
  }, [focusIndex]);

  return (
    <FocusLock autoFocus={true}>
      <Header dismissIconAriaLabel={dismissIconAriaLabel} onClose={onClose}>
        <span id={headerId}>{headerText}</span>
      </Header>
      <ul className={styles['overflow-menu-list']} aria-labelledby={headerId}>
        {items.map((utility, index) => (
          <UtilityMenuItem
            key={index}
            index={index}
            ref={index === focusIndex ? ref : undefined}
            onClose={onClose}
            {...utility}
          />
        ))}
      </ul>
    </FocusLock>
  );
};

export default UtilitiesView;
