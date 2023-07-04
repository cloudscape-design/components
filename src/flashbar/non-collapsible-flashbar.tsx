// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { Flash } from './flash';
import { FlashbarProps } from './interfaces';
import { TIMEOUT_FOR_ENTERING_ANIMATION } from './constant';
import { TransitionGroup } from 'react-transition-group';
import { Transition } from '../internal/components/transition';

import styles from './styles.css.js';
import { useFlashbar } from './common';
import { useInternalI18n } from '../internal/i18n/context';

export { FlashbarProps };

export default function NonCollapsibleFlashbar({ items, i18nStrings, ...restProps }: FlashbarProps) {
  const { allItemsHaveId, baseProps, breakpoint, isReducedMotion, isVisualRefresh, mergedRef } = useFlashbar({
    items,
    ...restProps,
  });

  const i18n = useInternalI18n('flashbar');
  const ariaLabel = i18n('i18nStrings.ariaLabel', i18nStrings?.ariaLabel);

  /**
   * All the flash items should have ids so we can identify which DOM element is being
   * removed from the DOM to animate it. Motion will be disabled if any of the provided
   * flash messages does not contain an `id`.
   */
  const motionDisabled = isReducedMotion || !isVisualRefresh || !allItemsHaveId;

  const animateFlash = !isReducedMotion && isVisualRefresh;

  /**
   * If the flashbar is flat and motion is `enabled` then the adding and removing of items
   * from the flashbar will render with visual transitions.
   */
  function renderFlatItemsWithTransitions() {
    if (motionDisabled || !items) {
      return;
    }

    return (
      // This is a proxy for <ul>, so we're not applying a class to another actual component.
      // eslint-disable-next-line react/forbid-component-props
      <TransitionGroup component="ul" className={styles['flash-list']} aria-label={ariaLabel}>
        {items.map((item, index) => (
          <Transition
            transitionChangeDelay={{ entering: TIMEOUT_FOR_ENTERING_ANIMATION }}
            key={item.id ?? index}
            in={true}
          >
            {(state: string, transitionRootElement: React.Ref<HTMLDivElement> | undefined) => (
              <li className={styles['flash-list-item']}>
                {renderItem(item, item.id ?? index, transitionRootElement, state)}
              </li>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    );
  }

  /**
   * If the flashbar is flat and motion is `disabled` then the adding and removing of items
   * from the flashbar will render without visual transitions.
   */
  function renderFlatItemsWithoutTransitions() {
    if (!motionDisabled || !items) {
      return;
    }

    return (
      <ul className={styles['flash-list']} aria-label={ariaLabel}>
        {items.map((item, index) => (
          <li key={item.id ?? index} className={styles['flash-list-item']}>
            {renderItem(item, item.id ?? index)}
          </li>
        ))}
      </ul>
    );
  }

  /**
   * This is a shared render function for a single flashbar item to be used
   * by the stacking, motion, and non-motion item group render functions.
   */
  function renderItem(
    item: FlashbarProps.MessageDefinition,
    key: string | number,
    transitionRootElement?: React.Ref<HTMLDivElement> | undefined,
    transitionState?: string | undefined
  ) {
    return (
      <Flash
        // eslint-disable-next-line react/forbid-component-props
        className={clsx(animateFlash && styles['flash-with-motion'], isVisualRefresh && styles['flash-refresh'])}
        key={key}
        ref={transitionRootElement}
        transitionState={transitionState}
        {...item}
      />
    );
  }

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.flashbar, styles[`breakpoint-${breakpoint}`])}
      ref={mergedRef}
    >
      {renderFlatItemsWithTransitions()}
      {renderFlatItemsWithoutTransitions()}
    </div>
  );
}
