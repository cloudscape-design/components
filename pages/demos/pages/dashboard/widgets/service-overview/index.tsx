// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Link from '@cloudscape-design/components/link';

import { formatReadOnlyRegion } from '../../../../common/aws-region-utils';
import { WidgetConfig } from '../interfaces';

function ServiceOverviewHeader() {
  return (
    <Header variant="h2" description={`Viewing data from ${formatReadOnlyRegion('us-east-1')} Region`}>
      Service overview - <em>new</em>
    </Header>
  );
}

function ServiceOverviewWidget() {
  return (
    <KeyValuePairs
      columns={4}
      items={[
        {
          label: 'Running instances',
          value: (
            <Link variant="awsui-value-large" href="#" ariaLabel="Running instances (14)">
              14
            </Link>
          ),
        },
        {
          label: 'Volumes',
          value: (
            <Link variant="awsui-value-large" href="#" ariaLabel="Volumes (126)">
              126
            </Link>
          ),
        },
        {
          label: 'Security groups',
          value: (
            <Link variant="awsui-value-large" href="#" ariaLabel="Security groups (116)">
              116
            </Link>
          ),
        },
        {
          label: 'Load balancers',
          value: (
            <Link variant="awsui-value-large" href="#" ariaLabel="Load balancers (28)">
              28
            </Link>
          ),
        },
      ]}
    />
  );
}
export const serviceOverview: WidgetConfig = {
  definition: { defaultRowSpan: 2, defaultColumnSpan: 3 },
  data: {
    icon: 'list',
    title: 'Service overview',
    description: 'Overview of all your resources',
    header: ServiceOverviewHeader,
    content: ServiceOverviewWidget,
  },
};
