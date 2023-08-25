// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { InternalButtonDropdownProps } from '../../../button-dropdown/interfaces';
import { IconProps } from '../../../icon/interfaces';

export interface ButtonTriggerProps {
  testUtilsClass?: string;
  iconName?: IconProps.Name;
  iconUrl?: string;
  iconAlt?: string;
  iconSvg?: React.ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;

  badge?: boolean;
  offsetRight?: 'none' | 'l' | 'xxl';
  expanded?: boolean;
}

export interface MenuDropdownProps extends InternalButtonDropdownProps {
  iconName?: IconProps.Name;
  iconUrl?: string;
  iconAlt?: string;
  iconSvg?: React.ReactNode;
  badge?: boolean;
  description?: string;
  offsetRight?: 'l' | 'xxl';
}
