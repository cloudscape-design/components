// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Table } from '~components';
import Header from '~components/header';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';

import ScreenshotArea from '../utils/screenshot-area';

const tableItems = Array.from({ length: 20 }, (_, i) => ({ id: `${i}`, name: `Item ${i + 1}` }));

export default function NavigationBarIntegPage() {
  return (
    <article>
      <h1>NavigationBar Integ Page</h1>
      <ScreenshotArea gutters={false}>
        <NavigationBar
          data-testid="primary-bar"
          ariaLabel="Primary navigation"
          content={
            <Link href="#" fontSize="heading-m" color="inverted">
              App Name
            </Link>
          }
        />
        <NavigationBar
          data-testid="secondary-bar"
          variant="secondary"
          ariaLabel="Page toolbar"
          content={<span>Toolbar content</span>}
        />
      </ScreenshotArea>

      {/* Sticky stacking scenario: both bars sticky, table header should offset below both */}
      <div data-testid="sticky-scenario" style={{ height: 600, overflowY: 'auto' }}>
        <NavigationBar
          data-testid="sticky-primary"
          sticky={true}
          ariaLabel="Sticky primary"
          content={
            <Link href="#" fontSize="heading-m" color="inverted">
              App
            </Link>
          }
        />
        <NavigationBar
          data-testid="sticky-secondary"
          variant="secondary"
          sticky={true}
          ariaLabel="Sticky secondary"
          content={<span>Toolbar</span>}
        />
        <Table
          data-testid="sticky-table"
          stickyHeader={true}
          header={<Header>Resources</Header>}
          columnDefinitions={[{ id: 'name', header: 'Name', cell: item => item.name }]}
          items={tableItems}
          ariaLabels={{ tableLabel: 'Resources' }}
        />
      </div>
    </article>
  );
}
