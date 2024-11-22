// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalIcon from '../icon/internal';
import InternalPopover from '../popover/internal';
import { TimelineProps } from './interfaces';

import styles from './styles.css.js';

export interface TimelineStepBaseProps {
  i18nStrings: TimelineProps.I18nStrings;
  index: number;
  className?: string;
  titleClassName?: string;
}

export interface FlattenedTimelineStep extends TimelineProps.Step {
  isNested?: boolean;
  variant: string;
}

export interface TimelineStepProps extends TimelineStepBaseProps {
  step: FlattenedTimelineStep;
}

const renderStepContent = (step: FlattenedTimelineStep) => {
  if (step.variant === 'horizontal') {
    return (
      <div className={styles['step-container']}>
        <div className={clsx(styles['step-info'])}>
          <InternalPopover size="content" content={step.content}>
            <div className={styles.title}>{step.title}</div>
          </InternalPopover>
          {step.statusSlot}
          {step.action && <div className={styles['step-actions-wrapper']}>{step.action}</div>}
        </div>
      </div>
    );
  }
  return (
    <div className={styles['step-container']}>
      <div className={clsx(styles['step-info'])}>
        <div
          className={clsx(styles.title, {
            [styles.completed]: step.completed,
            [styles['is-nested']]: step.isNested,
            [styles[`status-${step.status}`]]: step.status,
            [styles[`color-override-${step.iconColor}`]]: !!step.iconColor,
          })}
        >
          {step.title}
        </div>
        {step.content}
        {step.statusSlot}
      </div>
      {step.action && <div className={styles['step-actions-wrapper']}>{step.action}</div>}
    </div>
  );
};
export function TimelineStepVisualRefresh({ step, className = '' }: TimelineStepProps) {
  const hasIcon = !!step.iconName || !!step.iconSvg;
  console.log(step);
  return (
    <li className={clsx(styles['timeline-step-item'], className)}>
      <hr className={step.completed ? styles.completed : ''} />
      <div className={styles['timeline-step-item-inner']}>
        {hasIcon ? (
          <span
            className={clsx(styles['icon-container'], {
              [styles.completed]: step.completed,
              [styles['is-nested']]: step.isNested,
              [styles[`status-${step.status}`]]: !!step.status,
              [styles[`color-override-${step.iconColor}`]]: !!step.iconColor,
            })}
          >
            <InternalIcon
              size={step.isNested ? 'small' : 'medium'}
              name={step.iconName}
              alt={step.iconAlt}
              svg={step.iconSvg}
            />
          </span>
        ) : (
          <span
            className={clsx(styles.circle, {
              [styles.completed]: step.completed,
              [styles['is-nested']]: step.isNested,
              [styles[`status-${step.status}`]]: !!step.status,
              [styles[`color-override-${step.iconColor}`]]: !!step.iconColor,
            })}
          />
        )}
        {renderStepContent(step)}
      </div>
    </li>
  );
}

//todo  create custom fof classic
export const TimelineStepClassic = TimelineStepVisualRefresh;
