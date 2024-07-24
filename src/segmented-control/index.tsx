// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { SegmentedControlProps } from './interfaces';
import InternalSegmentedControl from './internal';

export { SegmentedControlProps };

export default function SegmentedControl(props: SegmentedControlProps) {
  const baseComponentProps = useBaseComponent('SegmentedControl');
  return <InternalSegmentedControl {...props} {...baseComponentProps} />;
}

applyDisplayName(SegmentedControl, 'SegmentedControl');
