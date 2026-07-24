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
  describe('rendering', () => {
    test('renders a single counter element between the prev/next arrows', () => {
      const { wrapper } = renderPagination(<Pagination pagesVariant="compact" currentPageIndex={3} pagesCount={12} />);
      // Should have exactly 3 li elements: prev, counter, next
      expect(wrapper.findAll('li')).toHaveLength(3);
    });

    test('findPagesCompactText returns the visible text element', () => {
      const { wrapper } = renderPagination(<Pagination pagesVariant="compact" currentPageIndex={3} pagesCount={12} />);
      const counter = wrapper.findPagesCompactText();
      expect(counter).not.toBeNull();
    });

    test('findPagesCompactText returns null in normal variant', () => {
      const { wrapper } = renderPagination(<Pagination currentPageIndex={3} pagesCount={12} />);
      expect(wrapper.findPagesCompactText()).toBeNull();
    });

    test('does NOT render page number buttons in compact variant', () => {
      const { wrapper } = renderPagination(<Pagination pagesVariant="compact" currentPageIndex={5} pagesCount={10} />);
      expect(wrapper.findPageNumbers()).toHaveLength(0);
    });
  });

  describe('visible counter text', () => {
    test('uses neutral fallback "# / #" when no i18n provider and no consumer override', () => {
      const { wrapper } = renderPagination(<Pagination pagesVariant="compact" currentPageIndex={3} pagesCount={12} />);
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('3 / 12');
    });

    test('uses i18n catalog "# of #" format when i18n provider is present', () => {
      const { wrapper } = renderWithI18n(<Pagination pagesVariant="compact" currentPageIndex={3} pagesCount={12} />);
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('3 of 12');
    });

    test('appends "+" to the fallback when openEnd is true', () => {
      const { wrapper } = renderPagination(
        <Pagination pagesVariant="compact" currentPageIndex={3} pagesCount={12} openEnd={true} />
      );
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('3 / 12+');
    });

    test('appends "+" to the localized text when openEnd is true', () => {
      const { wrapper } = renderWithI18n(
        <Pagination pagesVariant="compact" currentPageIndex={3} pagesCount={12} openEnd={true} />
      );
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('3 of 12+');
    });

    test('passes named page state to a consumer override', () => {
      const pagesCompactText = jest.fn(
        ({ currentPage, pagesCount, openEnd }: { currentPage: number; pagesCount: number; openEnd: boolean }) =>
          `${currentPage} / ${pagesCount}${openEnd ? '+' : ''}`
      );
      const { wrapper } = renderWithI18n(
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

    test('visible counter is announced directly (not aria-hidden)', () => {
      const { wrapper } = renderPagination(<Pagination pagesVariant="compact" currentPageIndex={3} pagesCount={12} />);
      expect(wrapper.findPagesCompactText()!.getElement()).not.toHaveAttribute('aria-hidden');
    });
  });

  describe('navigation — prev/next arrows', () => {
    test('findPreviousPageButton works in compact variant', () => {
      const { wrapper } = renderPagination(<Pagination pagesVariant="compact" currentPageIndex={3} pagesCount={12} />);
      expect(wrapper.findPreviousPageButton()).not.toBeNull();
    });

    test('findNextPageButton works in compact variant', () => {
      const { wrapper } = renderPagination(<Pagination pagesVariant="compact" currentPageIndex={3} pagesCount={12} />);
      expect(wrapper.findNextPageButton()).not.toBeNull();
    });

    test('clicking next page fires onChange and onNextPageClick', () => {
      const onChange = jest.fn();
      const onNextPageClick = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination
          pagesVariant="compact"
          currentPageIndex={3}
          pagesCount={12}
          onChange={onChange}
          onNextPageClick={onNextPageClick}
        />
      );
      wrapper.findNextPageButton().click();

      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { currentPageIndex: 4 } }));
      expect(onNextPageClick).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { requestedPageAvailable: true, requestedPageIndex: 4 },
        })
      );
    });

    test('clicking previous page fires onChange and onPreviousPageClick', () => {
      const onChange = jest.fn();
      const onPreviousPageClick = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination
          pagesVariant="compact"
          currentPageIndex={3}
          pagesCount={12}
          onChange={onChange}
          onPreviousPageClick={onPreviousPageClick}
        />
      );
      wrapper.findPreviousPageButton().click();

      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { currentPageIndex: 2 } }));
      expect(onPreviousPageClick).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { requestedPageAvailable: true, requestedPageIndex: 2 },
        })
      );
    });

    test('previous button is disabled on first page', () => {
      const { wrapper } = renderPagination(<Pagination pagesVariant="compact" currentPageIndex={1} pagesCount={10} />);
      expect(wrapper.findPreviousPageButton().getElement()).toHaveAttribute('aria-disabled', 'true');
      expect(wrapper.findNextPageButton().getElement()).not.toHaveAttribute('aria-disabled');
    });

    test('next button is disabled on last page', () => {
      const { wrapper } = renderPagination(<Pagination pagesVariant="compact" currentPageIndex={10} pagesCount={10} />);
      expect(wrapper.findNextPageButton().getElement()).toHaveAttribute('aria-disabled', 'true');
      expect(wrapper.findPreviousPageButton().getElement()).not.toHaveAttribute('aria-disabled');
    });

    test('next button remains enabled on the last known page when openEnd is true', () => {
      const { wrapper } = renderPagination(
        <Pagination pagesVariant="compact" currentPageIndex={10} pagesCount={10} openEnd={true} />
      );
      expect(wrapper.findNextPageButton().getElement()).not.toHaveAttribute('aria-disabled');
    });

    test('does not fire onChange when clicking disabled previous button on first page', () => {
      const onChange = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination pagesVariant="compact" currentPageIndex={1} pagesCount={10} onChange={onChange} />
      );
      wrapper.findPreviousPageButton().click();
      expect(onChange).not.toHaveBeenCalled();
    });

    test('does not fire onChange when clicking disabled next button on last page', () => {
      const onChange = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination pagesVariant="compact" currentPageIndex={10} pagesCount={10} onChange={onChange} />
      );
      wrapper.findNextPageButton().click();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    test('both prev and next arrows are disabled when disabled=true', () => {
      const { wrapper } = renderPagination(
        <Pagination pagesVariant="compact" currentPageIndex={5} pagesCount={10} disabled={true} />
      );
      expect(wrapper.isDisabled()).toBe(true);
      expect(wrapper.findPreviousPageButton().getElement()).toHaveAttribute('aria-disabled', 'true');
      expect(wrapper.findNextPageButton().getElement()).toHaveAttribute('aria-disabled', 'true');
    });

    test('does not fire onChange when disabled', () => {
      const onChange = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination pagesVariant="compact" currentPageIndex={5} pagesCount={10} disabled={true} onChange={onChange} />
      );
      wrapper.findPreviousPageButton().click();
      wrapper.findNextPageButton().click();
      expect(onChange).not.toHaveBeenCalled();
    });

    test('compact counter text is still visible when disabled', () => {
      const { wrapper } = renderWithI18n(
        <Pagination pagesVariant="compact" currentPageIndex={5} pagesCount={10} disabled={true} />
      );
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('5 of 10');
    });
  });

  describe('boundary conditions', () => {
    test('shows correct text on first page', () => {
      const { wrapper } = renderWithI18n(<Pagination pagesVariant="compact" currentPageIndex={1} pagesCount={20} />);
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('1 of 20');
    });

    test('shows correct text on last page', () => {
      const { wrapper } = renderWithI18n(<Pagination pagesVariant="compact" currentPageIndex={20} pagesCount={20} />);
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('20 of 20');
    });

    test('does not show a current page beyond the last page', () => {
      const { wrapper } = renderWithI18n(<Pagination pagesVariant="compact" currentPageIndex={21} pagesCount={20} />);
      expect(wrapper.findPagesCompactText()!.getElement().textContent).toBe('20 of 20');
    });

    test('works with pagesCount=1', () => {
      const { wrapper } = renderWithI18n(<Pagination pagesVariant="compact" currentPageIndex={1} pagesCount={1} />);
      const counter = wrapper.findPagesCompactText();
      expect(counter).not.toBeNull();
      expect(counter!.getElement().textContent).toBe('1 of 1');
      // Both arrows disabled on single page
      expect(wrapper.findPreviousPageButton().getElement()).toHaveAttribute('aria-disabled', 'true');
      expect(wrapper.findNextPageButton().getElement()).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('normal variant is unaffected', () => {
    test('normal variant does not render compact counter', () => {
      const { wrapper } = renderPagination(<Pagination currentPageIndex={3} pagesCount={12} />);
      expect(wrapper.findPagesCompactText()).toBeNull();
    });

    test('normal variant renders page number buttons as usual', () => {
      const { wrapper } = renderPagination(<Pagination currentPageIndex={3} pagesCount={5} />);
      expect(wrapper.findPageNumbers().length).toBeGreaterThan(0);
    });
  });

  describe('compact variant with jumpToPage', () => {
    test('renders jump to page input alongside compact counter', () => {
      const { wrapper } = renderPagination(
        <Pagination pagesVariant="compact" currentPageIndex={3} pagesCount={12} jumpToPage={{}} />
      );
      expect(wrapper.findJumpToPageInput()).not.toBeNull();
      expect(wrapper.findPagesCompactText()).not.toBeNull();
    });

    test('findNextPageButton works when jumpToPage is present in compact pages', () => {
      const { wrapper } = renderPagination(
        <Pagination pagesVariant="compact" currentPageIndex={3} pagesCount={12} jumpToPage={{}} />
      );
      expect(wrapper.findNextPageButton().getElement().tagName.toLowerCase()).toBe('button');
    });
  });
});
