// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Button, Container, TableProps } from '~components';
import Table from '~components/table/composition';

type NestedItem<T> = T & {
  children?: NestedItem<T>[];
};

interface ExpandableTableProps<T> {
  columnDefinitions: TableProps.ColumnDefinition<T>[];
  items: T[];
  trackBy: keyof T;
}

function ExpandableTableItemRows<T>({
  item,
  columnDefinitions,
  level,
  posInSet,
  setSize,
  trackBy,
}: {
  item: NestedItem<T>;
  columnDefinitions: TableProps.ColumnDefinition<NestedItem<T>>[];
  level: number;
  posInSet: number;
  setSize: number;
  trackBy: keyof NestedItem<T>;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const rowRef = React.useRef<HTMLTableRowElement>(null);
  const expandable = item.children && item.children.length;
  return (
    <>
      <Table.Row
        nativeAttributes={{
          'aria-level': level,
          'aria-posinset': posInSet,
          'aria-setsize': setSize,
          'aria-expanded': expandable ? expanded : undefined,
          tabIndex: -1,
          onKeyDown: e => {
            switch (e.key) {
              case 'Enter':
              case 'Space':
                setExpanded(!expanded);
                break;
              case 'ArrowRight':
                setExpanded(true);
                break;
              case 'ArrowLeft':
                setExpanded(false);
                break;
              case 'ArrowUp':
                (rowRef.current?.previousElementSibling as HTMLElement)?.focus();
                break;
              case 'ArrowDown':
                (rowRef.current?.nextElementSibling as HTMLElement)?.focus();
                break;
            }
          },
        }}
        ref={rowRef}
      >
        {columnDefinitions.map((col, index) => (
          <Table.DataCell key={col.id}>
            <span style={index === 0 ? { paddingLeft: `${24 * (level - 1)}px` } : {}}>
              {index === 0 && expandable ? (
                <Button
                  variant="inline-icon"
                  iconName={expanded ? 'angle-down' : 'angle-right'}
                  onClick={() => setExpanded(!expanded)}
                />
              ) : null}
              {col.cell(item)}
            </span>
          </Table.DataCell>
        ))}
      </Table.Row>
      {expanded && item.children
        ? item.children.map((child, index) => (
            <ExpandableTableItemRows
              item={child}
              columnDefinitions={columnDefinitions}
              level={level + 1}
              setSize={item.children!.length}
              posInSet={index + 1}
              trackBy={trackBy}
              key={child[trackBy] as any}
            />
          ))
        : null}
    </>
  );
}

function ExpandableTable<T>({ columnDefinitions, items, trackBy }: ExpandableTableProps<NestedItem<T>>) {
  const tableRef = React.useRef<HTMLTableElement>(null);
  return (
    <Container>
      <Table.Table
        nativeAttributes={{
          role: 'treegrid',
          tabIndex: 0,
          onFocus: e => {
            if (e.target === tableRef.current) {
              tableRef.current?.querySelector('tr')?.focus();
            }
          },
        }}
        ref={tableRef}
      >
        <Table.Head>
          {columnDefinitions.map(d => (
            <Table.Header key={d.id}>{d.header}</Table.Header>
          ))}
        </Table.Head>
        <Table.Body>
          {items.map((item, index) => (
            <ExpandableTableItemRows
              item={item}
              columnDefinitions={columnDefinitions}
              level={1}
              setSize={items.length}
              posInSet={index + 1}
              trackBy={trackBy}
              key={item[trackBy] as any}
            />
          ))}
        </Table.Body>
      </Table.Table>
    </Container>
  );
}

export default function () {
  return (
    <ExpandableTable<{ name: string; key1: string; key2: string }>
      columnDefinitions={[
        { header: 'Name', cell: item => item.name },
        { header: 'Key 1', cell: item => item.key1 },
        { header: 'Key 2', cell: item => item.key2 },
      ]}
      trackBy="name"
      items={[
        {
          name: 'Item 1',
          key1: 'Value 1-1',
          key2: 'Value 1-2',
          children: [
            {
              name: 'Item 1-A',
              key1: 'Value 1-A-1',
              key2: 'Value 1-A-2',
            },
            {
              name: 'Item 1-B',
              key1: 'Value 1-B-1',
              key2: 'Value 1-B-2',
              children: [
                {
                  name: 'Item 1-B-Z',
                  key1: 'Value 1-B-Z-1',
                  key2: 'Value 1-B-Z-2',
                },
              ],
            },
            {
              name: 'Item 1-C',
              key1: 'Value 1-C-1',
              key2: 'Value 1-C-2',
            },
          ],
        },
      ]}
    />
  );
}
