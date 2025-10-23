// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { BoxProps } from '../box/interfaces';
import InternalBox from '../box/internal';
import InternalIcon from '../icon/internal';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import InternalSpaceBetween from '../space-between/internal';
import InternalSpinner from '../spinner/internal';
import StatusIndicator from '../status-indicator/internal';
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

const typeToIcon: () => Record<StepsProps.Status, JSX.Element> = () => ({
  error: <InternalIcon name="status-negative" size="normal" />,
  warning: <InternalIcon name="status-warning" size="normal" />,
  success: <InternalIcon name="status-positive" size="normal" />,
  info: <InternalIcon name="status-info" size="normal" />,
  stopped: <InternalIcon name="status-stopped" size="normal" />,
  pending: <InternalIcon name="status-pending" size="normal" />,
  'in-progress': <InternalIcon name="status-in-progress" size="normal" />,
  loading: <InternalSpinner />,
});

const InternalStep = ({
  status,
  statusIconAriaLabel,
  header,
  details,
  orientation,
  separateHorizontalHeader,
  iconName,
  iconSvg,
}: StepsProps.Step & { orientation: StepsProps.Orientation; separateHorizontalHeader?: boolean }) => {
  const hasStatusIndicator = !iconName && !iconSvg && !separateHorizontalHeader;

  const iconWithHeader = hasStatusIndicator ? (
    <StatusIndicator type={status} iconAriaLabel={statusIconAriaLabel}>
      {header}
    </StatusIndicator>
  ) : (
    <InternalSpaceBetween size="xxs" direction="horizontal">
      <InternalBox color={statusToColor[status]}>
        {iconName || iconSvg ? (
          <InternalIcon name={iconName} svg={iconSvg} ariaLabel={statusIconAriaLabel} />
        ) : (
          typeToIcon()[status]
        )}
      </InternalBox>

      {(!separateHorizontalHeader || orientation === 'vertical') && header}
    </InternalSpaceBetween>
  );

  return (
    <li className={clsx(styles.container, separateHorizontalHeader && styles['separate-header'])}>
      {orientation === 'horizontal' ? (
        <>
          <div className={styles.header}>
            {iconWithHeader}
            <hr className={styles.connector} role="none" />
          </div>
        </>
      ) : (
        <>
          <div className={styles.header}>{iconWithHeader}</div>
          <hr className={styles.connector} role="none" />
        </>
      )}
      {(details || separateHorizontalHeader) && (
        <div className={styles.details}>
          {separateHorizontalHeader && orientation === 'horizontal' && header}
          {details}
        </div>
      )}
    </li>
  );
};

const InternalSteps = ({
  steps,
  orientation = 'horizontal',
  separateHorizontalHeader = false,
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
            iconName={step.iconName}
            iconSvg={step.iconSvg}
            orientation={orientation}
            separateHorizontalHeader={separateHorizontalHeader}
          />
        ))}
      </ol>
    </div>
  );
};

export default InternalSteps;
