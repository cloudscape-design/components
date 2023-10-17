// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import customCssProps from '../internal/generated/custom-css-properties';
import { Flash, focusFlashById } from './flash';
import { FlashbarProps } from './interfaces';
import InternalIcon from '../icon/internal';
import { TransitionGroup } from 'react-transition-group';
import { Transition } from '../internal/components/transition';
import styles from './styles.css.js';
import { counterTypes, getFlashTypeCount, getItemColor, getVisibleCollapsedItems, StackableItem } from './utils';
import { animate, getDOMRects } from '../internal/animate';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { IconProps } from '../icon/interfaces';
import { sendToggleMetric } from './internal/analytics';
import { useFlashbar } from './common';
import { throttle } from '../internal/utils/throttle';
import { scrollElementIntoView } from '../internal/utils/scrollable-containers';
import { findUpUntil } from '../internal/utils/dom';
import { useInternalI18n } from '../i18n/context';
import { getVisualContextClassname } from '../internal/components/visual-context';
import { usePrevious } from '../internal/hooks/use-previous';

export { FlashbarProps };

// If the number of items is equal or less than this value,
// the toggle element will not be displayed and the Flashbar will look like a regular single-item Flashbar.
const maxNonCollapsibleItems = 1;

const resizeListenerThrottleDelay = 100;

export default function CollapsibleFlashbar({ items, ...restProps }: FlashbarProps) {
  const [enteringItems, setEnteringItems] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>([]);
  const [exitingItems, setExitingItems] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>([]);
  const [isFlashbarStackExpanded, setIsFlashbarStackExpanded] = useState(false);
  const wasFlashbarStackExpanded = usePrevious(isFlashbarStackExpanded);

  const getElementsToAnimate = useCallback(() => {
    const flashElements = isFlashbarStackExpanded ? expandedItemRefs.current : collapsedItemRefs.current;
    return { ...flashElements, notificationBar: notificationBarRef.current };
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

  const collapsedItemRefs = useRef<Record<string | number, HTMLElement | null>>({});
  const expandedItemRefs = useRef<Record<string | number, HTMLElement | null>>({});
  const [initialAnimationState, setInitialAnimationState] = useState<Record<string | number, DOMRect> | null>(null);
  const listElementRef = useRef<HTMLUListElement | null>(null);
  const notificationBarRef = useRef<HTMLDivElement | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const flashbarElementId = useUniqueId('flashbar');
  const itemCountElementId = useUniqueId('item-count');

  if (items.length <= maxNonCollapsibleItems && isFlashbarStackExpanded) {
    setIsFlashbarStackExpanded(false);
  }

  function toggleCollapseExpand() {
    sendToggleMetric(items.length, !isFlashbarStackExpanded);
    if (!isReducedMotion) {
      prepareAnimations();
    }
    setIsFlashbarStackExpanded(prev => !prev);
  }

  useLayoutEffect(() => {
    if (isFlashbarStackExpanded && items?.length) {
      const mostRecentItem = items[0];
      if (mostRecentItem.id !== undefined) {
        focusFlashById(ref.current, mostRecentItem.id);
      }
    }
    // When collapsing, scroll up if necessary to avoid losing track of the focused button
    else if (wasFlashbarStackExpanded && !isFlashbarStackExpanded && notificationBarRef.current) {
      scrollElementIntoView(notificationBarRef.current);
    }
    // Run this after expanding, but not every time the items change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlashbarStackExpanded]);

  const updateBottomSpacing = useMemo(
    () =>
      throttle(() => {
        // Allow vertical space between Flashbar and page bottom only when the Flashbar is reaching the end of the page,
        // otherwise avoid spacing with eventual sticky elements below.
        const listElement = listElementRef?.current;
        const flashbar = listElement?.parentElement;
        if (listElement && flashbar) {
          // Make sure the bottom padding is present when we make the calculations,
          // then we might decide to remove it or not.
          flashbar.classList.remove(styles.floating);
          const windowHeight = window.innerHeight;
          // Take the parent region into account if using the App Layout, because it might have additional margins.
          // Otherwise we use the Flashbar component for this calculation.
          const outerElement = findUpUntil(flashbar, element => element.getAttribute('role') === 'region') || flashbar;
          const applySpacing =
            isFlashbarStackExpanded && Math.ceil(outerElement.getBoundingClientRect().bottom) >= windowHeight;
          if (!applySpacing) {
            flashbar.classList.add(styles.floating);
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

  const i18n = useInternalI18n('flashbar');
  const ariaLabel = i18n('i18nStrings.ariaLabel', i18nStrings?.ariaLabel);
  const notificationBarText = i18n('i18nStrings.notificationBarText', i18nStrings?.notificationBarText);
  const notificationBarAriaLabel = i18n('i18nStrings.notificationBarAriaLabel', i18nStrings?.notificationBarAriaLabel);
  const iconAriaLabels = {
    errorIconAriaLabel: i18n('i18nStrings.errorIconAriaLabel', i18nStrings?.errorIconAriaLabel),
    inProgressIconAriaLabel: i18n('i18nStrings.inProgressIconAriaLabel', i18nStrings?.inProgressIconAriaLabel),
    infoIconAriaLabel: i18n('i18nStrings.infoIconAriaLabel', i18nStrings?.infoIconAriaLabel),
    successIconAriaLabel: i18n('i18nStrings.successIconAriaLabel', i18nStrings?.successIconAriaLabel),
    warningIconAriaLabel: i18n('i18nStrings.warningIconAriaLabel', i18nStrings?.warningIconAriaLabel),
  };

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

  const countByType = getFlashTypeCount(items);

  const numberOfColorsInStack = new Set(items.map(getItemColor)).size;
  const maxSlots = Math.max(numberOfColorsInStack, 3);
  const stackDepth = Math.min(maxSlots, items.length);

  const itemsToShow = isFlashbarStackExpanded
    ? items.map((item, index) => ({ ...item, expandedIndex: index }))
    : getVisibleCollapsedItems(items, stackDepth).map((item: StackableItem, index: number) => ({
        ...item,
        collapsedIndex: index,
      }));

  const getItemId = (item: StackableItem | FlashbarProps.MessageDefinition) =>
    item.id ?? (item as StackableItem).expandedIndex ?? 0;

  const renderListWithoutAnimations = () => {
    const showInnerContent = (item: StackableItem | FlashbarProps.MessageDefinition) =>
      isFlashbarStackExpanded || ('expandedIndex' in item && item.expandedIndex === 0);

    return (
      <ul
        ref={listElementRef}
        className={clsx(
          styles['flash-list'],
          isFlashbarStackExpanded ? styles.expanded : styles.collapsed,
          isVisualRefresh && styles['visual-refresh']
        )}
        id={flashbarElementId}
        aria-label={ariaLabel}
        aria-describedby={isCollapsible ? itemCountElementId : undefined}
        style={
          !isFlashbarStackExpanded
            ? {
                [customCssProps.flashbarStackDepth]: stackDepth,
              }
            : undefined
        }
      >
        {itemsToShow.map((item: StackableItem, index: number) => (
          <li
            aria-hidden={!showInnerContent(item)}
            className={
              showInnerContent(item)
                ? clsx(styles['flash-list-item'], !isFlashbarStackExpanded && styles.item)
                : clsx(styles.flash, styles[`flash-type-${item.type ?? 'info'}`], styles.item)
            }
            style={
              !isFlashbarStackExpanded
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
                className={clsx(isVisualRefresh && styles['flash-refresh'])}
                key={getItemId(item)}
                i18nStrings={iconAriaLabels}
                {...item}
              />
            )}
          </li>
        ))}
      </ul>
    );
  };

  const renderListWithAnimations = () => {
    // This check allows us to use the standard "enter" Transition only when the notification was not existing before.
    // If instead it was moved to the top of the stack but was already present in the array
    // (e.g, after dismissing another notification),
    // we need to use different, more custom and more controlled animations.
    const hasEntered = (item: StackableItem | FlashbarProps.MessageDefinition) =>
      enteringItems.some(_item => _item.id && _item.id === item.id);
    const hasLeft = (item: StackableItem | FlashbarProps.MessageDefinition) => !('expandedIndex' in item);
    const hasEnteredOrLeft = (item: StackableItem | FlashbarProps.MessageDefinition) =>
      hasEntered(item) || hasLeft(item);

    const showInnerContent = (item: StackableItem | FlashbarProps.MessageDefinition) =>
      isFlashbarStackExpanded || hasLeft(item) || ('expandedIndex' in item && item.expandedIndex === 0);

    const shouldUseStandardAnimation = (item: StackableItem, index: number) => index === 0 && hasEnteredOrLeft(item);

    const getAnimationElementId = (item: StackableItem) => `flash-${getItemId(item)}`;

    return (
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
                      className={clsx(styles['flash-with-motion'], isVisualRefresh && styles['flash-refresh'])}
                      key={getItemId(item)}
                      ref={shouldUseStandardAnimation(item, index) ? transitionRootElement : undefined}
                      transitionState={shouldUseStandardAnimation(item, index) ? state : undefined}
                      i18nStrings={iconAriaLabels}
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
  };

  const renderList = isReducedMotion ? renderListWithoutAnimations : renderListWithAnimations;

  return (
    <div
      {...baseProps}
      className={clsx(
        baseProps.className,
        styles.flashbar,
        styles[`breakpoint-${breakpoint}`],
        styles.stack,
        isCollapsible && styles.collapsible,
        items.length === 2 && styles['short-list'],
        isFlashbarStackExpanded && styles.expanded,
        isVisualRefresh && styles['visual-refresh']
      )}
      ref={mergedRef}
    >
      <>
        {isFlashbarStackExpanded && renderList()}
        {isCollapsible && (
          <div
            className={clsx(
              styles['notification-bar'],
              isVisualRefresh && styles['visual-refresh'],
              isFlashbarStackExpanded ? styles.expanded : styles.collapsed,
              transitioning && styles['animation-running'],
              items.length === 2 && styles['short-list'],
              getVisualContextClassname('flashbar') // Visual context is needed for focus ring to be white
            )}
            onClick={toggleCollapseExpand}
            ref={notificationBarRef}
          >
            <span aria-live="polite" className={styles.status} role="status" id={itemCountElementId}>
              {notificationBarText && <h2 className={styles.header}>{notificationBarText}</h2>}
              <span className={styles['item-count']}>
                {counterTypes.map(({ type, labelName, iconName }) => (
                  <NotificationTypeCount
                    key={type}
                    iconName={iconName}
                    label={iconAriaLabels[labelName]}
                    count={countByType[type]}
                  />
                ))}
              </span>
            </span>
            <button
              aria-controls={flashbarElementId}
              aria-describedby={itemCountElementId}
              aria-expanded={isFlashbarStackExpanded}
              aria-label={notificationBarAriaLabel}
              className={clsx(styles.button, isFlashbarStackExpanded && styles.expanded)}
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
      <span aria-label={label} role="img">
        <span title={label} aria-hidden="true">
          <InternalIcon name={iconName} />
        </span>
      </span>
      <span className={styles['count-number']}>{count}</span>
    </span>
  );
};
