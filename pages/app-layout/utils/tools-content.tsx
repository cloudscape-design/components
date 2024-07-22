// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon from '~components/icon';

export const long = (
  <>
    <p>
      When you want to use CloudFront to distribute your content, you create a distribution and choose the configuration
      settings you want. For example:
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

export const small = (
  <p>
    You can configure CloudFront to return a specific object (the default root object) when a user requests the root URL
    for your web distribution instead of requesting an object in your distribution. Specifying a default root object
    lets you avoid exposing the contents of your distribution or returning an error.
  </p>
);
