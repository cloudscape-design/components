// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { SegmentedControlProps } from './interfaces';
import InternalIcon from '../icon/internal';
import styles from './styles.css.js';

export interface SegmentProps extends SegmentedControlProps.Option {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  tabIndex: number;
}

export const Segment = React.forwardRef(
  (
    { disabled, text, iconName, iconAlt, iconUrl, iconSvg, isActive, onClick, onKeyDown, tabIndex }: SegmentProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        className={clsx(styles.segment, { [styles.disabled]: !!disabled }, { [styles.selected]: isActive })}
        ref={ref}
        onClick={onClick}
        onKeyDown={onKeyDown}
        disabled={disabled}
        type="button"
        tabIndex={tabIndex}
        aria-pressed={isActive ? 'true' : 'false'}
        aria-label={!text ? iconAlt : undefined}
      >
        {(iconName || iconUrl || iconSvg) && (
          <InternalIcon
            className={clsx(styles.icon, text ? styles['with-text'] : styles['with-no-text'])}
            name={iconName}
            url={iconUrl}
            svg={iconSvg}
            alt={iconAlt}
            variant={disabled ? 'disabled' : 'normal'}
          />
        )}
        <span>{text}</span>
      </button>
    );
  }
);
