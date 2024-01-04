// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import { GridNavigationProvider } from '../../../../lib/components/table/table-role';

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
      Name <button aria-label="Sort by name" tabIndex={0} />
    </span>
  ),
  cell: (item: Item) => item.name,
};
export const valueColumn = {
  header: (
    <span>
      Value <button aria-label="Sort by value" tabIndex={0} />
    </span>
  ),
  cell: (item: Item) => <ValueCell item={item} />,
};
export const actionsColumn = {
  header: 'Actions',
  cell: (item: Item) => (
    <span>
      <button aria-label={`Delete item ${item.id}`} tabIndex={0} />
      <button aria-label={`Copy item ${item.id}`} tabIndex={0} />
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
              <th key={columnIndex} aria-colindex={columnIndex + 1} tabIndex={-1}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, itemIndex) => (
            <tr key={itemIndex} aria-rowindex={startIndex + itemIndex + 1 + 1}>
              {columns.map((column, columnIndex) => (
                <td key={columnIndex} aria-colindex={columnIndex + 1} tabIndex={-1}>
                  {column.cell(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </GridNavigationProvider>
  );
}

function ValueCell({ item }: { item: Item }) {
  const [active, setActive] = useState(false);

  return !active ? (
    <span>
      {item.value ?? 0} <button aria-label={`Edit value ${item.value}`} onClick={() => setActive(true)} tabIndex={0} />
    </span>
  ) : (
    <span role="dialog">
      <input value={item.value} autoFocus={true} aria-label="Value input" tabIndex={0} />
      <button aria-label="Save" onClick={() => setActive(false)} tabIndex={0} />
      <button aria-label="Discard" onClick={() => setActive(false)} tabIndex={0} />
    </span>
  );
}
