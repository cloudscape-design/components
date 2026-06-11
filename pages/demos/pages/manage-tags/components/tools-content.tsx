// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import HelpPanel from '@cloudscape-design/components/help-panel';

import { ExternalLinkGroup } from '../../commons';

/* eslint-disable react/jsx-key */
export default [
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
  <HelpPanel
    header={<h2>Tag restrictions</h2>}
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
    <p>The following basic restrictions apply to tags:</p>
    <ul>
      <li>Maximum number of tags per resource – 50</li>
      <li>Maximum key length – 128 Unicode characters</li>
      <li>Maximum value length – 256 Unicode characters</li>
      <li>Valid values for key and value – a-z, A-Z, 0-9, space, and the following characters: _ . : / = + - and @</li>
      <li>Tag keys and values are case sensitive</li>
      <li>
        Don't use <code>aws:</code> as a prefix for keys; it's reserved for AWS use
      </li>
    </ul>
  </HelpPanel>,
];
/* eslint-enable react/jsx-key */
