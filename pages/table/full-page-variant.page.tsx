// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Header from '~components/header';
import Table from '~components/table';
import { Instance, generateItems } from './generate-data';
import { columnsConfig } from './shared-configs';

const items = generateItems(20);

export default function App() {
  return (
    <Table<Instance>
      header={<Header variant="awsui-h1-sticky">Full-page table</Header>}
      stickyHeader={true}
      variant="full-page"
      columnDefinitions={columnsConfig}
      items={items}
    />
  );
}
