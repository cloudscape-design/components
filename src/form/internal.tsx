// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import clsx from 'clsx';
import { getBaseProps } from '../internal/base-component';
import InternalAlert from '../alert/internal';
import InternalBox from '../box/internal';
import InternalContentLayout from '../content-layout/internal';
import styles from './styles.css.js';
import { FormLayoutProps, FormProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import LiveRegion from '../internal/components/live-region';
import { useInternalI18n } from '../internal/i18n/context';

import { FunnelMetrics } from '../internal/analytics';
import { useFunnel, useFunnelStep } from '../internal/analytics/hooks/use-funnel';

type InternalFormProps = FormProps & InternalBaseComponentProps;

export default function InternalForm({
  children,
  header,
  errorText,
  errorIconAriaLabel: errorIconAriaLabelOverride,
  actions,
  secondaryActions,
  variant,
  __internalRootRef,
  ...props
}: InternalFormProps) {
  const baseProps = getBaseProps(props);
  const i18n = useInternalI18n('form');
  const errorIconAriaLabel = i18n('errorIconAriaLabel', errorIconAriaLabelOverride);
  const { funnelInteractionId, funnelProps } = useFunnel();
  const { funnelStepProps } = useFunnelStep();

  useEffect(() => {
    if (funnelInteractionId && errorText) {
      FunnelMetrics.funnelError({ funnelInteractionId });
    }
  }, [funnelInteractionId, errorText]);

  return (
    <div
      {...baseProps}
      {...funnelProps}
      {...funnelStepProps}
      ref={__internalRootRef}
      className={clsx(styles.root, baseProps.className)}
    >
      <FormLayout
        header={
          header && <div className={clsx(styles.header, variant === 'full-page' && styles['full-page'])}>{header}</div>
        }
        variant={variant}
      >
        {children && <div className={styles.content}>{children}</div>}
        {errorText && (
          <InternalBox margin={{ top: 'l' }}>
            <InternalAlert type="error" statusIconAriaLabel={errorIconAriaLabel}>
              <div className={styles.error}>{errorText}</div>
            </InternalAlert>
          </InternalBox>
        )}
        {(actions || secondaryActions) && (
          <div className={styles.footer}>
            <div className={styles['actions-section']}>
              {actions && <div className={styles.actions}>{actions}</div>}
              {secondaryActions && <div className={styles['secondary-actions']}>{secondaryActions}</div>}
            </div>
          </div>
        )}
        {errorText && (
          <LiveRegion assertive={true}>
            {errorIconAriaLabel}, {errorText}
          </LiveRegion>
        )}
      </FormLayout>
    </div>
  );
}

function FormLayout({ children, header, variant }: FormLayoutProps) {
  return variant === 'full-page' && header ? (
    <InternalContentLayout header={header}>{children}</InternalContentLayout>
  ) : (
    <>
      {header}
      {children}
    </>
  );
}
