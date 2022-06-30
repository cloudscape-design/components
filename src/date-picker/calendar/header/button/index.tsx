// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { CancelableEventHandler } from '../../../../internal/events';
import { ButtonProps } from '../../../../button/interfaces';
import { InternalButton } from '../../../../button/internal';
import styles from '../../../styles.css.js';

interface HeaderButtonProps {
  ariaLabel: string;
  isPrevious: boolean;
  focusable: boolean;
  onChangeMonth: (isPrevious: boolean) => void;
}

const HeaderButton = ({ ariaLabel, isPrevious, onChangeMonth, focusable }: HeaderButtonProps) => {
  const iconName = isPrevious ? 'angle-left' : 'angle-right';
  const additionalAttributes: React.HTMLAttributes<HTMLButtonElement> = {
    className: isPrevious ? styles['calendar-prev-month-btn'] : styles['calendar-next-month-btn'],
    tabIndex: focusable ? 0 : -1,
  };

  const onClick: CancelableEventHandler<ButtonProps.ClickDetail> = e => {
    e.preventDefault();
    onChangeMonth(isPrevious);
  };

  return (
    <InternalButton
      {...additionalAttributes}
      iconName={iconName}
      ariaLabel={ariaLabel}
      variant={'icon'}
      onClick={onClick}
    />
  );
};

export default HeaderButton;
