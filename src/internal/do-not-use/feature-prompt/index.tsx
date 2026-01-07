// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import useBaseComponent from '../../hooks/use-base-component';
import { applyDisplayName } from '../../utils/apply-display-name';
import { getExternalProps } from '../../utils/external-props';
import { FeaturePromptProps } from './interfaces';
import InternalFeaturePrompt from './internal';

export { FeaturePromptProps };

const FeaturePrompt = React.forwardRef(
  (
    { size = 'medium', position = 'top', ...rest }: FeaturePromptProps,
    ref: React.Ref<FeaturePromptProps.Ref>
  ): JSX.Element => {
    const baseComponentProps = useBaseComponent('FeaturePromptProps', { props: { size, position } });

    const externalProps = getExternalProps(rest);
    return (
      <InternalFeaturePrompt ref={ref} size={size} position={position} {...externalProps} {...baseComponentProps} />
    );
  }
);

applyDisplayName(FeaturePrompt, 'FeaturePrompt');
export default FeaturePrompt;
