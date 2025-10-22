// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import StatusIndicator from '../status-indicator/internal';
import { StepsProps } from './interfaces';

import styles from './styles.css.js';

type InternalStepsProps = SomeRequired<StepsProps, 'steps'> & InternalBaseComponentProps;

const InternalStep = ({
  status,
  statusIconAriaLabel,
  header,
  details,
  orientation,
}: StepsProps.Step & { orientation: StepsProps.Orientation }) => {
  return (
    <li className={styles.container}>
      {orientation === 'horizontal' ? (
        <>
          <div className={styles.header}>
            <StatusIndicator type={status} iconAriaLabel={statusIconAriaLabel}>
              {header}
            </StatusIndicator>
            <hr className={styles.connector} role="none" />
          </div>
          {details && <div className={styles.details}>{details}</div>}
        </>
      ) : (
        <>
          <div className={styles.header}>
            <StatusIndicator type={status} iconAriaLabel={statusIconAriaLabel}>
              {header}
            </StatusIndicator>
          </div>
          <hr className={styles.connector} role="none" />
          {details && <div className={styles.details}>{details}</div>}
        </>
      )}
    </li>
  );
};

const InternalSteps = ({
  steps,
  orientation = 'horizontal',
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  __internalRootRef,
  ...props
}: InternalStepsProps) => {
  return (
    <div
      {...props}
      className={clsx(styles.root, props.className, orientation === 'horizontal' ? styles.horizontal : styles.vertical)}
      ref={__internalRootRef}
    >
      <ol
        className={styles.list}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        style={
          orientation === 'horizontal'
            ? { gridTemplateColumns: `repeat(${Math.max(1, steps.length - 1)}, 1fr) auto` }
            : {}
        }
      >
        {steps.map((step, index) => (
          <InternalStep
            key={index}
            status={step.status}
            statusIconAriaLabel={step.statusIconAriaLabel}
            header={step.header}
            details={step.details}
            orientation={orientation}
          />
        ))}
      </ol>
    </div>
  );
};

export default InternalSteps;
