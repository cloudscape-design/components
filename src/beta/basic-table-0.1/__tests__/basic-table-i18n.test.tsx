// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import BasicTable, {
  BasicTableHeader,
  BasicTableHeaderCell,
  BasicTableBody,
  BasicTableRow,
  BasicTableCell,
  BasicTableProps,
} from '../index';

// Localization is prop-driven: the consumer passes already-localized strings through the typed
// `i18nStrings` object and the component reads them directly. There is no I18nProvider runtime in
// this package. The resize-handle role description has a hardcoded English fallback for when no
// value is supplied.

interface Item {
  id: string;
  name: string;
  status: string;
}

const makeItems = (n: number): Item[] =>
  Array.from({ length: n }, (_, i) => ({ id: `row-${i}`, name: `Resource ${i}`, status: i % 2 === 0 ? 'Up' : 'Down' }));

// resizableColumns renders the resize handle whose toggle carries aria-roledescription.
function buildTree(i18nStrings?: BasicTableProps.I18nStrings) {
  const columns: BasicTableProps.ColumnDefinition[] = [
    { id: 'name', minWidth: 120 },
    { id: 'status' }, // flexible (no width → shares remaining space)
  ];
  const items = makeItems(10);
  return (
    <BasicTable columns={columns} totalRowCount={items.length} resizableColumns={true} i18nStrings={i18nStrings}>
      <BasicTableHeader>
        <BasicTableHeaderCell columnId="name">Name</BasicTableHeaderCell>
        <BasicTableHeaderCell columnId="status">Status</BasicTableHeaderCell>
      </BasicTableHeader>
      <BasicTableBody>
        {items.map((item, index) => (
          <BasicTableRow key={item.id} index={index} id={item.id}>
            <BasicTableCell columnId="name">{item.name}</BasicTableCell>
            <BasicTableCell columnId="status">{item.status}</BasicTableCell>
          </BasicTableRow>
        ))}
      </BasicTableBody>
    </BasicTable>
  );
}

// The resize toggle button owns aria-roledescription.
const getResizerRoleDescription = (container: HTMLElement) =>
  container.querySelector('[aria-roledescription]')!.getAttribute('aria-roledescription');

const getTableLabel = (container: HTMLElement) =>
  container.querySelector('[role="grid"]')!.getAttribute('aria-label');

describe('BasicTable i18nStrings passthrough (#20)', () => {
  test('(a) resizerRoleDescription passes through to the resize handle', () => {
    const { container } = render(buildTree({ resizerRoleDescription: 'width handle' }));
    expect(getResizerRoleDescription(container)).toBe('width handle');
  });

  test('(b) tableLabel passes through to the grid aria-label', () => {
    const { container } = render(buildTree({ tableLabel: 'Resources' }));
    expect(getTableLabel(container)).toBe('Resources');
  });

  test('(c) no i18nStrings: the hardcoded English resize-handle fallback remains', () => {
    const { container } = render(buildTree());
    expect(getResizerRoleDescription(container)).toBe('resize handle');
  });
});
