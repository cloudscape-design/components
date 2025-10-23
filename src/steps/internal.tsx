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

const CustomStep = ({
  step,
  orientation,
  renderStep,
}: {
  step: StepsProps.Step;
  orientation: StepsProps.Orientation;
  renderStep: Required<StepsProps>['renderStep'];
}) => {
  const { header, details } = renderStep(step);
  return (
    <li className={clsx(styles.container, styles.custom)}>
      {orientation === 'horizontal' ? (
        <>
          <div className={styles.header}>
            {header}
            <hr className={styles.connector} role="none" />
          </div>
        </>
      ) : (
        <>
          <div className={styles.header}>{header}</div>
          <hr className={styles.connector} role="none" />
        </>
      )}
      {details && <div className={styles.details}>{details}</div>}
    </li>
  );
};

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
        </>
      ) : (
        <>
          <div className={styles.header}>
            <StatusIndicator type={status} iconAriaLabel={statusIconAriaLabel}>
              {header}
            </StatusIndicator>
          </div>
          <hr className={styles.connector} role="none" />
        </>
      )}
      {details && <div className={styles.details}>{details}</div>}
    </li>
  );
};

const InternalSteps = ({
  steps,
  orientation = 'horizontal',
  renderStep,
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
        {steps.map((step, index) => {
          if (renderStep) {
            return <CustomStep key={index} orientation={orientation} step={step} renderStep={renderStep} />;
          }
          return (
            <InternalStep
              key={index}
              status={step.status}
              statusIconAriaLabel={step.statusIconAriaLabel}
              header={step.header}
              details={step.details}
              orientation={orientation}
            />
          );
        })}
      </ol>
    </div>
  );
};

export default InternalSteps;
