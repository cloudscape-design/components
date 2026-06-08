// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Header from '@cloudscape-design/components/header';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { formatReadOnlyRegion } from '../../../../common/aws-region-utils';
import { InfoLink, useHelpPanel } from '../../../commons';
import { WidgetConfig } from '../interfaces';
import { ServiceHealthInfo } from './help-content';

function ServiceHealthHeader() {
  const loadHelpPanelContent = useHelpPanel();
  return (
    <Header
      variant="h2"
      info={
        <InfoLink data-testid="service-health-info-link" onFollow={() => loadHelpPanelContent(<ServiceHealthInfo />)} />
      }
    >
      Service health
    </Header>
  );
}

export default function ServiceHealthContent() {
  return (
    <ColumnLayout columns={2}>
      <div>
        <Box variant="awsui-key-label">Region</Box>
        <div>{formatReadOnlyRegion('us-east-1')}</div>
      </div>
      <div>
        <Box variant="awsui-key-label">Status</Box>
        <StatusIndicator type="success">Service is operating normally</StatusIndicator>
      </div>
    </ColumnLayout>
  );
}
export const serviceHealth: WidgetConfig = {
  definition: { defaultRowSpan: 2, defaultColumnSpan: 1 },
  data: {
    icon: 'list',
    title: 'Service Health',
    description: 'General information about service health',
    header: ServiceHealthHeader,
    content: ServiceHealthContent,
  },
};
