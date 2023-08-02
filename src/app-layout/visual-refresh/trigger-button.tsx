// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import Icon from '../../icon/internal';
import styles from './styles.css.js';
import { ButtonProps } from '../../button/interfaces';
import { IconProps } from '../../icon/interfaces';

export interface TriggerButtonProps {
  ariaLabel?: string;
  className?: string;
  iconName?: IconProps.Name;
  iconSvg?: React.ReactNode;
  testId?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
}

function TriggerButton(
  { ariaLabel, className, iconName, iconSvg, onClick, testId, selected = false }: TriggerButtonProps,
  ref: React.Ref<ButtonProps.Ref>
) {
  return (
    <button
      aria-expanded={false}
      aria-haspopup={true}
      aria-label={ariaLabel}
      className={clsx(
        styles.trigger,
        {
          [styles.selected]: selected,
        },
        className
      )}
      onClick={onClick}
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      data-testid={testId}
    >
      <Icon name={iconName} svg={iconSvg} />
    </button>
  );
}

export default React.forwardRef(TriggerButton);
