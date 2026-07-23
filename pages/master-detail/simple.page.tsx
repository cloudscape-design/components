// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '~components/app-layout';
import Box from '~components/box';
import ContentLayout from '~components/content-layout';
import Header from '~components/header';
import MasterDetailLayout from '~components/internal/components/master-detail-layout';
import KeyValuePairs from '~components/key-value-pairs';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Table from '~components/table';

import ScreenshotArea from '../utils/screenshot-area';

interface Instance {
  id: string;
  name: string;
  type: string;
  state: 'running' | 'stopped' | 'pending';
  zone: string;
  publicDns: string;
}

const INSTANCES: ReadonlyArray<Instance> = [
  {
    id: 'i-01a2',
    name: 'web-server-1',
    type: 't3.medium',
    state: 'running',
    zone: 'us-east-1a',
    publicDns: 'ec2-1.compute.amazonaws.com',
  },
  {
    id: 'i-02b3',
    name: 'web-server-2',
    type: 't3.medium',
    state: 'running',
    zone: 'us-east-1b',
    publicDns: 'ec2-2.compute.amazonaws.com',
  },
  { id: 'i-03c4', name: 'batch-worker', type: 'c5.large', state: 'stopped', zone: 'us-east-1a', publicDns: '—' },
  {
    id: 'i-04d5',
    name: 'db-primary',
    type: 'r5.xlarge',
    state: 'running',
    zone: 'us-east-1c',
    publicDns: 'ec2-4.compute.amazonaws.com',
  },
  { id: 'i-05e6', name: 'db-replica', type: 'r5.xlarge', state: 'pending', zone: 'us-east-1c', publicDns: '—' },
];

const STATE_TYPE: Record<Instance['state'], 'success' | 'stopped' | 'in-progress'> = {
  running: 'success',
  stopped: 'stopped',
  pending: 'in-progress',
};

function InstanceDetail({ instance }: { instance: Instance }) {
  return (
    <SpaceBetween size="l">
      <Header variant="h2">{instance.name}</Header>
      <KeyValuePairs
        columns={2}
        items={[
          { label: 'Instance ID', value: instance.id },
          { label: 'Instance type', value: instance.type },
          {
            label: 'State',
            value: <StatusIndicator type={STATE_TYPE[instance.state]}>{instance.state}</StatusIndicator>,
          },
          { label: 'Availability zone', value: instance.zone },
          { label: 'Public DNS', value: instance.publicDns },
        ]}
      />
    </SpaceBetween>
  );
}

/**
 * Dev/demo page for the Master/Detail pattern (v0).
 *
 * Demonstrates a list/master pane (Table) alongside a detail pane driven by the
 * selected item, composed with the experimental `MasterDetailLayout` helper.
 * Selecting a row updates the detail pane; the helper collapses to a single
 * column on narrow container widths (resize the browser to observe).
 */
export default function MasterDetailSimplePage() {
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        contentType="table"
        toolsHide={true}
        navigationHide={true}
        ariaLabels={{ navigation: 'Navigation', notifications: 'Notifications', tools: 'Tools' }}
        content={
          <ContentLayout header={<Header variant="h1">Master/Detail pattern (WIP v0)</Header>}>
            <MasterDetailLayout
              hasSelection={selectedInstance !== null}
              onClearSelection={() => setSelectedInstance(null)}
              masterAriaLabel="Instances list"
              detailAriaLabel="Instance details"
              backLabel="Back to instances"
              master={
                <Table<Instance>
                  variant="container"
                  selectionType="single"
                  trackBy="id"
                  items={INSTANCES}
                  selectedItems={selectedInstance ? [selectedInstance] : []}
                  onSelectionChange={({ detail }) => setSelectedInstance(detail.selectedItems[0] ?? null)}
                  ariaLabels={{
                    selectionGroupLabel: 'Instance selection',
                    itemSelectionLabel: (_data, row) => row.name,
                    tableLabel: 'Instances',
                  }}
                  header={<Header counter={`(${INSTANCES.length})`}>Instances</Header>}
                  columnDefinitions={[
                    { id: 'name', header: 'Name', cell: item => item.name, isRowHeader: true },
                    { id: 'type', header: 'Type', cell: item => item.type },
                    {
                      id: 'state',
                      header: 'State',
                      cell: item => <StatusIndicator type={STATE_TYPE[item.state]}>{item.state}</StatusIndicator>,
                    },
                  ]}
                />
              }
              detail={selectedInstance && <InstanceDetail instance={selectedInstance} />}
              detailPlaceholder={
                <Box textAlign="center" color="text-body-secondary" padding={{ vertical: 'xxl' }}>
                  <b>No instance selected</b>
                  <Box variant="p" color="text-body-secondary">
                    Select an instance from the list to view its details.
                  </Box>
                </Box>
              }
            />
          </ContentLayout>
        }
      />
    </ScreenshotArea>
  );
}
