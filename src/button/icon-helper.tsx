// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import clsx from 'clsx';

import { IconProps } from '../icon/interfaces';
import InternalIcon from '../icon/internal';
import InternalSpinner from '../spinner/internal';
import { ButtonProps } from './interfaces';

import styles from './styles.css.js';

export interface ButtonIconProps {
  loading?: boolean;
  iconName?: ButtonProps['iconName'];
  iconAlign?: ButtonProps['iconAlign'];
  iconUrl?: string;
  iconSvg?: React.ReactNode;
  iconAlt?: string;
  iconSize?: IconProps.Size;
  variant?: string;
  iconClass?: string;
  badge?: boolean;
}

function getIconAlign(props: ButtonIconProps) {
  const standalone = props.variant === 'icon' || props.variant === 'inline-icon';

  return standalone ? 'left' : props.iconAlign;
}

function IconWrapper({ iconName, iconUrl, iconAlt, iconSvg, iconSize, badge, ...props }: ButtonIconProps) {
  if (!iconName && !iconUrl && !iconSvg) {
    return null;
  }

  return (
    <InternalIcon
      className={clsx(styles.icon, styles[`icon-${getIconAlign(props)}`], props.iconClass)}
      name={iconName}
      url={iconUrl}
      svg={iconSvg}
      alt={iconAlt}
      size={iconSize}
      badge={badge}
    />
  );
}

export function LeftIcon(props: ButtonIconProps) {
  if (props.loading) {
    return <InternalSpinner className={clsx(styles.icon, styles['icon-left'])} />;
  } else if (getIconAlign(props) === 'left') {
    return <IconWrapper {...props} />;
  }
  return null;
}

export function RightIcon(props: ButtonIconProps) {
  if (getIconAlign(props) === 'right') {
    return <IconWrapper {...props} />;
  }
  return null;
}
