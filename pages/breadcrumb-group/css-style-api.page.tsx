// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import BreadcrumbGroup from '~components/breadcrumb-group';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

import './css-style-api.css';

const items = [
  { text: 'Home', href: '#' },
  { text: 'Instances', href: '#' },
  { text: 'i-1234567890abcdef0', href: '#' },
];

export default function Page() {
  return (
    <SimplePage title="CSS Style API — BreadcrumbGroup">
      <SpaceBetween size="l">
        <div>
          <p>Default</p>
          <BreadcrumbGroup items={items} />
        </div>
        <div>
          <p>Custom styled</p>
          <BreadcrumbGroup className="custom-breadcrumbs" items={items} />
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
