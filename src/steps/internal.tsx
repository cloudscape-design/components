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
};

const getStatusColor = (status?: StepsProps.Status): BoxProps.Color =>
  status ? statusToColor[status] : 'text-status-inactive';

// Renders the step's leading icon. When `status` is omitted, it falls back to the internal
// `'neutral'` status type, which renders a plain dot via the status indicator.
const StepIcon = ({ status, statusIconAriaLabel }: { status?: StepsProps.Status; statusIconAriaLabel?: string }) => (
  <InternalStatusIcon type={status ?? 'neutral'} iconAriaLabel={statusIconAriaLabel} />
);

const CustomStep = ({
  step,
  orientation,
  renderStep,
  showHeaderStart,
}: {
  step: StepsProps.Step;
  orientation: StepsProps.Orientation;
  renderStep: Required<StepsProps>['renderStep'];
  showHeaderStart: boolean;
}) => {
  const { status, statusIconAriaLabel, headerStart } = step;
  const { header, details, icon } = renderStep(step);
  const iconNode = icon ? icon : <StepIcon status={status} statusIconAriaLabel={statusIconAriaLabel} />;

  if (orientation === 'horizontal') {
    return (
      <li className={styles.container}>
        <div className={styles.header}>
          {iconNode}
          <hr className={styles.connector} role="none" />
        </div>
        <div className={styles['horizontal-header']}>{header}</div>
        {details && <div className={styles.details}>{details}</div>}
      </li>
    );
  }

  // Vertical orientation: render the icon and the connector together in a column "rail" so the
  // connector starts directly beneath the icon and stretches the full height of the step. Unlike
  // placing the header in the same row as the icon, this keeps the vertical line continuous even
  // when the custom header wraps onto multiple lines.
  return (
    <li className={clsx(styles.container, styles['custom-vertical'])}>
      {showHeaderStart && <div className={styles['header-start']}>{headerStart}</div>}
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
  headerStart,
  details,
  orientation,
  showHeaderStart,
}: StepsProps.Step & { orientation: StepsProps.Orientation; showHeaderStart: boolean }) => {
  if (orientation === 'horizontal') {
    return (
      <li className={styles.container}>
        <div className={styles.header}>
          <InternalBox color={getStatusColor(status)}>
            <StepIcon status={status} statusIconAriaLabel={statusIconAriaLabel} />
          </InternalBox>
          <hr className={styles.connector} role="none" />
        </div>
        <div className={styles['horizontal-header']}>
          <InternalBox color={getStatusColor(status)}>{header}</InternalBox>
        </div>
        {details && <div className={styles.details}>{details}</div>}
      </li>
    );
  }

  // Vertical timeline (some step provides `headerStart`): use the same column "rail" as custom
  // steps so the connector stays continuous and the header/details stay out of the connector column
  // even when they wrap. The icon and header keep their status color via InternalBox.
  if (showHeaderStart) {
    return (
      <li className={clsx(styles.container, styles['custom-vertical'])}>
        <div className={styles['header-start']}>{headerStart}</div>
        <div className={styles.rail}>
          <InternalBox color={getStatusColor(status)}>
            <StepIcon status={status} statusIconAriaLabel={statusIconAriaLabel} />
          </InternalBox>
          <hr className={styles.connector} role="none" />
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <InternalBox color={getStatusColor(status)}>{header}</InternalBox>
          </div>
          {details && <div className={styles.details}>{details}</div>}
        </div>
      </li>
    );
  }

  // Vertical, no timeline: keep the status-indicator layout (icon and header rendered together).
  return (
    <li className={styles.container}>
      <div className={styles.header}>
        <InternalStatusIndicator type={status ?? 'neutral'} iconAriaLabel={statusIconAriaLabel}>
          {header}
        </InternalStatusIndicator>
      </div>
      <hr className={styles.connector} role="none" />
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
  const showHeaderStart =
    orientation === 'vertical' && steps.some(step => step.headerStart !== undefined && step.headerStart !== null);
  return (
    <div
      {...props}
      className={clsx(styles.root, props.className, orientation === 'horizontal' ? styles.horizontal : styles.vertical)}
      ref={__internalRootRef}
    >
      <ol
        className={clsx(styles.list, showHeaderStart && styles['with-header-start'])}
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
              showHeaderStart={showHeaderStart}
            />
          ) : (
            <InternalStep
              key={index}
              status={step.status}
              statusIconAriaLabel={step.statusIconAriaLabel}
              header={step.header}
              headerStart={step.headerStart}
              details={step.details}
              orientation={orientation}
              showHeaderStart={showHeaderStart}
            />
          )
        )}
      </ol>
    </div>
  );
};

export default InternalSteps;
