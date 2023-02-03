// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import PropertyFilter from '~components/property-filter';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import Pagination from '~components/pagination';
import Table from '~components/table';
import Button from '~components/button';
import SpaceBetween from '~components/space-between';
import Box from '~components/box';
import Select, { SelectProps } from '~components/select';
import TextFilter from '~components/text-filter';
import Header from '~components/header';
import Input from '~components/input';
import ScreenshotArea from '../utils/screenshot-area';
import { allItems, TableItem } from '../property-filter/table.data';
import { columnDefinitions, i18nStrings, filteringProperties } from '../property-filter/common-props';
import { useCollection } from '@cloudscape-design/collection-hooks';
import { paginationLabels, getMatchesCountText, pageSizeOptions, visibleContentOptions } from './shared-configs';
import styles from './table.scss';

export default function () {
  const [selectedOption, setSelectedOption] = React.useState<SelectProps.Option | null>({
    label: 'Option 1',
    value: '1',
  });
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    pageSize: 5,
    visibleContent: ['id', 'type', 'dnsName', 'state'],
    wrapLines: false,
  });
  const { items, collectionProps, actions, propertyFilterProps, filterProps, filteredItemsCount, paginationProps } =
    useCollection(allItems, {
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
              onClick={() =>
                actions.setPropertyFiltering({ tokens: [], operation: propertyFilterProps.query.operation })
              }
            >
              Clear filter
            </Button>
          </Box>
        ),
        filteringProperties,
      },
      sorting: {},
      pagination: { pageSize: preferences.pageSize },
    });

  return (
    <>
      <ScreenshotArea disableAnimations={true}>
        <SpaceBetween size="l">
          {/* 
             EXAMPLE 1
            */}
          <Table<TableItem>
            footer={<div style={{ display: 'flex', justifyContent: 'center' }}>View all</div>}
            header={
              <Header
                headingTagOverride={'h1'}
                actions={
                  <SpaceBetween size="xs" direction="horizontal">
                    <Button>View details</Button>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                    <Button variant="primary">Create distribution</Button>
                  </SpaceBetween>
                }
              >
                Instances
              </Header>
            }
            items={items}
            {...collectionProps}
            filter={
              <PropertyFilter
                {...propertyFilterProps}
                virtualScroll={true}
                countText={`${items.length} matches`}
                i18nStrings={i18nStrings}
              />
            }
            pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
            preferences={
              <CollectionPreferences
                title="Preferences"
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                onConfirm={({ detail }) => setPreferences(detail)}
                preferences={preferences}
                pageSizePreference={{
                  title: 'Select page size',
                  options: pageSizeOptions,
                }}
                visibleContentPreference={{
                  title: 'Select visible columns',
                  options: visibleContentOptions,
                }}
              />
            }
            columnDefinitions={columnDefinitions}
          />
          {/* 
             EXAMPLE 2
            */}
          <Table<TableItem>
            header={
              <Header
                headingTagOverride={'h1'}
                description="This is a very long description for a table header for us to test text wrapping and where other stuff
                  will go. This is a very long description for a table header for us to test text wrapping and where other stuff
                  will go. This is a very long description for a table header for us to test text wrapping and where other stuff
                  will go. This is a very long description for a table header for us to test text wrapping and where other stuff
                  will go."
                actions={
                  <SpaceBetween size="xs" direction="horizontal">
                    <Button>View details</Button>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                    <Button variant="primary">Create distribution</Button>
                  </SpaceBetween>
                }
              >
                Instances
              </Header>
            }
            items={items}
            {...collectionProps}
            filter={
              <PropertyFilter
                {...propertyFilterProps}
                virtualScroll={true}
                countText={`${items.length} matches`}
                i18nStrings={i18nStrings}
              />
            }
            pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
            preferences={
              <CollectionPreferences
                title="Preferences"
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                onConfirm={({ detail }) => setPreferences(detail)}
                preferences={preferences}
                pageSizePreference={{
                  title: 'Select page size',
                  options: pageSizeOptions,
                }}
                visibleContentPreference={{
                  title: 'Select visible columns',
                  options: visibleContentOptions,
                }}
              />
            }
            columnDefinitions={columnDefinitions}
          />
          {/* 
             EXAMPLE 3
            */}
          <Table<TableItem>
            header={
              <Header
                headingTagOverride={'h1'}
                description="This is a very long description for a table header for us to test text wrapping and where other stuff
                  will go."
                actions={
                  <SpaceBetween size="xs" direction="horizontal">
                    <Button>View details</Button>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                    <Button variant="primary">Create distribution</Button>
                  </SpaceBetween>
                }
              >
                Instances
              </Header>
            }
            items={items}
            {...collectionProps}
            filter={
              <PropertyFilter
                {...propertyFilterProps}
                virtualScroll={true}
                countText={`${items.length} matches`}
                i18nStrings={i18nStrings}
                hideOperations={false}
                disableFreeTextFiltering={false}
                customControl={
                  <Select
                    selectedOption={selectedOption}
                    onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
                    options={[
                      { label: 'Option 1', value: '1' },
                      { label: 'Option 2', value: '2' },
                      { label: 'Option 3', value: '3' },
                      { label: 'Option 4', value: '4' },
                      { label: 'Option 5', value: '5' },
                    ]}
                    selectedAriaLabel="Selected"
                  />
                }
              />
            }
            pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
            preferences={
              <CollectionPreferences
                title="Preferences"
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                onConfirm={({ detail }) => setPreferences(detail)}
                preferences={preferences}
                pageSizePreference={{
                  title: 'Select page size',
                  options: pageSizeOptions,
                }}
                visibleContentPreference={{
                  title: 'Select visible columns',
                  options: visibleContentOptions,
                }}
              />
            }
            columnDefinitions={columnDefinitions}
          />
          {/* 
             EXAMPLE 4
            */}
          <Table<TableItem>
            header={
              <Header
                headingTagOverride={'h1'}
                description="This is a very long description for a table header for us to test text wrapping and where other stuff
                  will go. This is a very long description for a table header for us to test text wrapping and where other stuff
                  will go."
                actions={
                  <SpaceBetween size="xs" direction="horizontal">
                    <Button>View details</Button>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                    <Button>View details</Button>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                    <Button variant="primary">Create distribution</Button>
                  </SpaceBetween>
                }
              >
                So Many Instances That I Decided I Needed A Very Long Title To Describe How Many
              </Header>
            }
            items={items}
            {...collectionProps}
            pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
            preferences={
              <CollectionPreferences
                title="Preferences"
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                onConfirm={({ detail }) => setPreferences(detail)}
                preferences={preferences}
                pageSizePreference={{
                  title: 'Select page size',
                  options: pageSizeOptions,
                }}
                visibleContentPreference={{
                  title: 'Select visible columns',
                  options: visibleContentOptions,
                }}
              />
            }
            columnDefinitions={columnDefinitions}
          />
          {/* 
             EXAMPLE 5
            */}
          <Table<TableItem>
            header={
              <Header
                headingTagOverride={'h1'}
                actions={
                  <SpaceBetween size="xs" direction="horizontal">
                    <Button>View details</Button>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                    <Button variant="primary">Create distribution</Button>
                  </SpaceBetween>
                }
              >
                Instances
              </Header>
            }
            items={items}
            {...collectionProps}
            filter={
              <PropertyFilter
                {...propertyFilterProps}
                virtualScroll={true}
                countText={`${items.length} matches`}
                i18nStrings={i18nStrings}
              />
            }
            columnDefinitions={columnDefinitions}
          />
          {/* 
             EXAMPLE 6 - text filter
            */}
          <Table<TableItem>
            header={
              <Header
                headingTagOverride={'h1'}
                actions={
                  <SpaceBetween size="xs" direction="horizontal">
                    <Button>View details</Button>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                    <Button variant="primary">Create distribution</Button>
                  </SpaceBetween>
                }
              >
                Instances
              </Header>
            }
            items={items}
            {...collectionProps}
            filter={
              <div className={styles.inputContainer}>
                <div className={styles.inputFilter}>
                  <TextFilter
                    {...filterProps!}
                    countText={getMatchesCountText(filteredItemsCount!)}
                    filteringAriaLabel="Filter instances"
                  />
                </div>
                <div className={styles.selectFilter}>
                  <Input value="" onChange={() => {}} />
                </div>
                <div className={styles.selectFilter}>
                  <Input value="" onChange={() => {}} />
                </div>
              </div>
            }
            pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
            columnDefinitions={columnDefinitions}
          />
          {/* 
             EXAMPLE 6B - property filter
            */}
          <Table<TableItem>
            header={
              <Header
                headingTagOverride={'h1'}
                actions={
                  <SpaceBetween size="xs" direction="horizontal">
                    <Button>View details</Button>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                    <Button variant="primary">Create distribution</Button>
                  </SpaceBetween>
                }
              >
                Instances
              </Header>
            }
            items={items}
            {...collectionProps}
            filter={
              <div className={styles.inputContainer}>
                <div className={styles.inputFilter}>
                  <PropertyFilter
                    {...propertyFilterProps}
                    virtualScroll={true}
                    countText={`${items.length} matches`}
                    i18nStrings={i18nStrings}
                  />
                </div>
                <div className={styles.selectFilter}>
                  <Input value="" onChange={() => {}} />
                </div>
                <div className={styles.selectFilter}>
                  <Input value="" onChange={() => {}} />
                </div>
              </div>
            }
            pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
            columnDefinitions={columnDefinitions}
          />
          {/* 
             EXAMPLE 7
            */}
          <Table<TableItem>
            header={<Header headingTagOverride={'h1'}>Instances</Header>}
            items={items}
            {...collectionProps}
            pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
            preferences={
              <CollectionPreferences
                title="Preferences"
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                onConfirm={({ detail }) => setPreferences(detail)}
                preferences={preferences}
                pageSizePreference={{
                  title: 'Select page size',
                  options: pageSizeOptions,
                }}
                visibleContentPreference={{
                  title: 'Select visible columns',
                  options: visibleContentOptions,
                }}
              />
            }
            columnDefinitions={columnDefinitions}
          />
          {/* 
             EXAMPLE 8
            */}
          <Table<TableItem>
            header={<Header headingTagOverride={'h1'}>Instances</Header>}
            items={items}
            {...collectionProps}
            columnDefinitions={columnDefinitions}
          />
          {/* 
             EXAMPLE 9
            */}
          <Table<TableItem>
            items={items}
            {...collectionProps}
            pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
            preferences={
              <CollectionPreferences
                title="Preferences"
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                onConfirm={({ detail }) => setPreferences(detail)}
                preferences={preferences}
                pageSizePreference={{
                  title: 'Select page size',
                  options: pageSizeOptions,
                }}
                visibleContentPreference={{
                  title: 'Select visible columns',
                  options: visibleContentOptions,
                }}
              />
            }
            columnDefinitions={columnDefinitions}
          />
          {/* 
             EXAMPLE 10
            */}
          <Table<TableItem>
            items={items}
            {...collectionProps}
            pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
            filter={
              <PropertyFilter
                {...propertyFilterProps}
                virtualScroll={true}
                countText={`${items.length} matches`}
                i18nStrings={i18nStrings}
              />
            }
            preferences={
              <CollectionPreferences
                title="Preferences"
                confirmLabel="Confirm"
                cancelLabel="Cancel"
                onConfirm={({ detail }) => setPreferences(detail)}
                preferences={preferences}
                pageSizePreference={{
                  title: 'Select page size',
                  options: pageSizeOptions,
                }}
                visibleContentPreference={{
                  title: 'Select visible columns',
                  options: visibleContentOptions,
                }}
              />
            }
            columnDefinitions={columnDefinitions}
          />
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
