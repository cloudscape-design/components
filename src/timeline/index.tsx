// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { BaseComponentProps } from '../internal/base-component';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { TimelineProps } from './interfaces';
import { TimelineStepClassic, TimelineStepVisualRefresh } from './timeline-step';

import styles from './styles.css.js';

interface TimelineContainerProps extends BaseComponentProps, InternalBaseComponentProps {
  hidden?: boolean;
  i18nStrings: TimelineProps.I18nStrings;
  //   isLoadingNextStep: boolean;
  //   onStepClick: (stepIndex: number) => void;
  //   onSkipToClick: (stepIndex: number) => void;
  steps: ReadonlyArray<TimelineProps.Step>;
  variant?: string;
}

function Timeline({
  hidden = false,
  i18nStrings,
  variant = 'vertical',
  steps,
  className = '',
  __internalRootRef,
}: TimelineContainerProps) {
  const isVisualRefresh = useVisualRefresh();
  const [breakpoint, breakpointsRef] = useContainerBreakpoints(['xs']);
  const ref = useMergeRefs(breakpointsRef, __internalRootRef);
  const smallContainer = breakpoint === 'default';

  return (
    <div ref={ref} className={clsx(styles.root, className)}>
      <div
        className={clsx(styles.timeline, {
          [styles.hidden]: hidden,
          [styles.refresh]: isVisualRefresh,
          [styles.vertical]: variant === 'vertical',
          [styles.horizontal]: variant === 'horizontal',
          [styles['small-container']]: smallContainer,
        })}
      >
        <ul className={clsx(isVisualRefresh && styles.refresh)}>
          {steps.map((step, index: number) =>
            isVisualRefresh ? (
              <TimelineStepVisualRefresh
                i18nStrings={i18nStrings}
                index={index}
                key={`timeline-step-${index}`}
                step={step}
                variant={variant}
              />
            ) : (
              <TimelineStepClassic
                i18nStrings={i18nStrings}
                index={index}
                key={`timeline-step-${index}`}
                step={step}
                variant={variant}
              />
            )
          )}
        </ul>
      </div>
    </div>
  );
}

applyDisplayName(Timeline, 'Timeline');

export { TimelineProps, TimelineContainerProps };
export default Timeline;
