// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { IconProps } from '../icon/interfaces';
import InternalIcon from '../icon/internal';

import styles from './styles.css.js';

interface TabButtonProps {
  text: string;
  iconName: IconProps.Name;
  active: boolean;
  disabled: boolean;
  tabIndex?: number;
  ariaHidden?: boolean;
  ariaLabel?: string;
  paneId?: string;
  isRefresh: boolean;

  className: string;
  id?: string;

  onClick: () => void;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
}

export const TabButton = React.forwardRef(
  (
    {
      active,
      disabled,
      iconName,
      onClick,
      onFocus,
      onBlur,
      tabIndex,
      ariaHidden,
      ariaLabel,
      paneId,
      isRefresh,
      text,
      className,
      id,
    }: TabButtonProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        className={clsx([styles['tab-button'], className], {
          [styles['tab-button--active']]: active,
          [styles['tab-button--disabled']]: disabled,
          [styles['tab-button--refresh']]: isRefresh,
        })}
        id={id}
        type="button"
        onClick={onClick}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        ref={ref}
        tabIndex={tabIndex}
        role="tab"
        aria-selected={active}
        aria-controls={paneId}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
      >
        <InternalIcon name={iconName} /> {text}
      </button>
    );
  }
);
