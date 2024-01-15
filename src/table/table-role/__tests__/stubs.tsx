// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import { GridNavigationProvider } from '../../../../lib/components/table/table-role';
import { useSingleTabStopNavigation } from '../../../../lib/components/internal/context/single-tab-stop-navigation-context';

export interface Item {
  id: string;
  name: string;
  value: number;
}

export const items: Item[] = [
  { id: 'id1', name: 'First', value: 1 },
  { id: 'id2', name: 'Second', value: 2 },
  { id: 'id3', name: 'Third', value: 3 },
  { id: 'id4', name: 'Fourth', value: 4 },
];

export const idColumn = { header: 'ID', cell: (item: Item) => item.id };
export const nameColumn = {
  header: (
    <span>
      Name <Button aria-label="Sort by name" />
    </span>
  ),
  cell: (item: Item) => item.name,
};
export const valueColumn = {
  header: (
    <span>
      Value <Button aria-label="Sort by value" />
    </span>
  ),
  cell: (item: Item) => <EditableCellContent item={item} />,
};
export const actionsColumn = {
  header: 'Actions',
  cell: (item: Item) => (
    <span>
      <Button aria-label={`Delete item ${item.id}`} />
      <Button aria-label={`Copy item ${item.id}`} />
    </span>
  ),
};

export function TestTable<T extends object>({
  keyboardNavigation = true,
  columns,
  items,
  startIndex = 0,
  pageSize = 2,
}: {
  keyboardNavigation?: boolean;
  columns: { header: React.ReactNode; cell: (item: T) => React.ReactNode }[];
  items: T[];
  startIndex?: number;
  pageSize?: number;
}) {
  const tableRef = useRef<HTMLTableElement>(null);
  return (
    <GridNavigationProvider
      keyboardNavigation={keyboardNavigation}
      pageSize={pageSize}
      getTable={() => tableRef.current}
    >
      <table role="grid" ref={tableRef}>
        <thead>
          <tr aria-rowindex={1}>
            {columns.map((column, columnIndex) => (
              <Cell tag="th" key={columnIndex} aria-colindex={columnIndex + 1} tabIndex={-1}>
                {column.header}
              </Cell>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, itemIndex) => (
            <tr key={itemIndex} aria-rowindex={startIndex + itemIndex + 1 + 1}>
              {columns.map((column, columnIndex) => (
                <Cell tag="td" key={columnIndex} aria-colindex={columnIndex + 1} tabIndex={-1}>
                  {column.cell(item)}
                </Cell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </GridNavigationProvider>
  );
}

function EditableCellContent({ item }: { item: Item }) {
  const [active, setActive] = useState(false);
  return !active ? (
    <span>
      {item.value ?? 0} <Button aria-label={`Edit value ${item.value}`} onClick={() => setActive(true)} />
    </span>
  ) : (
    <span role="dialog">
      <Input value={item.value} autoFocus={true} aria-label="Value input" tabIndex={0} />
      <Button aria-label="Save" onClick={() => setActive(false)} />
      <Button aria-label="Discard" onClick={() => setActive(false)} />
    </span>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(inputRef, { tabIndex: 0 });
  return <input {...props} ref={inputRef} tabIndex={tabIndex} />;
}

function Button(props: React.HTMLAttributes<HTMLButtonElement>) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(buttonRef, { tabIndex: 0 });
  return <button {...props} ref={buttonRef} tabIndex={tabIndex} />;
}

function Cell({ tag: Tag, ...rest }: React.HTMLAttributes<HTMLTableCellElement> & { tag: 'th' | 'td' }) {
  const cellRef = useRef<HTMLTableCellElement>(null);
  const { tabIndex } = useSingleTabStopNavigation(cellRef);
  return <Tag {...rest} ref={cellRef} tabIndex={tabIndex} />;
}
