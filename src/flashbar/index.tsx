// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import customCssProps from '../internal/generated/custom-css-properties';
import { Flash, focusFlashById } from './flash';
import { FlashbarProps, StackedFlashbarProps } from './interfaces';
import { getBaseProps } from '../internal/base-component';
import InternalIcon from '../icon/internal';
import { TIMEOUT_FOR_ENTERING_ANIMATION } from './constant';
import { TransitionGroup } from 'react-transition-group';
import { Transition } from '../internal/components/transition';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import useFocusVisible from '../internal/hooks/focus-visible';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useReducedMotion, useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { getVisualContextClassname } from '../internal/components/visual-context';

import styles from './styles.css.js';

export { FlashbarProps };

export default function Flashbar({ items, ...restProps }: FlashbarProps) {
  const { __internalRootRef } = useBaseComponent('Flashbar');
  const baseProps = getBaseProps(restProps);

  const ref = useRef<HTMLDivElement | null>(null);
  const [breakpoint, breakpointRef] = useContainerBreakpoints(['xs']);
  const mergedRef = useMergeRefs(ref, breakpointRef, __internalRootRef);

  const isFocusVisible = useFocusVisible();
  const isVisualRefresh = useVisualRefresh();

  const [previousItems, setPreviousItems] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>(items);
  const [nextFocusId, setNextFocusId] = useState<string | null>(null);

  // Track new or removed item IDs in state to only trigger focus changes for newly added items.
  // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
  if (items) {
    const newItems = items.filter(({ id }) => id && !previousItems.some(item => item.id === id));
    const removedItems = previousItems.filter(({ id }) => id && !items.some(item => item.id === id));
    if (newItems.length > 0 || removedItems.length > 0) {
      setPreviousItems(items);
      const newFocusItems = newItems.filter(({ ariaRole }) => ariaRole === 'alert');
      if (newFocusItems.length > 0) {
        setNextFocusId(newFocusItems[0].id!);
      }
    }
  }

  useEffect(() => {
    if (nextFocusId) {
      focusFlashById(ref.current, nextFocusId);
    }
  }, [nextFocusId]);

  /**
   * All the flash items should have ids so we can identify which DOM element is being
   * removed from the DOM to animate it. Motion will be disabled if any of the provided
   * flash messages does not contain an `id`.
   */
  const motionDisabled =
    useReducedMotion(breakpointRef as any) || !isVisualRefresh || (items && !items.every(item => 'id' in item));

  /**
   * The `stackItems` property is a hidden boolean that allows for teams
   * to beta test the flashbar stacking feature.
   */
  const stackItems = isStackedFlashbar(restProps);
  const ariaLabels = stackItems ? restProps.ariaLabels : {};
  const isFlashbarStacked = stackItems && items?.length > 3;
  const [isFlashbarStackExpanded, setIsFlashbarStackExpanded] = useState(false);

  /**
   * Compute the appropriate aria label for the stacked notifications toggle button
   * based on the expanded/collapsed state of the stack and the presence of
   * corresponding aria label properties.
   */
  function getStackButtonAriaLabel() {
    let stackButtonAriaLabel;

    if (isFlashbarStackExpanded) {
      stackButtonAriaLabel = ariaLabels?.stackCollapseLabel ?? 'Collapse stacked notifications';
    } else {
      stackButtonAriaLabel = ariaLabels?.stackExpandLabel ?? 'Expand stacked notifications';
    }

    return stackButtonAriaLabel;
  }

  /**
   * If the `isFlashbarStacked` is true (which is only possible if `stackItems` is true)
   * then the first item should be rendered followed by two dummy items that visually indicate
   * two, three, or more items exist in the stack.
   */
  function renderStackedItems() {
    if (!isFlashbarStacked) {
      return;
    }

    const stackDepth = Math.min(3, items.length);
    const stackedItems = items.slice(0, stackDepth);

    return (
      <div className={styles.stack} style={{ [customCssProps.flashbarStackDepth]: stackDepth }}>
        {!isFlashbarStackExpanded && (
          <div className={clsx(styles.collapsed, isVisualRefresh && styles['visual-refresh'])}>
            {stackedItems.map((item, index) => (
              <div className={styles.item} style={{ [customCssProps.flashbarStackIndex]: index }} key={index}>
                {index === 0 && (
                  <ul className={styles['flash-list']}>
                    <li className={styles['flash-list-item']}>{renderItem(item, item.id ?? index)}</li>
                  </ul>
                )}
                {index > 0 && <div className={clsx(styles.flash, styles[`flash-type-${item.type ?? 'info'}`])} />}
              </div>
            ))}
          </div>
        )}

        {isFlashbarStackExpanded && (
          <ul className={clsx(styles['flash-list'], styles.expanded)}>
            {items.map((item, index) => (
              <li key={item.id ?? index} className={styles['flash-list-item']}>
                {renderItem(item, item.id ?? index)}
              </li>
            ))}
          </ul>
        )}

        <button
          aria-label={getStackButtonAriaLabel()}
          className={clsx(styles.toggle, isVisualRefresh && styles['visual-refresh'])}
          onClick={() => setIsFlashbarStackExpanded(!isFlashbarStackExpanded)}
          {...isFocusVisible}
        >
          <span className={clsx(styles.icon, isFlashbarStackExpanded && styles.expanded)}>
            <InternalIcon size="small" name="angle-down" />
          </span>
        </button>
      </div>
    );
  }

  /**
   * If the flashbar is flat and motion is `enabled` then the adding and removing of items
   * from the flashbar will render with visual transitions.
   */
  function renderFlatItemsWithTransitions() {
    if (isFlashbarStacked || motionDisabled || !items) {
      return;
    }

    return (
      // This is a proxy for <ul>, so we're not applying a class to another Cloudscape component.
      // eslint-disable-next-line react/forbid-component-props
      <TransitionGroup component="ul" className={styles['flash-list']}>
        {items &&
          items.map((item, index) => (
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
    if (isFlashbarStacked || !motionDisabled || !items) {
      return;
    }

    return (
      <ul className={styles['flash-list']}>
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
        className={clsx(getVisualContextClassname('flashbar'), isVisualRefresh ? styles['flash-refresh'] : '')}
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
      {renderStackedItems()}
      {renderFlatItemsWithTransitions()}
      {renderFlatItemsWithoutTransitions()}
    </div>
  );
}

function isStackedFlashbar(props: any): props is StackedFlashbarProps {
  return 'stackItems' in props && !!props.stackItems;
}

applyDisplayName(Flashbar, 'Flashbar');
