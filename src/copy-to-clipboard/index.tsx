// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { CopyToClipboardProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalCopyToClipboard from './internal';
import { getExternalProps } from '../internal/utils/external-props';

export { CopyToClipboardProps };

export default function CopyToClipboard({ variant = 'button', ...restProps }: CopyToClipboardProps) {
  const baseProps = useBaseComponent('CopyToClipboard', {
    props: { variant },
  });
  const filteredProps = getExternalProps(restProps);

  return <InternalCopyToClipboard variant={variant} {...baseProps} {...filteredProps} />;
}

applyDisplayName(CopyToClipboard, 'CopyToClipboard');
