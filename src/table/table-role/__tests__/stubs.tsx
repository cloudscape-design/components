// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import { useGridNavigation } from '../../../../lib/components/table/table-role';

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
      Name <button aria-label="Sort by name" />
    </span>
  ),
  cell: (item: Item) => item.name,
};
export const valueColumn = {
  header: (
    <span>
      Value <button aria-label="Sort by value" />
    </span>
  ),
  cell: (item: Item) => <ValueCell item={item} />,
};
export const actionsColumn = {
  header: 'Actions',
  cell: (item: Item) => (
    <span>
      <button aria-label={`Delete item ${item.id}`} />
      <button aria-label={`Copy item ${item.id}`} />
    </span>
  ),
};

export function TestTable<T extends object>({
  keyboardNavigation = true,
  columns,
  items,
  startIndex = 0,
  pageSize = 2,
  before,
  after,
}: {
  keyboardNavigation?: boolean;
  columns: { header: React.ReactNode; cell: (item: T) => React.ReactNode }[];
  items: T[];
  startIndex?: number;
  pageSize?: number;
  before?: React.ReactNode;
  after?: React.ReactNode;
}) {
  const tableRef = useRef<HTMLTableElement>(null);
  useGridNavigation({ keyboardNavigation, pageSize, getTable: () => tableRef.current });
  return (
    <div>
      {before}
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
      {after}
    </div>
  );
}

function ValueCell({ item }: { item: Item }) {
  const [active, setActive] = useState(false);

  return !active ? (
    <span>
      {item.value ?? 0} <button aria-label={`Edit value ${item.value}`} onClick={() => setActive(true)} />
    </span>
  ) : (
    <span role="dialog">
      <input value={item.value} autoFocus={true} aria-label="Value input" tabIndex={0} />
      <button aria-label="Save" onClick={() => setActive(false)} />
      <button aria-label="Discard" onClick={() => setActive(false)} />
    </span>
  );
}
