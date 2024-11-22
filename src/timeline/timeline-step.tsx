// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';
import clsx from 'clsx';

import InternalPopover from '../popover/internal';
import { TimelineProps } from './interfaces';

import styles from './styles.css.js';

export interface TimelineStepProps {
  i18nStrings: TimelineProps.I18nStrings;
  index: number;
  step: TimelineProps.Step;
  actions?: ReactNode;
  className?: string;
  titleClassName?: string;
  variant: string;
}

const renderStepContent = (step: TimelineProps.Step, direction: string) => {
  if (direction === 'horizontal') {
    return (
      <div className={styles['step-container']}>
        <div className={clsx(styles['step-info'], !!step.action && styles['with-action'])}>
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
      <div className={clsx(styles['step-info'], !!step.action && styles['with-action'])}>
        <div className={styles.title}>{step.title}</div>
        {step.content}
        {step.statusSlot}
      </div>
      {step.action && <div className={styles['step-actions-wrapper']}>{step.action}</div>}
    </div>
  );
};
export function TimelineStepVisualRefresh({ step, className = '', variant }: TimelineStepProps) {
  return (
    <li className={clsx(styles['timeline-step-item'], className)}>
      <hr className={step.completed ? styles.completed : ''} />
      <div className={styles['timeline-step-item-inner']}>
        <span className={clsx(styles.circle, step.completed && styles.completed)} />
        {renderStepContent(step, variant)}
      </div>
    </li>
  );
}

export function TimelineStepClassic() {
  // {
  // i18nStrings,
  // step
  // }: TimelineStepProps
  //todo  classic version
  return <li className={styles['timeline-step-item']}>Test</li>;
}
