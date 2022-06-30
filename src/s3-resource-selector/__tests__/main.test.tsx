// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import S3ResourceSelector, { S3ResourceSelectorProps } from '../../../lib/components/s3-resource-selector';
import createWrapper, { S3ResourceSelectorWrapper } from '../../../lib/components/test-utils/dom';
import { buckets, i18nStrings, objects, versions, waitForFetch } from './fixtures';

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
