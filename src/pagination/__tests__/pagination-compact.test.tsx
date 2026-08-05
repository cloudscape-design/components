// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import TestI18nProvider from '../../../lib/components/i18n/testing';
import Pagination from '../../../lib/components/pagination';
import createWrapper from '../../../lib/components/test-utils/dom';

// A controlled catalog so the tests exercise pagination's substitution and the
// openEnd `select` branch, independent of the real shipped strings.
const i18nMessages = {
  pagination: {
    'i18nStrings.pagesCompactText':
      '{openEnd, select, true {{currentPage} of {pagesCount}+} false {{currentPage} of {pagesCount}} other {}}',
  },
};

function renderPagination(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findPagination()!;
  return { wrapper, rerender };
}

function renderWithI18n(jsx: React.ReactElement) {
  const { container, rerender } = render(<TestI18nProvider messages={i18nMessages}>{jsx}</TestI18nProvider>);
  const wrapper = createWrapper(container).findPagination()!;
  return { wrapper, rerender };
}

describe('compact variant', () => {
  describe('visible counter text', () => {
    test('substitutes the page state into the i18n string when a provider is present', () => {
      const { wrapper } = renderWithI18n(<Pagination pagesVariant="compact" currentPageIndex={3} pagesCount={12} />);
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('3 of 12');
    });

    test('selects the openEnd branch of the i18n string when openEnd is true', () => {
      const { wrapper } = renderWithI18n(
        <Pagination pagesVariant="compact" currentPageIndex={3} pagesCount={12} openEnd={true} />
      );
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('3 of 12+');
    });

    test('calls the consumer override with the page state and uses its result (no i18n provider)', () => {
      const pagesCompactText = jest.fn(
        ({ currentPage, pagesCount, openEnd }: { currentPage: number; pagesCount: number; openEnd: boolean }) =>
          `${currentPage} / ${pagesCount}${openEnd ? '+' : ''}`
      );
      const { wrapper } = renderPagination(
        <Pagination
          pagesVariant="compact"
          currentPageIndex={3}
          pagesCount={12}
          openEnd={true}
          i18nStrings={{ pagesCompactText }}
        />
      );

      expect(pagesCompactText).toHaveBeenCalledWith({ currentPage: 3, pagesCount: 12, openEnd: true });
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('3 / 12+');
    });

    test('consumer override takes precedence over the i18n provider string', () => {
      const { wrapper } = renderWithI18n(
        <Pagination
          pagesVariant="compact"
          currentPageIndex={3}
          pagesCount={12}
          i18nStrings={{ pagesCompactText: ({ currentPage, pagesCount }) => `${currentPage} / ${pagesCount}` }}
        />
      );
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('3 / 12');
    });
  });
});
