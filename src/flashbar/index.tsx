// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { getStackedItems } from './utils';
import { animate, getDOMRects } from './animate';

export { FlashbarProps };

const maxUnstackedItems = 1;

export default function Flashbar(props: FlashbarProps) {
  const { __internalRootRef } = useBaseComponent('Flashbar');
  const baseProps = getBaseProps(props);

  const ref = useRef<HTMLDivElement | null>(null);
  const [breakpoint, breakpointRef] = useContainerBreakpoints(['xs']);
  const mergedRef = useMergeRefs(ref, breakpointRef, __internalRootRef);

  const isFocusVisible = useFocusVisible();
  const isVisualRefresh = useVisualRefresh();

  /**
   * The `stackItems` property is a hidden boolean that allows for teams
   * to beta test the flashbar stacking feature.
   */
  const stackItems = isStackedFlashbar(props);

  // When using the stacking feature, the items are shown in reverse order (last item on top)
  const items = stackItems ? props.items.slice().reverse() : props.items;
  const [previousItems, setPreviousItems] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>(items);
  const [nextFocusId, setNextFocusId] = useState<string | null>(null);

  const collapsedItemRefs = useRef<Record<string | number, HTMLElement | null>>({});
  const expandedItemRefs = useRef<Record<string | number, HTMLElement | null>>({});
  const [initialAnimationState, setInitialAnimationState] = useState<Record<number, DOMRect> | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const [toggleButtonRect, setToggleButtonRect] = useState<DOMRect>();
  const [transitioning, setTransitioning] = useState(false);
  const [isFlashbarStackExpanded, setIsFlashbarStackExpanded] = useState(false);

  const isReducedMotion = useReducedMotion(breakpointRef as any);

  const prepareAnimation = useCallback(() => {
    if (isReducedMotion) {
      return;
    }
    const oldElements = isFlashbarStackExpanded ? expandedItemRefs.current : collapsedItemRefs.current;
    const rects = getDOMRects(oldElements);
    setInitialAnimationState(rects);
    setToggleButtonRect(toggleButtonRef.current?.getBoundingClientRect());
  }, [isFlashbarStackExpanded, isReducedMotion]);

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
      prepareAnimation();
    }
  }

  useEffect(() => {
    if (nextFocusId) {
      focusFlashById(ref.current, nextFocusId);
    }
  }, [nextFocusId]);

  useEffect(() => {
    if (items.length <= maxUnstackedItems) {
      setIsFlashbarStackExpanded(false);
    }
  }, [items.length]);

  /**
   * All the flash items should have ids so we can identify which DOM element is being
   * removed from the DOM to animate it. Motion will be disabled if any of the provided
   * flash messages does not contain an `id`.
   */
  const motionDisabled = isReducedMotion || !isVisualRefresh || (items && !items.every(item => 'id' in item));

  const isFlashbarStackable = stackItems && items?.length > maxUnstackedItems;

  const animateFlash = !isReducedMotion && (isVisualRefresh || isFlashbarStackable);

  function toggleCollapseExpand() {
    prepareAnimation();
    setIsFlashbarStackExpanded(!isFlashbarStackExpanded);
  }

  useLayoutEffect(() => {
    // At this point, the DOM is updated but has not been painted yet. So it's a good moment to trigger animations
    // that will make calculations based on old and new DOM state.
    // The old state is kept in `oldStateDOMRects` (notification items) and `toggleButtonRect` (toggle button),
    // and the new state can be retrieved from the current DOM elements.
    if (initialAnimationState) {
      const elements = isFlashbarStackExpanded ? expandedItemRefs.current : collapsedItemRefs.current;
      animate({ elements, oldState: initialAnimationState, onTransitionEnd: () => setTransitioning(false) });
      if (toggleButtonRect && toggleButtonRef) {
        animate({
          elements: {
            toggleButton: toggleButtonRef.current,
          },
          oldState: { toggleButton: toggleButtonRect },
        });
      }
      setTransitioning(true);
      setInitialAnimationState(null);
    }
  }, [isFlashbarStackExpanded, initialAnimationState, toggleButtonRect]);

  /**
   * If the `isFlashbarStacked` is true (which is only possible if `stackItems` is true)
   * then the first item should be rendered followed by two dummy items that visually indicate
   * two, three, or more items exist in the stack.
   */
  function renderStackedItems() {
    if (!isFlashbarStackable) {
      return;
    }

    const stackDepth = Math.min(3, items.length);
    const stackedItems = getStackedItems(items, stackDepth);

    const { i18nStrings } = props as StackedFlashbarProps;
    const toggleButtonText = i18nStrings?.toggleButtonText(items.length);

    const toggleButtonAriaLabel = isFlashbarStackExpanded
      ? i18nStrings?.collapseButtonAriaLabel
      : i18nStrings?.expandButtonAriaLabel(items.length);

    return (
      <>
        {!isFlashbarStackExpanded && (
          <TransitionGroup
            component="ul"
            className={clsx(
              styles['flash-list'],
              styles.collapsed,
              transitioning && styles.transitioning,
              isVisualRefresh && styles['visual-refresh']
            )}
            style={{
              [customCssProps.flashbarStackDepth]: stackDepth,
            }}
          >
            {stackedItems.map((item, index) => (
              <>
                {index === 0 && (
                  <Transition key={item.id ?? index} in={true}>
                    {(state: string, transitionRootElement: React.Ref<HTMLDivElement> | undefined) => (
                      <li
                        className={clsx(styles['flash-list-item'], styles.item)}
                        ref={element => (collapsedItemRefs.current[item.id ?? item.originalIndex] = element)}
                        style={{ [customCssProps.flashbarStackIndex]: 0 }}
                        key={item.id ?? item.originalIndex}
                      >
                        {renderItem(item, item.id ?? item.originalIndex, transitionRootElement, state)}
                      </li>
                    )}
                  </Transition>
                )}
                {index > 0 && (
                  <li
                    className={clsx(styles.flash, styles[`flash-type-${item.type ?? 'info'}`], styles.item)}
                    ref={element => (collapsedItemRefs.current[item.id ?? item.originalIndex] = element)}
                    style={{ [customCssProps.flashbarStackIndex]: index }}
                    key={item.id ?? item.originalIndex}
                  />
                )}
              </>
            ))}
          </TransitionGroup>
        )}

        {isFlashbarStackExpanded && (
          <ul
            className={clsx(styles['flash-list'], styles.expanded, transitioning && styles.transitioning)}
            style={{
              [customCssProps.flashbarStackDepth]: stackDepth,
            }}
          >
            {items.map((item, index) => (
              <li
                key={item.id ?? index}
                className={styles['flash-list-item']}
                ref={element => (expandedItemRefs.current[item.id ?? index] = element)}
                style={{ [customCssProps.flashbarStackIndex]: index }}
              >
                {renderItem(item, item.id ?? index)}
              </li>
            ))}
          </ul>
        )}

        <button
          aria-label={toggleButtonAriaLabel}
          className={clsx(
            styles.toggle,
            isVisualRefresh && styles['visual-refresh'],
            isFlashbarStackExpanded ? styles.expanded : styles.collapsed,
            transitioning && styles.transitioning
          )}
          onClick={toggleCollapseExpand}
          ref={toggleButtonRef}
          {...isFocusVisible}
        >
          {toggleButtonText && <span>{toggleButtonText}</span>}
          <span className={clsx(styles.icon, isFlashbarStackExpanded && styles.expanded)}>
            <InternalIcon size="normal" name="angle-down" />
          </span>
        </button>
      </>
    );
  }

  /**
   * If the flashbar is flat and motion is `enabled` then the adding and removing of items
   * from the flashbar will render with visual transitions.
   */
  function renderFlatItemsWithTransitions() {
    if (isFlashbarStackable || motionDisabled || !items) {
      return;
    }

    return (
      // This is a proxy for <ul>, so we're not applying a class to another actual component.
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
    if (isFlashbarStackable || !motionDisabled || !items) {
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
        className={clsx(
          getVisualContextClassname('flashbar'),
          animateFlash && styles['flash-with-motion'],
          isVisualRefresh && styles['flash-refresh']
        )}
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
      className={clsx(
        baseProps.className,
        styles.flashbar,
        styles[`breakpoint-${breakpoint}`],
        isFlashbarStackable && styles.stack
      )}
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
