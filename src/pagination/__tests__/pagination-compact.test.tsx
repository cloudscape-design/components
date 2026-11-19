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

function renderWithI18n(jsx: React.ReactElement) {
  const { container } = render(<TestI18nProvider messages={i18nMessages}>{jsx}</TestI18nProvider>);
  const wrapper = createWrapper(container).findPagination()!;
  return { wrapper };
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
