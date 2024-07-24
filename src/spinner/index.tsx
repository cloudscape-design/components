// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { SpinnerProps } from './interfaces';
import InternalSpinner from './internal';

export { SpinnerProps };

export default function Spinner({ size = 'normal', variant = 'normal', ...props }: SpinnerProps) {
  const baseComponentProps = useBaseComponent('Spinner', {
    props: { size, variant },
  });
  return <InternalSpinner size={size} variant={variant} {...props} {...baseComponentProps} />;
}

applyDisplayName(Spinner, 'Spinner');
