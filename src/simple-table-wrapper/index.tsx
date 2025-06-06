// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { render } from 'react-dom';

import InternalContainer from '../container/internal';
import InternalHeader from '../header/internal';
import InternalIcon from '../icon/internal';
import InternalTextFilter from '../text-filter/internal';

import styles from './styles.css.js';

interface ColumnDefinition {
  id: string;
  sortable?: boolean;
}

export interface SimpleTableWrapperProps {
  children: ReactNode;
  title: string;
  columns?: ColumnDefinition[];
  enableFiltering?: boolean;
}

export default function SimpleTableWrapper({
  children,
  title,
  columns,
  enableFiltering = false,
}: SimpleTableWrapperProps) {
  const baseTable = useRef<HTMLDivElement | null>(null);

  const sortTableByColumn = useCallback((colIndex: number, sortingDirection = 'asc') => {
    const tableColumns = Array.from(baseTable.current?.querySelector('thead')?.querySelectorAll('th') ?? []);

    for (const col of tableColumns) {
      if (tableColumns.indexOf(col) !== colIndex) {
        col.removeAttribute('data-sortingDirection');
        if (col.childNodes.length > 1) {
          col.removeChild(col.lastChild!);
        }
      } else {
        render(
          <>
            {col.textContent}
            <InternalIcon name={sortingDirection === 'asc' ? 'caret-up-filled' : 'caret-down-filled'} />
          </>,
          col
        );
      }
    }

    const sortDirectionModifier = sortingDirection === 'asc' ? 1 : -1;
    const body = baseTable.current?.querySelector('tbody');
    const rows = Array.from(body!.querySelectorAll('tr'));

    const sortedRows = rows.sort((a, b) => {
      const contentA = a.querySelector(`td:nth-child(${colIndex + 1})`)?.textContent?.trim() ?? '';
      const contentB = b.querySelector(`td:nth-child(${colIndex + 1})`)?.textContent?.trim() ?? '';

      return (contentA > contentB ? 1 : -1) * sortDirectionModifier;
    });

    baseTable.current?.querySelector('tbody')?.replaceChildren(...sortedRows);
  }, []);

  useEffect(() => {
    const tableColumns = Array.from(baseTable.current?.querySelector('thead')?.querySelectorAll('th') ?? []);
    if (columns) {
      for (const col of tableColumns) {
        const columnDef = columns.find(c => c.id === col.id);
        if (columnDef?.sortable) {
          const index = tableColumns.indexOf(col);
          const item = baseTable.current?.querySelectorAll('th').item(index);

          item?.addEventListener('click', () => {
            const currentSortingDirection = item.getAttribute('data-sortingDirection');
            const newSortingDirection =
              currentSortingDirection === null || currentSortingDirection === 'desc' ? 'asc' : 'desc';
            sortTableByColumn(index, newSortingDirection);
            item.setAttribute('data-sortingDirection', newSortingDirection);
          });
        }
      }
    }
  }, [columns, sortTableByColumn]);

  return (
    <InternalContainer
      header={
        <InternalHeader variant="h2" description={enableFiltering ? <TableFilter tableRef={baseTable} /> : undefined}>
          {title}
        </InternalHeader>
      }
      className={styles.root}
    >
      <div ref={baseTable}>{children}</div>
    </InternalContainer>
  );
}

function TableFilter({ tableRef }: { tableRef: React.MutableRefObject<HTMLDivElement | null> }) {
  const [filteringText, setFilteringText] = useState('');

  useEffect(() => {
    const body = tableRef.current?.querySelector('tbody');
    const rows = Array.from(body!.querySelectorAll('tr'));
    for (const row of rows) {
      if (row.textContent?.toLowerCase().includes(filteringText.toLowerCase())) {
        row.classList.remove(styles['hidden-row']);
      } else {
        row.classList.add(styles['hidden-row']);
      }
    }
  }, [tableRef, filteringText]);

  return (
    <InternalTextFilter
      filteringText={filteringText}
      filteringPlaceholder="Find items..."
      onChange={({ detail }) => setFilteringText(detail.filteringText)}
    />
  );
}
