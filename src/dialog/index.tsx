// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { DialogProps } from './interfaces';
import InternalDialog from './internal';

export { DialogProps };

const Dialog = React.forwardRef(({ onDismiss, ...props }: DialogProps, ref: React.Ref<DialogProps.Ref>) => {
  const baseComponentProps = useBaseComponent('Dialog');
  const externalProps = getExternalProps(props);
  return <InternalDialog onDismiss={onDismiss} {...externalProps} {...baseComponentProps} ref={ref} />;
});

applyDisplayName(Dialog, 'Dialog');
export default Dialog;
