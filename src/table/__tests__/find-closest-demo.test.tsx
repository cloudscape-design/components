// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render, screen } from '@testing-library/react';

import Header from '../../../lib/components/header';
import Table from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';

test('finds table by header text', () => {
  render(
    <div>
      <Table
        items={[{ id: 'A' }]}
        columnDefinitions={[{ id: 'id', header: 'ID', cell: item => item.id }]}
        header={<Header>Table One</Header>}
      />
      <Table
        items={[{ id: 'A' }, { id: 'B' }]}
        columnDefinitions={[{ id: 'id', header: 'ID', cell: item => item.id }]}
        header={<Header>Table Two</Header>}
      />
    </div>
  );

  const table1 = createWrapper(screen.getByText('Table One')).findTable(undefined, { closest: true })!;
  const table2 = createWrapper(screen.getByText('Table Two')).findTable(undefined, { closest: true })!;

  expect(table1.findRows()).toHaveLength(1);
  expect(table2.findRows()).toHaveLength(2);
});
