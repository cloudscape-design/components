// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper, TableWrapper } from '../../../../lib/components/test-utils/dom';
import { buckets, i18nStrings, objects, versions, waitForFetch } from '../../__tests__/fixtures';
import screenreaderOnlyStyles from '../../../../lib/components/internal/components/screenreader-only/styles.selectors.js';

export const modalDefaultProps = {
  alert: undefined,
  selectableItemsTypes: ['buckets', 'objects', 'versions'],
  fetchBuckets: () => Promise.resolve(buckets),
  fetchObjects: () => Promise.resolve(objects),
  fetchVersions: () => Promise.resolve(versions),
  bucketsVisibleColumns: ['Name', 'CreationDate'],
  objectsVisibleColumns: ['Key', 'LastModified', 'Size'],
  versionsVisibleColumns: ['ID', 'LastModified', 'Size'],
  bucketsIsItemDisabled: undefined,
  objectsIsItemDisabled: undefined,
  versionsIsItemDisabled: undefined,
  i18nStrings,
  getModalRoot: undefined,
  removeModalRoot: undefined,
  onSubmit: () => {},
  onDismiss: () => {},
} as const;

export function getColumnAriaLabels(wrapper: TableWrapper) {
  return (
    wrapper
      .findColumnHeaders()
      // skip the first column with selection controls
      .slice(1)
      .map(colHeader => colHeader.find('[aria-label]')!.getElement().getAttribute('aria-label'))
  );
}

export async function navigateToTableItem(wrapper: ElementWrapper<Element>, rowIndex: number) {
  wrapper.findTable()!.findBodyCell(rowIndex, 2)!.findLink()!.click();
  await waitForFetch();
}

export function getElementsText(wrappers: ReadonlyArray<ElementWrapper>) {
  return wrappers.map(wrapper => wrapper.getElement().textContent!.trim());
}

export function getTableBodyContent(wrapper: TableWrapper) {
  return wrapper.findAll('tbody tr').map(row => getElementsText(row.findAll(':scope > td')));
}

export function getTableColumnContent(wrapper: TableWrapper, colIndex: number) {
  return getElementsText(wrapper.findAll(`tbody tr > td:nth-child(${colIndex})`));
}

export function getHeaderVisibleText(wrapper: TableWrapper) {
  return wrapper.findColumnHeaders().map(colHeader => {
    const element = colHeader.getElement();
    if (colHeader.getElement().children[0].classList.contains(screenreaderOnlyStyles.root)) {
      return '';
    }
    return element.textContent!.trim();
  });
}
