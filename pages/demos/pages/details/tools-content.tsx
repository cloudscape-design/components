// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import HelpPanel from '@cloudscape-design/components/help-panel';

import { ExternalLinkGroup } from '../commons';

function DistributionSettings({ header }: { header: React.ReactNode }) {
  return (
    <HelpPanel
      header={<h2>{header}</h2>}
      footer={
        <ExternalLinkGroup
          items={[
            {
              href: 'https://docs.aws.amazon.com/en_pv/AmazonCloudFront/latest/DeveloperGuide/distribution-overview.html',
              text: 'Overview of Distributions',
            },
          ]}
        />
      }
    >
      <p>
        When you want to use CloudFront to distribute your content, you create a distribution and choose the
        configuration settings you want. For example:
      </p>
      <ul>
        <li>
          Your content origin—that is, the Amazon S3 bucket, MediaPackage channel, or HTTP server from which CloudFront
          gets the files to distribute. You can specify any combination of up to 25 Amazon S3 buckets, channels, and/or
          HTTP servers as your origins.
        </li>
        <li>Access—whether you want the files to be available to everyone or restrict access to some users.</li>
        <li>Security—whether you want CloudFront to require users to use HTTPS to access your content.</li>
        <li>
          Cookie or query-string forwarding—whether you want CloudFront to forward cookies or query strings to your
          origin.
        </li>
        <li>
          Geo-restrictions—whether you want CloudFront to prevent users in selected countries from accessing your
          content.
        </li>
        <li>Access logs—whether you want CloudFront to create access logs that show viewer activity.</li>
      </ul>
    </HelpPanel>
  );
}

/* eslint-disable react/jsx-key */
export default [
  <DistributionSettings header="Distribution settings" />,
  <DistributionSettings header="Details" />,
  <HelpPanel
    header={<h2>Tags</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/tagging.html',
            text: 'Tagging Amazon CloudFront Distributions',
          },
        ]}
      />
    }
  >
    <p>
      Tags are words or phrases that you can use to identify and organize your AWS resources. You can add multiple tags
      to each resource, and each tag includes a key and a value that you define. For example, the key might be "domain"
      and the value might be "example.com". You can search and filter your resources based on the tags you add.
    </p>
  </HelpPanel>,
];
