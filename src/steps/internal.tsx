// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import StatusIndicator from '../status-indicator/internal';
import { StepsProps } from './interfaces';

import styles from './styles.css.js';

type InternalStepsProps = SomeRequired<StepsProps, 'steps'> & InternalBaseComponentProps<HTMLDivElement>;

const InternalStep = ({ status, statusIconAriaLabel, header, details }: StepsProps.Step) => {
  return (
    <li className={styles.container}>
      <div className={styles.header}>
        <StatusIndicator type={status} iconAriaLabel={statusIconAriaLabel}>
          {header}
        </StatusIndicator>
      </div>
      <hr className={styles.connector} role="none" />
      {details && <div className={styles.details}>{details}</div>}
    </li>
  );
};

export const InternalSteps = ({
  steps,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  __internalRootRef,
  ...props
}: InternalStepsProps) => {
  return (
    <div {...props} className={clsx(styles.root, props.className)} ref={__internalRootRef}>
      <ol
        className={styles.list}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
      >
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
