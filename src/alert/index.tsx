// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { AlertProps } from './interfaces';
import InternalAlert from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { AlertProps };

export default function Alert({ type = 'info', visible = true, ...props }: AlertProps) {
  const baseComponentProps = useBaseComponent('Alert');
  console.log('dummy');
  return <InternalAlert type={type} visible={visible} {...props} {...baseComponentProps} />;
}

applyDisplayName(Alert, 'Alert');
