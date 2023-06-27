// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { Box, Link } from '~components';
import styles from './styles.scss';
import { generateItems, Instance } from '../table/generate-data';
import { StickyScrollbar } from '~components/table/sticky-scrollbar';
import { useScrollSync } from '~components/internal/hooks/use-scroll-sync';

const items = generateItems(50);
const columnDefinitions = [
  { key: 'id', label: 'ID', render: (item: Instance) => <Link>{item.id}</Link> },
  { key: 'state', label: 'State', render: (item: Instance) => item.state },
  { key: 'type', label: 'Type', render: (item: Instance) => item.type },
  { key: 'imageId', label: 'Image ID', render: (item: Instance) => item.imageId },
  { key: 'dnsName', label: 'DNS name', render: (item: Instance) => item.dnsName ?? '?' },
  { key: 'dnsName2', label: 'DNS name 2', render: (item: Instance) => (item.dnsName ?? '?') + ':2' },
  { key: 'dnsName3', label: 'DNS name 3', render: (item: Instance) => (item.dnsName ?? '?') + ':3' },
];

export default function Page() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const scrollbarRef = useRef<HTMLDivElement>(null);

  const handleScroll = useScrollSync([wrapperRef, scrollbarRef]);

  return (
    <Box margin="l">
      <h1>Sticky scrollbar with a custom table</h1>
      <div ref={wrapperRef} onScroll={handleScroll} className={styles['custom-table']}>
        <table ref={tableRef} className={styles['custom-table-table']}>
          <thead>
            <tr>
              {columnDefinitions.map(column => (
                <th key={column.key} className={styles['custom-table-cell']}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                {columnDefinitions.map(column => (
                  <td key={column.key} className={styles['custom-table-cell']}>
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <StickyScrollbar ref={scrollbarRef} wrapperRef={wrapperRef} tableRef={tableRef} onScroll={handleScroll} />
    </Box>
  );
}
