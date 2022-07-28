// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { getBaseProps } from '../internal/base-component';
import styles from './styles.css.js';
import { Flash } from './flash';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import VisualContext from '../internal/components/visual-context';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useReducedMotion, useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { FlashbarProps } from './interfaces';
import { TransitionGroup } from 'react-transition-group';
import { Transition } from '../internal/components/transition';
import { TIMEOUT_FOR_ENTERING_ANIMATION } from './constant';

export { FlashbarProps };

export default function Flashbar({ items, ...restProps }: FlashbarProps) {
  const { __internalRootRef } = useBaseComponent('Flashbar');
  const [breakpoint, ref] = useContainerBreakpoints(['xs']);
  const isRefresh = useVisualRefresh();
  const baseProps = getBaseProps(restProps);

  const mergedRef = useMergeRefs(ref, __internalRootRef);

  // All the flash items should have ids so we can identify which DOM element is being removed from the DOM to animate it.
  const motionDisabled = useReducedMotion(ref as any) || !isRefresh || (items && !items.every(item => 'id' in item));
  // Motion will be disabled if any of the provided flash messages does not contain an `id`

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
  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.flashbar, styles[`breakpoint-${breakpoint}`])}
      ref={mergedRef}
    >
      <VisualContext contextName="flashbar">
        {items && (
          <>
            {motionDisabled
              ? items.map((item, index) => renderFlashItem(item, index))
              : renderFlashItemsWithTransitions(items)}
          </>
        )}
      </VisualContext>
    </div>
  );
}

applyDisplayName(Flashbar, 'Flashbar');
