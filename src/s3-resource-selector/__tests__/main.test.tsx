// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import S3ResourceSelector, { S3ResourceSelectorProps } from '../../../lib/components/s3-resource-selector';
import createWrapper, { S3ResourceSelectorWrapper } from '../../../lib/components/test-utils/dom';
import { buckets, i18nStrings, objects, versions, waitForFetch } from './fixtures';
import FormField from '../../../lib/components/form-field';
import TestI18nProvider from '../../../lib/components/internal/i18n/testing';

jest.setTimeout(10_000);

const defaultProps = {
  resource: { uri: '' },
  selectableItemsTypes: ['buckets', 'objects'],
  fetchBuckets: () => Promise.resolve(buckets),
  fetchObjects: () => Promise.resolve(objects),
  fetchVersions: () => Promise.resolve(versions),
  i18nStrings,
} as const;

function renderComponent(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findS3ResourceSelector()!;
}

async function navigateToTableItem(wrapper: S3ResourceSelectorWrapper, rowIndex: number) {
  wrapper.findTable()!.findBodyCell(rowIndex, 2)!.findLink()!.click();
  await waitForFetch();
}

async function openBrowseDialog(wrapper: S3ResourceSelectorWrapper) {
  wrapper.findInContext().findBrowseButton().click();
  await waitForFetch();
}

test('should select a bucket via modal', async () => {
  const onChange = jest.fn();
  const wrapper = renderComponent(<S3ResourceSelector {...defaultProps} onChange={event => onChange(event.detail)} />);
  await openBrowseDialog(wrapper);
  wrapper.findTable()!.findRowSelectionArea(1)!.click();
  wrapper.findModal()!.findSubmitButton().click();
  expect(onChange).toHaveBeenCalledWith({ resource: { uri: 's3://bucket-laborum' } });
});

test('should select a folder via modal', async () => {
  const onChange = jest.fn();
  const wrapper = renderComponent(<S3ResourceSelector {...defaultProps} onChange={event => onChange(event.detail)} />);
  await openBrowseDialog(wrapper);
  await navigateToTableItem(wrapper, 1); // open a bucket
  wrapper.findTable()!.findRowSelectionArea(1)!.click();
  wrapper.findModal()!.findSubmitButton().click();
  expect(onChange).toHaveBeenCalledWith({ resource: { uri: 's3://bucket-laborum/simulation-nano-2019' } });
});

test('should select an object via modal', async () => {
  const onChange = jest.fn();
  const wrapper = renderComponent(<S3ResourceSelector {...defaultProps} onChange={event => onChange(event.detail)} />);
  await openBrowseDialog(wrapper);
  await navigateToTableItem(wrapper, 1); // open a bucket
  wrapper.findTable()!.findRowSelectionArea(2)!.click();
  wrapper.findModal()!.findSubmitButton().click();
  expect(onChange).toHaveBeenCalledWith({ resource: { uri: 's3://bucket-laborum/black-hole-9ns.sim' } });
});

test('should select a version via modal', async () => {
  const onChange = jest.fn();
  const wrapper = renderComponent(
    <S3ResourceSelector
      {...defaultProps}
      onChange={event => onChange(event.detail)}
      selectableItemsTypes={['versions']}
    />
  );
  await openBrowseDialog(wrapper);
  await navigateToTableItem(wrapper, 1); // open a bucket
  await navigateToTableItem(wrapper, 2); // open an object
  wrapper.findTable()!.findRowSelectionArea(1)!.click();
  wrapper.findModal()!.findSubmitButton().click();
  expect(onChange).toHaveBeenCalledWith({
    resource: { uri: 's3://bucket-laborum/black-hole-9ns.sim', versionId: '6036589969ec3d9b2db8faa7' },
  });
});

test('should not change the current uri after dismissing a modal', async () => {
  const onChange = jest.fn();
  const wrapper = renderComponent(
    <S3ResourceSelector
      {...defaultProps}
      resource={{ uri: 's3://test-bucket' }}
      onChange={event => onChange(event.detail)}
    />
  );
  expect(wrapper.findInContext().findUriInput().findNativeInput().getElement()).toHaveValue('s3://test-bucket');
  await openBrowseDialog(wrapper);
  wrapper.findTable()!.findRowSelectionArea(1)!.click();
  wrapper.findModal()!.findDismissButton().click();
  expect(onChange).not.toHaveBeenCalled();
  expect(wrapper.findInContext().findUriInput().findNativeInput().getElement()).toHaveValue('s3://test-bucket');
});

test('resets modal state after dismiss and reopen', async () => {
  const onChange = jest.fn();
  const wrapper = renderComponent(
    <S3ResourceSelector
      {...defaultProps}
      resource={{ uri: 's3://test-bucket' }}
      onChange={event => onChange(event.detail)}
    />
  );
  await openBrowseDialog(wrapper);
  wrapper.findTable()!.findRowSelectionArea(1)!.click();
  expect(wrapper.findTable()!.findSelectedRows()).toHaveLength(1);
  wrapper.findModal()!.findDismissButton().click();
  await openBrowseDialog(wrapper);
  expect(wrapper.findTable()!.findSelectedRows()).toHaveLength(0);
});

test('renders only a single alert regardless the modal is open or not', async () => {
  const wrapper = renderComponent(<S3ResourceSelector {...defaultProps} alert={<div data-testid="alert" />} />);
  expect(screen.getAllByTestId('alert')).toHaveLength(1);
  expect(wrapper.findAlertSlot()!.getElement()).toContainHTML('<div data-testid="alert"></div>');
  await openBrowseDialog(wrapper);
  expect(screen.getAllByTestId('alert')).toHaveLength(1);
  expect(wrapper.findModal()!.find('[data-testid="alert"]')!.getElement()).toContainHTML(
    '<div data-testid="alert"></div>'
  );
});

test('focuses the S3Uri field when calling the focus function', () => {
  let ref: S3ResourceSelectorProps.Ref | null;
  const wrapper = renderComponent(<S3ResourceSelector ref={value => (ref = value)} {...defaultProps} />);
  wrapper.findInContext().findBrowseButton().focus();
  expect(wrapper.findInContext().findBrowseButton().getElement()).toBe(document.activeElement);
  ref!.focus();
  expect(wrapper.findInContext().findUriInput().findNativeInput().getElement()).toBe(document.activeElement);
});

describe('URL sanitization', () => {
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });
  afterEach(() => {
    consoleWarnSpy?.mockRestore();
    consoleErrorSpy?.mockRestore();
  });

  test('does not throw an error when a safe javascript: URL is passed', () => {
    const element = renderComponent(<S3ResourceSelector {...defaultProps} viewHref="javascript:void(0)" />);
    expect((element.findInContext().findViewButton().getElement() as unknown as HTMLAnchorElement).href).toBe(
      'javascript:void(0)'
    );
    expect(console.warn).toHaveBeenCalledTimes(0);
  });

  test('throws an error when a dangerous javascript: URL is passed', () => {
    expect(() =>
      renderComponent(<S3ResourceSelector {...defaultProps} viewHref="javascript:alert('Hello!')" />)
    ).toThrow('A javascript: URL was blocked as a security precaution.');

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      `[AwsUi] [S3ResourceSelector] A javascript: URL was blocked as a security precaution. The URL was "javascript:alert('Hello!')".`
    );
  });
});

test('Should have role as group', () => {
  const wrapper = renderComponent(<S3ResourceSelector {...defaultProps} />);
  expect(wrapper.getElement()).toHaveAttribute('role', 'group');
});

test('Should have aria-label when it is set', () => {
  const wrapper = renderComponent(<S3ResourceSelector {...defaultProps} ariaLabel={'aria label'} />);
  expect(wrapper.getElement()).toHaveAttribute('aria-label', 'aria label');
});

test('Should inherits aria-labelledby aria-describedby from the surrounding FormField', () => {
  const wrapper = renderComponent(
    <FormField controlId="test-control" description="test description" label="test label">
      <S3ResourceSelector {...defaultProps} />
    </FormField>
  );
  expect(wrapper.getElement()).toHaveAttribute('aria-labelledby', 'test-control-label');
  expect(wrapper.getElement()).toHaveAttribute('aria-describedby', 'test-control-description');
});

test('Should overwrites aria-labelledby aria-describedby from surrounding FormField when they are set on itself', () => {
  const wrapper = renderComponent(
    <FormField controlId="test-control" description="test description" label="test label">
      <S3ResourceSelector {...defaultProps} ariaDescribedby={'description-id'} ariaLabelledby={'label-id'} />
    </FormField>
  );
  expect(wrapper.getElement()).toHaveAttribute('aria-labelledby', 'label-id');
  expect(wrapper.getElement()).toHaveAttribute('aria-describedby', 'description-id');
});

describe('i18n', () => {
  test('supports using (bucket) modal strings from i18n provider', async () => {
    const wrapper = renderComponent(
      <TestI18nProvider
        messages={{
          's3-resource-selector': {
            'i18nStrings.modalTitle': 'Custom modal title',
            'i18nStrings.modalCancelButton': 'Custom cancel',
            'i18nStrings.modalSubmitButton': 'Custom submit',
            'i18nStrings.modalBreadcrumbRootItem': 'Custom root',
            'i18nStrings.selectionBuckets': 'Custom buckets',
            'i18nStrings.labelRefresh': 'Custom refresh',
            'i18nStrings.selectionBucketsSearchPlaceholder': 'Custom find buckets',
            'i18nStrings.columnBucketName': 'Custom name',
            'i18nStrings.columnBucketCreationDate': 'Custom creation date',
            'i18nStrings.labelFiltering': 'Custom find {itemsType}',
            'i18nStrings.labelNotSorted': 'Custom {columnName} not sorted',
            'i18nStrings.labelSortedAscending': 'Custom {columnName} sorted ascending',
            'i18nStrings.labelSortedDescending': 'Custom {columnName} sorted descending',
          },
        }}
      >
        <S3ResourceSelector {...defaultProps} i18nStrings={undefined} />
      </TestI18nProvider>
    );
    await openBrowseDialog(wrapper);
    expect(wrapper.findModal()!.findHeader().getElement()).toHaveTextContent('Custom modal title');
    expect(
      wrapper.findModal()!.findFooter()!.findSpaceBetween()!.find(':nth-child(1)')!.findButton()!.getElement()
    ).toHaveTextContent('Custom cancel');
    expect(
      wrapper.findModal()!.findFooter()!.findSpaceBetween()!.find(':nth-child(2)')!.findButton()!.getElement()
    ).toHaveTextContent('Custom submit');
    const modalContent = wrapper.findModal()!.findContent();
    expect(modalContent.findBreadcrumbGroup()!.getElement()).toHaveTextContent('Custom root');
    const table = modalContent.findTable()!;
    expect(table.findHeaderSlot()!.findHeader()!.findHeadingText().getElement()).toHaveTextContent('Custom buckets');
    expect(table.findHeaderSlot()!.findHeader()!.findActions()!.findButton()!.getElement()).toHaveAttribute(
      'aria-label',
      'Custom refresh'
    );
    expect(table.findHeaderSlot()!.findTextFilter()!.findInput()!.findNativeInput()!.getElement()).toHaveAttribute(
      'placeholder',
      'Custom find buckets'
    );
    expect(table.findHeaderSlot()!.findTextFilter()!.findInput()!.findNativeInput()!.getElement()).toHaveAttribute(
      'aria-label',
      'Custom find Custom buckets'
    );
    expect(table.findColumnHeaders()[1].getElement()).toHaveTextContent('Custom name');
    expect(table.findColumnSortingArea(2)!.getElement()).toHaveAttribute('aria-label', 'Custom Custom name not sorted');
    expect(table.findColumnHeaders()[2].getElement()).toHaveTextContent('Custom creation date');
    expect(table.findColumnSortingArea(3)!.getElement()).toHaveAttribute(
      'aria-label',
      'Custom Custom creation date not sorted'
    );

    table.findColumnSortingArea(2)!.click();
    expect(table.findColumnSortingArea(2)!.getElement()).toHaveAttribute(
      'aria-label',
      'Custom Custom name sorted ascending'
    );
    table.findColumnSortingArea(2)!.click();
    expect(table.findColumnSortingArea(2)!.getElement()).toHaveAttribute(
      'aria-label',
      'Custom Custom name sorted descending'
    );
  });
});
