// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { BreadcrumbGroupProps, BreadcrumbItemProps } from '../interfaces';
import InternalIcon from '../../icon/internal';
import styles from './styles.css.js';
import clsx from 'clsx';
import { fireCancelableEvent, isPlainLeftClick } from '../../internal/events';

import { DATA_ATTR_FUNNEL_KEY } from '../../internal/analytics/selectors';
import { FUNNEL_KEY_FUNNEL_NAME } from '../../internal/analytics/selectors';
import Tooltip from '../../internal/components/tooltip';
import { getEventDetail } from '../utils';

type BreadcrumbItemWithPopoverProps<T extends BreadcrumbGroupProps.Item> = React.HTMLAttributes<HTMLElement> & {
  item: T;
  isLast: boolean;
  anchorAttributes: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  funnelAttributes: Record<string, string>;
};

const BreadcrumbItemWithPopover = <T extends BreadcrumbGroupProps.Item>({
  item,
  isLast,
  anchorAttributes,
  funnelAttributes,
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
        <span {...funnelAttributes} className={styles.text} ref={textRef}>
          {item.text}
        </span>
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

  const funnelAttributes: Record<string, string> = {};
  if (isLast) {
    funnelAttributes[DATA_ATTR_FUNNEL_KEY] = FUNNEL_KEY_FUNNEL_NAME;
  }

  return (
    <div className={clsx(styles.breadcrumb, isLast && styles.last)}>
      {isDisplayed && isCompressed ? (
        <BreadcrumbItemWithPopover
          item={item}
          isLast={isLast}
          anchorAttributes={anchorAttributes}
          funnelAttributes={funnelAttributes}
          {...itemAttributes}
        />
      ) : (
        <Item isLast={isLast} anchorAttributes={anchorAttributes} {...itemAttributes}>
          <span {...funnelAttributes} className={styles.text}>
            {item.text}
          </span>
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
