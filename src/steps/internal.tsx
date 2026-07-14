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
  'not-started': 'text-status-inactive',
  log: 'text-status-inactive',
};

const CustomStep = ({
  step,
  orientation,
  renderStep,
  showAnnotation,
}: {
  step: StepsProps.Step;
  orientation: StepsProps.Orientation;
  renderStep: Required<StepsProps>['renderStep'];
  showAnnotation: boolean;
}) => {
  const { status, statusIconAriaLabel, annotation } = step;
  const { header, details, icon } = renderStep(step);
  const iconNode = icon ?? <InternalStatusIcon type={status} iconAriaLabel={statusIconAriaLabel} />;

  if (orientation === 'horizontal') {
    return (
      <li className={styles.container}>
        {annotation !== undefined && annotation !== null && <div className={styles.annotation}>{annotation}</div>}
        <div className={styles.header}>
          {iconNode}
          <hr className={styles.connector} role="none" />
        </div>
        <div className={styles['horizontal-header']}>{header}</div>
        {details && <div className={styles.details}>{details}</div>}
      </li>
    );
  }

  // Vertical orientation: render the icon and the connector together in a column-1 "rail" so the
  // connector starts directly beneath the icon and stretches the full height of the step. Unlike
  // placing the header in the same row as the icon, this keeps the vertical line continuous even
  // when the custom header wraps onto multiple lines. `annotation` (for example, a timeline timestamp)
  // is rendered before the rail.
  return (
    <li className={clsx(styles.container, styles['custom-vertical'])}>
      {showAnnotation && annotation !== undefined && annotation !== null && (
        <div className={styles.annotation}>{annotation}</div>
      )}
      <div className={styles.rail}>
        {iconNode}
        <hr className={styles.connector} role="none" />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>{header}</div>
        {details && <div className={styles.details}>{details}</div>}
      </div>
    </li>
  );
};

const InternalStep = ({
  status,
  statusIconAriaLabel,
  header,
  details,
  annotation,
  orientation,
}: StepsProps.Step & { orientation: StepsProps.Orientation }) => {
  return (
    <li className={styles.container}>
      {annotation !== undefined && annotation !== null && <div className={styles.annotation}>{annotation}</div>}
      <div className={styles.header}>
        {orientation === 'vertical' ? (
          <InternalStatusIndicator type={status} iconAriaLabel={statusIconAriaLabel}>
            {header}
          </InternalStatusIndicator>
        ) : (
          <>
            <InternalBox color={statusToColor[status]}>
              <InternalStatusIcon type={status} iconAriaLabel={statusIconAriaLabel} />
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
  const showAnnotation = steps.some(step => step.annotation !== undefined && step.annotation !== null);
  return (
    <div
      {...props}
      className={clsx(styles.root, props.className, orientation === 'horizontal' ? styles.horizontal : styles.vertical)}
      ref={__internalRootRef}
    >
      <ol
        className={clsx(styles.list, orientation === 'vertical' && showAnnotation && styles['with-annotation'])}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
      >
        {steps.map((step, index) =>
          renderStep ? (
            <CustomStep
              key={index}
              orientation={orientation}
              step={step}
              renderStep={renderStep}
              showAnnotation={showAnnotation}
            />
          ) : (
            <InternalStep
              key={index}
              status={step.status}
              statusIconAriaLabel={step.statusIconAriaLabel}
              header={step.header}
              details={step.details}
              annotation={step.annotation}
              orientation={orientation}
            />
          )
        )}
      </ol>
    </div>
  );
};

export default InternalSteps;
