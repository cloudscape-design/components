// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { BoxProps } from '../box/interfaces';
import InternalBox from '../box/internal';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import InternalStatusIndicator, { InternalStatusIcon } from '../status-indicator/internal';
import { StepsProps } from './interfaces';

import styles from './styles.css.js';

type InternalStepsProps = SomeRequired<StepsProps, 'steps'> & InternalBaseComponentProps;

const statusToColor: Record<StepsProps.Status, BoxProps.Color> = {
  error: 'text-status-error',
  warning: 'text-status-warning',
  success: 'text-status-success',
  info: 'text-status-info',
  stopped: 'text-status-inactive',
  pending: 'text-status-inactive',
  'in-progress': 'text-status-inactive',
  loading: 'text-status-inactive',
};

const CustomStep = ({
  step,
  orientation,
  renderStep,
}: {
  step: StepsProps.Step;
  orientation: StepsProps.Orientation;
  renderStep: Required<StepsProps>['renderStep'];
}) => {
  const { status, statusIconAriaLabel } = step;
  const { header, details, icon } = renderStep(step);
  return (
    <li className={styles.container}>
      <div className={styles.header}>
        {icon ? icon : <InternalStatusIcon type={status} iconAriaLabel={statusIconAriaLabel} size="normal" />}
        {orientation === 'vertical' ? header : <hr className={styles.connector} role="none" />}
      </div>
      {orientation === 'vertical' ? (
        <hr className={styles.connector} role="none" />
      ) : (
        <div className={styles['horizontal-header']}>{header}</div>
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
      <div className={styles.header}>
        {orientation === 'vertical' ? (
          <InternalStatusIndicator type={status} iconAriaLabel={statusIconAriaLabel}>
            {header}
          </InternalStatusIndicator>
        ) : (
          <>
            <InternalBox color={statusToColor[status]}>
              <InternalStatusIcon type={status} iconAriaLabel={statusIconAriaLabel} size="normal" />
            </InternalBox>
            <hr className={styles.connector} role="none" />
          </>
        )}
      </div>
      {orientation === 'vertical' ? (
        <hr className={styles.connector} role="none" />
      ) : (
        <div className={styles['horizontal-header']}>
          <InternalBox color={statusToColor[status]}>{header}</InternalBox>
        </div>
      )}
      {details && <div className={styles.details}>{details}</div>}
    </li>
  );
};

const InternalSteps = ({
  steps,
  orientation = 'vertical',
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
