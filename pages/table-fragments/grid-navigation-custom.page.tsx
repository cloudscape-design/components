// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useMemo, useRef, useState } from 'react';
import {
  AppLayout,
  Button,
  ButtonDropdown,
  Checkbox,
  CollectionPreferences,
  ColumnLayout,
  Container,
  ContentLayout,
  FormField,
  Header,
  HelpPanel,
  Icon,
  Input,
  Link,
  RadioGroup,
  Select,
  SpaceBetween,
  StatusIndicator,
} from '~components';
import { useEffectOnUpdate } from '~components/internal/hooks/use-effect-on-update';
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
  GridNavigationProvider,
} from '~components/table/table-role';
import {
  useSingleTabStopNavigation,
  SingleTabStopNavigationSuppressed,
} from '~components/internal/context/single-tab-stop-navigation-context';
import { orderBy, range } from 'lodash';
import appLayoutLabels from '../app-layout/utils/labels';
import { stateToStatusIndicator } from '../table/shared-configs';
import { contentDisplayPreferenceI18nStrings } from '../common/i18n-strings';

interface ExtendedWindow extends Window {
  refreshItems: () => void;
}
declare const window: ExtendedWindow;

type PageContext = React.Context<
  AppContextType<{
    pageSize: number;
    tableRole: TableRole;
    actionsMode: ActionsMode;
    autoRefresh: boolean;
    visibleColumns: string;
  }>
>;

type ActionsMode = 'dropdown' | 'inline';

const tableRoleOptions = [{ value: 'table' }, { value: 'grid' }, { value: 'grid-default' }];

const actionsModeOptions = [
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'inline', label: 'Inline (anti-pattern)' },
];

export default function Page() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const {
    pageSize = 10,
    tableRole = 'grid',
    actionsMode = 'dropdown',
    autoRefresh = false,
    visibleColumns:
      visibleColumnsString = 'id,actions,state,imageId,dnsName,type,inline-select,inline-radio,inline-input',
  } = urlParams;
  const visibleColumns = visibleColumnsString.split(',').filter(Boolean);

  const [items, setItems] = useState(generateItems(25));
  const [refreshCounter, setRefreshCounter] = useState(0);
  window.refreshItems = () => setRefreshCounter(prev => prev + 1);

  useEffectOnUpdate(() => {
    setItems(prev => [...prev.slice(1), ...generateItems(1)]);
    if (autoRefresh) {
      const timeoutId = setTimeout(() => setRefreshCounter(prev => prev + 1), 10000);
      return () => clearTimeout(timeoutId);
    }
  }, [autoRefresh, refreshCounter]);

  const columnDefinitions = [
    {
      key: 'id',
      label: 'ID',
      render: (item: Instance) => item.id,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: Instance) => (
        <ItemActionsCell
          mode={actionsMode}
          onDelete={() => setItems(prev => prev.filter(prevItem => prevItem.id !== item.id))}
          onDuplicate={() =>
            setItems(prev =>
              prev.flatMap(prevItem =>
                prevItem.id !== item.id ? [prevItem] : [prevItem, { ...prevItem, id: generateId() }]
              )
            )
          }
          onUpdate={() =>
            setItems(prev =>
              prev.map(prevItem => (prevItem.id !== item.id ? prevItem : { ...prevItem, id: generateId() }))
            )
          }
        />
      ),
    },
    {
      key: 'state',
      label: 'State',
      render: (item: Instance) => <StatusIndicator {...stateToStatusIndicator[item.state]} />,
    },
    {
      key: 'imageId',
      label: 'Image ID',
      render: (item: Instance) => <Link>{item.imageId}</Link>,
    },
    { key: 'dnsName', label: 'DNS name', render: (item: Instance) => <DnsEditCell item={item} /> },
    { key: 'type', label: 'Type', render: (item: Instance) => item.type },
    { key: 'inline-select', label: 'Select', render: (item: Instance) => <InlineSelect value={item.type} /> },
    { key: 'inline-radio', label: 'Radio', render: (item: Instance) => <InlineRadio value={item.type} /> },
    { key: 'inline-input', label: 'Input', render: (item: Instance) => <InlineInput value={item.type} /> },
  ];
  const visibleColumnDefinitions = columnDefinitions.filter(def => visibleColumns.includes(def.key));

  const [sortingKey, setSortingKey] = useState<null | string>(null);
  const [sortingDirection, setSortingDirection] = useState<1 | -1>(1);

  const tableRef = useRef<HTMLTableElement>(null);

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

                  <FormField label="Actions mode">
                    <Select
                      options={actionsModeOptions}
                      selectedOption={actionsModeOptions.find(option => option.value === actionsMode) ?? null}
                      onChange={event =>
                        setUrlParams({ actionsMode: event.detail.selectedOption.value as ActionsMode })
                      }
                    />
                  </FormField>
                </ColumnLayout>

                <SpaceBetween alignItems="center" size="m" direction="horizontal">
                  <CollectionPreferences
                    title="Preferences"
                    confirmLabel="Confirm"
                    cancelLabel="Cancel"
                    customPreference={(
                      customValue: undefined | { autoRefresh: boolean },
                      setCustomValue: (value: { autoRefresh: boolean }) => void
                    ) => (
                      <Checkbox
                        checked={!!customValue?.autoRefresh}
                        onChange={event => setCustomValue({ autoRefresh: event.detail.checked })}
                      >
                        Auto-refresh every 10 seconds
                      </Checkbox>
                    )}
                    preferences={{
                      contentDisplay: columnDefinitions.map(column => ({
                        id: column.key,
                        visible: visibleColumns.includes(column.key),
                      })),
                    }}
                    onConfirm={({ detail }) =>
                      setUrlParams({
                        visibleColumns: (detail.contentDisplay ?? [])
                          .filter(column => column.visible)
                          .map(column => column.id)
                          .join(','),
                        autoRefresh: detail.custom.autoRefresh,
                      })
                    }
                    contentDisplayPreference={{
                      title: 'Column preferences',
                      description: 'Customize the columns visibility.',
                      options: columnDefinitions.map(column => ({
                        id: column.key,
                        label: column.label,
                        alwaysVisible: column.key === 'id',
                      })),
                      ...contentDisplayPreferenceI18nStrings,
                    }}
                  />

                  <Button onClick={() => setRefreshCounter(prev => prev + 1)} iconName="refresh" ariaLabel="Refresh">
                    Refresh
                  </Button>
                </SpaceBetween>

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
            <GridNavigationProvider
              keyboardNavigation={tableRole === 'grid'}
              pageSize={pageSize}
              getTable={() => tableRef.current}
            >
              <div className={styles['custom-table']} {...getTableWrapperRoleProps({ tableRole, isScrollable: false })}>
                <table
                  ref={tableRef}
                  className={styles['custom-table-table']}
                  {...getTableRoleProps({
                    tableRole,
                    totalItemsCount: items.length,
                    totalColumnsCount: visibleColumnDefinitions.length,
                  })}
                >
                  <thead>
                    <tr {...getTableHeaderRowRoleProps({ tableRole })}>
                      {visibleColumnDefinitions.map((column, colIndex) => (
                        <Cell
                          tag="th"
                          key={column.key}
                          className={styles['custom-table-cell']}
                          {...getTableColHeaderRoleProps({ tableRole, colIndex })}
                        >
                          <SortingHeader
                            column={column}
                            sortingKey={sortingKey}
                            sortingDirection={sortingDirection}
                            onClick={() => {
                              if (sortingKey !== column.key) {
                                setSortingKey(column.key);
                                setSortingDirection(-1);
                              } else {
                                setSortingDirection(prev => (prev === 1 ? -1 : 1));
                              }
                            }}
                          />
                        </Cell>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedItems.map((item, rowIndex) => (
                      <tr key={item.id} {...getTableRowRoleProps({ tableRole, rowIndex, firstIndex: 0 })}>
                        {visibleColumnDefinitions.map((column, colIndex) => (
                          <Cell
                            tag="td"
                            key={column.key}
                            className={styles['custom-table-cell']}
                            {...getTableCellRoleProps({ tableRole, colIndex })}
                          >
                            {column.render(item)}
                          </Cell>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GridNavigationProvider>
          </Container>
        </ContentLayout>
      }
    />
  );
}

function Cell({ tag: Tag, ...rest }: React.HTMLAttributes<HTMLTableCellElement> & { tag: 'th' | 'td' }) {
  const cellRef = useRef<HTMLTableCellElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(cellRef);
  return <Tag {...rest} ref={cellRef} tabIndex={tabIndex} />;
}

function SortingHeader({
  column,
  sortingKey,
  sortingDirection,
  onClick,
}: {
  column: { key: string; label: string };
  sortingKey: null | string;
  sortingDirection: -1 | 1;
  onClick: () => void;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(buttonRef);
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
      <button ref={buttonRef} tabIndex={tabIndex} className={styles['custom-table-sorting-header']} onClick={onClick}>
        {column.label}
      </button>
      {sortingKey === column.key && sortingDirection === -1 && <Icon name="angle-down" />}
      {sortingKey === column.key && sortingDirection === 1 && <Icon name="angle-up" />}
    </div>
  );
}

function InlineInput({ value: initialValue }: { value: string }) {
  const [value, setValue] = useState(initialValue);
  return (
    <div style={{ minWidth: 200 }}>
      <Input ariaLabel="Inline input" value={value} onChange={e => setValue(e.detail.value)} />
    </div>
  );
}

function InlineSelect({ value: initialValue }: { value: string }) {
  const options = range(0, 5).map(i => ({ value: initialValue + i }));
  const [selectedOption, setSelectedOption] = useState(options[0]);
  return (
    <Select
      selectedOption={selectedOption}
      options={options}
      onChange={e => setSelectedOption(e.detail.selectedOption as any)}
      expandToViewport={true}
    />
  );
}

function InlineRadio({ value: initialValue }: { value: string }) {
  const items = range(0, 2).map(i => ({ value: initialValue + i, label: initialValue + i }));
  const [value, setValue] = useState(initialValue + 0);
  return (
    <div style={{ minWidth: 200 }}>
      <RadioGroup items={items} value={value} onChange={e => setValue(e.detail.value)} />
    </div>
  );
}

function ItemActionsCell({
  onDelete,
  onDuplicate,
  onUpdate,
  mode,
}: {
  onDelete: () => void;
  onDuplicate: () => void;
  onUpdate: () => void;
  mode: ActionsMode;
}) {
  if (mode === 'dropdown') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ButtonDropdown
          ariaLabel="Item actions"
          variant="inline-icon"
          items={[
            { id: 'delete', text: 'Delete' },
            { id: 'duplicate', text: 'Duplicate' },
            { id: 'update', text: 'Update' },
          ]}
          onItemClick={event => {
            switch (event.detail.id) {
              case 'delete':
                return onDelete();
              case 'duplicate':
                return onDuplicate();
              case 'update':
                return onUpdate();
            }
          }}
          expandToViewport={true}
        />
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
      <Button variant="inline-icon" iconName="remove" ariaLabel="Delete item" onClick={onDelete} />
      <Button variant="inline-icon" iconName="copy" ariaLabel="Duplicate item" onClick={onDuplicate} />
      <Button variant="inline-icon" iconName="refresh" ariaLabel="Update item" onClick={onUpdate} />
    </div>
  );
}

function DnsEditCell({ item }: { item: Instance }) {
  const [active, setActive] = useState(false);
  const [value, setValue] = useState(item.dnsName ?? '');

  const triggerRef = useRef<HTMLDivElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(triggerRef);
  const dialogRef = useRef<HTMLDivElement>(null);

  return !active ? (
    <div
      ref={triggerRef}
      role="button"
      tabIndex={tabIndex}
      aria-label="Edit DNS name"
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
    <SingleTabStopNavigationSuppressed>
      <div
        ref={dialogRef}
        role="dialog"
        aria-label="Edit DND name"
        onBlur={event => {
          if (!dialogRef.current!.contains(event.relatedTarget)) {
            setActive(false);
          }
        }}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === 'Escape' || event.key === 'F2') {
            setActive(false);
          }
        }}
        style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}
      >
        <Input autoFocus={true} value={value} onChange={event => setValue(event.detail.value)} />
        <Button iconName="check" ariaLabel="Save" onClick={() => setActive(false)} />
        <Button iconName="close" ariaLabel="Cancel" onClick={() => setActive(false)} />
      </div>
    </SingleTabStopNavigationSuppressed>
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
      </ul>
    </HelpPanel>
  );
}
