// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';
import clsx from 'clsx';
import InternalIcon from '../icon/internal';
import InternalButtonDropdown from '../button-dropdown/internal';
import { CustomTriggerProps, LinkItem } from '../button-dropdown/interfaces';
import { InternalButton } from '../button/internal';
import { BreadcrumbItem } from './item/item';
import { BreadcrumbGroupProps, EllipsisDropdownProps } from './interfaces';
import { fireCancelableEvent } from '../internal/events';
import { getBaseProps } from '../internal/base-component';
import { useMobile } from '../internal/hooks/use-mobile';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import { useInternalI18n } from '../i18n/context';

/**
 * Provided for backwards compatibility
 */
const DEFAULT_EXPAND_ARIA_LABEL = 'Show path';

const getDropdownTrigger = ({
  ariaLabel,
  triggerRef,
  disabled,
  testUtilsClass,
  isOpen,
  onClick,
}: CustomTriggerProps) => {
  return (
    <InternalButton
      ref={triggerRef}
      className={testUtilsClass}
      disabled={disabled}
      onClick={event => {
        event.preventDefault();
        onClick();
      }}
      ariaExpanded={isOpen}
      aria-haspopup={true}
      ariaLabel={ariaLabel}
      variant="breadcrumb-group"
      formAction="none"
    >
      ...
    </InternalButton>
  );
};

const EllipsisDropdown = ({
  ariaLabel,
  dropdownItems,
  onDropdownItemClick,
  onDropdownItemFollow,
}: EllipsisDropdownProps) => {
  const i18n = useInternalI18n('breadcrumb-group');

  return (
    <li className={styles.ellipsis}>
      <InternalButtonDropdown
        ariaLabel={i18n('expandAriaLabel', ariaLabel) ?? DEFAULT_EXPAND_ARIA_LABEL}
        items={dropdownItems}
        onItemClick={onDropdownItemClick}
        onItemFollow={onDropdownItemFollow}
        customTriggerBuilder={getDropdownTrigger}
      />
      <span className={styles.icon}>
        <InternalIcon name="angle-right" />
      </span>
    </li>
  );
};

export const getEventDetail = <T extends BreadcrumbGroupProps.Item>(item: T) => ({
  item,
  text: item.text,
  href: item.href,
});

type InternalBreadcrumbGroupProps<T extends BreadcrumbGroupProps.Item = BreadcrumbGroupProps.Item> =
  BreadcrumbGroupProps<T> & InternalBaseComponentProps;

export default function InternalBreadcrumbGroup<T extends BreadcrumbGroupProps.Item = BreadcrumbGroupProps.Item>({
  items = [],
  ariaLabel,
  expandAriaLabel,
  onClick,
  onFollow,
  __internalRootRef,
  ...props
}: InternalBreadcrumbGroupProps<T>) {
  for (const item of items) {
    checkSafeUrl('BreadcrumbGroup', item.href);
  }
  const baseProps = getBaseProps(props);
  const isMobile = useMobile();

  let breadcrumbItems = items.map((item, index) => {
    const isLast = index === items.length - 1;

    return (
      <li className={styles.item} key={index}>
        <BreadcrumbItem
          item={item}
          onClick={onClick}
          onFollow={onFollow}
          isCompressed={isMobile}
          isLast={isLast}
          isDisplayed={!isMobile || isLast || index === 0}
        />
      </li>
    );
  });

  const getEventItem = (e: CustomEvent<{ id: string }>) => {
    const { id } = e.detail;
    return items[parseInt(id)];
  };

  // Add ellipsis
  if (breadcrumbItems.length >= 2) {
    const dropdownItems: Array<LinkItem> = items
      .slice(1, items.length - 1)
      .map((item: BreadcrumbGroupProps.Item, index: number) => ({
        id: (index + 1).toString(), // the first item doesn't get inside dropdown
        text: item.text,
        href: item.href || '#',
      }));

    breadcrumbItems = [
      breadcrumbItems[0],
      <EllipsisDropdown
        key={'ellipsis'}
        ariaLabel={expandAriaLabel}
        dropdownItems={dropdownItems}
        onDropdownItemClick={e => fireCancelableEvent(onClick, getEventDetail(getEventItem(e)), e)}
        onDropdownItemFollow={e => fireCancelableEvent(onFollow, getEventDetail(getEventItem(e)), e)}
      />,
      ...breadcrumbItems.slice(1),
    ];
  }

  return (
    <nav
      {...baseProps}
      className={clsx(
        styles['breadcrumb-group'],
        isMobile && styles.mobile,
        items.length <= 2 && styles['mobile-short'],
        baseProps.className
      )}
      aria-label={ariaLabel || undefined}
      ref={__internalRootRef}
    >
      <ol className={styles['breadcrumb-group-list']}>{breadcrumbItems}</ol>
    </nav>
  );
}
