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
  items,
  variant,
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

  const activeItemIndexEnd = useMemo(() => {
    return activeItem + visibleItemNumber - 1;
  }, [activeItem, visibleItemNumber]);

  const mainRef = useRef<HTMLDivElement>(null);
  const mode = useCurrentMode(mainRef);
  const mergedRef = useMergeRefs(mainRef, __internalRootRef);
  const [isMeasured, setIsMeasured] = useState(false);

  const transformX = useMemo(() => {
    const itemWidth = carouselWrapperRef.current?.querySelector('li')?.clientWidth ?? 0;
    return itemWidth * (activeItem + 1) + CAROUSEL_ITEM_MARGIN * (activeItem + 1);
  }, [activeItem, isMeasured]);

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
      setActiveItem(items.length - 1);
    } else {
      setActiveItem((activeItem - 1) % items.length);
    }
    setCurrentPlus(currentPlus + 1);
  };

  const goNext = () => {
    setActiveItem((activeItem + 1) % items.length);

    setCurrentPlus((currentPlus + 1) % items.length);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!carouselWrapperRef.current) {
      return;
    }
    // focus the correct li based on the direction.
    const target = event.target as HTMLElement;
    let newFocusTarget: HTMLLIElement;
    if (event.keyCode === KeyCode.left) {
      newFocusTarget = target.previousSibling as HTMLLIElement;

      goPrev();
    } else if (event.keyCode === KeyCode.right) {
      goNext();
      newFocusTarget = target.nextSibling as HTMLLIElement;
    }

    requestAnimationFrame(() => {
      newFocusTarget?.focus();
    });
  };

  function getPreviousListItem() {
    let item;
    if (activeItem === 0) {
      item = items[items.length - 1];
    } else {
      item = items[activeItem - 1];
    }

    return (
      <li
        tabIndex={-1}
        aria-hidden={true}
        aria-label={`List item ${activeItem + 1} of ${items.length} items`}
        className={clsx(styles['carousel-item'], 'rendered')}
        style={{
          background: typeof item.backgroundStyle === 'function' ? item.backgroundStyle(mode) : item.backgroundStyle,
          width: `${itemWidth}%`,
        }}
      >
        <div className={styles['content-wrapper']}></div>
      </li>
    );
  }
  function getNextItemsShadow() {
    const item = items[(activeItemIndexEnd + 1) % items.length];

    return (
      <li
        tabIndex={-1}
        aria-hidden={true}
        aria-label={`List item ${activeItem + 1} of ${items.length} items`}
        className={clsx(styles['carousel-item'], 'rendered')}
        style={{
          background: typeof item.backgroundStyle === 'function' ? item.backgroundStyle(mode) : item.backgroundStyle,
          width: `${itemWidth}%`,
        }}
      >
        <div className={styles['content-wrapper']}></div>
      </li>
    );
  }

  const [currentPlus, setCurrentPlus] = useState(0);
  function getCurrentItemsShadow() {
    console.log(activeItem, activeItemIndexEnd);
    return items.slice(activeItem, activeItemIndexEnd + 1 + currentPlus);
  }

  return (
    <div {...props} className={clsx(styles.root, props.className)} ref={mergedRef} aria-label={ariaLabel}>
      <ul
        ref={carouselWrapperRef}
        className={clsx(styles['carousel-wrapper'], styles[`${variant}`])}
        style={{ height: `${height}px`, transform: `translateX(-${transformX}px)` }}
      >
        {getPreviousListItem()}
        {getCurrentItemsShadow().map((item, index) => (
          <li
            key={index}
            onKeyDown={onKeyDown}
            tabIndex={0}
            className={clsx(styles['carousel-item'])}
            style={{
              background:
                typeof item.backgroundStyle === 'function' ? item.backgroundStyle(mode) : item.backgroundStyle,
              width: `${itemWidth}%`,
            }}
          >
            <div className={styles['content-wrapper']}>{item.content}</div>
          </li>
        ))}
        {getNextItemsShadow()}
      </ul>

      <div className={styles.pagination}>
        <SpaceBetween size="s" direction="horizontal" alignItems="center">
          <Button variant="icon" iconName="angle-left" ariaLabel={ariaLabelPrevious} onClick={goPrev} />

          <span aria-label={`List item ${activeItem + 1} of ${items.length} items`}>
            {activeItem + 1} / {items.length}
          </span>

          <Button variant="icon" iconName="angle-right" ariaLabel={ariaLabelNext} onClick={goNext} />
        </SpaceBetween>
      </div>

      <InternalLiveRegion assertive={true} tagName="span" hidden={true}>
        List item {activeItem + 1} of {items.length} items
      </InternalLiveRegion>
    </div>
  );
};

export default InternalCarousel;
