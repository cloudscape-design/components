// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { SegmentedControlProps } from './interfaces.js';
import InternalSegmentedControl from './internal.js';

export { SegmentedControlProps };

export default function SegmentedControl(props: SegmentedControlProps) {
  const baseComponentProps = useBaseComponent('SegmentedControl', {
    props: {},
    metadata: {
      hasDisabledReasons: (props.options ?? []).some(option => Boolean(option.disabledReason)),
    },
  });
  return <InternalSegmentedControl {...props} {...baseComponentProps} />;
}

applyDisplayName(SegmentedControl, 'SegmentedControl');
