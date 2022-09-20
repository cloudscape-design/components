// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useState } from 'react';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { getBaseProps } from '../internal/base-component';
import styles from './styles.css.js';
import { Flash } from './flash';
import Toggle from '../toggle/internal';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import VisualContext from '../internal/components/visual-context';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useReducedMotion, useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { FlashbarProps } from './interfaces';
import { TransitionGroup } from 'react-transition-group';
import { Transition } from '../internal/components/transition';
import { TIMEOUT_FOR_ENTERING_ANIMATION } from './constant';
import customCssProps from '../internal/generated/custom-css-properties';

export { FlashbarProps };

export default function Flashbar({ items, ...restProps }: FlashbarProps) {
  const { __internalRootRef } = useBaseComponent('Flashbar');
  const [breakpoint, ref] = useContainerBreakpoints(['xs']);
  const isRefresh = useVisualRefresh();
  const baseProps = getBaseProps(restProps);
  const mergedRef = useMergeRefs(ref, __internalRootRef);

  // All the flash items should have ids so we can identify which DOM element is being removed from the DOM to animate it.
  // Motion will be disabled if any of the provided flash messages does not contain an `id`
  const motionDisabled = useReducedMotion(ref as any) || !isRefresh || (items && !items.every(item => 'id' in item));

  /**
   *
   */
  // const [enableStackingOption, setEnableStackingOption] = useState(true);
  const enableStackingOption = true;
  const [isFlashbarStacked, setIsFlashbarStacked] = useState(false);

  const renderFlashItem = (item: FlashbarProps.MessageDefinition, index: number) => (
    <Flash
      key={item.id ?? index}
      // eslint-disable-next-line react/forbid-component-props
      className={clsx(isRefresh ? styles['flash-refresh'] : '')}
      {...item}
    />
  );

  const renderFlashItemsWithTransitions = (items: readonly FlashbarProps.MessageDefinition[]) => {
    return (
      <>
        <TransitionGroup component={null}>
          {items &&
            items.map((item, index) => (
              <Transition
                transitionChangeDelay={{ entering: TIMEOUT_FOR_ENTERING_ANIMATION }}
                key={item.id ?? index}
                in={true}
              >
                {(state: string, transitionRootElement: React.Ref<HTMLDivElement> | undefined) => (
                  <Flash
                    ref={transitionRootElement}
                    key={item.id ?? index}
                    transitionState={state}
                    // eslint-disable-next-line react/forbid-component-props
                    className={clsx(isRefresh ? styles['flash-refresh'] : '')}
                    {...item}
                  />
                )}
              </Transition>
            ))}
        </TransitionGroup>
      </>
    );
  };

  /**
   *
   */
  function renderStackedFlashItems(items: readonly FlashbarProps.MessageDefinition[]) {
    const stackDepth = Math.min(3, items.length);
    const stackedItems = items.slice(0, stackDepth);

    return (
      <div className={styles.stack} style={{ [customCssProps.flashbarStackDepth]: stackDepth }}>
        {stackedItems.map((item, index) => (
          <div className={styles.item} style={{ [customCssProps.flashbarStackDepth]: index }} key={index}>
            {index === 0 && (
              <Flash
                key={item.id ?? index}
                // eslint-disable-next-line react/forbid-component-props
                className={clsx(isRefresh ? styles['flash-refresh'] : '')}
                {...item}
              />
            )}
            {index > 0 && <div className={clsx(styles.flash, styles[`flash-type-${item.type ?? 'info'}`])} />}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.flashbar, styles[`breakpoint-${breakpoint}`])}
      ref={mergedRef}
    >
      <VisualContext contextName="flashbar">
        {items.length > 1 && enableStackingOption && (
          <div className={clsx(styles['stacking-option'])}>
            <Toggle onChange={({ detail }) => setIsFlashbarStacked(detail.checked)} checked={isFlashbarStacked}>
              Stack Notifications {`(${items.length})`}
            </Toggle>
          </div>
        )}

        {items.length > 0 && isFlashbarStacked && renderStackedFlashItems(items)}
        {items && !isFlashbarStacked && !motionDisabled && renderFlashItemsWithTransitions(items)}
        {items && !isFlashbarStacked && motionDisabled && items.map((item, index) => renderFlashItem(item, index))}
      </VisualContext>
    </div>
  );
}

applyDisplayName(Flashbar, 'Flashbar');
