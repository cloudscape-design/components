// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';

import Button from '../button/internal';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { KeyCode } from '../internal/keycode';
import InternalLiveRegion from '../live-region/internal';
import SpaceBetween from '../space-between/internal';
import { CAROUSEL_HEIGHT, CAROUSEL_ITEM_MARGIN } from './config';
import { CarouselProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalCarouselProps extends CarouselProps, InternalBaseComponentProps {}

export const InternalCarousel = ({
  __internalRootRef,
  items = [],
  size,
  ariaLabel,
  ariaLabelNext,
  ariaLabelPrevious,
  visibleItemNumber = 1,
  ...props
}: InternalCarouselProps) => {
  const height =
    typeof size === 'number' ? size : typeof size === 'string' ? CAROUSEL_HEIGHT[size] : CAROUSEL_HEIGHT.medium;
  const carouselWrapperRef = useRef<HTMLUListElement>(null);
  const [activeItem, setActiveItem] = useState<number>(0);

  const mainRef = useRef<HTMLDivElement>(null);
  const mode = useCurrentMode(mainRef);
  const mergedRef = useMergeRefs(mainRef, __internalRootRef);

  const transformX = useMemo(() => {
    const itemWidth = carouselWrapperRef.current?.querySelector('li')?.clientWidth ?? 0;
    return (itemWidth * activeItem + CAROUSEL_ITEM_MARGIN * activeItem) * visibleItemNumber;
  }, [activeItem, visibleItemNumber]);

  const [isMeasured, setIsMeasured] = useState(false);

  const itemWidth = useMemo(() => {
    if (!carouselWrapperRef.current || !isMeasured) {
      return 100 / visibleItemNumber;
    }

    const totalMarginSpace = (visibleItemNumber - 1) * CAROUSEL_ITEM_MARGIN;
    const wrapperWidth = carouselWrapperRef.current.clientWidth;

    const marginPercentage = (totalMarginSpace / wrapperWidth) * 100;
    const itemWidth = (100 - marginPercentage) / visibleItemNumber;

    return itemWidth;
  }, [visibleItemNumber, isMeasured]);

  useEffect(() => {
    if (carouselWrapperRef.current) {
      setIsMeasured(true);
    }
  }, []);

  const goPrev = () => {
    if (activeItem === 0) {
      setActiveItem(Math.ceil(items.length / visibleItemNumber - 1));
    } else {
      setActiveItem(activeItem - 1);
    }
  };

  const goNext = () => setActiveItem((activeItem + 1) % Math.ceil(items.length / visibleItemNumber));

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!carouselWrapperRef.current) {
      return;
    }

    if (event.keyCode !== KeyCode.left && event.keyCode !== KeyCode.right) {
      return;
    }

    event.preventDefault();
    const items = carouselWrapperRef.current.querySelectorAll('li');
    const currentIndex = Array.from(items).findIndex(item => item === event.target);

    if (currentIndex === -1) {
      return;
    }

    if (event.keyCode === KeyCode.left) {
      const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      if (newIndex !== 0 && newIndex % Math.ceil(items.length / visibleItemNumber) === 0) {
        goPrev();
      }
      requestAnimationFrame(() => {
        const newTarget = items[newIndex] as HTMLElement;
        if (newTarget) {
          newTarget.focus();
        }
      });
    } else if (event.keyCode === KeyCode.right) {
      const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;

      if (newIndex % Math.ceil(items.length / visibleItemNumber + 1) === 0) {
        goNext();
      }
      setTimeout(() => {
        requestAnimationFrame(() => {
          const newTarget = items[newIndex] as HTMLElement;
          if (newTarget) {
            newTarget.focus();
          }
        });
      }, 0);
    }
  };

  return (
    <div {...props} className={clsx(styles.root, props.className)} ref={mergedRef} aria-label={ariaLabel}>
      <ul
        ref={carouselWrapperRef}
        className={clsx(styles['carousel-wrapper'])}
        style={{ height: `${height}px`, transform: `translateX(-${transformX}px)` }}
      >
        {items.map(({ content, backgroundStyle }, index) => {
          // Calculate start and end indices for current page
          const start = activeItem * visibleItemNumber;
          const end = Math.min(start + visibleItemNumber - 1, items.length - 1);
          const isActiveItem = index >= start && index <= end;

          return (
            <li
              tabIndex={isActiveItem ? 0 : -1}
              onKeyDown={event => {
                isActiveItem && onKeyDown(event);
              }}
              key={index}
              aria-hidden={!isActiveItem}
              aria-label={`List item ${index + 1} of ${items.length} items`}
              className={clsx(styles['carousel-item'])}
              style={{
                background: typeof backgroundStyle === 'function' ? backgroundStyle(mode) : backgroundStyle,
                width: `${itemWidth}%`,
              }}
            >
              <div className={styles['content-wrapper']}>{isActiveItem ? content : null}</div>
            </li>
          );
        })}
      </ul>

      <div className={styles.pagination}>
        <SpaceBetween size="s" direction="horizontal" alignItems="center">
          <Button variant="icon" iconName="angle-left" ariaLabel={ariaLabelPrevious} onClick={goPrev} />

          <span aria-label={`List item ${activeItem + 1} of ${items.length} items`}>
            {activeItem + 1} / {Math.ceil(items.length / visibleItemNumber)}
          </span>

          <Button variant="icon" iconName="angle-right" ariaLabel={ariaLabelNext} onClick={goNext} />
        </SpaceBetween>
      </div>

      <InternalLiveRegion assertive={true} tagName="span" hidden={true}>
        List item {activeItem + 1} of {Math.ceil(items.length / visibleItemNumber)} items
      </InternalLiveRegion>
    </div>
  );
};

export default InternalCarousel;
