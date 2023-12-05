// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Box from '~components/box';
import { Header, Link, SpaceBetween, Table, Tabs } from '~components';

export default function ButtonsScenario() {
  const [loading, setLoading] = useState(true);
  return (
    <Box padding="xxl">
      <SpaceBetween size="xxl">
        <label>
          <input type="checkbox" checked={loading} onChange={e => setLoading(e.target.checked)} id="loading" />
          Loading
        </label>

        <Table
          items={[]}
          loading={loading}
          columnDefinitions={[]}
          header={<Header info={<Link variant="info">Info</Link>}>This is my table</Header>}
        />

        <Table items={[]} columnDefinitions={[]} header="A table without the Header component" />

        <Tabs
          tabs={[
            {
              label: 'An empty tab',
              id: 'first',
              content: "There is nothing in this tab, but there's a table in the other tab.",
            },
            {
              label: 'A tab with a table',
              id: 'second',
              content: (
                <Table
                  items={[]}
                  loading={loading}
                  columnDefinitions={[]}
                  header={<Header info={<Link variant="info">Info</Link>}>This is the table in the tab.</Header>}
                />
              ),
            },
          ]}
        />
      </SpaceBetween>
    </Box>
  );
}
