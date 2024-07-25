// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
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

const getMetadata = (label: string, props: PaginationProps, eventDetail?: Record<string, string>) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Pagination',
          label,
          properties: {
            openEnd: `${!!props.openEnd}`,
            pagesCount: `${props.pagesCount || ''}`,
            currentPageIndex: `${props.currentPageIndex}`,
          },
        },
      },
    ],
  };
  if (eventDetail) {
    metadata.action = 'click';
    metadata.detail = eventDetail;
  }
  return metadata;
};

const testNext = (wrapper: PaginationWrapper, props: PaginationProps, disabled?: boolean) => {
  const nextButton = wrapper.findNextPageButton()!.getElement();
  validateComponentNameAndLabels(nextButton, {});
  expect(getGeneratedAnalyticsMetadata(nextButton)).toEqual(
    getMetadata(
      ariaLabels.paginationLabel,
      props,
      disabled ? undefined : { label: ariaLabels.nextPageLabel, position: 'next' }
    )
  );
};
const testPrevious = (wrapper: PaginationWrapper, props: PaginationProps, disabled?: boolean) => {
  const previousButton = wrapper.findPreviousPageButton()!.getElement();
  validateComponentNameAndLabels(previousButton, {});
  expect(getGeneratedAnalyticsMetadata(previousButton)).toEqual(
    getMetadata(
      ariaLabels.paginationLabel,
      props,
      disabled ? undefined : { label: ariaLabels.previousPageLabel, position: 'prev' }
    )
  );
};
const testButton = (wrapper: PaginationWrapper, props: PaginationProps, page: number, disabled?: boolean) => {
  const pageButton = wrapper.findPageNumbers()![2]!.getElement();
  validateComponentNameAndLabels(pageButton, {});
  expect(getGeneratedAnalyticsMetadata(pageButton)).toEqual(
    getMetadata(
      ariaLabels.paginationLabel,
      props,
      disabled ? undefined : { label: ariaLabels.pageLabel(page), position: `${page}` }
    )
  );
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

    testNext(wrapper, paginationProps);
    testPrevious(wrapper, paginationProps);
    testButton(wrapper, paginationProps, 19);
  });
  test('disabled', () => {
    const paginationProps: PaginationProps = {
      pagesCount: 300,
      currentPageIndex: 20,
      disabled: true,
    };
    const wrapper = renderPagination(paginationProps);

    testNext(wrapper, paginationProps, true);
    testPrevious(wrapper, paginationProps, true);
    testButton(wrapper, paginationProps, 19, true);
  });

  test('first page', () => {
    const paginationProps: PaginationProps = {
      pagesCount: 300,
      currentPageIndex: 1,
    };
    const wrapper = renderPagination(paginationProps);

    testNext(wrapper, paginationProps);
    testPrevious(wrapper, paginationProps, true);
    testButton(wrapper, paginationProps, 3);
  });

  test('last page', () => {
    const paginationProps: PaginationProps = {
      pagesCount: 300,
      currentPageIndex: 300,
    };
    const wrapper = renderPagination(paginationProps);

    testNext(wrapper, paginationProps, true);
    testPrevious(wrapper, paginationProps);
    testButton(wrapper, paginationProps, 295);
  });

  test('last page and openEnd', () => {
    const paginationProps: PaginationProps = {
      pagesCount: 300,
      currentPageIndex: 300,
      openEnd: true,
    };
    const wrapper = renderPagination(paginationProps);

    testNext(wrapper, paginationProps);
    testPrevious(wrapper, paginationProps);
    testButton(wrapper, paginationProps, 296);
  });
});

test('Internal Pagination does not render "component" metadata', () => {
  const renderResult = render(<InternalPagination pagesCount={300} currentPageIndex={2} />);
  const wrapper = createWrapper(renderResult.container).findPagination()!;
  validateComponentNameAndLabels(wrapper.getElement(), {});
  expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual({});
});
