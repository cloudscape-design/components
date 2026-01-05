// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';

import Pagination, { PaginationProps } from '../../../lib/components/pagination';
import createWrapper, { PaginationWrapper } from '../../../lib/components/test-utils/dom';

const getItemsContent = (wrapper: PaginationWrapper) =>
  wrapper
    .findAll('li')
    // skip arrow buttons
    .slice(1, -1)
    .map(page => page.getElement().textContent!.trim());

function renderPagination(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findPagination()!;
  return { wrapper, rerender };
}

test('should render page numbers', () => {
  const { wrapper } = renderPagination(<Pagination currentPageIndex={1} pagesCount={3} />);
  expect(getItemsContent(wrapper)).toEqual(['1', '2', '3']);
});

test('should not include truncation and buttons in the page numbers', () => {
  const { wrapper } = renderPagination(<Pagination currentPageIndex={7} pagesCount={15} />);
  expect(wrapper.findPageNumbers()).toHaveLength(7);
  expect(wrapper.findAll('li')).toHaveLength(11);
});

test('should re-render component correctly after current page state change', () => {
  const { wrapper, rerender } = renderPagination(<Pagination currentPageIndex={1} pagesCount={20} />);

  const testCases = [
    { page: 7, state: ['1', '...', '5', '6', '7', '8', '9', '...', '20'] },
    { page: 1, state: ['1', '2', '3', '4', '5', '6', '7', '...', '20'] },
    { page: 6, state: ['1', '...', '4', '5', '6', '7', '8', '...', '20'] },
    { page: 20, state: ['1', '...', '14', '15', '16', '17', '18', '19', '20'] },
  ];
  testCases.map(({ page, state }) => {
    rerender(<Pagination currentPageIndex={page} pagesCount={20} />);
    expect(getItemsContent(wrapper)).toEqual(state);
  });
});

test('should have both arrows disabled when there is only one page', () => {
  const { wrapper } = renderPagination(<Pagination currentPageIndex={1} pagesCount={1} />);
  expect(wrapper.findPreviousPageButton().getElement()).toBeDisabled();
  expect(wrapper.findNextPageButton().getElement()).toBeDisabled();
  expect(wrapper.findPageNumberByIndex(1)!.getElement()).toHaveTextContent('1');
  expect(getItemsContent(wrapper)).toEqual(['1']);
});

test('should have both arrows disabled when there are no pages', () => {
  const { wrapper } = renderPagination(<Pagination currentPageIndex={1} pagesCount={0} />);
  expect(wrapper.findPreviousPageButton().getElement()).toBeDisabled();
  expect(wrapper.findNextPageButton().getElement()).toBeDisabled();
  expect(wrapper.findPageNumberByIndex(1)!.getElement()).toHaveTextContent('1');
  expect(getItemsContent(wrapper)).toEqual(['1']);
});

test('should show all buttons when middle page selected', () => {
  const { wrapper } = renderPagination(<Pagination currentPageIndex={5} pagesCount={9} />);
  expect(wrapper.findPreviousPageButton().getElement()).toBeEnabled();
  expect(wrapper.findNextPageButton().getElement()).toBeEnabled();
  expect(wrapper.findCurrentPage().getElement()).toHaveTextContent('5');
  expect(getItemsContent(wrapper)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
});

test('should not fire nextPageClick event when clicking next page with the last page being active', () => {
  const onChange = jest.fn();
  const onNextPageClick = jest.fn();
  const { wrapper } = renderPagination(
    <Pagination currentPageIndex={10} pagesCount={10} onChange={onChange} onNextPageClick={onNextPageClick} />
  );
  wrapper.findNextPageButton().click();

  expect(onChange).not.toHaveBeenCalled();
  expect(onNextPageClick).not.toHaveBeenCalled();
});

[false, true].forEach(openEnd => {
  describe(`shared functionality, openEnd=${openEnd}`, () => {
    test('should disable `previous` button when first page selected', () => {
      const { wrapper } = renderPagination(<Pagination currentPageIndex={1} pagesCount={10} openEnd={openEnd} />);

      expect(wrapper.findPreviousPageButton().getElement()).toBeDisabled();
      expect(wrapper.findNextPageButton().getElement()).toBeEnabled();
      expect(wrapper.findCurrentPage().getElement()).toHaveTextContent('1');
    });

    test('should trigger on change handler when clicking on the page number', () => {
      const onChange = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination currentPageIndex={1} pagesCount={10} openEnd={openEnd} onChange={onChange} />
      );

      wrapper.findPageNumberByIndex(3)!.click();

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { currentPageIndex: 3 },
        })
      );
    });

    test('should fire nextPageClick event when clicking on the next page button', () => {
      const onChange = jest.fn();
      const onNextPageClick = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination
          currentPageIndex={1}
          pagesCount={10}
          openEnd={openEnd}
          onChange={onChange}
          onNextPageClick={onNextPageClick}
        />
      );
      wrapper.findNextPageButton().click();

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { currentPageIndex: 2 },
        })
      );
      expect(onNextPageClick).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            requestedPageAvailable: true,
            requestedPageIndex: 2,
          },
        })
      );
    });

    test('should fire previousPageClick event with page available', () => {
      const onChange = jest.fn();
      const onPreviousPageClick = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination
          currentPageIndex={2}
          pagesCount={10}
          openEnd={openEnd}
          onChange={onChange}
          onPreviousPageClick={onPreviousPageClick}
        />
      );
      wrapper.findPreviousPageButton().click();

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { currentPageIndex: 1 },
        })
      );
      expect(onPreviousPageClick).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            requestedPageAvailable: true,
            requestedPageIndex: 1,
          },
        })
      );
    });

    test('should not fire previousPageClick event with page not available when requesting page 0', () => {
      const onChange = jest.fn();
      const onPreviousPageClick = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination
          currentPageIndex={1}
          pagesCount={10}
          openEnd={openEnd}
          onChange={onChange}
          onPreviousPageClick={onPreviousPageClick}
        />
      );
      wrapper.findPreviousPageButton().click();

      expect(onChange).not.toHaveBeenCalled();
      expect(onPreviousPageClick).not.toHaveBeenCalled();
    });

    test('should prevent user interaction when set to disabled', () => {
      const onChange = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination currentPageIndex={1} pagesCount={10} openEnd={openEnd} disabled={true} onChange={onChange} />
      );

      expect(wrapper.isDisabled()).toBe(true);
      expect(wrapper.findPreviousPageButton().getElement()).toBeDisabled();
      expect(wrapper.findNextPageButton().getElement()).toBeDisabled();

      wrapper.findPreviousPageButton().click();
      expect(onChange).not.toHaveBeenCalled();
      wrapper.findNextPageButton().click();
      expect(onChange).not.toHaveBeenCalled();
      wrapper.findPageNumberByIndex(3)!.click();
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});

describe('aria-labels', () => {
  test('should add empty aria-labels when the user does not define any', () => {
    const { wrapper } = renderPagination(<Pagination currentPageIndex={1} pagesCount={10} />);
    expect(wrapper.findPreviousPageButton().getElement()).toHaveAttribute('aria-label', '');
    expect(wrapper.findNextPageButton().getElement()).toHaveAttribute('aria-label', '');
    expect(wrapper.findPageNumberByIndex(1)!.getElement()).toHaveAttribute('aria-label', '1');
  });

  test('should add empty aria-labels when the user defines the labels only partially', () => {
    const { wrapper } = renderPagination(
      <Pagination
        currentPageIndex={1}
        pagesCount={10}
        ariaLabels={{
          pageLabel: pageNumber => `Go to ${pageNumber}`,
        }}
      />
    );
    expect(wrapper.findPreviousPageButton().getElement()).toHaveAttribute('aria-label', '');
    expect(wrapper.findNextPageButton().getElement()).toHaveAttribute('aria-label', '');
    expect(wrapper.findPageNumberByIndex(1)!.getElement()).toHaveAttribute('aria-label', 'Go to 1');
  });

  test('should add the aria-labels on the top of the page buttons', () => {
    const { wrapper } = renderPagination(
      <Pagination
        currentPageIndex={1}
        pagesCount={10}
        ariaLabels={{
          nextPageLabel: 'Next page',
          paginationLabel: 'Table pagination',
          previousPageLabel: 'Previous page',
          pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
        }}
      />
    );
    expect(wrapper.getElement()).toHaveAttribute('aria-label', 'Table pagination');
    expect(wrapper.findPreviousPageButton().getElement()).toHaveAttribute('aria-label', 'Previous page');
    expect(wrapper.findNextPageButton().getElement()).toHaveAttribute('aria-label', 'Next page');
    expect(wrapper.findPageNumberByIndex(1)!.getElement()).toHaveAttribute('aria-label', 'Page 1 of all pages');
  });
});

describe('open-end pagination', () => {
  test('should show one page and dots as last element if there is only one page', () => {
    const { wrapper } = renderPagination(<Pagination currentPageIndex={1} pagesCount={1} openEnd={true} />);

    expect(getItemsContent(wrapper)).toEqual(['1', '...']);
  });

  test('should show two pages and dots as last element if there are two pages', () => {
    const { wrapper } = renderPagination(<Pagination currentPageIndex={1} pagesCount={2} openEnd={true} />);

    expect(getItemsContent(wrapper)).toEqual(['1', '2', '...']);
  });

  // From 3 it's the standard formula
  test('should show three pages and dots as last element if there are three pages', () => {
    const { wrapper } = renderPagination(<Pagination currentPageIndex={1} pagesCount={3} openEnd={true} />);

    expect(getItemsContent(wrapper)).toEqual(['1', '2', '3', '...']);
  });

  test('should show at most eight pages and dots as last element if there are eight pages', () => {
    const { wrapper } = renderPagination(<Pagination currentPageIndex={1} pagesCount={8} openEnd={true} />);

    expect(getItemsContent(wrapper)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '...']);
  });

  test('should not show more than nine elements', () => {
    const { wrapper } = renderPagination(<Pagination currentPageIndex={6} pagesCount={10} openEnd={true} />);

    expect(getItemsContent(wrapper)).toEqual(['1', '...', '4', '5', '6', '7', '8', '9', '...']);
  });

  test('should show only one current page', () => {
    const { wrapper } = renderPagination(<Pagination currentPageIndex={6} pagesCount={10} openEnd={true} />);

    expect(wrapper.findAll('[aria-current="true"]')).toHaveLength(1);
    expect(wrapper.findCurrentPage().getElement()).toHaveAttribute('aria-current');
  });

  test('should fire nextPageClick event with page not available when clicked the next page and there are no more pages to be loaded', () => {
    const onNextPageClick = jest.fn();
    const { wrapper } = renderPagination(
      <Pagination currentPageIndex={3} pagesCount={3} openEnd={true} onNextPageClick={onNextPageClick} />
    );
    wrapper.findNextPageButton().click();

    expect(onNextPageClick).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          requestedPageAvailable: false,
          requestedPageIndex: 4,
        },
      })
    );
  });
});

describe('jump to page', () => {
  test('should render jump to page input and button when jumpToPage is provided', () => {
    const { wrapper } = renderPagination(<Pagination currentPageIndex={1} pagesCount={10} jumpToPage={{}} />);

    expect(wrapper.findJumpToPageInput()).toBeTruthy();
    expect(wrapper.findJumpToPageButton()).toBeTruthy();
  });

  test('should not render jump to page when jumpToPage is not provided', () => {
    const { wrapper } = renderPagination(<Pagination currentPageIndex={1} pagesCount={10} />);

    expect(wrapper.findJumpToPageInput()).toBeNull();
    expect(wrapper.findJumpToPageButton()).toBeNull();
  });

  test('should show loading state on jump to page button', () => {
    const { wrapper } = renderPagination(
      <Pagination currentPageIndex={1} pagesCount={10} jumpToPage={{ loading: true }} />
    );

    expect(wrapper.findJumpToPageButton()!.findLoadingIndicator()).toBeTruthy();
  });

  test('should disable jump to page button when input is empty', () => {
    const { wrapper } = renderPagination(<Pagination currentPageIndex={1} pagesCount={10} jumpToPage={{}} />);

    wrapper.findJumpToPageInput()!.setInputValue('');
    expect(wrapper.findJumpToPageButton()!.getElement()).toBeDisabled();
  });

  test('should disable jump to page button when input equals current page', () => {
    const { wrapper } = renderPagination(<Pagination currentPageIndex={5} pagesCount={10} jumpToPage={{}} />);

    expect(wrapper.findJumpToPageButton()!.getElement()).toBeDisabled();
  });

  test('should set min attribute to 1 on input', () => {
    const { wrapper } = renderPagination(<Pagination currentPageIndex={1} pagesCount={10} jumpToPage={{}} />);

    expect(wrapper.findJumpToPageInput()!.findNativeInput().getElement()).toHaveAttribute('min', '1');
  });

  test('should set max attribute to pagesCount in closed mode', () => {
    const { wrapper } = renderPagination(<Pagination currentPageIndex={1} pagesCount={10} jumpToPage={{}} />);

    expect(wrapper.findJumpToPageInput()!.findNativeInput().getElement()).toHaveAttribute('max', '10');
  });

  test('should not set max attribute in open-end mode', () => {
    const { wrapper } = renderPagination(
      <Pagination currentPageIndex={1} pagesCount={10} openEnd={true} jumpToPage={{}} />
    );

    expect(wrapper.findJumpToPageInput()!.findNativeInput().getElement()).not.toHaveAttribute('max');
  });

  describe('closed mode validation', () => {
    test('should navigate to valid page in range', () => {
      const onChange = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination currentPageIndex={1} pagesCount={10} jumpToPage={{}} onChange={onChange} />
      );

      wrapper.findJumpToPageInput()!.setInputValue('5');
      wrapper.findJumpToPageButton()!.click();

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { currentPageIndex: 5 },
        })
      );
    });

    test('should navigate to first page when input is less than 1', () => {
      const onChange = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination currentPageIndex={5} pagesCount={10} jumpToPage={{}} onChange={onChange} />
      );

      wrapper.findJumpToPageInput()!.setInputValue('0');
      wrapper.findJumpToPageButton()!.click();

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { currentPageIndex: 1 },
        })
      );
      expect(wrapper.findJumpToPageInput()!.findNativeInput().getElement()).toHaveValue(1);
    });

    test('should show error and navigate to last page when input exceeds pagesCount', () => {
      const onChange = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination currentPageIndex={1} pagesCount={10} jumpToPage={{}} onChange={onChange} />
      );

      wrapper.findJumpToPageInput()!.setInputValue('15');
      wrapper.findJumpToPageButton()!.click();

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { currentPageIndex: 10 },
        })
      );
      expect(wrapper.findJumpToPageInput()!.findNativeInput().getElement()).toHaveValue(10);
    });
  });

  describe('open-end mode', () => {
    test('should navigate to any page without validation', () => {
      const onChange = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination currentPageIndex={1} pagesCount={5} openEnd={true} jumpToPage={{}} onChange={onChange} />
      );

      wrapper.findJumpToPageInput()!.setInputValue('100');
      wrapper.findJumpToPageButton()!.click();

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { currentPageIndex: 100 },
        })
      );
    });
  });

  describe('error handling via ref', () => {
    test('should show error popover when setError is called', () => {
      const ref = React.createRef<PaginationProps.JumpToPageRef>();
      const { wrapper, rerender } = renderPagination(
        <Pagination ref={ref} currentPageIndex={1} pagesCount={10} jumpToPage={{}} />
      );

      ref.current?.setError(true);
      rerender(<Pagination ref={ref} currentPageIndex={1} pagesCount={10} jumpToPage={{}} />);

      // Error popover should be visible
      expect(wrapper.findPopover()).not.toBeNull();
    });

    test('should clear error when user types in input', () => {
      const ref = React.createRef<PaginationProps.JumpToPageRef>();
      const { wrapper, rerender } = renderPagination(
        <Pagination ref={ref} currentPageIndex={1} pagesCount={10} jumpToPage={{}} />
      );

      ref.current?.setError(true);
      rerender(<Pagination ref={ref} currentPageIndex={1} pagesCount={10} jumpToPage={{}} />);

      wrapper.findJumpToPageInput()!.setInputValue('5');

      // Error should be cleared - popover should not be visible
      expect(wrapper.findPopover()).toBeNull();
    });

    test('should clear error when user navigates successfully', () => {
      const ref = React.createRef<PaginationProps.JumpToPageRef>();
      const onChange = jest.fn();
      const { wrapper, rerender } = renderPagination(
        <Pagination ref={ref} currentPageIndex={1} pagesCount={10} jumpToPage={{}} onChange={onChange} />
      );

      ref.current?.setError(true);
      rerender(<Pagination ref={ref} currentPageIndex={1} pagesCount={10} jumpToPage={{}} onChange={onChange} />);

      wrapper.findPageNumberByIndex(3)!.click();

      expect(onChange).toHaveBeenCalled();
      // Error should be cleared
      expect(wrapper.findPopover()).toBeNull();
    });
  });

  describe('keyboard navigation', () => {
    test('should submit on Enter key', () => {
      const onChange = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination currentPageIndex={1} pagesCount={10} jumpToPage={{}} onChange={onChange} />
      );

      const input = wrapper.findJumpToPageInput()!.findNativeInput().getElement();
      wrapper.findJumpToPageInput()!.setInputValue('7');
      fireEvent.keyDown(input, { keyCode: 13, key: 'Enter' });

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { currentPageIndex: 7 },
        })
      );
    });

    test('should not submit on Enter when input equals current page', () => {
      const onChange = jest.fn();
      const { wrapper } = renderPagination(
        <Pagination currentPageIndex={5} pagesCount={10} jumpToPage={{}} onChange={onChange} />
      );

      const input = wrapper.findJumpToPageInput()!.findNativeInput().getElement();
      wrapper.findJumpToPageInput()!.setInputValue('5');
      fireEvent.keyDown(input, { keyCode: 13, key: 'Enter' });

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
