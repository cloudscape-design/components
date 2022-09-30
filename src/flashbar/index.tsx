// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import customCssProps from '../internal/generated/custom-css-properties';
import { Flash } from './flash';
import { FlashbarProps } from './interfaces';
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
import VisualContext from '../internal/components/visual-context';
import styles from './styles.css.js';

export { FlashbarProps };

export default function Flashbar({ items, ...restProps }: FlashbarProps) {
  const { __internalRootRef } = useBaseComponent('Flashbar');
  const [breakpoint, ref] = useContainerBreakpoints(['xs']);
  const baseProps = getBaseProps(restProps);
  const mergedRef = useMergeRefs(ref, __internalRootRef);
  const isFocusVisible = useFocusVisible();
  const isVisualRefresh = useVisualRefresh();

  /**
   * All the flash items should have ids so we can identify which DOM element is being
   * removed from the DOM to animate it. Motion will be disabled if any of the provided
   * flash messages does not contain an `id`.
   */
  const motionDisabled =
    useReducedMotion(ref as any) || !isVisualRefresh || (items && !items.every(item => 'id' in item));

  /**
   * The `enableStackingOption` property is a hidden boolean that allows for teams
   * to beta test the flashbar stacking feature.
   */
  const enableStackingOption = (restProps as any).enableStackingOption;
  const [isFlashbarStacked, setIsFlashbarStacked] = useState(false);
  const [isFlashbarStackExpanded, setIsFlashbarStackExpanded] = useState(false);

  useEffect(
    function handleIsFlashbardStacked() {
      if (enableStackingOption && items?.length > 3) {
        setIsFlashbarStacked(true);
      } else {
        setIsFlashbarStacked(false);
        setIsFlashbarStackExpanded(false);
      }
    },
    [enableStackingOption, isFlashbarStacked, items]
  );

  /**
   * If the `isFlashbarStacked` is true (which is only possible if `enableStackingOption` is true)
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
                {index === 0 && renderItem(item, item.id ?? index)}
                {index > 0 && <div className={clsx(styles.flash, styles[`flash-type-${item.type ?? 'info'}`])} />}
              </div>
            ))}
          </div>
        )}

        {isFlashbarStackExpanded && (
          <div className={styles.expanded}>{items.map((item, index) => renderItem(item, item.id ?? index))}</div>
        )}

        <button
          className={clsx(styles.toggle, isVisualRefresh && styles['visual-refresh'], 'awsui-context-content-header')}
          onClick={() => setIsFlashbarStackExpanded(!isFlashbarStackExpanded)}
          {...isFocusVisible}
        >
          <InternalIcon
            className={clsx(styles.icon, isFlashbarStackExpanded && styles.expanded)}
            size="small"
            name="angle-down"
          />
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
      <TransitionGroup component={null}>
        {items &&
          items.map((item, index) => (
            <Transition
              transitionChangeDelay={{ entering: TIMEOUT_FOR_ENTERING_ANIMATION }}
              key={item.id ?? index}
              in={true}
            >
              {(state: string, transitionRootElement: React.Ref<HTMLDivElement> | undefined) =>
                renderItem(item, item.id ?? index, transitionRootElement, state)
              }
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

    return <>{items.map((item, index) => renderItem(item, item.id ?? index))}</>;
  }

  /**
   *
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
        className={clsx(isVisualRefresh ? styles['flash-refresh'] : '')}
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
      <VisualContext contextName="flashbar">
        {renderStackedItems()}
        {renderFlatItemsWithTransitions()}
        {renderFlatItemsWithoutTransitions()}
      </VisualContext>
    </div>
  );
}

applyDisplayName(Flashbar, 'Flashbar');
