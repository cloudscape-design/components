// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import InternalButton from '../../../button/internal';

import styles from '../../styles.css.js';
export interface HeaderProps {
  dismissIconAriaLabel?: string;
  backIconAriaLabel?: string;
  secondaryText?: string;
  onClose?: () => void;
  onBack?: () => void;
  children: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  children,
  secondaryText,
  backIconAriaLabel,
  dismissIconAriaLabel,
  onBack,
  onClose,
}) => {
  return (
    <div className={styles['overflow-menu-header']}>
      {onBack && (
        <InternalButton
          // Used for test-utils, which require the selectable element to have a classname.
          // eslint-disable-next-line react/forbid-component-props
          className={styles['overflow-menu-back-button']}
          ariaLabel={backIconAriaLabel}
          iconName="angle-left"
          variant="icon"
          onClick={() => onBack()}
        />
      )}
      <h2 className={styles['overflow-menu-header-text']}>
        <div className={styles['overflow-menu-header-text--title']}>{children}</div>
        {secondaryText && <div className={styles['overflow-menu-header-text--secondary']}>{secondaryText}</div>}
      </h2>
      <InternalButton
        // eslint-disable-next-line react/forbid-component-props
        className={styles['overflow-menu-dismiss-button']}
        ariaLabel={dismissIconAriaLabel}
        iconName="close"
        variant="icon"
        onClick={() => onClose && onClose()}
      />
    </div>
  );
};

export default Header;
