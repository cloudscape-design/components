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
import { useContainerQuery } from '../../internal/hooks/container-queries';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';

export function BreadcrumbItem<T extends BreadcrumbGroupProps.Item>({
  item,
  onClick,
  onFollow,
  isLast = false,
  isFirst = false,
  isCompressed = false,
}: BreadcrumbItemProps<T>) {
  const focusVisible = useFocusVisible();
  const [textTruncated, setTextTruncated] = useState(false);
  const [openPopover, setOpenPopover] = useState(false);
  const preventDefault = (event: React.MouseEvent) => event.preventDefault();
  const onClickHandler = (event: React.MouseEvent) => {
    if (isPlainLeftClick(event)) {
      fireCancelableEvent(onFollow, getEventDetail(item), event);
    }
    fireCancelableEvent(onClick, getEventDetail(item), event);
  };
  const trackRef = useRef<HTMLElement>(null);
  const [textWidth, textRef] = useContainerQuery(rect => rect.width);
  const mergedRef = useMergeRefs(trackRef, textRef);
  const virtualTextRef = useRef<HTMLElement>(null);

  const popoverContent = (
    <Transition in={openPopover}>
      {() => (
        <PopoverContainer
          trackRef={trackRef}
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
  );

  useEffect(() => {
    if (isCompressed && textWidth && virtualTextRef && virtualTextRef.current) {
      if (Math.round(virtualTextRef.current.clientWidth) > Math.round(textWidth)) {
        setTextTruncated(true);
      }
    } else {
      setTextTruncated(false);
    }
  }, [isCompressed, textWidth, virtualTextRef]);

  return (
    <>
      <div className={clsx(styles.breadcrumb, isLast && styles.last)}>
        <a
          {...focusVisible}
          href={isLast ? undefined : item.href || '#'}
          className={clsx(styles.anchor, { [styles.compressed]: isCompressed })}
          aria-current={isLast ? 'page' : undefined} // Active breadcrumb item is implemented according to WAI-ARIA 1.1
          aria-disabled={isLast && 'true'}
          onClick={isLast ? preventDefault : onClickHandler}
          tabIndex={isLast ? 0 : undefined} // tabIndex is added to the last crumb to keep it in the index without an href
          onFocus={() => textTruncated && setOpenPopover(true)}
          onBlur={() => textTruncated && setOpenPopover(false)}
          onMouseEnter={() => textTruncated && setOpenPopover(true)}
          onMouseLeave={() => textTruncated && setOpenPopover(false)}
        >
          <span className={styles.text} ref={mergedRef}>
            {item.text}
          </span>
          {(isLast || isFirst) && isCompressed && (
            <span className={styles['virtual-item']} ref={virtualTextRef}>
              {item.text}
            </span>
          )}
        </a>
        {!isLast ? (
          <span className={styles.icon}>
            <InternalIcon name="angle-right" />
          </span>
        ) : null}
      </div>
      {openPopover && <Portal>{popoverContent}</Portal>}
    </>
  );
}
