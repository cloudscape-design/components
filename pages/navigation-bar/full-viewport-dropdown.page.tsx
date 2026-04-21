// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, ButtonDropdownProps, Container, Header, SpaceBetween } from '~components';
import ButtonDropdown from '~components/button-dropdown';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';

const megaMenuItems: ButtonDropdownProps.Items = [
  {
    id: 'compute',
    text: 'Compute',
    items: [
      { id: 'ec2', text: 'EC2 — Virtual Servers' },
      { id: 'lambda', text: 'Lambda — Serverless Functions' },
      { id: 'ecs', text: 'ECS — Container Service' },
      { id: 'fargate', text: 'Fargate — Serverless Containers' },
      { id: 'lightsail', text: 'Lightsail — Simple VPS' },
    ],
  },
  {
    id: 'storage',
    text: 'Storage',
    items: [
      { id: 's3', text: 'S3 — Object Storage' },
      { id: 'ebs', text: 'EBS — Block Storage' },
      { id: 'efs', text: 'EFS — File Storage' },
      { id: 'glacier', text: 'Glacier — Archive Storage' },
    ],
  },
  {
    id: 'database',
    text: 'Database',
    items: [
      { id: 'rds', text: 'RDS — Relational Database' },
      { id: 'dynamodb', text: 'DynamoDB — NoSQL' },
      { id: 'elasticache', text: 'ElastiCache — In-Memory' },
      { id: 'redshift', text: 'Redshift — Data Warehouse' },
    ],
  },
  {
    id: 'networking',
    text: 'Networking',
    items: [
      { id: 'vpc', text: 'VPC — Virtual Network' },
      { id: 'cloudfront', text: 'CloudFront — CDN' },
      { id: 'route53', text: 'Route 53 — DNS' },
      { id: 'elb', text: 'ELB — Load Balancing' },
    ],
  },
];

export default function NavigationBarFullViewportDropdownPage() {
  const [expandToViewport, setExpandToViewport] = useState(true);

  return (
    <article>
      <h1>Navigation Bar — Full-Viewport Expanded Dropdowns</h1>
      <p>
        Tests dropdown behavior when <code>expandToViewport</code> is toggled. With it enabled, dropdowns escape
        overflow containers and render at the viewport level.
      </p>

      <SpaceBetween size="l">
        <Box>
          <label>
            <input type="checkbox" checked={expandToViewport} onChange={e => setExpandToViewport(e.target.checked)} />{' '}
            expandToViewport
          </label>
        </Box>

        <Box>
          <Header variant="h2">Dropdown with expandToViewport={String(expandToViewport)}</Header>
          <div style={{ overflow: 'hidden', border: '2px dashed #aab7b8', borderRadius: 8 }}>
            <NavigationBar
              ariaLabel="Viewport dropdown demo"
              content={
                <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                  <Link href="#" fontSize="heading-m" color="inverted">
                    Console
                  </Link>
                  <ButtonDropdown items={megaMenuItems} expandToViewport={expandToViewport}>
                    Services
                  </ButtonDropdown>
                </SpaceBetween>
              }
            />
            <div style={{ padding: 20, height: 100 }}>
              <p>
                This container has <code>overflow: hidden</code>. Without <code>expandToViewport</code>, dropdowns get
                clipped.
              </p>
            </div>
          </div>
        </Box>

        <Box>
          <Header variant="h2">Nested grouped dropdown (mega-menu style)</Header>
          <NavigationBar
            ariaLabel="Mega menu demo"
            content={
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Link href="#" fontSize="heading-m" color="inverted">
                  AWS
                </Link>
                <ButtonDropdown items={megaMenuItems} expandToViewport={true}>
                  All Services
                </ButtonDropdown>
              </SpaceBetween>
            }
          />
        </Box>

        <Box>
          <Header variant="h2">Dropdown at bottom of page (tests upward expansion)</Header>
          <div style={{ height: '60vh' }} />
          <NavigationBar
            variant="secondary"
            ariaLabel="Bottom bar with dropdown"
            content={<span>Status: Connected</span>}
          />
        </Box>

        <Container header={<Header>Below the bottom bar</Header>}>
          <p>Content below to ensure the page scrolls past the bottom bar.</p>
        </Container>
      </SpaceBetween>
    </article>
  );
}
