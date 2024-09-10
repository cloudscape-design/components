// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TransitionGroup } from 'react-transition-group';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { useInternalI18n } from '../i18n/context';
import { Transition } from '../internal/components/transition';
import { getComponentsAnalyticsMetadata, getItemAnalyticsMetadata } from './analytics-metadata/utils';
import { useFlashbar } from './common';
import { TIMEOUT_FOR_ENTERING_ANIMATION } from './constant';
import { Flash } from './flash';
import { FlashbarProps } from './interfaces';

import styles from './styles.css.js';

export { FlashbarProps };

export default function NonCollapsibleFlashbar({ items, i18nStrings, ...restProps }: FlashbarProps) {
  const { allItemsHaveId, baseProps, breakpoint, isReducedMotion, isVisualRefresh, mergedRef } = useFlashbar({
    items,
    ...restProps,
  });

  const i18n = useInternalI18n('flashbar');
  const ariaLabel = i18n('i18nStrings.ariaLabel', i18nStrings?.ariaLabel);
  const iconAriaLabels = {
    errorIconAriaLabel: i18n('i18nStrings.errorIconAriaLabel', i18nStrings?.errorIconAriaLabel),
    inProgressIconAriaLabel: i18n('i18nStrings.inProgressIconAriaLabel', i18nStrings?.inProgressIconAriaLabel),
    infoIconAriaLabel: i18n('i18nStrings.infoIconAriaLabel', i18nStrings?.infoIconAriaLabel),
    successIconAriaLabel: i18n('i18nStrings.successIconAriaLabel', i18nStrings?.successIconAriaLabel),
    warningIconAriaLabel: i18n('i18nStrings.warningIconAriaLabel', i18nStrings?.warningIconAriaLabel),
  };

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
      <ul
        className={styles['flash-list']}
        aria-label={ariaLabel}
        {...getAnalyticsMetadataAttribute(getComponentsAnalyticsMetadata(items.length, false))}
      >
        {items.map((item, index) => (
          <li
            key={item.id ?? index}
            className={styles['flash-list-item']}
            {...getAnalyticsMetadataAttribute(getItemAnalyticsMetadata(index + 1, item.type || 'info', item.id))}
          >
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
        i18nStrings={iconAriaLabels}
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
