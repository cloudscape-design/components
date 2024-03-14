// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Table from '~components/table';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
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
import { allInstances } from './expandable-rows/expandable-rows-data';
import messages from '~components/i18n/messages/all.en';
import I18nProvider from '~components/i18n';
import { createColumns, createPreferences, filteringProperties } from './expandable-rows/expandable-rows-configs';
import { ariaLabels, getHeaderCounterText } from './expandable-rows/common';

type PageContext = React.Context<
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

export default () => {
  const settings = usePageSettings();
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    pageSize: 10,
    wrapLines: true,
    stickyColumns: { first: 0, last: 1 },
  });
  const [selectedCluster, setSelectedCluster] = useState<null | string>(null);
  const getScopedInstances = (selected: null | string) =>
    selected === null ? allInstances : allInstances.filter(i => i.path.includes(selected));

  const { items, collectionProps, paginationProps, propertyFilterProps, filteredItemsCount, actions } = useCollection(
    getScopedInstances(selectedCluster),
    {
      pagination: settings.usePagination ? { pageSize: 10 } : undefined,
      sorting: {},
      filtering: {},
      propertyFiltering: { filteringProperties },
      selection: { trackBy: 'name', keepSelection: settings.keepSelection },
      expandableRows: settings.groupResources
        ? {
            getId: item => item.name,
            getParentId: item => (item.name === selectedCluster ? null : item.parentName),
          }
        : undefined,
    }
  );

  // Decorate path options to only show the last node and not the full path.
  const filteringOptions = propertyFilterProps.filteringOptions.map(option =>
    option.propertyKey === 'path' ? { ...option, value: option.value.split(',')[0] } : option
  );

  const expandedInstances = collectionProps.expandableRows?.expandedItems ?? [];

  const columnDefinitions = createColumns({
    groupResources: settings.groupResources,
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
      <Box margin="m">
        <SpaceBetween size="m">
          <Box variant="h1">Expandable rows</Box>

          <PageSettings />

          <Table
            {...collectionProps}
            stickyColumns={preferences.stickyColumns}
            resizableColumns={settings.resizableColumns}
            stickyHeader={settings.stickyHeader}
            sortingDisabled={settings.sortingDisabled}
            selectionType={settings.selectionType}
            stripedRows={settings.stripedRows}
            columnDefinitions={columnDefinitions}
            items={items}
            ariaLabels={ariaLabels}
            wrapLines={preferences.wrapLines}
            pagination={settings.usePagination && <Pagination {...paginationProps} />}
            columnDisplay={preferences.contentDisplay}
            preferences={createPreferences({ preferences, setPreferences })}
            submitEdit={() => {}}
            header={
              <SpaceBetween size="m">
                <Header
                  counter={getHeaderCounterText(allInstances, collectionProps.selectedItems)}
                  actions={
                    <SpaceBetween size="s" direction="horizontal" alignItems="center">
                      <Toggle
                        checked={settings.groupResources}
                        onChange={event => settings.setUrlParams({ groupResources: event.detail.checked })}
                      >
                        Group resources
                      </Toggle>

                      <ButtonDropdown
                        variant="normal"
                        items={[
                          { id: 'expand-all', text: 'Expand all', disabled: !settings.groupResources },
                          { id: 'collapse-all', text: 'Collapse all', disabled: !settings.groupResources },
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
          />
        </SpaceBetween>
      </Box>
    </I18nProvider>
  );
};

function usePageSettings() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  return {
    resizableColumns: urlParams.resizableColumns ?? true,
    stickyHeader: urlParams.stickyHeader ?? true,
    sortingDisabled: urlParams.sortingDisabled ?? false,
    stripedRows: urlParams.stripedRows ?? false,
    selectionType: urlParams.selectionType ?? 'multi',
    keepSelection: urlParams.keepSelection ?? false,
    usePagination: urlParams.usePagination ?? false,
    groupResources: urlParams.groupResources ?? true,
    setUrlParams,
  };
}

function PageSettings() {
  const selectionTypeOptions = [{ value: 'none' }, { value: 'single' }, { value: 'multi' }];
  const settings = usePageSettings();
  return (
    <ExpandableSection variant="container" headerText="Page settings" headingTagOverride="h2" defaultExpanded={true}>
      <SpaceBetween direction="horizontal" size="m">
        <FormField label="Table flags">
          <Checkbox
            checked={settings.resizableColumns}
            onChange={event => settings.setUrlParams({ resizableColumns: event.detail.checked })}
          >
            Resizable columns
          </Checkbox>

          <Checkbox
            checked={settings.stickyHeader}
            onChange={event => {
              settings.setUrlParams({ stickyHeader: event.detail.checked });
              window.location.reload();
            }}
          >
            Sticky header
          </Checkbox>

          <Checkbox
            checked={settings.sortingDisabled}
            onChange={event => settings.setUrlParams({ sortingDisabled: event.detail.checked })}
          >
            Sorting disabled
          </Checkbox>

          <Checkbox
            checked={settings.stripedRows}
            onChange={event => settings.setUrlParams({ stripedRows: event.detail.checked })}
          >
            Striped rows
          </Checkbox>

          <Checkbox
            checked={settings.keepSelection}
            onChange={event => settings.setUrlParams({ keepSelection: event.detail.checked })}
          >
            Keep selection
          </Checkbox>

          <Checkbox
            checked={settings.usePagination}
            onChange={event => settings.setUrlParams({ usePagination: event.detail.checked })}
          >
            Use pagination
          </Checkbox>
        </FormField>

        <FormField label="Selection type">
          <Select
            selectedOption={
              selectionTypeOptions.find(option => option.value === settings.selectionType) ?? selectionTypeOptions[0]
            }
            options={selectionTypeOptions}
            onChange={event =>
              settings.setUrlParams({
                selectionType:
                  event.detail.selectedOption.value === 'single' || event.detail.selectedOption.value === 'multi'
                    ? event.detail.selectedOption.value
                    : undefined,
              })
            }
          />
        </FormField>
      </SpaceBetween>
    </ExpandableSection>
  );
}
