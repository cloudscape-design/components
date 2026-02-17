// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
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

const InternalPagination = React.forwardRef(
  (
    {
      openEnd,
      currentPageIndex,
      ariaLabels,
      i18nStrings,
      pagesCount,
      disabled,
      onChange,
      onNextPageClick,
      onPreviousPageClick,
      __internalRootRef,
      jumpToPage,
      ...rest
    }: InternalPaginationProps,
    ref: React.Ref<PaginationProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    const { leftDots, leftIndex, rightIndex, rightDots } = getPaginationState(currentPageIndex, pagesCount, openEnd);
    const [jumpToPageValue, setJumpToPageValue] = useState(currentPageIndex?.toString());
    const prevLoadingRef = React.useRef(jumpToPage?.loading);
    const jumpToPageInputRef = useRef<HTMLInputElement>(null);
    const [hasError, setHasError] = useState(false);

    const i18n = useInternalI18n('pagination');

    // Expose setError function via ref
    React.useImperativeHandle(ref, () => ({
      setError: (error: boolean) => setHasError(error),
    }));

    // Sync input with currentPageIndex after loading completes
    React.useEffect(() => {
      if (prevLoadingRef.current && !jumpToPage?.loading) {
        setJumpToPageValue(String(currentPageIndex));
      }
      prevLoadingRef.current = jumpToPage?.loading;
    }, [jumpToPage?.loading, currentPageIndex]);

    const paginationLabel = ariaLabels?.paginationLabel ?? '';
    const nextPageLabel = i18n('ariaLabels.nextPageLabel', ariaLabels?.nextPageLabel) ?? '';
    const previousPageLabel = i18n('ariaLabels.previousPageLabel', ariaLabels?.previousPageLabel) ?? '';
    const pageNumberLabelFn =
      i18n('ariaLabels.pageLabel', ariaLabels?.pageLabel, format => pageNumber => format({ pageNumber })) ?? (() => '');

    const jumpToPageLabel = i18n('i18nStrings.jumpToPageInputLabel', i18nStrings?.jumpToPageInputLabel) ?? '';
    const jumpToPageButtonLabel = i18n('ariaLabels.jumpToPageButtonLabel', ariaLabels?.jumpToPageButton) ?? '';
    const jumpToPageError = i18n('i18nStrings.jumpToPageError', i18nStrings?.jumpToPageError) ?? '';
    const jumpToPageLoadingText = i18n('i18nStrings.jumpToPageLoadingText', i18nStrings?.jumpToPageLoadingText) ?? '';

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

    function handlePageClick(requestedPageIndex: number, errorState?: boolean) {
      setJumpToPageValue(String(requestedPageIndex));
      setHasError(!!errorState); // Clear error on successful navigation
      fireNonCancelableEvent(onChange, { currentPageIndex: requestedPageIndex });
    }

    function handleJumpToPageClick(requestedPageIndex: number) {
      if (requestedPageIndex < 1) {
        handlePageClick(1);
        jumpToPageInputRef.current?.focus();
        return;
      }

      if (openEnd) {
        // Open-end: always navigate, parent will handle async loading
        handlePageClick(requestedPageIndex);
      } else {
        // Closed-end: validate range
        if (requestedPageIndex >= 1 && requestedPageIndex <= pagesCount) {
          handlePageClick(requestedPageIndex);
        } else {
          // Out of range - set error and navigate to last page
          handlePageClick(pagesCount, true);
        }
      }
      jumpToPageInputRef.current?.focus();
    }

    // Auto-clear error when user types in the input
    const handleInputChange = (e: NonCancelableCustomEvent<BaseChangeDetail>) => {
      setJumpToPageValue(e.detail.value);
      if (hasError) {
        setHasError(false);
      }
    };

    const previousButtonDisabled = disabled || currentPageIndex === 1;
    const nextButtonDisabled = disabled || (!openEnd && (pagesCount === 0 || currentPageIndex === pagesCount));
    const tableComponentContext = useTableComponentsContext();
    if (tableComponentContext?.paginationRef?.current) {
      tableComponentContext.paginationRef.current.currentPageIndex = currentPageIndex;
      tableComponentContext.paginationRef.current.totalPageCount = pagesCount;
      tableComponentContext.paginationRef.current.openEnd = openEnd;
    }

    const jumpToPageButton = (
      <InternalButton
        iconName="arrow-right"
        variant="icon"
        loading={jumpToPage?.loading}
        loadingText={jumpToPageLoadingText}
        ariaLabel={jumpToPage?.loading ? jumpToPageLoadingText : jumpToPageButtonLabel}
        onClick={() => handleJumpToPageClick(Number(jumpToPageValue))}
        disabled={!jumpToPageValue || Number(jumpToPageValue) === currentPageIndex}
      />
    );

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
          ariaLabel={previousPageLabel}
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
          ariaLabel={nextPageLabel}
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
          <li className={styles['jump-to-page']}>
            <InternalSpaceBetween size="xxs" direction="horizontal" alignItems="end">
              <div className={styles['jump-to-page-input']}>
                <InternalInput
                  ref={jumpToPageInputRef}
                  type="number"
                  value={jumpToPageValue}
                  __inlineLabelText={jumpToPageLabel || undefined}
                  __fullWidth={true}
                  ariaLabel={jumpToPageLabel || undefined}
                  nativeInputAttributes={{
                    min: 1,
                    max: !openEnd ? pagesCount : undefined,
                  }}
                  onChange={handleInputChange}
                  onBlur={() => setHasError(false)}
                  onKeyDown={e => {
                    if (e.detail.keyCode === 13 && jumpToPageValue && Number(jumpToPageValue) !== currentPageIndex) {
                      handleJumpToPageClick(Number(jumpToPageValue));
                    }
                  }}
                />
              </div>
              {hasError ? (
                <InternalPopover
                  size="medium"
                  dismissButton={false}
                  __visible={hasError}
                  content={jumpToPageError}
                  position="bottom"
                  triggerType="custom"
                  __onVisibleChange={({ detail }) => !detail.visible && setHasError(false)}
                >
                  {jumpToPageButton}
                </InternalPopover>
              ) : (
                jumpToPageButton
              )}
            </InternalSpaceBetween>
          </li>
        )}
      </ul>
    );
  }
);

export default InternalPagination;
