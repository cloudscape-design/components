// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { SkeletonProps } from './interfaces';
import InternalSkeleton from './internal';

export { SkeletonProps };

export default function Skeleton(props: SkeletonProps) {
  const baseComponentProps = useBaseComponent('Skeleton');
  return <InternalSkeleton {...props} {...baseComponentProps} />;
}

applyDisplayName(Skeleton, 'Skeleton');
