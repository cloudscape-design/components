// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';

import { S3Modal } from '../../../../lib/components/s3-resource-selector/s3-modal';
import createWrapper, { ElementWrapper } from '../../../../lib/components/test-utils/dom';
import { buckets, i18nStrings, objects, versions, waitForFetch } from '../../__tests__/fixtures';
import { getElementsText, modalDefaultProps, navigateToTableItem } from './utils';

import styles from '../../../../lib/components/s3-resource-selector/s3-modal/styles.css.js';

jest.setTimeout(30_000);

async function renderModal(jsx: React.ReactElement) {
  render(jsx);
  await waitForFetch();
  // modal renders to the document body, we search its content there
  return createWrapper(document.body);
}

function getBreadcrumbsText(wrapper: ElementWrapper<Element>) {
  return getElementsText(wrapper.findBreadcrumbGroup()!.findBreadcrumbLinks());
}

async function clickRefreshAndWaitForFetch() {
  screen.getByRole('button', { name: i18nStrings.labelRefresh }).click();
  await waitForFetch();
}

test('updating breadcrumbs and header text when navigating the bucket contents', async () => {
  const wrapper = await renderModal(<S3Modal {...modalDefaultProps} />);
  expect(getElementsText(wrapper.findBreadcrumbGroup()!.findBreadcrumbLinks())).toEqual(['S3 buckets']);
  expect(wrapper.findTable()!.findHeaderSlot()!.findHeader()!.getElement()).toHaveTextContent('Buckets');
  // open a bucket
  await navigateToTableItem(wrapper, 1);
  expect(getBreadcrumbsText(wrapper)).toEqual(['S3 buckets', 'bucket-laborum']);
  expect(wrapper.findTable()!.findHeaderSlot()!.findHeader()!.getElement()).toHaveTextContent('Objects');
  // open a folder
  await navigateToTableItem(wrapper, 1);
  expect(getBreadcrumbsText(wrapper)).toEqual(['S3 buckets', 'bucket-laborum', 'simulation-nano-2019']);
  // open another nested folder
  await navigateToTableItem(wrapper, 1);
  expect(getBreadcrumbsText(wrapper)).toEqual([
    'S3 buckets',
    'bucket-laborum',
    'simulation-nano-2019',
    'simulation-nano-2019',
  ]);
  expect(wrapper.findTable()!.findHeaderSlot()!.findHeader()!.getElement()).toHaveTextContent('Objects');
  // go back to bucket root
  wrapper.findBreadcrumbGroup()!.findBreadcrumbLinks()[1].click();
  await waitForFetch();
  expect(getBreadcrumbsText(wrapper)).toEqual(['S3 buckets', 'bucket-laborum']);
});

test('calls respective fetching functions when navigating', async () => {
  const fetchBucketsSpy = jest.fn(() => Promise.resolve(buckets));
  const fetchObjectsSpy = jest.fn(() => Promise.resolve(objects));
  const fetchVersionsSpy = jest.fn(() => Promise.resolve(versions));
  const wrapper = await renderModal(
    <S3Modal
      {...modalDefaultProps}
      fetchBuckets={fetchBucketsSpy}
      fetchObjects={fetchObjectsSpy}
      fetchVersions={fetchVersionsSpy}
    />
  );
  expect(fetchBucketsSpy).toHaveBeenCalled();
  fetchBucketsSpy.mockClear();
  expect(fetchObjectsSpy).not.toHaveBeenCalled();
  expect(fetchVersionsSpy).not.toHaveBeenCalled();
  // open a bucket
  await navigateToTableItem(wrapper, 1);
  expect(fetchBucketsSpy).not.toHaveBeenCalled();
  expect(fetchObjectsSpy).toHaveBeenCalledWith('bucket-laborum', '');
  fetchObjectsSpy.mockClear();
  expect(fetchVersionsSpy).not.toHaveBeenCalled();
  // open a folder
  await navigateToTableItem(wrapper, 1);
  expect(fetchBucketsSpy).not.toHaveBeenCalled();
  expect(fetchObjectsSpy).toHaveBeenCalledWith('bucket-laborum', 'simulation-nano-2019');
  fetchObjectsSpy.mockClear();
  expect(fetchVersionsSpy).not.toHaveBeenCalled();
  // open a nested folder
  await navigateToTableItem(wrapper, 1);
  expect(fetchBucketsSpy).not.toHaveBeenCalled();
  expect(fetchObjectsSpy).toHaveBeenCalledWith('bucket-laborum', 'simulation-nano-2019/simulation-nano-2019');
  fetchObjectsSpy.mockClear();
  expect(fetchVersionsSpy).not.toHaveBeenCalled();
  // open object versions
  await navigateToTableItem(wrapper, 2);
  expect(fetchBucketsSpy).not.toHaveBeenCalled();
  expect(fetchObjectsSpy).not.toHaveBeenCalled();
  expect(fetchVersionsSpy).toHaveBeenCalledWith(
    'bucket-laborum',
    'simulation-nano-2019/simulation-nano-2019/black-hole-9ns.sim'
  );
});

test('displays loading text when fetch is in progress', async () => {
  const wrapper = await renderModal(<S3Modal {...modalDefaultProps} />);
  expect(wrapper.findTable()!.findLoadingText()).toBeFalsy();
  // open bucket contents
  act(() => wrapper.findTable()!.findBodyCell(1, 2)!.findLink()!.click());
  expect(wrapper.findTable()!.findLoadingText()!.getElement()).toHaveTextContent('Loading objects');
  await waitForFetch();
  expect(wrapper.findTable()!.findLoadingText()).toBeFalsy();
});

test('dives into folders containing slashes in names', async () => {
  const fetchObjectsSpy = jest.fn();
  fetchObjectsSpy.mockImplementation(() => Promise.resolve([{ Key: 'folder/', IsFolder: true }]));
  const wrapper = await renderModal(<S3Modal {...modalDefaultProps} fetchObjects={fetchObjectsSpy} />);
  // open bucket
  await navigateToTableItem(wrapper, 1);
  fetchObjectsSpy.mockClear();
  // open folder
  await navigateToTableItem(wrapper, 1);
  expect(fetchObjectsSpy).toHaveBeenCalledWith('bucket-laborum', 'folder/');
  fetchObjectsSpy.mockClear();
  fetchObjectsSpy.mockImplementation(() => Promise.resolve([{ Key: '/', IsFolder: true }]));
  await navigateToTableItem(wrapper, 1);
  expect(fetchObjectsSpy).toHaveBeenCalledWith('bucket-laborum', 'folder/folder/');
  fetchObjectsSpy.mockClear();
  await navigateToTableItem(wrapper, 1);
  expect(fetchObjectsSpy).toHaveBeenCalledWith('bucket-laborum', 'folder/folder//');
  fetchObjectsSpy.mockClear();
  fetchObjectsSpy.mockImplementation(() => Promise.resolve([{ Key: 'final', IsFolder: true }]));
  await navigateToTableItem(wrapper, 1);
  expect(fetchObjectsSpy).toHaveBeenCalledWith('bucket-laborum', 'folder/folder///');
  fetchObjectsSpy.mockClear();
  await navigateToTableItem(wrapper, 1);
  expect(fetchObjectsSpy).toHaveBeenCalledWith('bucket-laborum', 'folder/folder///final');
});

describe('last updated status text', () => {
  beforeEach(() => {
    const lastUpdatedDate = new Date('2024-01-02T10:00:00.000Z');
    jest.useFakeTimers().setSystemTime(lastUpdatedDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('does not show the last updated once the initial fetch is done', async () => {
    const wrapper = await renderModal(<S3Modal {...modalDefaultProps} />);
    const lastUpdated = wrapper.findByClassName(styles['last-updated-caption']);

    expect(lastUpdated).toBeFalsy();
  });

  test('renders the last updated time within the aria-live region', async () => {
    const wrapper = await renderModal(<S3Modal {...modalDefaultProps} />);
    await clickRefreshAndWaitForFetch();

    const lastUpdated = wrapper.findByClassName(styles['last-updated-caption'])!.find('[aria-live]')!.getElement();
    await waitFor(() => {
      /**
       * <LiveRegion /> component is using innerText for setting the span element's text content.
       * To populate the textContent from innerText, layout engine is required which JSDom doesn't have.
       * So falling back to assert against innerText rather than the textContent.
       */
      expect(lastUpdated.innerText).toBe('Last updated January 2, 2024, 10:00:00 (UTC)');
    });
  });

  test('updates the "last updated" once the refresh button is clicked and the request is settled', async () => {
    const wrapper = await renderModal(<S3Modal {...modalDefaultProps} />);
    await waitForFetch();

    const refreshFetchDate = new Date('2024-01-02T11:00:00.000Z');
    jest.useFakeTimers().setSystemTime(refreshFetchDate);
    await clickRefreshAndWaitForFetch();

    const lastUpdated = wrapper.findByClassName(styles['last-updated-caption'])!.getElement();
    expect(lastUpdated).toHaveTextContent('Last updatedJanuary 2, 2024, 11:00:00 (UTC)');
  });

  test('does not render "Last updated" when the i18n label is not specified', async () => {
    const wrapper = await renderModal(
      <S3Modal
        {...modalDefaultProps}
        i18nStrings={{ ...modalDefaultProps.i18nStrings, modalLastUpdatedText: undefined }}
      />
    );
    await clickRefreshAndWaitForFetch();

    const lastUpdated = wrapper.findByClassName(styles['last-updated-caption']);
    expect(lastUpdated).toBeFalsy();
  });
});
