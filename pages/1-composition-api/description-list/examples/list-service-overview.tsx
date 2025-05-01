// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ColumnLayout, Container, Grid, Header, Link, StatusIndicator } from '~components';
import DescriptionList from '~components/key-value-pairs/composition';

export default function ListServiceOverview() {
  return (
    <Grid gridDefinition={[{ colspan: { l: 8, m: 8, default: 12 } }, { colspan: { l: 4, m: 4, default: 12 } }]}>
      <Container
        header={
          <Header description="Viewing data from N. Virginia region" variant="h2">
            Service Overview
          </Header>
        }
      >
        <ColumnLayout columns={4} variant="text-grid">
          <DescriptionList.List>
            <DescriptionList.ListItem>
              <DescriptionList.Term>Running instances</DescriptionList.Term>
              <DescriptionList.Details>
                <Link href="#" variant="awsui-value-large">
                  14
                </Link>
              </DescriptionList.Details>
            </DescriptionList.ListItem>
          </DescriptionList.List>

          <DescriptionList.List>
            <DescriptionList.ListItem>
              <DescriptionList.Term>Volumes</DescriptionList.Term>
              <DescriptionList.Details>
                <Link href="#" variant="awsui-value-large">
                  126
                </Link>
              </DescriptionList.Details>
            </DescriptionList.ListItem>
          </DescriptionList.List>

          <DescriptionList.List>
            <DescriptionList.ListItem>
              <DescriptionList.Term>Security Groups</DescriptionList.Term>
              <DescriptionList.Details>
                <Link href="#" variant="awsui-value-large">
                  116
                </Link>
              </DescriptionList.Details>
            </DescriptionList.ListItem>
          </DescriptionList.List>

          <DescriptionList.List>
            <DescriptionList.ListItem>
              <DescriptionList.Term>Load balancers</DescriptionList.Term>
              <DescriptionList.Details>
                <Link href="#" variant="awsui-value-large">
                  28
                </Link>
              </DescriptionList.Details>
            </DescriptionList.ListItem>
          </DescriptionList.List>
        </ColumnLayout>
      </Container>

      <Container
        header={
          <Header description="Viewing data from N. Virginia region" variant="h2">
            Service health - new
          </Header>
        }
      >
        <DescriptionList.List direction="auto">
          <DescriptionList.ListItem>
            <DescriptionList.Term>Region</DescriptionList.Term>
            <DescriptionList.Details>US East (N. Virginia)</DescriptionList.Details>
          </DescriptionList.ListItem>

          <DescriptionList.ListItem>
            <DescriptionList.Term>Status</DescriptionList.Term>
            <DescriptionList.Details>
              <StatusIndicator>Service is operating normally</StatusIndicator>
            </DescriptionList.Details>
          </DescriptionList.ListItem>
        </DescriptionList.List>
      </Container>
    </Grid>
  );
}
