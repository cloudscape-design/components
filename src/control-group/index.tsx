// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import InternalControlGroup from '../internal/components/control-group';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { ControlGroupProps } from './interfaces';

export { ControlGroupProps };

export default function ControlGroup({ direction = 'auto', ...props }: ControlGroupProps) {
  const baseComponentProps = useBaseComponent('ControlGroup', { props: { direction } });
  return <InternalControlGroup direction={direction} {...props} {...baseComponentProps} />;
}

applyDisplayName(ControlGroup, 'ControlGroup');
