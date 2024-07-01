// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import Icon from '../../../../icon/internal';
import styles from './styles.css.js';
import { ButtonProps } from '../../../../button/interfaces';
import { IconProps } from '../../../../icon/interfaces';

export interface TriggerButtonProps {
  ariaLabel?: string;
  className?: string;
  iconName?: IconProps.Name;
  iconSvg?: React.ReactNode;
  ariaExpanded: boolean | undefined;
  ariaControls?: string;
  testId?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
  badge?: boolean;
  disabled?: boolean;
  highContrastHeader?: boolean;
}

function TriggerButton(
  {
    ariaLabel,
    className,
    iconName,
    iconSvg,
    ariaExpanded,
    ariaControls,
    onClick,
    testId,
    badge,
    selected,
    disabled,
  }: TriggerButtonProps,
  ref: React.Ref<ButtonProps.Ref>
) {
  return (
    <div className={styles['trigger-wrapper']}>
      <button
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-haspopup={true}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        disabled={disabled}
        className={clsx(
          styles.trigger,
          {
            [styles.selected]: selected,
            [styles.badge]: badge,
          },
          className
        )}
        onClick={onClick}
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        data-testid={testId}
      >
        <span className={clsx(badge && styles['trigger-badge-wrapper'])}>
          <Icon name={iconName} svg={iconSvg} />
        </span>
      </button>
      {badge && <div className={styles.dot} />}
    </div>
  );
}

export default React.forwardRef(TriggerButton);
