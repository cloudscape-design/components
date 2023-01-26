// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import customCssProps from '../internal/generated/custom-css-properties';
import { Flash, focusFlashById } from './flash';
import { FlashbarProps, FlashType, CollapsibleFlashbarProps } from './interfaces';
import InternalIcon from '../icon/internal';
import { TransitionGroup } from 'react-transition-group';
import { Transition } from '../internal/components/transition';
import useFocusVisible from '../internal/hooks/focus-visible';
import { getVisualContextClassname } from '../internal/components/visual-context';

import styles from './styles.css.js';
import { counterTypes, getFlashTypeCount, getVisibleCollapsedItems, LabelName, StackableItem } from './utils';
import { animate, getDOMRects } from '../internal/animate';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { IconProps } from '../icon/interfaces';
import { sendToggleMetric } from './internal/analytics';
import { useFlashbar } from './common';
import LiveRegion from '../internal/components/live-region';
import { throttle } from '../internal/utils/throttle';

export { FlashbarProps };

// If the number of items is equal or less than this value,
// the toggle element will not be displayed and the Flashbar will look like a regular single-item Flashbar.
const maxNonCollapsibleItems = 1;

const resizeListenerThrottleDelay = 100;

export default function CollapsibleFlashbar({ items, ...restProps }: FlashbarProps & CollapsibleFlashbarProps) {
  const [enteringItems, setEnteringItems] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>([]);
  const [exitingItems, setExitingItems] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>([]);
  const [isFlashbarStackExpanded, setIsFlashbarStackExpanded] = useState(false);

  const getElementsToAnimate = useCallback(() => {
    const flashElements = isFlashbarStackExpanded ? expandedItemRefs.current : collapsedItemRefs.current;
    return { ...flashElements, toggleButton: toggleElementRef.current };
  }, [isFlashbarStackExpanded]);

  const prepareAnimations = useCallback(() => {
    const rects = getDOMRects(getElementsToAnimate());
    setInitialAnimationState(rects);
  }, [getElementsToAnimate]);

  const { baseProps, breakpoint, isReducedMotion, isVisualRefresh, mergedRef, ref } = useFlashbar({
    items,
    ...restProps,
    onItemsAdded: newItems => {
      setEnteringItems([...enteringItems, ...newItems]);
    },
    onItemsChanged: options => {
      // If not all items have ID, we can still animate collapse/expand transitions
      // because we can rely on each item's index in the original array,
      // but we can't do that when elements are added or removed, since the index changes.
      if (options?.allItemsHaveId && !options?.isReducedMotion) {
        prepareAnimations();
      }
    },
    onItemsRemoved: removedItems => {
      setExitingItems([...exitingItems, ...removedItems]);
    },
  });

  const isFocusVisible = useFocusVisible();
  const collapsedItemRefs = useRef<Record<string | number, HTMLElement | null>>({});
  const expandedItemRefs = useRef<Record<string | number, HTMLElement | null>>({});
  const [initialAnimationState, setInitialAnimationState] = useState<Record<string | number, DOMRect> | null>(null);
  const listElementRef = useRef<HTMLUListElement | null>(null);
  const toggleElementRef = useRef<HTMLDivElement | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const flashbarElementId = useUniqueId('flashbar');
  const itemCountElementId = useUniqueId('item-count');

  if (items.length <= maxNonCollapsibleItems && isFlashbarStackExpanded) {
    setIsFlashbarStackExpanded(false);
  }

  const animateFlash = !isReducedMotion;

  function toggleCollapseExpand() {
    sendToggleMetric(items.length, !isFlashbarStackExpanded);
    if (!isReducedMotion) {
      prepareAnimations();
    }
    if (!isFlashbarStackExpanded && items?.length) {
      const lastItem = items[items.length - 1];
      if (lastItem.id !== undefined) {
        focusFlashById(ref.current, lastItem.id);
      }
    }
    setIsFlashbarStackExpanded(prev => !prev);
  }

  const updateBottomSpacing = useMemo(
    () =>
      throttle(() => {
        // Allow vertical space between Flashbar and page bottom only when the Flashbar is reaching the end of the page,
        // otherwise avoid spacing with eventual sticky elements below.
        const listElement = listElementRef?.current;
        const flashbar = listElement?.parentElement;
        if (listElement && flashbar) {
          const bottom = listElement.getBoundingClientRect().bottom;
          const windowHeight = window.innerHeight;
          // Apply the class first (before rendering)
          // so that we can make calculations based on the applied padding-bottom;
          // then we might decide to remove it or not.
          flashbar.classList.add(styles['spaced-bottom']);
          const applySpacing =
            isFlashbarStackExpanded && bottom + parseInt(getComputedStyle(flashbar).paddingBottom) >= windowHeight;
          if (!applySpacing) {
            flashbar.classList.remove(styles['spaced-bottom']);
          }
        }
      }, resizeListenerThrottleDelay),
    [isFlashbarStackExpanded]
  );

  useLayoutEffect(() => {
    window.addEventListener('resize', updateBottomSpacing);
    return () => {
      window.removeEventListener('resize', updateBottomSpacing);
      updateBottomSpacing.cancel();
    };
  }, [updateBottomSpacing]);

  const { i18nStrings } = restProps;

  useLayoutEffect(() => {
    // When `useLayoutEffect` is called, the DOM is updated but has not been painted yet,
    // so it's a good moment to trigger animations that will make calculations based on old and new DOM state.
    // The old state is kept in `initialAnimationState`
    // and the new state can be retrieved from the current DOM elements.

    if (initialAnimationState) {
      updateBottomSpacing();
      animate({
        elements: getElementsToAnimate(),
        oldState: initialAnimationState,
        newElementInitialState: ({ top }) => ({ scale: 0.9, y: -0.2 * top }),
        onTransitionsEnd: () => setTransitioning(false),
      });
      setTransitioning(true);
      setInitialAnimationState(null);
    }
  }, [updateBottomSpacing, getElementsToAnimate, initialAnimationState, isFlashbarStackExpanded]);

  const isCollapsible = items.length > maxNonCollapsibleItems;

  // When using the stacking feature, the items are shown in reverse order (last item on top)
  const reversedItems = items.slice().reverse();

  const countByType = getFlashTypeCount(items);

  const stackDepth = Math.min(3, items.length);

  const itemsToShow = isFlashbarStackExpanded
    ? reversedItems.map((item, index) => ({ ...item, expandedIndex: index }))
    : getVisibleCollapsedItems(reversedItems, stackDepth).map((item: StackableItem, index: number) => ({
        ...item,
        collapsedIndex: index,
      }));

  const ariaLabel = i18nStrings?.ariaLabel;
  const toggleButtonText = i18nStrings?.toggleButtonText;

  const getItemId = (item: StackableItem | FlashbarProps.MessageDefinition) =>
    item.id ?? (item as StackableItem).expandedIndex ?? 0;

  // This check allows us to use the standard "enter" Transition only when the notification was not existing before.
  // If instead it was moved to the top of the stack but was already present in the array
  // (e.g, after dismissing another notification),
  // we need to use different, more custom and more controlled animations.
  const hasEntered = (item: StackableItem | FlashbarProps.MessageDefinition) =>
    enteringItems.some(_item => _item.id && _item.id === item.id);
  const hasLeft = (item: StackableItem | FlashbarProps.MessageDefinition) => !('expandedIndex' in item);
  const hasEnteredOrLeft = (item: StackableItem | FlashbarProps.MessageDefinition) => hasEntered(item) || hasLeft(item);

  const showInnerContent = (item: StackableItem | FlashbarProps.MessageDefinition) =>
    isFlashbarStackExpanded || hasLeft(item) || ('expandedIndex' in item && item.expandedIndex === 0);

  const shouldUseStandardAnimation = (item: StackableItem, index: number) => index === 0 && hasEnteredOrLeft(item);

  const getAnimationElementId = (item: StackableItem) => `flash-${getItemId(item)}`;

  const renderList = () => (
    <ul
      ref={listElementRef}
      className={clsx(
        styles['flash-list'],
        isFlashbarStackExpanded ? styles.expanded : styles.collapsed,
        transitioning && styles['animation-running'],
        initialAnimationState && styles['animation-ready'],
        isVisualRefresh && styles['visual-refresh']
      )}
      id={flashbarElementId}
      aria-label={ariaLabel}
      aria-describedby={isCollapsible ? itemCountElementId : undefined}
      style={
        !isFlashbarStackExpanded || transitioning
          ? {
              [customCssProps.flashbarStackDepth]: stackDepth,
            }
          : undefined
      }
    >
      <TransitionGroup component={null}>
        {itemsToShow.map((item: StackableItem, index: number) => (
          <Transition
            key={getItemId(item)}
            in={!hasLeft(item)}
            onStatusChange={status => {
              if (status === 'entered') {
                setEnteringItems([]);
              } else if (status === 'exited') {
                setExitingItems([]);
              }
            }}
          >
            {(state: string, transitionRootElement: React.Ref<HTMLDivElement> | undefined) => (
              <li
                aria-hidden={!showInnerContent(item)}
                className={
                  showInnerContent(item)
                    ? clsx(
                        styles['flash-list-item'],
                        !isFlashbarStackExpanded && styles.item,
                        !collapsedItemRefs.current[getAnimationElementId(item)] && styles['expanded-only']
                      )
                    : clsx(styles.flash, styles[`flash-type-${item.type ?? 'info'}`], styles.item)
                }
                ref={element => {
                  if (isFlashbarStackExpanded) {
                    expandedItemRefs.current[getAnimationElementId(item)] = element;
                  } else {
                    collapsedItemRefs.current[getAnimationElementId(item)] = element;
                  }
                }}
                style={
                  !isFlashbarStackExpanded || transitioning
                    ? {
                        [customCssProps.flashbarStackIndex]:
                          (item as StackableItem).collapsedIndex ?? (item as StackableItem).expandedIndex ?? index,
                      }
                    : undefined
                }
                key={getItemId(item)}
              >
                {showInnerContent(item) && (
                  <Flash
                    // eslint-disable-next-line react/forbid-component-props
                    className={clsx(
                      animateFlash && styles['flash-with-motion'],
                      isVisualRefresh && styles['flash-refresh']
                    )}
                    key={getItemId(item)}
                    ref={shouldUseStandardAnimation(item, index) ? transitionRootElement : undefined}
                    transitionState={shouldUseStandardAnimation(item, index) ? state : undefined}
                    {...item}
                  />
                )}
              </li>
            )}
          </Transition>
        ))}
      </TransitionGroup>
    </ul>
  );

  return (
    <div
      {...baseProps}
      className={clsx(
        baseProps.className,
        styles.flashbar,
        styles[`breakpoint-${breakpoint}`],
        styles.stack,
        isFlashbarStackExpanded && styles.expanded,
        getVisualContextClassname('flashbar')
      )}
      ref={mergedRef}
    >
      <>
        {isFlashbarStackExpanded && renderList()}
        {isCollapsible && (
          <div
            className={clsx(
              styles.toggle,
              isVisualRefresh && styles['visual-refresh'],
              isFlashbarStackExpanded ? styles.expanded : styles.collapsed,
              transitioning && styles['animation-running']
            )}
            onClick={toggleCollapseExpand}
            ref={toggleElementRef}
          >
            <span className={styles.status} id={itemCountElementId}>
              <LiveRegion>
                {toggleButtonText && <h2>{toggleButtonText}</h2>}
                {counterTypes
                  .map(
                    ({ type, labelName }: { type: FlashType; labelName: LabelName }) =>
                      `${(i18nStrings && i18nStrings[labelName]) ?? ''}: ${countByType[type]}`
                  )
                  .join(', ')}
              </LiveRegion>
              <span aria-hidden="true" className={styles['item-count-with-header']}>
                {toggleButtonText && <h2 className={styles.header}>{toggleButtonText}</h2>}
                <span className={styles['item-count']}>
                  {counterTypes.map(({ type, labelName, iconName }) => (
                    <NotificationTypeCount
                      key={type}
                      iconName={iconName}
                      label={i18nStrings ? i18nStrings[labelName] : undefined}
                      count={countByType[type]}
                    />
                  ))}
                </span>
              </span>
            </span>
            <button
              aria-controls={flashbarElementId}
              aria-describedby={itemCountElementId}
              aria-expanded={isFlashbarStackExpanded}
              aria-label={i18nStrings?.toggleButtonAriaLabel}
              className={clsx(styles.button, isFlashbarStackExpanded && styles.expanded)}
              {...isFocusVisible}
            >
              <InternalIcon className={styles.icon} size="normal" name="angle-down" />
            </button>
          </div>
        )}
        {!isFlashbarStackExpanded && renderList()}
      </>
    </div>
  );
}

const NotificationTypeCount = ({
  iconName,
  label,
  count,
}: {
  iconName: IconProps.Name;
  label?: string;
  count: number;
}) => {
  return (
    <span className={styles['type-count']}>
      <span title={label}>
        <InternalIcon name={iconName} />
      </span>
      <span className={styles['count-number']}>{count}</span>
    </span>
  );
};
