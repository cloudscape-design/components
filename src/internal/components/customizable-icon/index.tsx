// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { IconProps } from '../../../icon/interfaces';
import InternalIcon from '../../../icon/internal';

export interface CustomizableIconProps extends IconProps {
  /**
   * A custom icon replacing the default one, for example, provided by the consumer via the host
   * component's `icons` property. When set, it renders inside the same element as the default icon,
   * so it inherits the same size/box. When empty, the default icon with fallback props is rendered.
   */
  customIcon?: React.ReactNode;
  /**
   * Properties applied to the default icon only (when `customIcon` is empty). Use it for
   * default-icon presentation such as built-in rotation or motion attributes — a custom icon
   * brings its own presentation.
   */
  fallback?: IconProps;
}

export function CustomizableIcon({ customIcon, fallback, ...shared }: CustomizableIconProps) {
  return customIcon ? <InternalIcon {...shared} override={customIcon} /> : <InternalIcon {...shared} {...fallback} />;
}
