// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ExpandableSectionProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalExpandableSection from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { ExpandableSectionProps };

export default function ExpandableSection({ variant = 'default', ...props }: ExpandableSectionProps) {
  const baseComponentProps = useBaseComponent('ExpandableSection');

  return <InternalExpandableSection variant={variant} {...props} {...baseComponentProps} />;
}

applyDisplayName(ExpandableSection, 'ExpandableSection');
