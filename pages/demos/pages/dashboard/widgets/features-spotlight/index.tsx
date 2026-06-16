// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import { Alert, SpaceBetween } from '@cloudscape-design/components';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';

import { formatReadOnlyRegion } from '../../../../common/aws-region-utils';
import { WidgetConfig } from '../interfaces';

function FeaturesSpotlightHeader() {
  return (
    <Header variant="h2" description={`Updates on features available in ${formatReadOnlyRegion('us-east-1')} Region`}>
      Features spotlight
    </Header>
  );
}

function FeaturesSpotlightFooter() {
  return (
    <Box textAlign="center">
      <Link href="#" variant="primary">
        View all posts
      </Link>
    </Box>
  );
}

export function FeaturesSpotlightContent() {
  return (
    <SpaceBetween size="l">
      <ColumnLayout columns={2} variant="text-grid">
        <div>
          <Box color="text-label">August 26, 2019</Box>
          <Box padding={{ vertical: 'xxs' }}>
            <Link href="#" variant="primary">
              Amazon EC2 Fleet Functionality
            </Link>
          </Box>
          <Box variant="p">
            Amazon EC2 Auto Scaling now lets you provision and automatically scale instances across purchase options,
            Availability Zones (AZ), and instance families in a single Auto Scaling group (ASG), to optimize scale,
            performance, and cost.
          </Box>
        </div>
        <div>
          <Box color="text-label">September 9, 2019</Box>
          <Box padding={{ vertical: 'xxs' }}>
            <Link href="#" variant="primary">
              Amazon EC2 Hibernation Now Available on Amazon Linux 2
            </Link>
          </Box>
          <Box variant="p">
            Amazon EC2 expands Hibernation support for Amazon Linux 2. You can now hibernate newly launched EC2
            Instances running Amazon Linux 2, in addition to Amazon Linux and Ubuntu 18.04 LTS OS.
          </Box>
        </div>
      </ColumnLayout>
      <Alert type="info">
        Provisioning less than 100 GiB of General Purpose (SSD) storage for high throughput workloads could result in
        higher latencies upon exhaustion of the initial General Purpose (SSD) IO credit balance.
      </Alert>
    </SpaceBetween>
  );
}

export const featuresSpotlight: WidgetConfig = {
  definition: { defaultRowSpan: 3, defaultColumnSpan: 3 },
  data: {
    icon: 'list',
    title: 'Features spotlight',
    description: 'Updates on features available in the current region',
    header: FeaturesSpotlightHeader,
    content: FeaturesSpotlightContent,
    footer: FeaturesSpotlightFooter,
  },
};
