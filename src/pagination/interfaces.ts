// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { NonCancelableEventHandler } from '../types/events';

export interface PaginationProps {
  /**
   * Index of the current page. The first page has an index of 1.
   */
  currentPageIndex: number;

  /**
   * Sets the total number of pages. When `openEnd` is `true`, this is the number of pages currently known to be
   * available. Only positive integers are allowed.
   */
  pagesCount: number;

  /**
   * Sets the pagination to open-ended mode when the total number of pages is unknown. The next page button remains
   * enabled on the last known page. In normal pages, an ellipsis indicates that more pages might be available. In
   * compact pages, a plus sign after the last known page count indicates that more pages might be available. When the
   * user requests a page beyond the last known page, `onNextPageClick` is called with
   * `requestedPageAvailable: false` in the event detail.
   *
   * @default false
   */
  openEnd?: boolean;

  /**
   * Specifies how pages are displayed:
   * * `normal` - Displays page number buttons. For larger page ranges, the displayed range is truncated with
   *   ellipses.
   * * `compact` - Displays the current page and page count between the previous and next buttons. When `openEnd` is
   *   `true`, a plus sign after the page count indicates that more pages might be available. By default, the text uses
   *   a localized format, such as `3 of 12` or `3 of 12+` in English. You can customize the text using
   *   `i18nStrings.pagesCompactText`. When `jumpToPage` is set, the jump-to-page control is displayed next to it.
   *
   * @default 'normal'
   */
  pagesVariant?: PaginationProps.PagesVariant;

  /**
   * If set to `true`, the pagination links will be disabled. Use it, for example, if you want to prevent the user
   * from changing page before items are loaded.
   */
  disabled?: boolean;

  /**
   * Adds aria-labels to the pagination buttons:
   * * `paginationLabel` (string) - Label for the entire pagination group. It allows users to distinguish context
   * * in cases of multiple pagination components in a page.
   * * `previousPageLabel` (string) - Previous page button.
   * * `pageLabel` (number => string) - Individual page button, this function is called for every page number that's rendered.
   * * `nextPageLabel` (string) - Next page button
   *
   * Example:
   * ```
   * {
   *   nextPageLabel: 'Next page',
   *   paginationLabel: 'Table pagination',
   *   previousPageLabel: 'Previous page',
   *   pageLabel: pageNumber => `Page ${pageNumber}`
   * }
   * ```
   * @i18n
   */
  ariaLabels?: PaginationProps.Labels;
  /**
   * An object containing all the necessary localized strings required by the component:
   * * `jumpToPageInputLabel` (string) - Accessible label for the jump-to-page number input.
   * * `jumpToPageError` (string) - Error message displayed when the entered page number is invalid.
   * * `jumpToPageLoadingText` (string) - Loading text displayed while the jump-to-page action is in progress.
   * * `pagesCompactText` ((options: PaginationProps.PagesCompactTextOptions) => string) - Visible text for compact
   *   pages, for example `3 of 12` or `3 of 12+` when more pages might be available.
   * @i18n
   */
  i18nStrings?: PaginationProps.I18nStrings;

  /**
   * Called when a user interaction causes a pagination change. The event `detail` contains the new `currentPageIndex`.
   */
  onChange?: NonCancelableEventHandler<PaginationProps.ChangeDetail>;

  /**
   * Called when the previous page arrow is clicked. The event `detail` contains the following:
   * * `requestedPageAvailable` (boolean) - Always set to `true`.
   * * `requestedPageIndex` (integer) - The index of the requested page.
   */
  onPreviousPageClick?: NonCancelableEventHandler<PaginationProps.PageClickDetail>;

  /**
   * Called when the next page arrow is clicked. The event `detail` contains the following:
   * * `requestedPageAvailable` (boolean) - Indicates whether the requested page is available for display.
   *   The value can be `false` when the `openEnd` property is set to `true`.
   * * `requestedPageIndex` (integer) - The index of the requested page.
   */
  onNextPageClick?: NonCancelableEventHandler<PaginationProps.PageClickDetail>;
  /**
   * Jump to page configuration
   */
  jumpToPage?: PaginationProps.JumpToPageProps;
}

export namespace PaginationProps {
  export type PagesVariant = 'normal' | 'compact';

  export interface Labels {
    nextPageLabel?: string;
    paginationLabel?: string;
    previousPageLabel?: string;
    pageLabel?: (pageNumber: number) => string;
    jumpToPageButton?: string;
  }

  export interface I18nStrings {
    jumpToPageInputLabel?: string;
    jumpToPageError?: string;
    jumpToPageLoadingText?: string;
    pagesCompactText?: (options: { currentPage: number; pagesCount: number; openEnd: boolean }) => string;
  }

  export interface ChangeDetail {
    currentPageIndex: number;
  }

  export interface PageClickDetail {
    requestedPageAvailable: boolean;
    requestedPageIndex: number;
  }

  export interface JumpToPageProps {
    /**
     * User controlled loading state when jump to page callback is executing
     */
    loading?: boolean;
  }

  export interface Ref {
    /**
     * Set error state for jump to page. Component will auto-clear when user types or navigates.
     */
    setError: (hasError: boolean) => void;
  }
}
