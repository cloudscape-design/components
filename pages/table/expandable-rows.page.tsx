// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import Table, { TableProps } from '~components/table';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import { columnLabel, getMatchesCountText } from './shared-configs';
import { useCollection } from '@cloudscape-design/collection-hooks';
import {
  Alert,
  Box,
  Button,
  ButtonDropdown,
  Checkbox,
  FormField,
  Link,
  Popover,
  Select,
  StatusIndicator,
  TextFilter,
  Toggle,
} from '~components';
import AppContext, { AppContextType } from '../app/app-context';
import { allInstances, Instance, InstanceType } from './expandable-rows-data';

type DemoContext = React.Context<
  AppContextType<{
    resizableColumns: boolean;
    stickyHeader: boolean;
    sortingDisabled: boolean;
    stripedRows: boolean;
    selectionType: undefined | 'single' | 'multi';
    stickyColumnsFirst: string;
    groupResources: boolean;
  }>
>;

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
};

const selectionTypeOptions = [{ value: 'none' }, { value: 'single' }, { value: 'multi' }];

const stickyColumnsOptions = [{ value: '0' }, { value: '1' }, { value: '2' }, { value: '3' }];

export default () => {
  const {
    urlParams: {
      resizableColumns,
      stickyHeader,
      sortingDisabled,
      stripedRows,
      selectionType,
      stickyColumnsFirst,
      groupResources = true,
    },
    setUrlParams,
  } = useContext(AppContext as DemoContext);

  const [selectedCluster, setSelectedCluster] = useState<null | string>(null);
  const getScopedInstances = (selected: null | string) => {
    return selected === null
      ? allInstances
      : allInstances.filter(i => i.name === selected || i.parents.includes(selected));
  };
  const scopedInstances = getScopedInstances(selectedCluster);

  const { items, collectionProps, filterProps, filteredItemsCount, actions } = useCollection(
    getScopedInstances(selectedCluster),
    {
      pagination: { pageSize: 999 },
      sorting: {},
      filtering: {},
      selection: { trackBy: 'name' },
      expandableRows: groupResources
        ? {
            getId: item => item.name,
            getParentId: item => item.parentName,
          }
        : undefined,
    }
  );

  const expandedInstances = scopedInstances.filter(i => collectionProps.getItemExpanded?.(i));

  const columnDefinitions: TableProps.ColumnDefinition<Instance>[] = [
    {
      id: 'name',
      header: 'DB Name',
      cell: item => <Link href={`#${item.name}`}>{item.name}</Link>,
      ariaLabel: columnLabel('DB Name'),
      sortingField: 'name',
    },
    {
      id: 'role',
      header: 'Role',
      cell: item => (
        <InstanceTypeWrapper instanceType={item.type}>
          {item.type === 'instance'
            ? item.role
            : `${item.role} (${collectionProps.getItemChildren?.(item).length ?? 0})`}
        </InstanceTypeWrapper>
      ),
      ariaLabel: columnLabel('Role'),
      sortingField: 'role',
    },
    {
      id: 'activity',
      header: 'Activity',
      cell: item => (
        <Box fontSize="body-s" color="text-body-secondary">
          {item.selectsPerSecond !== null ? `${item.selectsPerSecond} Selects/Sec` : '-'}
        </Box>
      ),
      ariaLabel: columnLabel('Activity'),
      sortingField: 'selectsPerSecond',
    },
    {
      id: 'state',
      header: 'State',
      cell: item => {
        const selfState = (() => {
          switch (item.state) {
            case 'RUNNING':
              return <StatusIndicator type="success">Running</StatusIndicator>;
            case 'STOPPED':
              return <StatusIndicator type="stopped">Stopped</StatusIndicator>;
            case 'TERMINATED':
              return <StatusIndicator type="error">Terminated</StatusIndicator>;
          }
        })();
        if (item.type === 'instance') {
          return selfState;
        }
        return (
          <Popover
            dismissButton={false}
            position="top"
            size="small"
            content={
              <SpaceBetween size="s" direction="horizontal">
                <StatusIndicator type="success">{item.stateGrouped.RUNNING}</StatusIndicator>
                <StatusIndicator type="stopped">{item.stateGrouped.STOPPED}</StatusIndicator>
                <StatusIndicator type="error">{item.stateGrouped.TERMINATED}</StatusIndicator>
              </SpaceBetween>
            }
          >
            {selfState}
          </Popover>
        );
      },
      ariaLabel: columnLabel('State'),
      sortingField: 'state',
    },
    {
      id: 'engine',
      header: 'Engine',
      cell: item => item.engine,
      ariaLabel: columnLabel('Engine'),
      sortingField: 'engine',
    },
    {
      id: 'size',
      header: 'Size',
      cell: item => <InstanceTypeWrapper instanceType={item.type}>{item.sizeGrouped || '-'}</InstanceTypeWrapper>,
      ariaLabel: columnLabel('Size'),
      sortingField: 'sizeGrouped',
    },
    {
      id: 'region',
      header: 'Region & AZ',
      cell: item => <InstanceTypeWrapper instanceType={item.type}>{item.regionGrouped}</InstanceTypeWrapper>,
      ariaLabel: columnLabel('Region & AZ'),
      sortingField: 'regionGrouped',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: item => {
        if (item.children === 0) {
          return (
            <ButtonDropdown
              variant="inline-icon"
              ariaLabel={`Instance ${item.name} actions`}
              disabled={true}
              items={[]}
            />
          );
        }
        const scopedInstances = getScopedInstances(item.name);
        return (
          <ButtonDropdown
            expandToViewport={true}
            items={[
              { id: 'drill-down', text: `Show ${item.name} cluster only` },
              { id: 'expand-all', text: `Expand cluster` },
              { id: 'collapse-all', text: `Collapse cluster` },
            ]}
            variant="inline-icon"
            ariaLabel={`Instance ${item.name} actions`}
            onItemClick={event => {
              switch (event.detail.id) {
                case 'drill-down':
                  actions.setExpandedItems(scopedInstances);
                  setSelectedCluster(item.name);
                  break;
                case 'expand-all':
                  actions.setExpandedItems([...expandedInstances, ...scopedInstances]);
                  break;
                case 'collapse-all':
                  actions.setExpandedItems(expandedInstances.filter(i => !scopedInstances.includes(i)));
                  break;
                default:
                  throw new Error('Invariant violation: unexpected action.');
              }
            }}
          />
        );
      },
    },
    // {
    //   id: 'inline-edit',
    //   header: 'Editable cell',
    //   cell: item => item.alt || '-',
    //   editConfig: {
    //     ariaLabel: 'Edit first',
    //     editIconAriaLabel: 'editable',
    //     errorIconAriaLabel: 'Edit cell error',
    //     editingCell: (item, { currentValue, setValue }) => {
    //       return (
    //         <Input autoFocus={true} value={currentValue ?? item.name} onChange={event => setValue(event.detail.value)} />
    //       );
    //     },
    //   },
    // },
  ];

  return (
    <ScreenshotArea>
      <Box variant="h1" margin={{ bottom: 'm' }}>
        Expandable rows
      </Box>
      <SpaceBetween size="xl">
        <SpaceBetween direction="horizontal" size="m">
          <FormField label="Table flags">
            <Checkbox
              checked={resizableColumns}
              onChange={event => setUrlParams({ resizableColumns: event.detail.checked })}
            >
              Resizable columns
            </Checkbox>

            <Checkbox checked={stickyHeader} onChange={event => setUrlParams({ stickyHeader: event.detail.checked })}>
              Sticky header
            </Checkbox>

            <Checkbox
              checked={sortingDisabled}
              onChange={event => setUrlParams({ sortingDisabled: event.detail.checked })}
            >
              Sorting disabled
            </Checkbox>

            <Checkbox checked={stripedRows} onChange={event => setUrlParams({ stripedRows: event.detail.checked })}>
              Striped rows
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
                    event.detail.selectedOption.value === 'single' || event.detail.selectedOption.value === 'multi'
                      ? event.detail.selectedOption.value
                      : undefined,
                })
              }
            />
          </FormField>

          <FormField label="Sticky columns first">
            <Select
              selectedOption={
                stickyColumnsOptions.find(option => option.value === stickyColumnsFirst) ?? stickyColumnsOptions[0]
              }
              options={stickyColumnsOptions}
              onChange={event => setUrlParams({ stickyColumnsFirst: event.detail.selectedOption.value })}
            />
          </FormField>
        </SpaceBetween>

        <Table
          {...collectionProps}
          stickyColumns={{ first: parseInt(stickyColumnsFirst || '0') }}
          resizableColumns={resizableColumns}
          stickyHeader={stickyHeader}
          sortingDisabled={sortingDisabled}
          selectionType={selectionType}
          stripedRows={stripedRows}
          columnDefinitions={columnDefinitions}
          items={items}
          ariaLabels={{ ...ariaLabels, tableLabel: 'Small table' }}
          header={
            <SpaceBetween size="m">
              <Header
                counter={`(${filteredItemsCount ?? allInstances.length})`}
                actions={
                  <SpaceBetween size="s" direction="horizontal">
                    <Toggle
                      checked={groupResources}
                      onChange={event => setUrlParams({ groupResources: event.detail.checked })}
                    >
                      Group resources
                    </Toggle>
                  </SpaceBetween>
                }
              >
                Databases
              </Header>
              {selectedCluster && (
                <Alert
                  type="info"
                  action={
                    <Button
                      onClick={() => {
                        actions.setExpandedItems([]);
                        setSelectedCluster(null);
                      }}
                    >
                      Show all databases
                    </Button>
                  }
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
            <SpaceBetween size="s" direction="horizontal">
              <TextFilter
                {...filterProps}
                filteringAriaLabel="Filter items"
                filteringPlaceholder="Find items"
                filteringClearAriaLabel="Clear"
                countText={getMatchesCountText(filteredItemsCount ?? 0)}
              />
              <Button
                onClick={() => {
                  actions.setExpandedItems(allInstances);
                }}
              >
                Expand all
              </Button>
              <Button
                onClick={() => {
                  actions.setExpandedItems([]);
                }}
              >
                Collapse all
              </Button>
            </SpaceBetween>
          }
          enableKeyboardNavigation={true}
        />
      </SpaceBetween>
    </ScreenshotArea>
  );
};

function InstanceTypeWrapper({ instanceType, children }: { instanceType: InstanceType; children: React.ReactNode }) {
  return (
    <Box
      fontWeight={instanceType === 'instance' ? 'normal' : 'bold'}
      color={instanceType === 'instance' ? 'inherit' : 'text-body-secondary'}
    >
      {children}
    </Box>
  );
}
