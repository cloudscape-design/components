// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import {
  copyAnalyticsMetadataAttribute,
  getAnalyticsMetadataAttribute,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalButton from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import InternalIcon from '../icon/internal';
import { BaseChangeDetail } from '../input/interfaces';
import InternalInput from '../input/internal';
import { getBaseProps } from '../internal/base-component';
import { useTableComponentsContext } from '../internal/context/table-component-context';
import { fireNonCancelableEvent, NonCancelableCustomEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import InternalPopover from '../popover/internal';
import InternalSpaceBetween from '../space-between/internal';
import { GeneratedAnalyticsMetadataPaginationClick } from './analytics-metadata/interfaces';
import { PaginationProps } from './interfaces';
import { getPaginationState, range } from './utils';

import styles from './styles.css.js';

const defaultAriaLabels: Required<PaginationProps.Labels> = {
  nextPageLabel: '',
  paginationLabel: '',
  previousPageLabel: '',
  pageLabel: pageNumber => `${pageNumber}`,
};

interface PageButtonProps {
  className?: string;
  ariaLabel: string;
  disabled?: boolean;
  pageIndex: number;
  isCurrent?: boolean;
  children?: React.ReactNode;
  onClick: (requestedIndex: number) => void;
}

function PageButton({
  className,
  ariaLabel,
  disabled,
  pageIndex,
  isCurrent = false,
  children,
  onClick,
  ...rest
}: PageButtonProps) {
  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    onClick(pageIndex);
  }
  return (
    <li className={styles['page-item']} {...copyAnalyticsMetadataAttribute(rest)}>
      <button
        className={clsx(
          className,
          styles.button,
          disabled && styles['button-disabled'],
          isCurrent && styles['button-current']
        )}
        type="button"
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={handleClick}
        aria-current={isCurrent}
        {...(disabled
          ? {}
          : getAnalyticsMetadataAttribute({
              action: 'click',
              detail: {
                label: { root: 'self' },
              },
            } as GeneratedAnalyticsMetadataPaginationClick))}
      >
        {children}
      </button>
    </li>
  );
}

function PageNumber({ pageIndex, ...rest }: PageButtonProps) {
  return (
    <PageButton
      className={styles['page-number']}
      pageIndex={pageIndex}
      {...rest}
      {...(rest.disabled
        ? {}
        : getAnalyticsMetadataAttribute({
            detail: {
              position: `${pageIndex}`,
            },
          }))}
    >
      {pageIndex}
    </PageButton>
  );
}

type InternalPaginationProps = PaginationProps & InternalBaseComponentProps;
export default function InternalPagination({
  openEnd,
  currentPageIndex,
  ariaLabels,
  pagesCount,
  disabled,
  onChange,
  onNextPageClick,
  onPreviousPageClick,
  __internalRootRef,
  jumpToPage,
  jumpToPageIsLoading,
  jumpToPageErrorText,
  onJumpToPageClick,
  ...rest
}: InternalPaginationProps) {
  const baseProps = getBaseProps(rest);
  const { leftDots, leftIndex, rightIndex, rightDots } = getPaginationState(currentPageIndex, pagesCount, openEnd);
  const [jumpToPageValue, setJumpToPageValue] = useState(currentPageIndex.toString());
  const prevLoadingRef = React.useRef(jumpToPageIsLoading);

  // Sync input with currentPageIndex after loading completes
  React.useEffect(() => {
    if (prevLoadingRef.current && !jumpToPageIsLoading) {
      setJumpToPageValue(String(currentPageIndex));
    }
    prevLoadingRef.current = jumpToPageIsLoading;
  }, [jumpToPageIsLoading, currentPageIndex]);

  const i18n = useInternalI18n('pagination');

  const paginationLabel = ariaLabels?.paginationLabel;
  const nextPageLabel = i18n('ariaLabels.nextPageLabel', ariaLabels?.nextPageLabel) ?? defaultAriaLabels.nextPageLabel;
  const previousPageLabel =
    i18n('ariaLabels.previousPageLabel', ariaLabels?.previousPageLabel) ?? defaultAriaLabels.previousPageLabel;
  const pageNumberLabelFn =
    i18n('ariaLabels.pageLabel', ariaLabels?.pageLabel, format => pageNumber => format({ pageNumber })) ??
    defaultAriaLabels.pageLabel;

  function handlePrevPageClick(requestedPageIndex: number) {
    handlePageClick(requestedPageIndex);
    fireNonCancelableEvent(onPreviousPageClick, {
      requestedPageAvailable: true,
      requestedPageIndex: requestedPageIndex,
    });
  }

  function handleNextPageClick(requestedPageIndex: number) {
    handlePageClick(requestedPageIndex);
    fireNonCancelableEvent(onNextPageClick, {
      requestedPageAvailable: currentPageIndex < pagesCount,
      requestedPageIndex: requestedPageIndex,
    });
  }

  function handlePageClick(requestedPageIndex: number) {
    fireNonCancelableEvent(onChange, { currentPageIndex: requestedPageIndex });
  }

  function handleJumpToPageClick(requestedPageIndex: number) {
    handlePageClick(requestedPageIndex);
    fireNonCancelableEvent(onJumpToPageClick, {
      requestedPageAvailable: requestedPageIndex >= 1 && (openEnd || requestedPageIndex <= pagesCount),
      requestedPageIndex: requestedPageIndex,
      currentPageIndex: requestedPageIndex,
    });
  }

  const previousButtonDisabled = disabled || currentPageIndex === 1;
  const nextButtonDisabled = disabled || (!openEnd && (pagesCount === 0 || currentPageIndex === pagesCount));
  const tableComponentContext = useTableComponentsContext();
  if (tableComponentContext?.paginationRef?.current) {
    tableComponentContext.paginationRef.current.currentPageIndex = currentPageIndex;
    tableComponentContext.paginationRef.current.totalPageCount = pagesCount;
    tableComponentContext.paginationRef.current.openEnd = openEnd;
  }

  const renderJumpToPageButton = () => {
    return (
      <InternalButton
        iconName="arrow-right"
        variant="icon"
        loading={jumpToPageIsLoading}
        onClick={() => handleJumpToPageClick(Number(jumpToPageValue))}
        disabled={!jumpToPageValue || Number(jumpToPageValue) === currentPageIndex}
      />
    );
  };

  return (
    <ul
      aria-label={paginationLabel}
      {...baseProps}
      className={clsx(baseProps.className, styles.root, disabled && styles['root-disabled'])}
      ref={__internalRootRef}
    >
      <PageButton
        className={styles.arrow}
        pageIndex={currentPageIndex - 1}
        ariaLabel={previousPageLabel ?? defaultAriaLabels.nextPageLabel}
        disabled={previousButtonDisabled}
        onClick={handlePrevPageClick}
        {...(previousButtonDisabled
          ? {}
          : getAnalyticsMetadataAttribute({
              detail: {
                position: 'prev',
              },
            }))}
      >
        <InternalIcon name="angle-left" variant={disabled ? 'disabled' : 'normal'} />
      </PageButton>
      <PageNumber
        pageIndex={1}
        isCurrent={currentPageIndex === 1}
        disabled={disabled}
        ariaLabel={pageNumberLabelFn(1)}
        onClick={handlePageClick}
      />
      {leftDots && <li className={styles.dots}>...</li>}
      {range(leftIndex, rightIndex).map(pageIndex => (
        <PageNumber
          key={pageIndex}
          isCurrent={currentPageIndex === pageIndex}
          pageIndex={pageIndex}
          disabled={disabled}
          ariaLabel={pageNumberLabelFn(pageIndex)}
          onClick={handlePageClick}
        />
      ))}
      {rightDots && <li className={styles.dots}>...</li>}
      {!openEnd && pagesCount > 1 && (
        <PageNumber
          isCurrent={currentPageIndex === pagesCount}
          pageIndex={pagesCount}
          disabled={disabled}
          ariaLabel={pageNumberLabelFn(pagesCount)}
          onClick={handlePageClick}
        />
      )}
      <PageButton
        className={styles.arrow}
        pageIndex={currentPageIndex + 1}
        ariaLabel={nextPageLabel ?? defaultAriaLabels.nextPageLabel}
        disabled={nextButtonDisabled}
        onClick={handleNextPageClick}
        {...(nextButtonDisabled
          ? {}
          : getAnalyticsMetadataAttribute({
              detail: {
                position: 'next',
              },
            }))}
      >
        <InternalIcon name="angle-right" variant={disabled ? 'disabled' : 'normal'} />
      </PageButton>
      {jumpToPage && (
        <div className={styles['jump-to-page']}>
          <InternalSpaceBetween size="xxs" direction="horizontal" alignItems="end">
            <div className={styles['jump-to-page-input']}>
              <InternalInput
                type="number"
                value={jumpToPageValue}
                __inlineLabelText="Page"
                onChange={(e: NonCancelableCustomEvent<BaseChangeDetail>) => setJumpToPageValue(e.detail.value)}
              />
            </div>
            {jumpToPageErrorText ? (
              <InternalPopover size="medium" content={jumpToPageErrorText} position="bottom" dismissButton={false}>
                {renderJumpToPageButton()}
              </InternalPopover>
            ) : (
              renderJumpToPageButton()
            )}
          </InternalSpaceBetween>
        </div>
      )}
    </ul>
  );
}
