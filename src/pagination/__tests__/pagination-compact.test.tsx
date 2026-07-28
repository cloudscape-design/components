// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import I18nProvider from '../../../lib/components/i18n';
import messages from '../../../lib/components/i18n/messages/all.en';
import Pagination from '../../../lib/components/pagination';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderPagination(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findPagination()!;
  return { wrapper, rerender };
}

function renderWithI18n(jsx: React.ReactElement) {
  const { container, rerender } = render(
    <I18nProvider messages={[messages]} locale="en">
      {jsx}
    </I18nProvider>
  );
  const wrapper = createWrapper(container).findPagination()!;
  return { wrapper, rerender };
}

describe('compact variant', () => {
  describe('visible counter text', () => {
    test('uses i18n catalog "# of #" format when i18n provider is present', () => {
      const { wrapper } = renderWithI18n(<Pagination pagesVariant="compact" currentPageIndex={3} pagesCount={12} />);
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('3 of 12');
    });

    test('appends "+" to the localized text when openEnd is true', () => {
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

    test('visible text updates when currentPageIndex changes', () => {
      const { wrapper, rerender } = renderWithI18n(
        <Pagination pagesVariant="compact" currentPageIndex={1} pagesCount={10} />
      );
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('1 of 10');

      rerender(
        <I18nProvider messages={[messages]} locale="en">
          <Pagination pagesVariant="compact" currentPageIndex={7} pagesCount={10} />
        </I18nProvider>
      );
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('7 of 10');
    });
  });
});
