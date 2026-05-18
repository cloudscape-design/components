// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { TruncatedTextProps } from './interfaces';
import InternalTruncatedText from './internal';

export { TruncatedTextProps };

export default function TruncatedText({ children, tooltipText, ...rest }: TruncatedTextProps) {
  const baseComponentProps = useBaseComponent('TruncatedText');
  const externalProps = getExternalProps(rest);
  return (
    <InternalTruncatedText {...externalProps} {...baseComponentProps} tooltipText={tooltipText}>
      {children}
    </InternalTruncatedText>
  );
}

applyDisplayName(TruncatedText, 'TruncatedText');
