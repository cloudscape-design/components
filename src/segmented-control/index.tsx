// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { useControlGroupContext } from '../internal/context/control-group-context';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { SegmentedControlProps } from './interfaces';
import InternalSegmentedControl from './internal';

export { SegmentedControlProps };

export default function SegmentedControl(props: SegmentedControlProps) {
  const baseComponentProps = useBaseComponent('SegmentedControl', {
    props: {},
    metadata: {
      hasDisabledReasons: (props.options ?? []).some(option => Boolean(option.disabledReason)),
    },
  });
  const { position: controlGroupPosition } = useControlGroupContext();

  return <InternalSegmentedControl {...props} {...baseComponentProps} __controlGroupPosition={controlGroupPosition} />;
}

applyDisplayName(SegmentedControl, 'SegmentedControl');
