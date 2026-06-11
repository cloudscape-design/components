// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';
import Button from '@cloudscape-design/components/button';
import ButtonDropdown from '@cloudscape-design/components/button-dropdown';
import { CollectionPreferencesProps } from '@cloudscape-design/components/collection-preferences';
import LiveRegion from '@cloudscape-design/components/live-region';
import PropertyFilter from '@cloudscape-design/components/property-filter';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import { TableProps } from '@cloudscape-design/components/table';

import { getHeaderCounterText, getTextFilterCounterText } from '../../i18n-strings';
import allInstances, { Instance } from '../../resources/related-instances';
import { DemoTopNavigation, FullPageHeader, TableEmptyState, TableNoMatchState } from '../commons/common-components';
import { PageLayout } from './page-components';
import { createColumns, filteringProperties, tableAriaLabels, TablePreferences } from './table-configs';

import '../../styles/base.scss';
import '../../styles/base.scss';

const ROOT_FRAME_SIZE = 10;
const NESTED_FRAME_SIZE = 3;

const renderAriaLive: TableProps['renderAriaLive'] = ({
  firstIndex,
  lastIndex,
  totalItemsCount,
  visibleItemsCount,
}) => {
  return `Displaying clusters ${firstIndex} to ${lastIndex} of ${totalItemsCount}, ${visibleItemsCount} entities visible`;
};

function getFlatItems<T>(items: readonly T[], getItemChildren: (item: T) => T[]): T[] {
  const flatItems: T[] = [];
  function traverse(item: T) {
    flatItems.push(item);
    getItemChildren(item).forEach(traverse);
  }
  items.forEach(traverse);
  return flatItems;
}

export function App() {
  const [ariaLiveMessage, setAriaLiveMessage] = useState('');
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    wrapLines: false,
    stickyColumns: { first: 0, last: 1 },
  });

  const { items, collectionProps, propertyFilterProps, filteredItemsCount, actions } = useCollection(allInstances, {
    sorting: {},
    propertyFiltering: {
      filteringProperties,
      empty: <TableEmptyState resourceName="Instance" />,
      noMatch: (
        <TableNoMatchState onClearFilter={() => actions.setPropertyFiltering({ operation: 'and', tokens: [] })} />
      ),
    },
    selection: {},
    expandableRows: {
      getId: item => item.name,
      getParentId: item => item.parentName,
    },
  });

  const filteringOptions = propertyFilterProps.filteringOptions.map(option => {
    if (option.propertyKey === 'path') {
      return { ...option, value: option.value.split(',')[0] };
    }
    return option;
  });

  const isItemExpandable = collectionProps.expandableRows?.isItemExpandable ?? (() => false);
  const getItemChildren = collectionProps.expandableRows?.getItemChildren ?? (() => []);
  const allFilteredClusters = getFlatItems(items, getItemChildren).filter(isItemExpandable);
  const expandedItems = collectionProps.expandableRows?.expandedItems ?? [];
  const columnDefinitions = createColumns({
    getInstanceProps: instance => {
      const children = getItemChildren(instance).length;
      const clusterInstances = allFilteredClusters.filter(item => item.path.includes(instance.name));
      const isClusterFullyExpanded = clusterInstances.every(item => expandedItems.includes(item));
      const isClusterFullyCollapsed = clusterInstances.every(item => !expandedItems.includes(item));
      const instanceActions = [
        {
          id: 'expand-all',
          text: `Expand cluster`,
          hidden: !children,
          disabled: isClusterFullyExpanded,
          onClick: () => {
            actions.setExpandedItems([...expandedItems, ...clusterInstances]);
            setAriaLiveMessage(
              `Displaying all ${clusterInstances.length - 1} related instances for cluster ${instance.name}`
            );
          },
        },
        {
          id: 'collapse-all',
          text: `Collapse cluster`,
          hidden: !children,
          disabled: isClusterFullyCollapsed,
          onClick: () => {
            actions.setExpandedItems(expandedItems.filter(item => !clusterInstances.includes(item)));
            setAriaLiveMessage('');
          },
        },
      ];
      return { children, actions: instanceActions };
    },
  });

  const onExpandableItemToggle: TableProps.OnExpandableItemToggle<Instance> = event => {
    // Call collection-hooks-provided handler to update state.
    collectionProps.expandableRows?.onExpandableItemToggle(event);

    // Add custom logic on cluster expand.
    const cluster = event.detail.item;
    const clusterExpanded = event.detail.expanded;
    if (clusterExpanded) {
      setAriaLiveMessage(`Displaying ${getItemChildren(cluster).length} related instances for cluster ${cluster.name}`);
    } else {
      setAriaLiveMessage('');
    }
  };

  // Progressive loading setup
  const [pages, setPages] = useState<Record<string, number>>({ ROOT: 1 });
  const paginatedItems = items.slice(0, pages.ROOT * ROOT_FRAME_SIZE);

  const getItemChildrenWithPagination = (item: Instance): Instance[] => {
    const from = pages[item.name] ?? 1;
    return getItemChildren(item).slice(0, from * NESTED_FRAME_SIZE);
  };

  const getLoadingStatus = (item: null | Instance): TableProps.LoadingStatus => {
    const all = !item ? items : getItemChildren(item);
    const paginated = !item ? paginatedItems : getItemChildrenWithPagination(item);
    return paginated[paginated.length - 1] === all[all.length - 1] ? 'finished' : 'pending';
  };

  const expandableRows = collectionProps.expandableRows
    ? { ...collectionProps.expandableRows, onExpandableItemToggle, getItemChildren: getItemChildrenWithPagination }
    : undefined;

  return (
    <>
      <DemoTopNavigation />
      <PageLayout>
        {({ openTools }) => (
          <>
            <Table
              {...collectionProps}
              stickyColumns={preferences.stickyColumns}
              resizableColumns={true}
              stickyHeader={true}
              selectionType="single"
              columnDefinitions={columnDefinitions}
              items={paginatedItems}
              ariaLabels={tableAriaLabels}
              wrapLines={preferences.wrapLines}
              columnDisplay={preferences.contentDisplay}
              preferences={<TablePreferences preferences={preferences} setPreferences={setPreferences} />}
              submitEdit={() => {
                // Do nothing
              }}
              variant="full-page"
              renderAriaLive={renderAriaLive}
              header={
                <FullPageHeader
                  title="Instances"
                  selectedItemsCount={collectionProps.selectedItems?.length ?? 0}
                  counter={getHeaderCounterText(allInstances, collectionProps.selectedItems)}
                  actions={
                    <SpaceBetween size="xs" direction="horizontal">
                      <ButtonDropdown
                        disabled={collectionProps.selectedItems?.length === 0}
                        items={[
                          {
                            id: 'terminate',
                            text: 'Terminate DB instance',
                            disabled: true,
                            disabledReason: 'No permission granted',
                          },
                          {
                            id: 'create-replica',
                            text: 'Create DB instance replica',
                            disabled: true,
                            disabledReason: 'No permission granted',
                          },
                        ]}
                      >
                        Instance actions
                      </ButtonDropdown>
                      <Button>Restore from S3</Button>
                      <Button variant="primary">Launch DB instance</Button>
                    </SpaceBetween>
                  }
                  onInfoLinkClick={openTools}
                />
              }
              filter={
                <PropertyFilter
                  {...propertyFilterProps}
                  filteringOptions={filteringOptions}
                  countText={getTextFilterCounterText(filteredItemsCount ?? 0)}
                  filteringPlaceholder="Search databases"
                  enableTokenGroups={true}
                  expandToViewport={true}
                />
              }
              expandableRows={expandableRows}
              getLoadingStatus={getLoadingStatus}
              renderLoaderPending={({ item }) => (
                <Button
                  variant="inline-link"
                  iconName="add-plus"
                  onClick={() => {
                    const itemId = item?.name ?? 'ROOT';
                    setPages(prev => ({ ...prev, [itemId]: (prev[itemId] ?? 1) + 1 }));
                  }}
                  ariaLabel={item ? `Show more items for ${item.name}` : 'Show more items'}
                >
                  Show more items
                </Button>
              )}
            />

            <LiveRegion hidden={true}>{ariaLiveMessage}</LiveRegion>
          </>
        )}
      </PageLayout>
    </>
  );
}
