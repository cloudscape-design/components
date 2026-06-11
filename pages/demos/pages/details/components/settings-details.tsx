// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import CopyToClipboard from '@cloudscape-design/components/copy-to-clipboard';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

import { DistributionResource } from '../../../resources/types';
import { DEMO_DISTRIBUTION } from '../config';

export const SettingsDetails = ({
  distribution = DEMO_DISTRIBUTION,
  isInProgress,
}: {
  distribution?: DistributionResource;
  isInProgress: boolean;
}) => (
  <KeyValuePairs
    columns={4}
    items={[
      {
        type: 'group',
        items: [
          {
            label: 'Distribution ID',
            value: distribution.id,
          },
          {
            label: 'Domain name',
            value: distribution.domainName,
          },
          {
            label: 'ARN',
            value: (
              <CopyToClipboard
                variant="inline"
                textToCopy={`arn:aws:cloudfront::${distribution.domainName}/${distribution.id}`}
                copyButtonAriaLabel="Copy ARN"
                copySuccessText="ARN copied"
                copyErrorText="ARN failed to copy"
              />
            ),
          },
        ],
      },
      {
        type: 'group',
        items: [
          {
            label: 'Status',
            id: 'status-id',
            value: distribution.state ? (
              <StatusIndicator type={distribution.state === 'Deactivated' ? 'error' : 'success'}>
                {distribution.state}
              </StatusIndicator>
            ) : (
              <ProgressBar
                value={27}
                description={isInProgress ? 'Update in progress' : undefined}
                variant="key-value"
                resultText="Available"
                status={isInProgress ? 'in-progress' : 'success'}
                ariaLabelledby="status-id"
              />
            ),
          },
          {
            label: 'Price class',
            value: distribution.priceClass,
          },
          {
            label: 'CNAMEs',
            value: '-',
          },
        ],
      },
      {
        type: 'group',
        items: [
          {
            label: 'SSL certificate',
            value: distribution.sslCertificate,
          },
          {
            label: 'Custom SSL client support',
            value: '-',
          },
          {
            label: 'Logging',
            value: distribution.logging,
          },
        ],
      },
      {
        type: 'group',
        items: [
          {
            label: 'IPv6',
            value: 'Off',
          },
          {
            label: 'Default root object',
            value: '-',
          },
          {
            label: 'Comment',
            value: 'To verify',
          },
        ],
      },
    ]}
  />
);
