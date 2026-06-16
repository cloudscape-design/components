// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';

import * as styles from './styles.module.scss';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  verticalCenter?: boolean;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon, title, description, action, verticalCenter }: EmptyStateProps) => (
  <div className={verticalCenter ? styles.verticalCenter : ''}>
    <Box margin={{ vertical: 'xs' }} textAlign="center" color="text-body-secondary">
      <SpaceBetween size="xxs">
        <div>
          {icon && <div>{icon}</div>}
          <Box variant="strong" color="inherit">
            {title}
          </Box>
          <Box variant="p" color="inherit">
            {description}
          </Box>
        </div>
        {action}
      </SpaceBetween>
    </Box>
  </div>
);
