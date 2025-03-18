// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

// eslint-disable-next-line @cloudscape-design/ban-files
import Button, { ButtonProps as CoreButtonProps } from './index';

export * from './index';
export type ButtonProps = Omit<CoreButtonProps, 'variant'> & {
  variant: 'normal' | 'primary' | 'link' | 'icon' | 'inline-icon' | 'inline-link';
};
export default Button as React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<CoreButtonProps.Ref>>;
