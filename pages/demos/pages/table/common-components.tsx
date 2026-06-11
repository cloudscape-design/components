// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import { format as formatDate } from 'date-fns';

import Box from '@cloudscape-design/components/box';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Button from '@cloudscape-design/components/button';
import HelpPanel from '@cloudscape-design/components/help-panel';
import LiveRegion from '@cloudscape-design/components/live-region';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { resourcesBreadcrumbs } from '../../common/breadcrumbs';
import { ExternalLinkGroup } from '../commons';

export const Breadcrumbs = () => (
  <BreadcrumbGroup items={resourcesBreadcrumbs} expandAriaLabel="Show path" ariaLabel="Breadcrumbs" />
);

export const ToolsContent = () => (
  <HelpPanel
    header={<h2>Distributions</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-working-with.html',
            text: 'Working with distributions',
          },
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-returned.html',
            text: 'Values that CloudFront displays on the console',
          },
        ]}
      />
    }
  >
    <p>
      View your current distributions and related information such as the associated domain names, delivery methods, SSL
      certificates, and more. To drill down even further into the details, choose the name of an individual
      distribution.
    </p>
  </HelpPanel>
);

export const EC2ToolsContent = () => (
  <HelpPanel header={<h2>Instances</h2>}>
    <p>
      View your current instances and related information such as the instance ID, instance type, instance status, and
      more. To drill down even further into the details, select an individual instance.
    </p>
  </HelpPanel>
);

export interface ManualRefreshProps {
  onRefresh: () => void;
  lastRefresh?: Date;
  loading: boolean;
  disabled: boolean;
}

export const ManualRefresh = ({ onRefresh, loading, lastRefresh, disabled }: ManualRefreshProps) => {
  return (
    <SpaceBetween data-testid="manual-refresh" direction="horizontal" size="xs" alignItems="center">
      {lastRefresh && (
        <Box variant="p" fontSize="body-s" padding="n" color="text-status-inactive" textAlign="right">
          <LiveRegion>
            Last updated
            <br />
            {formatDate(lastRefresh, "MMMM d, yyyy, HH:mm ('UTC'xxx)")}
          </LiveRegion>
        </Box>
      )}
      <Button
        iconName="refresh"
        ariaLabel="Refresh"
        loadingText="Refreshing table content"
        loading={loading}
        onClick={onRefresh}
        disabled={disabled}
      />
    </SpaceBetween>
  );
};
