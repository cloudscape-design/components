// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import { BreadcrumbGroupProps, BreadcrumbItemProps } from '../interfaces';
import InternalIcon from '../../icon/internal';
import styles from './styles.css.js';
import clsx from 'clsx';
import useFocusVisible from '../../internal/hooks/focus-visible';
import { fireCancelableEvent, isPlainLeftClick } from '../../internal/events';
import { getEventDetail } from '../internal';
import { Transition } from '../../internal/components/transition';
import PopoverContainer from '../../popover/container';
import PopoverBody from '../../popover/body';
import Portal from '../../internal/components/portal';
import popoverStyles from '../../popover/styles.css.js';

type BreadcrumbItemWithPopoverProps<T extends BreadcrumbGroupProps.Item> =
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    item: T;
  };

const BreadcrumbItemWithPopover = <T extends BreadcrumbGroupProps.Item>({
  item,
  ...anchorAttributes
}: BreadcrumbItemWithPopoverProps<T>) => {
  const focusVisible = useFocusVisible();
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

  const popoverContent = (
    <Portal>
      <div className={styles['item-popover']}>
        <Transition in={true}>
          {() => (
            <PopoverContainer
              trackRef={textRef}
              size="small"
              fixedWidth={false}
              position="bottom"
              arrow={position => (
                <div className={clsx(popoverStyles.arrow, popoverStyles[`arrow-position-${position}`])}>
                  <div className={popoverStyles['arrow-outer']} />
                  <div className={popoverStyles['arrow-inner']} />
                </div>
              )}
            >
              <PopoverBody dismissButton={false} dismissAriaLabel={undefined} onDismiss={() => {}} header={undefined}>
                {item.text}
              </PopoverBody>
            </PopoverContainer>
          )}
        </Transition>
      </div>
    </Portal>
  );

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
      <a
        {...focusVisible}
        {...anchorAttributes}
        onFocus={() => {
          isTruncated(textRef, virtualTextRef) && setShowPopover(true);
        }}
        onBlur={() => setShowPopover(false)}
        onMouseEnter={() => {
          isTruncated(textRef, virtualTextRef) && setShowPopover(true);
        }}
        onMouseLeave={() => setShowPopover(false)}
      >
        <span className={styles.text} ref={textRef}>
          {item.text}
        </span>
        <span className={styles['virtual-item']} ref={virtualTextRef}>
          {item.text}
        </span>
      </a>
      {showPopover && popoverContent}
    </>
  );
};

export function BreadcrumbItem<T extends BreadcrumbGroupProps.Item>({
  item,
  onClick,
  onFollow,
  isDisplayed,
  isLast = false,
  isCompressed = false,
}: BreadcrumbItemProps<T>) {
  const focusVisible = useFocusVisible();
  const preventDefault = (event: React.MouseEvent) => event.preventDefault();
  const onClickHandler = (event: React.MouseEvent) => {
    if (isPlainLeftClick(event)) {
      fireCancelableEvent(onFollow, getEventDetail(item), event);
    }
    fireCancelableEvent(onClick, getEventDetail(item), event);
  };

  const anchorAttributes: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    href: isLast ? undefined : item.href || '#',
    className: clsx(styles.anchor, { [styles.compressed]: isCompressed }),
    'aria-current': isLast ? 'page' : undefined, // Active breadcrumb item is implemented according to WAI-ARIA 1.1
    'aria-disabled': isLast && 'true',
    onClick: isLast ? preventDefault : onClickHandler,
    tabIndex: isLast ? 0 : undefined, // tabIndex is added to the last crumb to keep it in the index without an href
  };

  return (
    <>
      <div className={clsx(styles.breadcrumb, isLast && styles.last)}>
        {isDisplayed && isCompressed ? (
          <BreadcrumbItemWithPopover item={item} {...anchorAttributes} />
        ) : (
          <a {...focusVisible} {...anchorAttributes}>
            <span className={styles.text}>{item.text}</span>
          </a>
        )}
        {!isLast ? (
          <span className={styles.icon}>
            <InternalIcon name="angle-right" />
          </span>
        ) : null}
      </div>
    </>
  );
}
