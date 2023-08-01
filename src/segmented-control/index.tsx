// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { SegmentedControlProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalSegmentedControl from './internal';

export { SegmentedControlProps };

export default function SegmentedControl(props: SegmentedControlProps) {
  const baseComponentProps = useBaseComponent('SegmentedControl', {
    selectedId: props.selectedId,
    options: props.options,
  });
  return <InternalSegmentedControl {...props} {...baseComponentProps} />;
}

applyDisplayName(SegmentedControl, 'SegmentedControl');
