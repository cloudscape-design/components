// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ExpandableSectionProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalExpandableSection from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { ExpandableSectionProps };

const ExpandableSection = React.forwardRef(
  ({ variant = 'default', ...props }: ExpandableSectionProps, ref: React.Ref<ExpandableSectionProps.Ref>) => {
    const baseComponentProps = useBaseComponent('ExpandableSection');
    return <InternalExpandableSection ref={ref} variant={variant} {...props} {...baseComponentProps} />;
  }
);

applyDisplayName(ExpandableSection, 'ExpandableSection');
export default ExpandableSection;
