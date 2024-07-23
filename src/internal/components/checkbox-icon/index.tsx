// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { BaseComponentProps, getBaseProps } from '../../base-component';
import { useVisualRefresh } from '../../hooks/use-visual-mode';

import styles from './styles.css.js';

export interface CheckboxIconProps extends BaseComponentProps {
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}
export interface Dimension {
  viewBox: string;
  indeterminate: string;
  checked: string;
  xy: number;
  r: number;
  size: number;
}

// Can't use css variables for svg attributes
export const dimensionsByTheme: Record<NonNullable<'default' | 'refresh'>, Dimension> = {
  default: {
    viewBox: '0 0 14 14',
    indeterminate: '2.5,7 11.5,7',
    checked: '2.5,7 6,10 11,3',
    xy: 0.5,
    r: 1.5,
    size: 13,
  },
  refresh: {
    viewBox: '0 0 16 16',
    indeterminate: '3.5,8 12.5,8',
    checked: '3.5,8 7,11 12,4',
    xy: 1,
    r: 2,
    size: 14,
  },
};

const CheckboxIcon = ({
  checked,
  indeterminate,
  disabled = false,
  readOnly = false,
  ...restProps
}: CheckboxIconProps) => {
  const baseProps = getBaseProps(restProps);
  const theme = useVisualRefresh() ? 'refresh' : 'default';
  const dimensions = dimensionsByTheme[theme];
  return (
    <svg className={styles.root} viewBox={dimensions.viewBox} aria-hidden="true" focusable="false" {...baseProps}>
      <rect
        className={clsx(styles['styled-box'], {
          [styles['styled-box-checked']]: checked,
          [styles['styled-box-indeterminate']]: indeterminate,
          [styles['styled-box-disabled']]: disabled,
          [styles['styled-box-readonly']]: readOnly,
        })}
        x={dimensions.xy}
        y={dimensions.xy}
        rx={dimensions.r}
        ry={dimensions.r}
        width={dimensions.size}
        height={dimensions.size}
      />
      {checked || indeterminate ? (
        <polyline
          className={clsx(styles['styled-line'], {
            [styles['styled-line-disabled']]: disabled,
            [styles['styled-line-readonly']]: readOnly,
          })}
          points={indeterminate ? dimensions.indeterminate : dimensions.checked}
        />
      ) : null}
    </svg>
  );
};

export default CheckboxIcon;
