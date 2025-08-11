// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { getExternalProps } from '../internal/utils/external-props.js';
import { CopyToClipboardProps } from './interfaces.js';
import InternalCopyToClipboard from './internal.js';

export { CopyToClipboardProps };

export default function CopyToClipboard({
  variant = 'button',
  popoverRenderWithPortal = false,
  ...restProps
}: CopyToClipboardProps) {
  const baseProps = useBaseComponent('CopyToClipboard', {
    props: { variant },
  });
  const filteredProps = getExternalProps(restProps);

  return (
    <InternalCopyToClipboard
      variant={variant}
      popoverRenderWithPortal={popoverRenderWithPortal}
      {...baseProps}
      {...filteredProps}
    />
  );
}

applyDisplayName(CopyToClipboard, 'CopyToClipboard');
