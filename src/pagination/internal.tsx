// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import InternalIcon from '../icon/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { getBaseProps } from '../internal/base-component';
import styles from './styles.css.js';
import { getPaginationState, range } from './utils';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { PaginationProps } from './interfaces';
import { useInternalI18n } from '../i18n/context';

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
}: PageButtonProps) {
  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    onClick(pageIndex);
  }
  return (
    <li className={styles['page-item']}>
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
      >
        {children}
      </button>
    </li>
  );
}

function PageNumber({ pageIndex, ...rest }: PageButtonProps) {
  return (
    <PageButton className={styles['page-number']} pageIndex={pageIndex} {...rest}>
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
  __internalRootRef = null,
  ...rest
}: InternalPaginationProps) {
  const baseProps = getBaseProps(rest);
  const { leftDots, leftIndex, rightIndex, rightDots } = getPaginationState(currentPageIndex, pagesCount, openEnd);

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
        disabled={disabled || currentPageIndex === 1}
        onClick={handlePrevPageClick}
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
        disabled={disabled || (!openEnd && (pagesCount === 0 || currentPageIndex === pagesCount))}
        onClick={handleNextPageClick}
      >
        <InternalIcon name="angle-right" variant={disabled ? 'disabled' : 'normal'} />
      </PageButton>
    </ul>
  );
}
