// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { getLogicalBoundingClientRect } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { InternalButton } from '../button/internal';
import { CustomTriggerProps, LinkItem } from '../button-dropdown/interfaces';
import InternalButtonDropdown from '../button-dropdown/internal';
import { useInternalI18n } from '../i18n/context';
import InternalIcon from '../icon/internal';
import { getBaseProps } from '../internal/base-component';
import { fireCancelableEvent } from '../internal/events';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import { createWidgetizedComponent } from '../internal/widgets';
import { AllItemsDropdown } from './all-items-dropdown';
import {
  GeneratedAnalyticsMetadataBreadcrumbGroupClick,
  GeneratedAnalyticsMetadataBreadcrumbGroupComponent,
} from './analytics-metadata/interfaces';
import { BreadcrumbGroupProps, EllipsisDropdownProps, InternalBreadcrumbGroupProps } from './interfaces';
import { BreadcrumbItem } from './item/item';
import { BreadcrumbGroupSkeleton } from './skeleton';
import { getEventDetail, getItemsDisplayProperties } from './utils';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

/**
 * Provided for backwards compatibility
 */
const DEFAULT_EXPAND_ARIA_LABEL = 'Show path';

const getEllipsisDropdownTrigger = ({ ariaLabel, triggerRef, testUtilsClass, isOpen, onClick }: CustomTriggerProps) => {
  return (
    <InternalButton
      ref={triggerRef}
      className={testUtilsClass}
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
  visible,
}: EllipsisDropdownProps) => {
  const i18n = useInternalI18n('breadcrumb-group');

  return (
    <li className={clsx(styles.ellipsis, visible && styles.visible)}>
      <InternalButtonDropdown
        ariaLabel={i18n('expandAriaLabel', ariaLabel) ?? DEFAULT_EXPAND_ARIA_LABEL}
        items={dropdownItems}
        onItemClick={onDropdownItemClick}
        onItemFollow={onDropdownItemFollow}
        customTriggerBuilder={getEllipsisDropdownTrigger}
        linkStyle={true}
        analyticsMetadataTransformer={metadata => {
          if (metadata.detail?.id) {
            delete metadata.detail.id;
          }
          if (metadata.detail?.position) {
            metadata.detail.position = `${parseInt(metadata.detail.position as string, 10) + 1}`;
          }
          return metadata;
        }}
      />
      <span className={styles.icon}>
        <InternalIcon name="angle-right" />
      </span>
    </li>
  );
};

interface ItemsRefsType {
  ghost: Record<string, HTMLLIElement>;
  real: Record<string, HTMLLIElement>;
}

interface ItemsWidthsType {
  ghost: Array<number>;
  real: Array<number>;
}

const areArrayEqual = (first: Array<number>, second: Array<number>) => {
  if (first.length !== second.length) {
    return false;
  }
  return first.every((item, index) => item === second[index]);
};

export function BreadcrumbGroupImplementation<T extends BreadcrumbGroupProps.Item = BreadcrumbGroupProps.Item>({
  items = [],
  ariaLabel,
  expandAriaLabel,
  onClick,
  onFollow,
  __internalRootRef,
  __injectAnalyticsComponentMetadata,
  ...props
}: InternalBreadcrumbGroupProps<T>) {
  for (const item of items) {
    checkSafeUrl('BreadcrumbGroup', item.href);
  }
  const baseProps = getBaseProps(props);
  const [navWidth, navRef] = useContainerQuery<number>(rect => rect.borderBoxWidth);
  const mergedRef = useMergeRefs(navRef, __internalRootRef);

  const itemsRefs = useRef<ItemsRefsType>({ ghost: {}, real: {} });
  const setBreadcrumb = (type: keyof ItemsRefsType, index: string, node: null | HTMLLIElement) => {
    if (node) {
      itemsRefs.current[type][index] = node;
    } else {
      delete itemsRefs.current[type][index];
    }
  };

  const [itemsWidths, setItemsWidths] = useState<ItemsWidthsType>({ ghost: [], real: [] });

  useEffect(() => {
    if (itemsRefs.current) {
      const newItemsWidths: ItemsWidthsType = { ghost: [], real: [] };
      for (const node of Object.values(itemsRefs.current.ghost)) {
        const width = getLogicalBoundingClientRect(node).inlineSize;
        newItemsWidths.ghost.push(width);
      }
      for (const node of Object.values(itemsRefs.current.real)) {
        const width = getLogicalBoundingClientRect(node).inlineSize;
        newItemsWidths.real.push(width);
      }
      setItemsWidths(oldWidths => {
        if (
          !areArrayEqual(newItemsWidths.ghost, oldWidths.ghost) ||
          !areArrayEqual(newItemsWidths.real, oldWidths.real)
        ) {
          return newItemsWidths;
        } else {
          return oldWidths;
        }
      });
    }
  }, [items, navWidth]);

  const { collapsed } = getItemsDisplayProperties(itemsWidths.ghost, navWidth);

  let breadcrumbItems = items.map((item, index) => {
    const isLast = index === items.length - 1;
    const isDisplayed = index === 0 || index > collapsed;

    const clickAnalyticsMetadata: GeneratedAnalyticsMetadataBreadcrumbGroupClick = {
      action: 'click',
      detail: {
        position: `${index + 1}`,
        label: `.${analyticsSelectors['breadcrumb-item']}`,
        href: item.href || '',
      },
    };
    return (
      <li
        className={clsx(styles.item, !isDisplayed && styles.hide)}
        key={index}
        {...(isLast ? {} : getAnalyticsMetadataAttribute(clickAnalyticsMetadata))}
        ref={node => setBreadcrumb('real', `${index}`, node)}
      >
        <BreadcrumbItem
          item={item}
          onClick={onClick}
          onFollow={onFollow}
          itemIndex={index}
          totalCount={items.length}
          isTruncated={itemsWidths.ghost[index] - itemsWidths.real[index] > 0}
        />
      </li>
    );
  });

  const hiddenBreadcrumbItems = items.map((item, index) => (
    <li className={styles['ghost-item']} key={index} ref={node => setBreadcrumb('ghost', `${index}`, node)}>
      <BreadcrumbItem item={item} itemIndex={index} totalCount={items.length} isGhost={true} />
    </li>
  ));

  const getEventItem = (e: CustomEvent<{ id: string }>) => {
    const { id } = e.detail;
    return items[parseInt(id)];
  };

  // Add ellipsis
  if (breadcrumbItems.length >= 2) {
    const dropdownItems: Array<LinkItem> = items
      .slice(1, 1 + collapsed)
      .map((item: BreadcrumbGroupProps.Item, index: number) => ({
        id: (index + 1).toString(), // the first item doesn't get inside dropdown
        text: item.text,
        href: item.href || '#',
      }));

    breadcrumbItems = [
      breadcrumbItems[0],
      <EllipsisDropdown
        key={'ellipsis'}
        visible={collapsed > 0}
        ariaLabel={expandAriaLabel}
        dropdownItems={dropdownItems}
        onDropdownItemClick={e => fireCancelableEvent(onClick, getEventDetail(getEventItem(e)), e)}
        onDropdownItemFollow={e => fireCancelableEvent(onFollow, getEventDetail(getEventItem(e)), e)}
      />,
      ...breadcrumbItems.slice(1),
    ];
  }

  const componentAnalyticsMetadata: GeneratedAnalyticsMetadataBreadcrumbGroupComponent = {
    name: 'awsui.BreadcrumbGroup',
    label: { root: 'self' },
  };

  return (
    <nav
      {...baseProps}
      className={clsx(styles['breadcrumb-group'], baseProps.className)}
      aria-label={ariaLabel || undefined}
      ref={mergedRef}
      {...(__injectAnalyticsComponentMetadata
        ? {
            ...getAnalyticsMetadataAttribute({
              component: componentAnalyticsMetadata,
            }),
          }
        : {})}
    >
      {collapsed === items.length - 1 ? (
        <AllItemsDropdown
          items={items}
          onItemClick={e =>
            e.detail.id !== (items.length - 1).toString() &&
            fireCancelableEvent(onClick, getEventDetail(getEventItem(e)), e)
          }
          onItemFollow={e =>
            e.detail.id !== (items.length - 1).toString() &&
            fireCancelableEvent(onFollow, getEventDetail(getEventItem(e)), e)
          }
        />
      ) : (
        <ol className={styles['breadcrumb-group-list']}>{breadcrumbItems}</ol>
      )}
      <ol className={clsx(styles['breadcrumb-group-list'], styles.ghost)} aria-hidden={true} tabIndex={-1}>
        {hiddenBreadcrumbItems}
      </ol>
    </nav>
  );
}

export const createWidgetizedBreadcrumbGroup = createWidgetizedComponent(
  BreadcrumbGroupImplementation,
  BreadcrumbGroupSkeleton
);
