// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import InternalIcon from '../../icon/internal';
import Tooltip from '../../internal/components/tooltip';
import { fireCancelableEvent, isPlainLeftClick } from '../../internal/events';
import { BreadcrumbGroupProps, BreadcrumbItemProps } from '../interfaces';
import { getEventDetail } from '../utils';
import { FunnelBreadcrumbItem } from './funnel';
import { registerTooltip } from './tooltips-registry';

import styles from './styles.css.js';

interface BreadcrumbItemWithPopoverProps<T extends BreadcrumbGroupProps.Item> {
  item: T;
  isLast: boolean;
  anchorAttributes: React.AnchorHTMLAttributes<HTMLAnchorElement>;
}

const BreadcrumbItemWithPopover = <T extends BreadcrumbGroupProps.Item>({
  item,
  isLast,
  anchorAttributes,
}: BreadcrumbItemWithPopoverProps<T>) => {
  const [showPopover, setShowPopover] = useState(false);
  const textRef = useRef<HTMLElement>(null);
  const popoverContent = <Tooltip trackRef={textRef} value={item.text} size="medium" />;

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
        <FunnelBreadcrumbItem ref={textRef} text={item.text} last={isLast} />
      </Item>
      {showPopover && popoverContent}
    </>
  );
};

type ItemProps = React.HTMLAttributes<HTMLElement> & {
  anchorAttributes: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  isLast: boolean;
};
const Item = ({ anchorAttributes, children, isLast, ...itemAttributes }: ItemProps) =>
  isLast ? (
    <span className={styles.anchor} {...itemAttributes}>
      {children}
    </span>
  ) : (
    <a className={styles.anchor} {...itemAttributes} {...anchorAttributes}>
      {children}
    </a>
  );

export function BreadcrumbItem<T extends BreadcrumbGroupProps.Item>({
  item,
  onClick,
  onFollow,
  isLast = false,
  isGhost = false,
  isTruncated = false,
}: BreadcrumbItemProps<T>) {
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
  };
  if (isGhost) {
    anchorAttributes.tabIndex = -1;
  }

  return (
    <div className={clsx(!isGhost && styles.breadcrumb, isGhost && styles['ghost-breadcrumb'], isLast && styles.last)}>
      {isTruncated && !isGhost ? (
        <BreadcrumbItemWithPopover item={item} isLast={isLast} anchorAttributes={anchorAttributes} />
      ) : (
        <Item isLast={isLast} anchorAttributes={anchorAttributes}>
          <FunnelBreadcrumbItem text={item.text} last={isLast} ghost={isGhost} />
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
