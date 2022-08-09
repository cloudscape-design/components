// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { InternalButton } from '../../../../button/internal';
import styles from '../../../styles.css.js';

interface HeaderButtonProps {
  ariaLabel: string;
  isPrevious: boolean;
  onChangeMonth: (isPrevious: boolean) => void;
}

const HeaderButton = ({ ariaLabel, isPrevious, onChangeMonth }: HeaderButtonProps) => {
  const iconName = isPrevious ? 'angle-left' : 'angle-right';
  const additionalAttributes: React.HTMLAttributes<HTMLButtonElement> = {
    className: isPrevious ? styles['calendar-prev-month-btn'] : styles['calendar-next-month-btn'],
  };

  const onClick = () => onChangeMonth(isPrevious);

  return (
    <InternalButton
      {...additionalAttributes}
      iconName={iconName}
      ariaLabel={ariaLabel}
      variant={'icon'}
      onClick={onClick}
      formAction="none"
    />
  );
};

export default HeaderButton;
