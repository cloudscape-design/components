// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

import './css-style-api.css';

export default function Page() {
  return (
    <SimplePage title="CSS Style API — Header">
      <SpaceBetween size="xl">
        <div>
          <h2>Default</h2>
          <Header
            variant="h1"
            counter="(42)"
            info={<Link variant="info">Info</Link>}
            actions={<Button variant="primary">Create instance</Button>}
            description="Manage your EC2 instances."
          >
            Instances
          </Header>
        </div>

        <div>
          <h2>Custom styled</h2>
          <Header
            variant="h1"
            counter="(42)"
            className="custom-header"
            info={<Link variant="info">Info</Link>}
            actions={<Button variant="primary">Create instance</Button>}
            description="Manage your EC2 instances."
          >
            Instances
          </Header>
        </div>

        <div>
          <h2>h2 variant</h2>
          <Header variant="h2" counter="(7)" className="custom-header">
            Snapshots
          </Header>
        </div>

        <div>
          <h2>h3 variant</h2>
          <Header variant="h3" counter="(3)" className="custom-header">
            Tags
          </Header>
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
