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
      <div className={styles.header}>
        <span>{header}</span>
        {orientation === 'horizontal' && <hr className={styles.connector} role="none" />}
      </div>
      {orientation === 'vertical' && <hr className={styles.connector} role="none" />}
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
      <div className={styles.header}>
        <StatusIndicator type={status} iconAriaLabel={statusIconAriaLabel}>
          {header}
        </StatusIndicator>
        {orientation === 'horizontal' && <hr className={styles.connector} role="none" />}
      </div>
      {orientation === 'vertical' && <hr className={styles.connector} role="none" />}
      {details && <div className={styles.details}>{details}</div>}
    </li>
  );
};

const InternalSteps = ({
  steps,
  orientation,
  renderStep,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  __internalRootRef,
  ...props
}: SomeRequired<InternalStepsProps, 'orientation'>) => {
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
      >
        {steps.map((step, index) =>
          renderStep ? (
            <CustomStep key={index} orientation={orientation} step={step} renderStep={renderStep} />
          ) : (
            <InternalStep
              key={index}
              status={step.status}
              statusIconAriaLabel={step.statusIconAriaLabel}
              header={step.header}
              details={step.details}
              orientation={orientation}
            />
          )
        )}
      </ol>
    </div>
  );
};

export default InternalSteps;
