// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import Box from '~components/box';
import FormField from '~components/form-field';
import Table from '~components/table';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Pagination from '~components/pagination';
import Input from '~components/input';
import Header from '~components/header';
import Button from '~components/button';
import Select from '~components/select';
import PropertyFilter, { PropertyFilterProps } from '~components/property-filter';
import { Navigation, Tools, Breadcrumbs } from './utils/content-blocks';
import * as toolsContent from './utils/tools-content';
import labels from './utils/labels';
import { allItems, states, TableItem } from '../property-filter/table.data';
import { columnDefinitions, filteringProperties } from '../property-filter/common-props';
import { useCollection } from '@cloudscape-design/collection-hooks';
import styles from './with-table-collection-select-filter.scss';
import CollectionPreferences from '~components/collection-preferences';
import { pageSizeOptions } from '../table/shared-configs';
import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import { Checkbox } from '~components';

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
  const [usePropertyFilter, setUsePropertyFilter] = useState(true);
  const [customControl, setCustomControl] = useState(true);
  const [customAction, setCustomAction] = useState(true);
  const [query, setQuery] = useState<PropertyFilterProps.Query>({ operation: 'and', tokens: [] });

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
    <I18nProvider messages={[messages]} locale="en">
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
                    <Checkbox checked={usePropertyFilter} onChange={e => setUsePropertyFilter(e.detail.checked)}>
                      Use property filter
                    </Checkbox>
                    <Checkbox checked={customControl} onChange={e => setCustomControl(e.detail.checked)}>
                      Custom control slot
                    </Checkbox>
                    <Checkbox checked={customAction} onChange={e => setCustomAction(e.detail.checked)}>
                      Custom action
                    </Checkbox>
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
                  {usePropertyFilter ? (
                    <PropertyFilter
                      data-testid="input-filter"
                      filteringPlaceholder="Find instances"
                      query={query}
                      onChange={e => {
                        setQuery(e.detail);
                      }}
                      filteringProperties={filteringProperties}
                      customControl={customControl && <Button>Filter action</Button>}
                      additionalActions={customAction && <Button>Filter action</Button>}
                    />
                  ) : (
                    <Input
                      data-testid="input-filter"
                      type="search"
                      value={''}
                      onChange={() => {}}
                      placeholder="Find instances"
                      clearAriaLabel="clear"
                    />
                  )}
                </div>
                <div className="select-filter">
                  <FormField label={'Filter instance type'}>
                    <Select
                      data-testid="instance-type-filter"
                      options={instanceOptions}
                      selectedAriaLabel="Selected"
                      selectedOption={instanceOptions[0]}
                      onChange={() => {}}
                      expandToViewport={true}
                    />
                  </FormField>
                </div>
                <div className="select-filter">
                  <FormField label={'Filter status'}>
                    <Select
                      data-testid="state-filter"
                      options={stateOptions}
                      selectedAriaLabel="Selected"
                      selectedOption={stateOptions[0]}
                      onChange={() => {}}
                      expandToViewport={true}
                    />
                  </FormField>
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
    </I18nProvider>
  );
}
