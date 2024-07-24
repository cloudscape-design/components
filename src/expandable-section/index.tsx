// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { ExpandableSectionProps } from './interfaces';
import InternalExpandableSection from './internal';

export { ExpandableSectionProps };

export default function ExpandableSection({ variant = 'default', ...props }: ExpandableSectionProps) {
  const baseComponentProps = useBaseComponent('ExpandableSection', {
    props: {
      disableContentPaddings: props.disableContentPaddings,
      headingTagOverride: props.headingTagOverride,
      variant,
    },
  });

  return <InternalExpandableSection variant={variant} {...props} {...baseComponentProps} />;
}

applyDisplayName(ExpandableSection, 'ExpandableSection');
