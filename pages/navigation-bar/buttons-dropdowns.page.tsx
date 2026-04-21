// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, ButtonDropdownProps, Header, SpaceBetween } from '~components';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';

const serviceItems: ButtonDropdownProps.Items = [
  { id: 'ec2', text: 'EC2' },
  { id: 's3', text: 'S3' },
  { id: 'lambda', text: 'Lambda' },
  { id: 'rds', text: 'RDS' },
  { id: 'cloudfront', text: 'CloudFront' },
  { id: 'dynamodb', text: 'DynamoDB' },
];

const regionItems: ButtonDropdownProps.Items = [
  { id: 'us-east-1', text: 'US East (N. Virginia)' },
  { id: 'us-west-2', text: 'US West (Oregon)' },
  { id: 'eu-west-1', text: 'EU (Ireland)' },
  { id: 'ap-southeast-1', text: 'Asia Pacific (Singapore)' },
];

export default function NavigationBarButtonsDropdownsPage() {
  return (
    <article>
      <h1>Navigation Bar — Buttons &amp; Dropdowns</h1>

      <SpaceBetween size="l">
        <Box>
          <Header variant="h2">Icon buttons via ButtonGroup</Header>
          <NavigationBar
            ariaLabel="Icon buttons demo"
            content={
              <Link href="#" fontSize="heading-m" color="inverted">
                Service
              </Link>
            }
          />
        </Box>

        <Box>
          <Header variant="h2">Menu dropdowns via ButtonGroup</Header>
          <NavigationBar
            ariaLabel="Menu dropdowns demo"
            content={
              <Link href="#" fontSize="heading-m" color="inverted">
                Console
              </Link>
            }
          />
        </Box>

        <Box>
          <Header variant="h2">Standalone ButtonDropdown components</Header>
          <NavigationBar
            ariaLabel="Standalone dropdowns demo"
            content={
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Link href="#" fontSize="heading-m" color="inverted">
                  App
                </Link>
                <ButtonDropdown items={serviceItems} variant="primary">
                  Services
                </ButtonDropdown>
                <ButtonDropdown items={regionItems} variant="normal">
                  Region
                </ButtonDropdown>
              </SpaceBetween>
            }
          />
        </Box>

        <Box>
          <Header variant="h2">Mixed: buttons + dropdowns on secondary bar</Header>
          <NavigationBar
            variant="secondary"
            ariaLabel="Mixed toolbar"
            content={
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Button iconName="menu" variant="icon" ariaLabel="Toggle navigation" />
                <Button variant="link">Dashboard</Button>
                <Button variant="link">Reports</Button>
                <ButtonDropdown items={serviceItems}>More</ButtonDropdown>
              </SpaceBetween>
            }
          />
        </Box>

        <Box>
          <Header variant="h2">Dense icon bar (many utilities)</Header>
          <NavigationBar
            ariaLabel="Dense icon bar"
            content={
              <Link href="#" fontSize="heading-m" color="inverted">
                Editor
              </Link>
            }
          />
        </Box>
      </SpaceBetween>
    </article>
  );
}
