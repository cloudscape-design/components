// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { DialogProps } from './interfaces';
import InternalDialog from './internal';

export { DialogProps };

const Dialog = React.forwardRef(
  ({ initialFocus = 'header', open, onDismiss, ...props }: DialogProps, ref: React.Ref<DialogProps.Ref>) => {
    if (!onDismiss) {
      warnOnce('Dialog', 'You should provide an `onDismiss` handler so the dialog can respond to close actions.');
    }
    const baseComponentProps = useBaseComponent('Dialog', {
      props: { initialFocus },
    });
    const externalProps = getExternalProps(props);
    return (
      <InternalDialog
        initialFocus={initialFocus}
        open={open}
        onDismiss={onDismiss}
        {...externalProps}
        {...baseComponentProps}
        ref={ref}
      />
    );
  }
);

applyDisplayName(Dialog, 'Dialog');
export default Dialog;
