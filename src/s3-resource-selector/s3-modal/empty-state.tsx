// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import InternalBox from '../../box/internal';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, subtitle, action }: EmptyStateProps) {
  return (
    <InternalBox textAlign="center" color="inherit">
      <InternalBox variant="strong" textAlign="center" color="inherit">
        {title}
      </InternalBox>
      <InternalBox variant="p" padding={{ bottom: 's' }} color="inherit">
        {subtitle}
      </InternalBox>
      {action}
    </InternalBox>
  );
}
