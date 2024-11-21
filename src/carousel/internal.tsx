// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { useCurrentMode } from '@cloudscape-design/component-toolkit/internal';

import Button from '../button/internal';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { KeyCode } from '../internal/keycode';
import SpaceBetween from '../space-between/internal';
import { CAROUSEL_HEIGHT } from './config';
import { CarouselProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalCarouselProps extends CarouselProps, InternalBaseComponentProps {}

export const InternalCarousel = ({
  __internalRootRef,
  items,
  variant,
  //   visibleItemNumber,
  size,
  ariaLabel,
  ariaLabelNext,
  ariaLabelPrevious,
  ...props
}: InternalCarouselProps) => {
  const height =
    typeof size === 'number' ? size : typeof size === 'string' ? CAROUSEL_HEIGHT[size] : CAROUSEL_HEIGHT.medium;
  const carouselWrapperRef = useRef<HTMLUListElement>(null);
  const [activeItem, setActiveItem] = useState<number>(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const mode = useCurrentMode(mainRef);
  const mergedRef = useMergeRefs(mainRef, __internalRootRef);

  const goPrev = () => {
    if (activeItem === 0) {
      setActiveItem(items.length - 1);
    } else {
      setActiveItem((activeItem - 1) % items.length);
    }
  };

  const goNext = () => setActiveItem((activeItem + 1) % items.length);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!carouselWrapperRef.current) {
      return;
    }

    const allItems = Array.from(carouselWrapperRef.current.querySelectorAll('li'));

    let newActiveItem: HTMLLIElement | null = null;

    if (event.keyCode === KeyCode.left) {
      if (activeItem === 0) {
        newActiveItem = allItems[items.length - 1];
      } else {
        newActiveItem = allItems[activeItem - 1];
      }
      goPrev();
    } else if (event.keyCode === KeyCode.right) {
      newActiveItem = allItems[(activeItem + 1) % items.length];
      goNext();
    }

    requestAnimationFrame(() => {
      newActiveItem?.focus();
    });
  };

  return (
    <div {...props} className={clsx(styles.root, props.className)} ref={mergedRef} aria-label={ariaLabel}>
      <ul
        ref={carouselWrapperRef}
        className={clsx(styles['carousel-wrapper'], styles[`${variant}`])}
        style={{ height: `${height}px` }}
      >
        {items.map(({ content, backgroundStyle }, index) => {
          const isActiveItem = activeItem === index;

          return (
            <li
              tabIndex={isActiveItem ? 0 : -1}
              onKeyDown={onKeyDown}
              key={index}
              aria-hidden={!isActiveItem}
              className={clsx(styles['carousel-item'], !isActiveItem && styles.hide)}
              style={{
                background: typeof backgroundStyle === 'function' ? backgroundStyle(mode) : backgroundStyle,
              }}
            >
              <div className={styles['content-wrapper']}>{content}</div>
            </li>
          );
        })}
      </ul>

      <div className={styles.pagination}>
        <SpaceBetween size="s" direction="horizontal" alignItems="center">
          <Button variant="icon" iconName="angle-left" ariaLabel={ariaLabelPrevious} onClick={goPrev} />

          <span>
            {activeItem + 1} / {items.length}
          </span>

          <Button variant="icon" iconName="angle-right" ariaLabel={ariaLabelNext} onClick={goNext} />
        </SpaceBetween>
      </div>
    </div>
  );
};

export default InternalCarousel;
