// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import InternalIcon from '../../icon/internal';
import Tooltip from '../../internal/components/tooltip';
import { registerTooltip } from '../../internal/components/tooltip/registry';
import { fireCancelableEvent, isPlainLeftClick } from '../../internal/events';
import { BreadcrumbGroupProps, BreadcrumbItemProps } from '../interfaces';
import { getEventDetail } from '../utils';
import { FunnelBreadcrumbItem } from './funnel';

import styles from './styles.css.js';

interface BreadcrumbItemWithPopoverProps<T extends BreadcrumbGroupProps.Item> {
  item: T;
  isLast: boolean;
  anchorAttributes: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  children: React.ReactNode;
}

const BreadcrumbItemWithPopover = <T extends BreadcrumbGroupProps.Item>({
  item,
  isLast,
  anchorAttributes,
  children,
}: BreadcrumbItemWithPopoverProps<T>) => {
  const [showPopover, setShowPopover] = useState(false);
  const textRef = useRef<HTMLElement>(null);
  const popoverContent = (
    <Tooltip trackRef={textRef} value={item.text} size="medium" onDismiss={() => setShowPopover(false)} />
  );

  useEffect(() => {
    if (showPopover) {
      return registerTooltip(() => {
        setShowPopover(false);
      });
    }
  }, [showPopover]);

  return (
    <>
      <Item
        ref={textRef}
        isLast={isLast}
        onFocus={() => {
          setShowPopover(true);
        }}
        onBlur={() => setShowPopover(false)}
        onMouseEnter={() => {
          setShowPopover(true);
        }}
        onMouseLeave={() => setShowPopover(false)}
        anchorAttributes={anchorAttributes}
        {...(isLast ? { tabIndex: 0 } : {})}
      >
        {children}
      </Item>
      {showPopover && popoverContent}
    </>
  );
};

type ItemProps = React.HTMLAttributes<HTMLElement> & {
  anchorAttributes: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  isLast: boolean;
};
const Item = React.forwardRef<HTMLElement, ItemProps>(
  ({ anchorAttributes, children, isLast, ...itemAttributes }, ref) =>
    isLast ? (
      <span ref={ref} className={styles.anchor} {...itemAttributes}>
        {children}
      </span>
    ) : (
      <a ref={ref as React.Ref<HTMLAnchorElement>} className={styles.anchor} {...itemAttributes} {...anchorAttributes}>
        {children}
      </a>
    )
);

export function BreadcrumbItem<T extends BreadcrumbGroupProps.Item>({
  item,
  itemIndex,
  totalCount,
  onClick,
  onFollow,
  isGhost = false,
  isTruncated = false,
}: BreadcrumbItemProps<T>) {
  const isLast = itemIndex === totalCount - 1;
  const preventDefault = (event: React.MouseEvent) => event.preventDefault();
  const onClickHandler = (event: React.MouseEvent) => {
    if (isPlainLeftClick(event)) {
      fireCancelableEvent(onFollow, getEventDetail(item), event);
    }
    fireCancelableEvent(onClick, getEventDetail(item), event);
  };

  const anchorAttributes: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    href: item.href || '#',
    onClick: isLast ? preventDefault : onClickHandler,
    tabIndex: 0,
  };
  if (isGhost) {
    anchorAttributes.tabIndex = -1;
  }

  if (isLast) {
    anchorAttributes.role = 'link';
    anchorAttributes['aria-disabled'] = true;
    anchorAttributes['aria-current'] = 'page';
  }

  const breadcrumbItem = (
    <FunnelBreadcrumbItem
      className={styles.text}
      itemIndex={itemIndex}
      totalCount={totalCount}
      text={item.text}
      disableAnalytics={isGhost}
    />
  );

  return (
    <div className={clsx(!isGhost && styles.breadcrumb, isGhost && styles['ghost-breadcrumb'], isLast && styles.last)}>
      {isTruncated && !isGhost ? (
        <BreadcrumbItemWithPopover item={item} isLast={isLast} anchorAttributes={anchorAttributes}>
          {breadcrumbItem}
        </BreadcrumbItemWithPopover>
      ) : (
        <Item isLast={isLast} anchorAttributes={anchorAttributes}>
          {breadcrumbItem}
        </Item>
      )}
      {!isLast ? (
        <span className={styles.icon}>
          <InternalIcon name="angle-right" />
        </span>
      ) : null}
    </div>
  );
}
