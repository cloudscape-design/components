// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Pagination, { PaginationProps } from '../../../lib/components/pagination';
import InternalPagination from '../../../lib/components/pagination/internal';
import createWrapper, { PaginationWrapper } from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

const ariaLabels = {
  paginationLabel: 'Pagination label',
  nextPageLabel: 'Next page',
  previousPageLabel: 'Previous page',
  pageLabel: (pageNumber: number) => `Page ${pageNumber}`,
};

function renderPagination(props: PaginationProps) {
  const renderResult = render(<Pagination {...props} ariaLabels={ariaLabels} />);
  return createWrapper(renderResult.container).findPagination()!;
}

const testNext = (wrapper: PaginationWrapper) => {
  const nextButton = wrapper.findNextPageButton()!.getElement();
  validateComponentNameAndLabels(nextButton, {});
  expect(getGeneratedAnalyticsMetadata(nextButton)).toMatchSnapshot();
};
const testPrevious = (wrapper: PaginationWrapper) => {
  const previousButton = wrapper.findPreviousPageButton()!.getElement();
  validateComponentNameAndLabels(previousButton, {});
  expect(getGeneratedAnalyticsMetadata(previousButton)).toMatchSnapshot();
};
const testButton = (wrapper: PaginationWrapper) => {
  const pageButton = wrapper.findPageNumbers()![2]!.getElement();
  validateComponentNameAndLabels(pageButton, {});
  expect(getGeneratedAnalyticsMetadata(pageButton)).toMatchSnapshot();
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Pagination renders correct analytics metadata', () => {
  test('enabled', () => {
    const paginationProps: PaginationProps = {
      pagesCount: 300,
      currentPageIndex: 20,
    };
    const wrapper = renderPagination(paginationProps);

    testNext(wrapper);
    testPrevious(wrapper);
    testButton(wrapper);
  });
  test('disabled', () => {
    const paginationProps: PaginationProps = {
      pagesCount: 300,
      currentPageIndex: 20,
      disabled: true,
    };
    const wrapper = renderPagination(paginationProps);

    testNext(wrapper);
    testPrevious(wrapper);
    testButton(wrapper);
  });

  test('first page', () => {
    const paginationProps: PaginationProps = {
      pagesCount: 300,
      currentPageIndex: 1,
    };
    const wrapper = renderPagination(paginationProps);

    testNext(wrapper);
    testPrevious(wrapper);
    testButton(wrapper);
  });

  test('last page', () => {
    const paginationProps: PaginationProps = {
      pagesCount: 300,
      currentPageIndex: 300,
    };
    const wrapper = renderPagination(paginationProps);

    testNext(wrapper);
    testPrevious(wrapper);
    testButton(wrapper);
  });

  test('last page and openEnd', () => {
    const paginationProps: PaginationProps = {
      pagesCount: 300,
      currentPageIndex: 300,
      openEnd: true,
    };
    const wrapper = renderPagination(paginationProps);

    testNext(wrapper);
    testPrevious(wrapper);
    testButton(wrapper);
  });
});

test('Internal Pagination does not render "component" metadata', () => {
  const renderResult = render(<InternalPagination pagesCount={300} currentPageIndex={2} />);
  const wrapper = createWrapper(renderResult.container).findPagination()!;
  validateComponentNameAndLabels(wrapper.getElement(), {});
  expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toMatchSnapshot();
});
