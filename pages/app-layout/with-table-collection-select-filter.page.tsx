// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Button from '~components/button';
import CollectionPreferences from '~components/collection-preferences';
import Header from '~components/header';
import Input from '~components/input';
import Link from '~components/link';
import Pagination from '~components/pagination';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';
import Table from '~components/table';

import { columnDefinitions, filteringProperties } from '../property-filter/common-props';
import { allItems, states, TableItem } from '../property-filter/table.data';
import { pageSizeOptions } from '../table/shared-configs';
import { Breadcrumbs, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

import styles from './with-table-collection-select-filter.scss';

const instanceTypes = new Set(allItems.map(item => item.instancetype));
const instanceOptions = Array.from(instanceTypes).map(type => {
  return { label: type, value: type };
});
const stateOptions = Object.entries(states).map(([key, value]) => {
  return { label: value, value: key };
});

export const PAGE_SIZE_OPTIONS = [
  { value: 10, label: '10 Items' },
  { value: 30, label: '30 Items' },
  { value: 50, label: '50 Items' },
];

export default function () {
  const [toolsOpen, setToolsOpen] = useState(false);

  const { items, actions, paginationProps, propertyFilterProps } = useCollection(allItems, {
    propertyFiltering: {
      empty: 'empty',
      noMatch: (
        <Box textAlign="center" color="inherit">
          <Box variant="strong" textAlign="center" color="inherit">
            No matches
          </Box>
          <Box variant="p" padding={{ bottom: 's' }} color="inherit">
            We can’t find a match.
          </Box>
          <Button
            onClick={() => actions.setPropertyFiltering({ tokens: [], operation: propertyFilterProps.query.operation })}
          >
            Clear filter
          </Button>
        </Box>
      ),
      filteringProperties,
      defaultQuery: { tokens: [{ propertyKey: 'averagelatency', operator: '!=', value: '30' }], operation: 'and' },
    },
    sorting: {},
  });

  return (
    <AppLayout
      ariaLabels={labels}
      breadcrumbs={<Breadcrumbs />}
      navigation={<Navigation />}
      contentType="table"
      tools={<Tools>{toolsContent.small}</Tools>}
      toolsOpen={toolsOpen}
      onToolsChange={({ detail }) => setToolsOpen(detail.open)}
      content={
        <Table<TableItem>
          stickyHeader={true}
          header={
            <Header
              variant="awsui-h1-sticky"
              info={<Link variant="info"> Info </Link>}
              actions={
                <SpaceBetween size="xs" direction="horizontal">
                  <Button data-testid="header-btn-view-details">View details</Button>
                  <Button data-testid="header-btn-edit" disabled={true}>
                    Edit
                  </Button>
                  <Button data-testid="header-btn-delete" disabled={true}>
                    Delete
                  </Button>
                  <Button data-testid="header-btn-create" variant="primary">
                    Create instance
                  </Button>
                </SpaceBetween>
              }
            >
              Instances
            </Header>
          }
          items={items}
          variant="full-page"
          ariaLabels={{
            selectionGroupLabel: 'group label',
            allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
            itemSelectionLabel: ({ selectedItems }, item) =>
              `${item.instanceid} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
          }}
          filter={
            <div className={styles['input-container']}>
              <div className={styles['input-filter']}>
                <Input
                  data-testid="input-filter"
                  type="search"
                  value={''}
                  onChange={() => {}}
                  placeholder="Find instances"
                  clearAriaLabel="clear"
                />
              </div>
              <div className={styles['select-filter']}>
                <Select
                  data-testid="instance-type-filter"
                  inlineLabelText="Instance type"
                  options={instanceOptions}
                  selectedAriaLabel="Selected"
                  selectedOption={instanceOptions[0]}
                  onChange={() => {}}
                  expandToViewport={true}
                />
              </div>
              <div className={styles['select-filter']}>
                <Select
                  disabled={true}
                  data-testid="state-filter"
                  inlineLabelText="Filtrar secuencias de registros por nombre"
                  options={stateOptions}
                  selectedAriaLabel="Selected"
                  selectedOption={stateOptions[0]}
                  onChange={() => {}}
                  expandToViewport={true}
                />
              </div>
            </div>
          }
          columnDefinitions={columnDefinitions.slice(0, 7)}
          pagination={
            <Pagination
              {...paginationProps}
              ariaLabels={{
                nextPageLabel: 'Next page',
                paginationLabel: 'Table pagination',
                previousPageLabel: 'Previous page',
                pageLabel: pageNumber => `Page ${pageNumber}`,
              }}
            />
          }
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              pageSizePreference={{
                title: 'Select page size',
                options: pageSizeOptions,
              }}
              visibleContentPreference={{
                title: 'Select visible section',
                options: [
                  {
                    label: 'Instance properties',
                    options: [
                      { id: 'type', label: 'Type', editable: false },
                      { id: 'dnsName', label: 'DNS name' },
                    ],
                  },
                ],
              }}
            />
          }
        />
      }
    />
  );
}
