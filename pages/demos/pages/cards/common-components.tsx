// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import HelpPanel from '@cloudscape-design/components/help-panel';

import { resourcesBreadcrumbs } from '../../common/breadcrumbs';
import { ExternalLinkGroup } from '../commons';

export const Breadcrumbs = () => (
  <BreadcrumbGroup items={resourcesBreadcrumbs} expandAriaLabel="Show path" ariaLabel="Breadcrumbs" />
);

const toolsFooter = (
  <ExternalLinkGroup
    items={[
      {
        text: 'Working with distributions',
        href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-working-with.html',
      },
      {
        text: 'Values that CloudFront displays on the console',
        href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web-values-returned.html',
      },
    ]}
  />
);
export const ToolsContent = () => (
  <HelpPanel footer={toolsFooter} header={<h2>Distributions</h2>}>
    <p>
      View your current distributions and related information such as the associated domain names, delivery methods, SSL
      certificates, and more. To drill down even further into the details, choose the name of an individual
      distribution.
    </p>
  </HelpPanel>
);
