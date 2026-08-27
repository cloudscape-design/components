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

export default function Dialog(props: DialogProps) {
  const baseComponentProps = useBaseComponent('Dialog', {
    props: {},
    metadata: {
      hasHeaderActions: Boolean(props.headerActions),
      hasContent: Boolean(props.children),
      hasFooter: Boolean(props.footer),
    },
  });
  const externalProps = getExternalProps(props);
  return <InternalDialog {...externalProps} {...baseComponentProps} />;
}

applyDisplayName(Dialog, 'Dialog');
