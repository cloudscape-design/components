// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useMemo, useRef, useState } from 'react';
import SpaceBetween from '~components/space-between';
import {
  AppLayout,
  Button,
  ColumnLayout,
  Container,
  ContentLayout,
  FormField,
  Header,
  HelpPanel,
  Icon,
  Input,
  Link,
  Select,
} from '~components';
import styles from './styles.scss';
import { id as generateId, generateItems, Instance } from '../table/generate-data';
import AppContext, { AppContextType } from '../app/app-context';
import {
  TableRole,
  getTableCellRoleProps,
  getTableColHeaderRoleProps,
  getTableHeaderRowRoleProps,
  getTableRoleProps,
  getTableRowRoleProps,
  getTableWrapperRoleProps,
  useGridNavigation,
} from '~components/table/table-role';
import { orderBy } from 'lodash';
import appLayoutLabels from '../app-layout/utils/labels';

type PageContext = React.Context<
  AppContextType<{
    pageSize: number;
    tableRole: TableRole;
  }>
>;

const createColumnDefinitions = ({
  onDelete,
  onDuplicate,
  onUpdate,
  dialogItem,
  setDialogItem,
}: {
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onUpdate: (id: string) => void;
  dialogItem: null | Instance;
  setDialogItem: (item: null | Instance) => void;
}) => [
  {
    key: 'id',
    label: 'ID',
    render: (item: Instance) => item.id,
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (item: Instance) => (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
        <Button variant="inline-icon" iconName="remove" ariaLabel="Delete item" onClick={() => onDelete(item.id)} />
        <Button variant="inline-icon" iconName="copy" ariaLabel="Duplicate item" onClick={() => onDuplicate(item.id)} />
        <Button variant="inline-icon" iconName="refresh" ariaLabel="Update item" onClick={() => onUpdate(item.id)} />
      </div>
    ),
  },
  {
    key: 'state',
    label: 'State',
    render: (item: Instance) => item.state,
  },
  {
    key: 'imageId',
    label: 'Image ID',
    render: (item: Instance) => <Link>{item.imageId}</Link>,
  },
  {
    key: 'dnsName',
    label: 'DNS name',
    render: (item: Instance) => (
      <DnsNameEditWidget
        item={item}
        active={item === dialogItem}
        setActive={active => setDialogItem(active ? item : null)}
      />
    ),
    isDialog: (item: Instance) => item === dialogItem,
  },
  { key: 'type', label: 'Type', render: (item: Instance) => item.type },
];

function DnsNameEditWidget({
  item,
  active,
  setActive,
}: {
  item: Instance;
  active: boolean;
  setActive: (active: boolean) => void;
}) {
  const [value, setValue] = useState(item.dnsName ?? '');
  return !active ? (
    <div
      role="button"
      tabIndex={0}
      aria-label="Edit dns name"
      onClick={() => setActive(true)}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === 'F2') {
          setActive(true);
        }
      }}
    >
      {item.dnsName}
    </div>
  ) : (
    <Input
      autoFocus={true}
      value={value}
      onChange={event => setValue(event.detail.value)}
      onBlur={() => {
        setActive(false);
      }}
      onKeyDown={event => {
        if (event.detail.key === 'Enter') {
          setActive(false);
        }
      }}
    />
  );
}

const tableRoleOptions = [{ value: 'table' }, { value: 'grid' }, { value: 'grid-default' }];

export default function Page() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const pageSize = urlParams.pageSize ?? 10;
  const tableRole = urlParams.tableRole ?? 'grid';

  const [dialogItem, setDialogItem] = useState<null | Instance>(null);
  const [items, setItems] = useState(generateItems(25));
  const columnDefinitions = useMemo(
    () =>
      createColumnDefinitions({
        onDelete: (id: string) => setItems(prev => prev.filter(item => item.id !== id)),
        onDuplicate: (id: string) =>
          setItems(prev => prev.flatMap(item => (item.id !== id ? [item] : [item, { ...item, id: generateId() }]))),
        onUpdate: (id: string) =>
          setItems(prev => prev.map(item => (item.id !== id ? item : { ...item, id: generateId() }))),
        dialogItem,
        setDialogItem,
      }),
    [dialogItem]
  );

  const [sortingKey, setSortingKey] = useState<null | string>(null);
  const [sortingDirection, setSortingDirection] = useState<1 | -1>(1);

  const tableRef = useRef<HTMLTableElement>(null);

  useGridNavigation({ tableRole, pageSize, getTable: () => tableRef.current });

  const sortedItems = useMemo(() => {
    if (!sortingKey) {
      return items;
    }
    return orderBy(items, [sortingKey], [sortingDirection === -1 ? 'desc' : 'asc']);
  }, [items, sortingKey, sortingDirection]);

  return (
    <AppLayout
      ariaLabels={appLayoutLabels}
      contentType="table"
      navigationHide={true}
      toolsOpen={toolsOpen}
      onToolsChange={event => setToolsOpen(event.detail.open)}
      tools={<GridNavigationHelpPanel />}
      content={
        <ContentLayout header={<Header variant="h1">Grid navigation with a custom table grid</Header>}>
          <Container
            disableContentPaddings={true}
            header={
              <SpaceBetween size="m">
                <ColumnLayout columns={3}>
                  <FormField label="Page size">
                    <Input
                      type="number"
                      value={pageSize.toString()}
                      onChange={event => setUrlParams({ pageSize: parseInt(event.detail.value) })}
                    />
                  </FormField>

                  <FormField label="Table role">
                    <Select
                      options={tableRoleOptions}
                      selectedOption={tableRoleOptions.find(option => option.value === tableRole) ?? null}
                      onChange={event => setUrlParams({ tableRole: event.detail.selectedOption.value as TableRole })}
                    />
                  </FormField>
                </ColumnLayout>

                <Link onFollow={() => setToolsOpen(true)} data-testid="link-before">
                  How to use grid navigation?
                </Link>
              </SpaceBetween>
            }
            footer={
              <Link onFollow={() => setToolsOpen(true)} data-testid="link-after">
                How to use grid navigation?
              </Link>
            }
          >
            <div className={styles['custom-table']} {...getTableWrapperRoleProps({ tableRole, isScrollable: false })}>
              <table
                ref={tableRef}
                className={styles['custom-table-table']}
                {...getTableRoleProps({
                  tableRole,
                  totalItemsCount: items.length,
                  totalColumnsCount: columnDefinitions.length,
                })}
              >
                <thead>
                  <tr {...getTableHeaderRowRoleProps({ tableRole })}>
                    {columnDefinitions.map((column, colIndex) => (
                      <th
                        key={column.key}
                        className={styles['custom-table-cell']}
                        {...getTableColHeaderRoleProps({ tableRole, colIndex })}
                      >
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
                          <button
                            className={styles['custom-table-sorting-header']}
                            onClick={() => {
                              if (sortingKey !== column.key) {
                                setSortingKey(column.key);
                                setSortingDirection(-1);
                              } else {
                                setSortingDirection(prev => (prev === 1 ? -1 : 1));
                              }
                            }}
                          >
                            {column.label}
                          </button>
                          {sortingKey === column.key && sortingDirection === -1 && <Icon name="angle-down" />}
                          {sortingKey === column.key && sortingDirection === 1 && <Icon name="angle-up" />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item, rowIndex) => (
                    <tr key={item.id} {...getTableRowRoleProps({ tableRole, rowIndex, firstIndex: 0 })}>
                      {columnDefinitions.map((column, colIndex) => (
                        <td
                          key={column.key}
                          className={styles['custom-table-cell']}
                          {...getTableCellRoleProps({ tableRole, colIndex, isDialog: column.isDialog?.(item) })}
                        >
                          {column.render(item)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Container>
        </ContentLayout>
      }
    />
  );
}

function GridNavigationHelpPanel() {
  return (
    <HelpPanel header={<Header variant="h2">Grid navigation</Header>}>
      <p>
        Grid tables offer better efficient navigation for keyboard users. The navigation intercepts keyboard commands to
        focus table cells and focusable cell content using arrow keys and other key combinations. Here is the full list
        of commands to move item focus:
      </p>
      <ul>
        <li>
          <b>Arrow Up</b> (one item up)
        </li>
        <li>
          <b>Arrow Down</b> (one item down)
        </li>
        <li>
          <b>Arrow Left</b> (one item to the left)
        </li>
        <li>
          <b>Arrow Right</b> (one item to the right)
        </li>
        <li>
          <b>Page Up</b> (one page up)
        </li>
        <li>
          <b>Page Down</b> (one page down)
        </li>
        <li>
          <b>Home</b> (to the first item in the row)
        </li>
        <li>
          <b>End</b> (to the last item in the row)
        </li>
        <li>
          <b>Control+Home</b> (to the first item in the grid)
        </li>
        <li>
          <b>Control+End</b> (to the last item in the grid)
        </li>
        <li>
          <b>Enter</b> (to move focus inside dialog cell)
        </li>
        <li>
          <b>Escape</b> (to move focus back to cell)
        </li>
        <li>
          <b>F2</b> (to move focus inside or outside cell)
        </li>
      </ul>
    </HelpPanel>
  );
}
