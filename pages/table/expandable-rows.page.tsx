// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Table, { TableProps } from '~components/table';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import { getMatchesCountText } from './shared-configs';
import { useCollection } from '@cloudscape-design/collection-hooks';
import {
  Alert,
  Box,
  Button,
  ButtonDropdown,
  Checkbox,
  CollectionPreferencesProps,
  ExpandableSection,
  FormField,
  Pagination,
  PropertyFilter,
  Select,
  Toggle,
} from '~components';
import AppContext, { AppContextType } from '../app/app-context';
import { allInstances, Instance } from './expandable-rows/expandable-rows-data';
import messages from '~components/i18n/messages/all.en';
import I18nProvider from '~components/i18n';
import { createColumns, createPreferences, filteringProperties } from './expandable-rows/expandable-rows-configs';

type DemoContext = React.Context<
  AppContextType<{
    resizableColumns: boolean;
    stickyHeader: boolean;
    sortingDisabled: boolean;
    stripedRows: boolean;
    selectionType: undefined | 'single' | 'multi';
    groupResources: boolean;
    keepSelection: boolean;
    usePagination: boolean;
  }>
>;

function getHeaderCounterText<T>(items: ReadonlyArray<T>, selectedItems: ReadonlyArray<T> | undefined) {
  return selectedItems && selectedItems?.length > 0 ? `(${selectedItems.length}/${items.length})` : `(${items.length})`;
}

const ariaLabels: TableProps<Instance>['ariaLabels'] = {
  selectionGroupLabel: 'group label',
  activateEditLabel: column => `Edit ${column.header}`,
  cancelEditLabel: column => `Cancel editing ${column.header}`,
  submitEditLabel: column => `Submit edit ${column.header}`,
  allItemsSelectionLabel: ({ selectedItems }) =>
    `${selectedItems.length} ${selectedItems.length === 1 ? 'item' : 'items'} selected`,
  itemSelectionLabel: ({ selectedItems }, item) => {
    const isItemSelected = selectedItems.filter(i => i.name === item.name).length;
    return `${item.name} is ${isItemSelected ? '' : 'not'} selected`;
  },
  tableLabel: 'Databases table',
  expandButtonLabel: () => 'expand row',
  collapseButtonLabel: () => 'collapse row',
};

const selectionTypeOptions = [{ value: 'none' }, { value: 'single' }, { value: 'multi' }];

export default () => {
  const {
    urlParams: {
      resizableColumns = true,
      stickyHeader = true,
      sortingDisabled,
      stripedRows,
      selectionType = 'multi',
      groupResources = true,
      keepSelection,
      usePagination = false,
    },
    setUrlParams,
  } = useContext(AppContext as DemoContext);

  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    pageSize: 10,
    wrapLines: true,
    stickyColumns: { first: 0, last: 1 },
  });
  const [selectedCluster, setSelectedCluster] = useState<null | string>(null);
  const getScopedInstances = (selected: null | string) => {
    return selected === null ? allInstances : allInstances.filter(i => i.path.includes(selected));
  };

  const { items, collectionProps, paginationProps, propertyFilterProps, filteredItemsCount, actions } = useCollection(
    getScopedInstances(selectedCluster),
    {
      pagination: usePagination ? { pageSize: 10 } : undefined,
      sorting: {},
      filtering: {},
      propertyFiltering: { filteringProperties },
      selection: { trackBy: 'name', keepSelection },
      expandableRows: groupResources
        ? {
            getId: item => item.name,
            getParentId: item => (item.name === selectedCluster ? null : item.parentName),
          }
        : undefined,
    }
  );
  const filteringOptions = propertyFilterProps.filteringOptions.map(option =>
    option.propertyKey === 'path' ? { ...option, value: option.value.split(',')[0] } : option
  );

  const expandedInstances = collectionProps.expandableRows?.expandedItems ?? [];

  const columnDefinitions = createColumns({
    groupResources,
    getInstanceProps: instance => {
      const children = collectionProps.expandableRows?.getItemChildren(instance).length ?? 0;
      const scopedInstances = getScopedInstances(instance.name);
      const instanceActions = [
        {
          id: 'drill-down',
          text: `Show ${instance.name} cluster only`,
          hidden: !children,
          onClick: () => {
            actions.setExpandedItems(scopedInstances);
            setSelectedCluster(instance.name);
          },
        },
        {
          id: 'expand-all',
          text: `Expand cluster`,
          hidden: !children,
          onClick: () => {
            actions.setExpandedItems([...expandedInstances, ...scopedInstances]);
          },
        },
        {
          id: 'collapse-all',
          text: `Collapse cluster`,
          hidden: !children,
          onClick: () => {
            actions.setExpandedItems(expandedInstances.filter(i => !scopedInstances.includes(i)));
          },
        },
      ];
      return { children, actions: instanceActions };
    },
  });

  return (
    <I18nProvider messages={[messages]} locale="en">
      <Box>
        <Box variant="h1" margin="m">
          Expandable rows
        </Box>
        <div>
          <Box margin={{ horizontal: 'm' }}>
            <ExpandableSection
              variant="container"
              headerText="Page settings"
              headingTagOverride="h2"
              defaultExpanded={true}
            >
              <SpaceBetween direction="horizontal" size="m">
                <FormField label="Table flags">
                  <Checkbox
                    checked={resizableColumns}
                    onChange={event => setUrlParams({ resizableColumns: event.detail.checked })}
                  >
                    Resizable columns
                  </Checkbox>

                  <Checkbox
                    checked={stickyHeader}
                    onChange={event => {
                      setUrlParams({ stickyHeader: event.detail.checked });
                      window.location.reload();
                    }}
                  >
                    Sticky header
                  </Checkbox>

                  <Checkbox
                    checked={sortingDisabled}
                    onChange={event => setUrlParams({ sortingDisabled: event.detail.checked })}
                  >
                    Sorting disabled
                  </Checkbox>

                  <Checkbox
                    checked={stripedRows}
                    onChange={event => setUrlParams({ stripedRows: event.detail.checked })}
                  >
                    Striped rows
                  </Checkbox>

                  <Checkbox
                    checked={keepSelection}
                    onChange={event => setUrlParams({ keepSelection: event.detail.checked })}
                  >
                    Keep selection
                  </Checkbox>

                  <Checkbox
                    checked={usePagination}
                    onChange={event => setUrlParams({ usePagination: event.detail.checked })}
                  >
                    Use pagination
                  </Checkbox>
                </FormField>

                <FormField label="Selection type">
                  <Select
                    selectedOption={
                      selectionTypeOptions.find(option => option.value === selectionType) ?? selectionTypeOptions[0]
                    }
                    options={selectionTypeOptions}
                    onChange={event =>
                      setUrlParams({
                        selectionType:
                          event.detail.selectedOption.value === 'single' ||
                          event.detail.selectedOption.value === 'multi'
                            ? event.detail.selectedOption.value
                            : undefined,
                      })
                    }
                  />
                </FormField>
              </SpaceBetween>
            </ExpandableSection>
          </Box>

          <ScreenshotArea>
            <Table
              {...collectionProps}
              stickyColumns={preferences.stickyColumns}
              resizableColumns={resizableColumns}
              stickyHeader={stickyHeader}
              sortingDisabled={sortingDisabled}
              selectionType={selectionType}
              stripedRows={stripedRows}
              columnDefinitions={columnDefinitions}
              items={items}
              ariaLabels={ariaLabels}
              wrapLines={preferences.wrapLines}
              pagination={usePagination && <Pagination {...paginationProps} />}
              columnDisplay={preferences.contentDisplay}
              preferences={createPreferences({ preferences, setPreferences })}
              header={
                <SpaceBetween size="m">
                  <Header
                    counter={getHeaderCounterText(allInstances, collectionProps.selectedItems)}
                    actions={
                      <SpaceBetween size="s" direction="horizontal" alignItems="center">
                        <Toggle
                          checked={groupResources}
                          onChange={event => setUrlParams({ groupResources: event.detail.checked })}
                        >
                          Group resources
                        </Toggle>

                        <ButtonDropdown
                          variant="normal"
                          items={[
                            { id: 'expand-all', text: 'Expand all', disabled: !groupResources },
                            { id: 'collapse-all', text: 'Collapse all', disabled: !groupResources },
                            {
                              id: 'terminate-selected',
                              text: 'Terminate selected instances',
                              disabled: collectionProps.selectedItems?.length === 0,
                            },
                          ]}
                          onItemClick={event => {
                            switch (event.detail.id) {
                              case 'expand-all':
                                return actions.setExpandedItems(allInstances);
                              case 'collapse-all':
                                return actions.setExpandedItems([]);
                              case 'terminate-selected':
                                return actions.setSelectedItems([]);
                              default:
                                throw new Error('Invariant violation: unsupported action.');
                            }
                          }}
                        >
                          Actions
                        </ButtonDropdown>
                      </SpaceBetween>
                    }
                  >
                    Databases
                  </Header>
                  {selectedCluster && (
                    <Alert
                      type="info"
                      action={<Button onClick={() => setSelectedCluster(null)}>Show all databases</Button>}
                    >
                      Showing databases that belong to{' '}
                      <Box variant="span" fontWeight="bold">
                        {selectedCluster}
                      </Box>{' '}
                      cluster.
                    </Alert>
                  )}
                </SpaceBetween>
              }
              filter={
                <PropertyFilter
                  {...propertyFilterProps}
                  filteringOptions={filteringOptions}
                  countText={getMatchesCountText(filteredItemsCount ?? 0)}
                  filteringPlaceholder="Search databases"
                />
              }
              // TODO: set by default when expandableProps is set
              enableKeyboardNavigation={true}
            />
          </ScreenshotArea>
        </div>
      </Box>
    </I18nProvider>
  );
};
