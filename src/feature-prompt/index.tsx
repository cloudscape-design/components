// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { FeaturePromptProps } from './interfaces';
import { InternalFeaturePrompt } from './internal';

export { FeaturePromptProps };

export default function FeaturePrompt({
  fixedWidth = false,
  size = 'medium',
  position = 'top',
  ...rest
}: FeaturePromptProps): JSX.Element {
  const baseComponentProps = useBaseComponent('FeaturePromptProps', { props: { fixedWidth, size, position } });

  const externalProps = getExternalProps(rest);
  return (
    <InternalFeaturePrompt
      fixedWidth={fixedWidth}
      size={size}
      position={position}
      {...externalProps}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(FeaturePrompt, 'FeaturePrompt');
