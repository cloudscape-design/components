// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { ErrorBoundaryProps } from './interfaces';
import { InternalErrorBoundary } from './internal';

export { ErrorBoundaryProps };

function ErrorBoundary({ suppressNested = false, ...props }: ErrorBoundaryProps) {
  const baseComponentProps = useBaseComponent('ErrorBoundary', {
    props: { suppressNested },
    metadata: {
      hasBoundaryId: !!props.errorBoundaryId,
      hasFeedbackAction: !!props.i18nStrings?.components?.Feedback,
      hasRenderFallback: !!props.renderFallback,
    },
  });
  return <InternalErrorBoundary {...baseComponentProps} {...props} suppressNested={suppressNested} />;
}

applyDisplayName(ErrorBoundary, 'ErrorBoundary');

export default ErrorBoundary;
