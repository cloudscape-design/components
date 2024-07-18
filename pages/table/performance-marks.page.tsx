// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Header, Link, Modal, SpaceBetween, Table, Tabs } from '~components';
import Box from '~components/box';

export default function TablePerformanceMarkPage() {
  const [loading, setLoading] = useState(true);
  return (
    <Box padding="xxl">
      <h1>Performance marks in table</h1>
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

        <Modal visible={false}>
          <Table items={[]} columnDefinitions={[]} header="A table inside a Modal" />
        </Modal>

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
