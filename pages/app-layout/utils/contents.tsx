// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, ButtonGroup, Link, SpaceBetween } from '~components';
import Icon from '~components/icon';
import PromptInput from '~components/prompt-input';

export const longContent = (
  <>
    <span>
      Content: When you want to use CloudFront to distribute your content, you create a distribution and choose the
      configuration settings you want. For example:
    </span>
    <ul>
      <li>
        Your content origin—that is, the Amazon S3 bucket, MediaPackage channel, or HTTP server from which CloudFront
        gets the files to distribute. You can specify any combination of up to 25 Amazon S3 buckets, channels, and/or
        HTTP servers as your origins.
      </li>
      <li>
        Your content origin—that is, the Amazon S3 bucket, MediaPackage channel, or HTTP server from which CloudFront
        gets the files to distribute. You can specify any combination of up to 25 Amazon S3 buckets, channels, and/or
        HTTP servers as your origins.
      </li>
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
        Geo-restrictions—whether you want CloudFront to prevent users in selected countries from accessing your content.
      </li>
      <li>Access logs—whether you want CloudFront to create access logs that show viewer activity.</li>
    </ul>
    <h3>
      Learn more <Icon name="external" />
    </h3>
    <ul>
      <li>
        <a
          href="https://docs.aws.amazon.com/en_pv/AmazonCloudFront/latest/DeveloperGuide/distribution-overview.html"
          rel="noopener noreferrer"
          target="_blank"
        >
          Overview of Distributions
        </a>
      </li>
    </ul>
  </>
);

export const shortContent = (
  <span>
    Content: You can configure CloudFront to return a specific object (the default root object) when a user requests the
    root URL for your web distribution instead of requesting an object in your distribution. Specifying a default root
    object lets you avoid exposing the contents of your distribution or returning an error.
  </span>
);

export const longHeader = <h2>Header: Lorem nesciunt praesentium voluptatem, molestias aliquid animi aspernatur!</h2>;

export const shortHeader = <h2>Header: Lorem nesciunt!</h2>;

export const longFooter = (
  <span>
    <SpaceBetween size="xs">
      <PromptInput
        value="Hey there, can you help me write some integration tests."
        disableSecondaryActionsPaddings={true}
        actionButtonAriaLabel={'Need Help?'}
        actionButtonIconName={'stop-circle'}
        maxRows={3}
        secondaryActions={
          <Box padding={{ left: 'xxs', top: 'xs' }}>
            <ButtonGroup
              ariaLabel="Additional chat input actions"
              items={[
                {
                  type: 'icon-button',
                  id: 'upload-files',
                  iconName: 'upload',
                  text: 'Upload files',
                },
                {
                  type: 'icon-button',
                  id: 'add-reference',
                  iconName: 'at-symbol',
                  text: 'Add reference or citation',
                },
              ]}
              variant="icon"
            />
          </Box>
        }
      />
      <Box fontSize="body-s" color="text-body-secondary">
        Use of this service is subject to the{' '}
        <Link external={true} variant="primary" href="https://aws.amazon.com/machine-learning/responsible-ai/policy/">
          AWS Responsible AI Policy
        </Link>
      </Box>
    </SpaceBetween>
  </span>
);

export const shortFooter = <span>Footer: Lorem nesciuntnatur!</span>;
