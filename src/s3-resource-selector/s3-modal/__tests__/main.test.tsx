// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import createWrapper from '../../../../lib/components/test-utils/dom';
import { S3Modal } from '../../../../lib/components/s3-resource-selector/s3-modal';
import { i18nStrings, waitForFetch } from '../../__tests__/fixtures';
import { modalDefaultProps, navigateToTableItem } from './utils';

jest.setTimeout(20_000);

async function renderModal(jsx: React.ReactElement) {
  render(jsx);
  await waitForFetch();
  // modal renders to the document body, we search its content there
  return createWrapper(document.body);
}

test('renders correct strings and aria labels', async () => {
  const wrapper = await renderModal(<S3Modal {...modalDefaultProps} />);
  const modal = wrapper.findModal()!;
  expect(modal.findHeader().getElement()).toHaveTextContent(i18nStrings.modalTitle!);
  expect(screen.getByRole('button', { name: i18nStrings.modalSubmitButton })).toBeTruthy();
  expect(screen.getByRole('button', { name: i18nStrings.modalCancelButton })).toBeTruthy();
  expect(modal.findContent().findBreadcrumbGroup()!.getElement()).toHaveAttribute(
    'aria-label',
    i18nStrings.labelBreadcrumbs
  );
  expect(modal.findDismissButton().getElement()).toHaveAttribute('aria-label', i18nStrings.labelModalDismiss);
});

test('modal has valid hierarchy of headings', async () => {
  const wrapper = await renderModal(<S3Modal {...modalDefaultProps} />);
  const modal = wrapper.findModal()!;
  expect(modal.findHeader().findAll('h2').length).toBe(1);
  const table = wrapper.findTable()!;
  await waitForFetch();
  expect(table.findHeaderSlot()!.findHeader()!.findAll('h3').length).toBe(1);
});

test('renders alert content when provided', async () => {
  const wrapper = await renderModal(<S3Modal {...modalDefaultProps} alert={<div data-testid="test-alert" />} />);
  expect(wrapper.findModal()!.findContent().find('[data-testid="test-alert"]')).toBeTruthy();
});

test('should enable submit button when there is active selection', async () => {
  const wrapper = await renderModal(<S3Modal {...modalDefaultProps} />);
  expect(screen.getByRole('button', { name: i18nStrings.modalSubmitButton })).toBeDisabled();
  wrapper.findTable()!.findRowSelectionArea(1)!.click();
  expect(screen.getByRole('button', { name: i18nStrings.modalSubmitButton })).toBeEnabled();
});

test('should reset the selection when changing path', async () => {
  const wrapper = await renderModal(<S3Modal {...modalDefaultProps} />);
  wrapper.findTable()!.findRowSelectionArea(1)!.click();
  expect(wrapper.findTable()!.findSelectedRows()).toHaveLength(1);
  // open a bucket
  wrapper.findTable()!.findBodyCell(1, 2)!.findLink()!.click();
  await waitForFetch();
  wrapper.findBreadcrumbGroup()!.findBreadcrumbLinks()[0].click();
  // go back to buckets list
  await waitForFetch();
  expect(wrapper.findTable()!.findHeaderSlot()!.getElement()).toHaveTextContent('Buckets');
  expect(wrapper.findTable()!.findSelectedRows()).toHaveLength(0);
});

test('should reset the filtering and sorting state when changing path', async () => {
  const wrapper = await renderModal(<S3Modal {...modalDefaultProps} />);
  act(() => {
    wrapper.findTextFilter()!.findInput().setInputValue('ea');
    wrapper.findTable()!.findColumnSortingArea(2)!.click();
  });
  expect(wrapper.findTable()!.findAscSortedColumn()).toBeTruthy();
  expect(wrapper.findTextFilter()!.findInput().findNativeInput().getElement()).toHaveValue('ea');
  await navigateToTableItem(wrapper, 1);
  expect(wrapper.findTable()!.findAscSortedColumn()).toBeFalsy();
  expect(wrapper.findTextFilter()!.findInput().findNativeInput().getElement()).toHaveValue('');
});

test('reloads current data upon the refresh button click', async () => {
  const fetchBuckets = jest.fn(() => Promise.resolve([]));
  await renderModal(<S3Modal {...modalDefaultProps} fetchBuckets={fetchBuckets} />);
  fetchBuckets.mockClear();
  screen.getByRole('button', { name: i18nStrings.labelRefresh }).click();
  await waitForFetch();
  expect(fetchBuckets).toHaveBeenCalled();
});

test('calls submit handler with selected bucket', async () => {
  const onSubmit = jest.fn();
  const wrapper = await renderModal(<S3Modal {...modalDefaultProps} onSubmit={onSubmit} />);
  wrapper.findTable()!.findRowSelectionArea(1)!.click();
  screen.getByRole('button', { name: i18nStrings.modalSubmitButton }).click();
  expect(onSubmit).toHaveBeenCalledWith({ uri: 's3://bucket-laborum' });
});

test('calls submit handler with selected object', async () => {
  const onSubmit = jest.fn();
  const wrapper = await renderModal(<S3Modal {...modalDefaultProps} onSubmit={onSubmit} />);
  await navigateToTableItem(wrapper, 1); // open a bucket contents
  wrapper.findTable()!.findRowSelectionArea(2)!.click();
  screen.getByRole('button', { name: i18nStrings.modalSubmitButton }).click();
  expect(onSubmit).toHaveBeenCalledWith({ uri: 's3://bucket-laborum/black-hole-9ns.sim' });
});

test('calls submit handler with selected version', async () => {
  const onSubmit = jest.fn();
  const wrapper = await renderModal(<S3Modal {...modalDefaultProps} onSubmit={onSubmit} />);
  await navigateToTableItem(wrapper, 1); // open a bucket contents
  await navigateToTableItem(wrapper, 2); // open an object
  wrapper.findTable()!.findRowSelectionArea(1)!.click(); // select a version
  screen.getByRole('button', { name: i18nStrings.modalSubmitButton }).click();
  expect(onSubmit).toHaveBeenCalledWith({
    uri: 's3://bucket-laborum/black-hole-9ns.sim',
    versionId: '6036589969ec3d9b2db8faa7',
  });
});
