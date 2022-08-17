// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import useFocusVisible from '../../internal/hooks/focus-visible';
import Icon from '../../icon/internal';
import styles from './styles.css.js';
import { ButtonProps } from '../../button/interfaces';
import { IconProps } from '../../icon/interfaces';

interface TriggerButtonProps {
  ariaLabel?: string;
  iconName: IconProps.Name;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
  className?: string;
  ariaExpanded?: boolean;
}

function TriggerButton(
  { ariaLabel, iconName, onClick, selected = false, className, ariaExpanded }: TriggerButtonProps,
  ref: React.Ref<ButtonProps.Ref>
) {
  const focusVisible = useFocusVisible();

  return (
    <button
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      className={clsx(
        styles.trigger,
        {
          [styles.selected]: selected,
        },
        className
      )}
      onClick={onClick}
      type="button"
      ref={ref as React.Ref<HTMLButtonElement>}
      {...focusVisible}
    >
      <Icon name={iconName} />
    </button>
  );
}

export default React.forwardRef(TriggerButton);
