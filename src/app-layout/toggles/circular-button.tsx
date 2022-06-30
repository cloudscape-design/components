// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import Icon from '../../icon/internal';
import { AppLayoutButtonProps } from './interfaces';
import styles from './styles.css.js';
import useFocusVisible from '../../internal/hooks/focus-visible';

interface CircularButton extends AppLayoutButtonProps {
  selected?: boolean;
}

export const CircularButton = React.forwardRef(
  (
    { className, ariaLabel, ariaExpanded, iconName, disabled, selected, onClick }: CircularButton,
    ref: React.Ref<any>
  ) => {
    const focusVisible = useFocusVisible();
    return (
      <button
        {...focusVisible}
        ref={ref}
        type="button"
        disabled={disabled}
        className={clsx(styles['circular-toggle'], selected && styles['circular-toggle-selected'], className)}
        aria-label={ariaLabel}
        aria-expanded={ariaExpanded}
        onClick={onClick}
      >
        <Icon name={iconName} />
      </button>
    );
  }
);
