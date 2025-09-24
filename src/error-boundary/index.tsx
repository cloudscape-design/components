// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use client';
import React from 'react';

import { ErrorBoundaryProps } from './interfaces';
import { InternalErrorBoundary } from './internal';

export { ErrorBoundaryProps };

export default function ErrorBoundary(props: ErrorBoundaryProps) {
  return <InternalErrorBoundary {...props} />;
}
