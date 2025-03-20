// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

// eslint-disable-next-line @cloudscape-design/ban-files
import CoreButton, { ButtonProps as CoreButtonProps } from './index';

export * from './index';
export type ButtonProps = Omit<CoreButtonProps, 'variant'> & {
  variant?: 'normal' | 'primary' | 'link' | 'icon' | 'inline-icon' | 'inline-link';
};

export default React.forwardRef(({ variant, ...rest }: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
  // @ts-expect-error not allowed by types
  if (variant === 'fire') {
    throw new Error('Fire is not a valid variant');
  }
  return <CoreButton ref={ref} {...rest} variant={variant} />;
});
