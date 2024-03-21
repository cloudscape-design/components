// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import Box from '~components/box';
import Button from '~components/button';
import ButtonDropdown from '~components/button-dropdown';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import Table, { TableProps } from '~components/table';
import ScreenshotArea from '../utils/screenshot-area';
import { Instance, generateItems } from './generate-data';
import { columnsConfig, selectionLabels } from './shared-configs';
import Link from '~components/link';
import AppContext, { AppContextType } from '../app/app-context';
import { Checkbox } from '~components';

type PageContext = React.Context<
  AppContextType<{
    enableKeyboardNavigation: boolean;
    stickyActions: boolean;
  }>
>;

const items = generateItems(10);

const simpleColumns = [columnsConfig[0], columnsConfig[1], columnsConfig[3], columnsConfig[4]];

const columnDefinitionsSingle: TableProps.ColumnDefinition<Instance>[] = [
  ...simpleColumns,
  {
    id: 'action',
    header: 'Actions',
    cell: item => (
      <Button variant="inline-link" ariaLabel={`Download ${item.id}`}>
        Download
      </Button>
    ),
  },
];
const columnDefinitionsMultiple: TableProps.ColumnDefinition<Instance>[] = [
  ...simpleColumns,
  {
    id: 'action',
    header: 'Actions',
    cell: item => (
      <SpaceBetween size="m" direction="horizontal">
        {item.state === 'TERMINATING' || item.state === 'TERMINATED' ? (
          <>
            <Button variant="inline-link" ariaLabel={`Accept ${item.id}`}>
              Accept
            </Button>
            <Button variant="inline-link" ariaLabel={`Reject ${item.id}`}>
              Reject
            </Button>
          </>
        ) : item.state === 'RUNNING' ? (
          <Button variant="inline-link" ariaLabel={`Cancel ${item.id}`}>
            Cancel
          </Button>
        ) : item.state === 'STOPPED' ? (
          <Button variant="inline-link" iconName="external" iconAlign="right" ariaLabel={`Verify payment ${item.id}`}>
            Verify payment
          </Button>
        ) : item.state === 'STOPPING' ? (
          <Button variant="inline-link" iconName="external" iconAlign="right" ariaLabel={`Verify email ${item.id}`}>
            Verify email
          </Button>
        ) : (
          '-'
        )}
      </SpaceBetween>
    ),
  },
];
const columnDefinitionsDropdown: TableProps.ColumnDefinition<Instance>[] = [
  ...simpleColumns,
  {
    id: 'action',
    header: 'Actions',
    cell: item => (
      <Box>
        <ButtonDropdown
          variant="inline-icon"
          expandToViewport={true}
          ariaLabel={`${item.id} actions`}
          items={[
            { id: 'connect', text: 'Connect' },
            { id: 'view', text: 'View details' },
            { id: 'manage', text: 'Manage instances' },
          ]}
        />
      </Box>
    ),
  },
];
const columnDefinitionsMixed: TableProps.ColumnDefinition<Instance>[] = [
  {
    id: 'id',
    header: 'Task name',
    cell: item => <Link href={`#${item.id}`}>{item.id}</Link>,
    sortingField: 'id',
  },
  columnsConfig[1],
  {
    id: 'dnsName',
    header: 'value',
    cell: item => item.dnsName || '-',
    sortingField: 'dnsName',
  },
  {
    id: 'action',
    header: 'Actions',
    cell: item => (
      <SpaceBetween size="xs" direction="horizontal">
        <Button variant="inline-link" ariaLabel={`Edit ${item.id}`}>
          Edit
        </Button>
        <ButtonDropdown
          variant="inline-icon"
          expandToViewport={true}
          ariaLabel={`${item.id} actions`}
          items={[
            { id: 'lock', text: 'Lock' },
            { id: 'delete', text: 'Delete' },
            { id: 'done', text: 'Mark as done' },
          ]}
        />
      </SpaceBetween>
    ),
  },
];
const columnDefinitionsOnlyIcons: TableProps.ColumnDefinition<Instance>[] = [
  ...simpleColumns,
  {
    id: 'action',
    header: 'Actions',
    cell: item => (
      <Box>
        <SpaceBetween size="xs" direction="horizontal">
          <Button variant="inline-icon" iconName="download" ariaLabel={`Download ${item.id}`} />
          <ButtonDropdown
            variant="inline-icon"
            expandToViewport={true}
            ariaLabel={`${item.id} actions`}
            items={[
              { id: 'share', text: 'Share' },
              { id: 'edit', text: 'Edit' },
              { id: 'delete', text: 'Delete' },
              { id: 'connect', text: 'Connect' },
              { id: 'manage', text: 'Manage state' },
            ]}
          />
        </SpaceBetween>
      </Box>
    ),
  },
];

export default function () {
  const {
    urlParams: { enableKeyboardNavigation = false, stickyActions = false },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  return (
    <Box>
      <Box margin={{ top: 'm', horizontal: 'm' }}>
        <Checkbox
          checked={enableKeyboardNavigation}
          onChange={event => {
            setUrlParams({ enableKeyboardNavigation: event.detail.checked });
            window.location.reload();
          }}
        >
          Keyboard navigation
        </Checkbox>
        <Checkbox checked={stickyActions} onChange={event => setUrlParams({ stickyActions: event.detail.checked })}>
          Sticky actions
        </Checkbox>
      </Box>

      <ScreenshotArea>
        <h1>Tables with inline actions</h1>

        <SpaceBetween size="l">
          <Table
            ariaLabels={selectionLabels}
            header={<Header>Table with single actions</Header>}
            columnDefinitions={columnDefinitionsSingle}
            items={items}
            enableKeyboardNavigation={enableKeyboardNavigation}
            stickyColumns={{ last: stickyActions ? 1 : 0 }}
          />
          <Table
            ariaLabels={selectionLabels}
            header={<Header>Table with multiple actions</Header>}
            columnDefinitions={columnDefinitionsMultiple}
            items={items}
            enableKeyboardNavigation={enableKeyboardNavigation}
            stickyColumns={{ last: stickyActions ? 1 : 0 }}
          />
          <Table
            data-testid="table-with-dropdown-actions"
            ariaLabels={selectionLabels}
            header={
              <Header
                actions={
                  <SpaceBetween size="xs" direction="horizontal">
                    <ButtonDropdown
                      items={[
                        { id: 'connect', text: 'Connect' },
                        { id: 'view', text: 'View details' },
                        { id: 'manage', text: 'Manage instances' },
                      ]}
                    >
                      Actions
                    </ButtonDropdown>
                    <Button variant="primary">Launch instance</Button>
                  </SpaceBetween>
                }
              >
                Table with action dropdowns
              </Header>
            }
            selectionType="multi"
            columnDefinitions={columnDefinitionsDropdown}
            items={items}
            enableKeyboardNavigation={enableKeyboardNavigation}
            stickyColumns={{ last: stickyActions ? 1 : 0 }}
          />
          <Table
            ariaLabels={selectionLabels}
            header={<Header>Table with mixed actions</Header>}
            columnDefinitions={columnDefinitionsMixed}
            items={items}
            enableKeyboardNavigation={enableKeyboardNavigation}
            stickyColumns={{ last: stickyActions ? 1 : 0 }}
          />
          <Table
            ariaLabels={selectionLabels}
            header={<Header>Table with only icon actions</Header>}
            columnDefinitions={columnDefinitionsOnlyIcons}
            items={items}
            enableKeyboardNavigation={enableKeyboardNavigation}
            stickyColumns={{ last: stickyActions ? 1 : 0 }}
          />
        </SpaceBetween>
      </ScreenshotArea>
    </Box>
  );
}
