// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { AppLayout, BreadcrumbGroup, Header, Link, Table } from '~components';

import { withFunnelTestingApi } from './components/funnel-testing-page';

function Content() {
  return (
    <>
      <Table
        items={[]}
        columnDefinitions={[]}
        header={
          <Header info={<Link variant="info">Info</Link>} counter="(10)">
            Table title
          </Header>
        }
      />
    </>
  );
}

function App() {
  return (
    <AppLayout
      contentType="table"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'System', href: '#' },
            { text: 'Components', href: '#components' },
            { text: 'Create component', href: '#components/create' },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      content={<Content />}
    />
  );
}

export default withFunnelTestingApi(App);
