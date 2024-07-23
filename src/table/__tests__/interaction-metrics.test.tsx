// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render as rtlRender } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';

import CollectionPreferences from '../../../lib/components/collection-preferences';
import { PerformanceMetrics } from '../../../lib/components/internal/analytics';
import Pagination from '../../../lib/components/pagination';
import Table from '../../../lib/components/table';
import createWrapper, { InputWrapper } from '../../../lib/components/test-utils/dom';
import TextFilter from '../../../lib/components/text-filter';
import { mockPerformanceMetrics } from '../../internal/analytics/__tests__/mocks';

beforeEach(() => {
  jest.resetAllMocks();
  mockPerformanceMetrics();
});

function render(jsx: React.ReactElement) {
  const { container, rerender } = rtlRender(jsx);

  return {
    textFilterWrapper: createWrapper(container).findTable()!.findTextFilter()!,
    paginationWrapper: createWrapper(container).findTable()!.findPagination()!,
    preferencesWrapper: createWrapper(container).findTable()!.findCollectionPreferences()!,
    rerender,
  };
}

test('should track clicks in the filter slot', () => {
  const { textFilterWrapper, rerender } = render(
    <Table items={[]} columnDefinitions={[]} filter={<TextFilter filteringText="" />} />
  );
  textFilterWrapper.findInput().click();
  rerender(<Table items={[]} columnDefinitions={[]} filter={<TextFilter filteringText="" />} loading={true} />);
  rerender(<Table items={[]} columnDefinitions={[]} filter={<TextFilter filteringText="" />} loading={false} />);

  expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledTimes(1);
  expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledWith(expect.objectContaining({ userAction: 'filter' }));
});

function pressKey(wrapper: InputWrapper) {
  wrapper.keydown(KeyCode.space);
  wrapper.keyup(KeyCode.space);
  wrapper.keypress(KeyCode.space);
}

test('should track keypresses in filter slot', () => {
  const { textFilterWrapper, rerender } = render(
    <Table items={[]} columnDefinitions={[]} filter={<TextFilter filteringText="" />} />
  );
  pressKey(textFilterWrapper.findInput());
  rerender(<Table items={[]} columnDefinitions={[]} filter={<TextFilter filteringText="" />} loading={true} />);
  rerender(<Table items={[]} columnDefinitions={[]} filter={<TextFilter filteringText="" />} loading={false} />);

  expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledTimes(1);
  expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledWith(expect.objectContaining({ userAction: 'filter' }));
});

test('should track clicks in the pagination slot', () => {
  const { paginationWrapper, rerender } = render(
    <Table items={[]} columnDefinitions={[]} pagination={<Pagination currentPageIndex={0} pagesCount={5} />} />
  );
  paginationWrapper.findPageNumberByIndex(2)!.click();
  rerender(
    <Table
      items={[]}
      columnDefinitions={[]}
      pagination={<Pagination currentPageIndex={0} pagesCount={5} />}
      loading={true}
    />
  );
  rerender(
    <Table
      items={[]}
      columnDefinitions={[]}
      pagination={<Pagination currentPageIndex={0} pagesCount={5} />}
      loading={false}
    />
  );

  expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledTimes(1);
  expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledWith(
    expect.objectContaining({ userAction: 'pagination' })
  );
});

test('should track clicks in preferences slot', () => {
  const { preferencesWrapper, rerender } = render(
    <Table items={[]} columnDefinitions={[]} preferences={<CollectionPreferences />} />
  );
  preferencesWrapper.findTriggerButton()!.click();
  preferencesWrapper.findModal()!.findConfirmButton()!.click();
  rerender(<Table items={[]} columnDefinitions={[]} preferences={<CollectionPreferences />} loading={true} />);
  rerender(<Table items={[]} columnDefinitions={[]} preferences={<CollectionPreferences />} loading={false} />);

  expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledTimes(1);
  expect(PerformanceMetrics.tableInteraction).toHaveBeenCalledWith(
    expect.objectContaining({ userAction: 'preferences' })
  );
});
