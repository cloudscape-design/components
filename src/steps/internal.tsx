// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import StatusIndicator from '../status-indicator/internal';
import { StepsProps } from './interfaces';

import styles from './styles.css.js';

type InternalStepsProps = SomeRequired<StepsProps, 'steps'> & InternalBaseComponentProps<HTMLDivElement>;

const InternalStep = ({ status, statusIconAriaLabel, header, details }: StepsProps.Step) => {
  return (
    <li className={styles['step-container']}>
      <div className={styles['step-status']}>
        <StatusIndicator type={status} iconAriaLabel={statusIconAriaLabel} />
      </div>
      <div className={styles['step-header']}>{header}</div>
      <hr className={styles['step-connector']} />
      {details && <div className={styles['step-details']}>{details}</div>}
    </li>
  );
};

export const InternalSteps = ({ steps, ...props }: InternalStepsProps) => {
  return (
    <div
      className={styles.root}
      aria-label={props.ariaLabel}
      aria-labelledby={props.ariaLabelledby}
      aria-describedby={props.ariaDescribedby}
    >
      <ol className={styles['steps-list']}>
        {steps.map((step, index) => (
          <InternalStep
            key={index}
            status={step.status}
            statusIconAriaLabel={step.statusIconAriaLabel}
            header={step.header}
            details={step.details}
          />
        ))}
      </ol>
    </div>
  );
};

export default InternalSteps;
