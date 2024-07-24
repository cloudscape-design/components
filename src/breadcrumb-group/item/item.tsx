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

import styles from './styles.css.js';

type BreadcrumbItemWithPopoverProps<T extends BreadcrumbGroupProps.Item> = React.HTMLAttributes<HTMLElement> & {
  item: T;
  isLast: boolean;
  anchorAttributes: React.AnchorHTMLAttributes<HTMLAnchorElement>;
};

const BreadcrumbItemWithPopover = <T extends BreadcrumbGroupProps.Item>({
  item,
  isLast,
  anchorAttributes,
  ...itemAttributes
}: BreadcrumbItemWithPopoverProps<T>) => {
  const [showPopover, setShowPopover] = useState(false);
  const textRef = useRef<HTMLElement>(null);
  const virtualTextRef = useRef<HTMLElement>(null);

  const isTruncated = (textRef: React.RefObject<HTMLElement>, virtualTextRef: React.RefObject<HTMLElement>) => {
    if (!textRef || !virtualTextRef || !textRef.current || !virtualTextRef.current) {
      return false;
    }
    const virtualTextWidth = virtualTextRef.current.getBoundingClientRect().width;
    const textWidth = textRef.current.getBoundingClientRect().width;
    if (virtualTextWidth > textWidth) {
      return true;
    }
    return false;
  };

  const popoverContent = <Tooltip trackRef={textRef} value={item.text} />;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowPopover(false);
      }
    };
    if (showPopover) {
      document.addEventListener('keydown', onKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [showPopover]);

  return (
    <>
      <Item
        isLast={isLast}
        {...itemAttributes}
        onFocus={() => {
          isTruncated(textRef, virtualTextRef) && setShowPopover(true);
        }}
        onBlur={() => setShowPopover(false)}
        onMouseEnter={() => {
          isTruncated(textRef, virtualTextRef) && setShowPopover(true);
        }}
        onMouseLeave={() => setShowPopover(false)}
        anchorAttributes={anchorAttributes}
      >
        <FunnelBreadcrumbItem ref={textRef} text={item.text} last={isLast} />
        <span className={styles['virtual-item']} ref={virtualTextRef}>
          {item.text}
        </span>
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
    <span {...itemAttributes}>{children}</span>
  ) : (
    <a {...itemAttributes} {...anchorAttributes}>
      {children}
    </a>
  );

export function BreadcrumbItem<T extends BreadcrumbGroupProps.Item>({
  item,
  onClick,
  onFollow,
  isDisplayed,
  isLast = false,
  isCompressed = false,
}: BreadcrumbItemProps<T>) {
  const preventDefault = (event: React.MouseEvent) => event.preventDefault();
  const onClickHandler = (event: React.MouseEvent) => {
    if (isPlainLeftClick(event)) {
      fireCancelableEvent(onFollow, getEventDetail(item), event);
    }
    fireCancelableEvent(onClick, getEventDetail(item), event);
  };

  const itemAttributes: React.HTMLAttributes<HTMLElement> = {
    className: clsx(styles.anchor, { [styles.compressed]: isCompressed }),
  };
  const anchorAttributes: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    href: item.href || '#',
    onClick: isLast ? preventDefault : onClickHandler,
  };

  return (
    <div className={clsx(styles.breadcrumb, isLast && styles.last)}>
      {isDisplayed && isCompressed ? (
        <BreadcrumbItemWithPopover
          item={item}
          isLast={isLast}
          anchorAttributes={anchorAttributes}
          {...itemAttributes}
        />
      ) : (
        <Item isLast={isLast} anchorAttributes={anchorAttributes} {...itemAttributes}>
          <FunnelBreadcrumbItem text={item.text} last={isLast} />
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
