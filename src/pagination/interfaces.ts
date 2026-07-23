// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { NonCancelableEventHandler } from '../types/events';

export interface PaginationProps {
  /**
   * Index of the current page. The first page has an index of 1.
   */
  currentPageIndex: number;

  /**
   * Sets the total number of pages. When `openEnd` is `true`, this is the number of pages currently available.
   * Only positive integers are allowed.
   */
  pagesCount: number;

  /**
   * Specifies whether the total number of pages is unknown. The next page button remains enabled on the last
   * available page. If the user requests a page beyond `pagesCount`, `onNextPageClick` is called with
   * `requestedPageAvailable: false`.
   *
   * @default false
   */
  openEnd?: boolean;

  /**
   * Specifies how pages are displayed:
   * * `normal` - Displays page number buttons. For larger page ranges, the displayed range is truncated with
   *   ellipses.
   * * `compact` - Displays the current page and page count between the previous and next buttons. When `openEnd` is
   *   `true`, a plus sign after the page count indicates that more pages are available.
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
   * * `pagesCompactText` ((options: { currentPage: number; pagesCount: number; openEnd: boolean }) => string) -
   *   Visible text for compact pages.
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
    /**
     * Visible text for compact pages. Receives the current page, page count, and whether pagination is open-ended.
     * @param options The page state used to format the text.
     * @returns The text displayed for compact pages.
     */
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
