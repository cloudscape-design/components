// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { ErrorBoundaryProps } from './interfaces';
import { InternalErrorBoundary } from './internal';

export { ErrorBoundaryProps };

export default function ErrorBoundary({ suppressNested = false, ...props }: ErrorBoundaryProps) {
  const baseComponentProps = useBaseComponent('ErrorBoundary', { props: { suppressNested } });
  return <InternalErrorBoundary {...baseComponentProps} {...props} suppressNested={suppressNested} />;
}
