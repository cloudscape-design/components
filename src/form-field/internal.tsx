// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useUniqueId, warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { copyAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalGrid from '../grid/internal';
import { useInternalI18n } from '../i18n/context';
import InternalIcon from '../icon/internal';
import { FunnelMetrics } from '../internal/analytics';
import { useFunnel, useFunnelStep, useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';
import {
  DATA_ATTR_FIELD_ERROR,
  DATA_ATTR_FIELD_LABEL,
  getFieldSlotSeletor,
  getSubStepAllSelector,
  getTextFromSelector,
} from '../internal/analytics/selectors';
import { getBaseProps } from '../internal/base-component';
import { FormFieldContext, useFormFieldContext } from '../internal/context/form-field-context';
import { InfoLinkLabelContext } from '../internal/context/info-link-label-context';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { joinStrings } from '../internal/utils/strings';
import InternalLiveRegion from '../live-region/internal';
import { InternalFormFieldProps } from './interfaces';
import { getAriaDescribedBy, getGridDefinition, getSlotIds } from './util';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

interface FormFieldErrorProps {
  id?: string;
  children?: React.ReactNode;
  errorIconAriaLabel?: string;
}

interface FormFieldWarningProps {
  id?: string;
  children?: React.ReactNode;
  warningIconAriaLabel?: string;
}

export function FormFieldError({ id, children, errorIconAriaLabel }: FormFieldErrorProps) {
  const i18n = useInternalI18n('form-field');
  const contentRef = useRef<HTMLDivElement | null>(null);
  const i18nErrorIconAriaLabel = i18n('i18nStrings.errorIconAriaLabel', errorIconAriaLabel);

  return (
    <>
      <div id={id} className={styles.error}>
        <div className={styles['error-icon-shake-wrapper']}>
          <div className={styles['error-icon-scale-wrapper']}>
            <InternalIcon name="status-negative" size="small" ariaLabel={i18nErrorIconAriaLabel} />
          </div>
        </div>
        <span className={styles.error__message} ref={contentRef}>
          {children}
        </span>
      </div>

      <InternalLiveRegion assertive={true} tagName="span" sources={[i18nErrorIconAriaLabel, contentRef]} />
    </>
  );
}

export function FormFieldWarning({ id, children, warningIconAriaLabel }: FormFieldWarningProps) {
  const i18n = useInternalI18n('form-field');
  const contentRef = useRef<HTMLDivElement | null>(null);
  const i18nWarningIconAriaLabel = i18n('i18nStrings.warningIconAriaLabel', warningIconAriaLabel);

  return (
    <>
      <div id={id} className={styles.warning}>
        <div className={styles['warning-icon-shake-wrapper']}>
          <div className={styles['warning-icon-scale-wrapper']}>
            <InternalIcon name="status-warning" size="small" ariaLabel={i18nWarningIconAriaLabel} />
          </div>
        </div>
        <span className={styles.warning__message} ref={contentRef}>
          {children}
        </span>
      </div>

      <InternalLiveRegion assertive={true} tagName="span" sources={[i18nWarningIconAriaLabel, contentRef]} />
    </>
  );
}

export function ConstraintText({
  id,
  hasValidationText,
  children,
}: {
  id?: string;
  hasValidationText: boolean;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className={clsx(styles.constraint, hasValidationText && styles['constraint-has-validation-text'])}>
      {children}
    </div>
  );
}

export default function InternalFormField({
  controlId,
  stretch = false,
  label,
  info,
  i18nStrings,
  children,
  secondaryControl,
  description,
  constraintText,
  errorText,
  warningText,
  __hideLabel,
  __internalRootRef = null,
  __disableGutters = false,
  __analyticsMetadata = undefined,
  __style = {},
  ...rest
}: InternalFormFieldProps) {
  const baseProps = getBaseProps(rest);
  const isRefresh = useVisualRefresh();

  const instanceUniqueId = useUniqueId('formField');
  const generatedControlId = controlId || instanceUniqueId;
  const formFieldId = controlId || generatedControlId;

  const { funnelIdentifier, funnelInteractionId, submissionAttempt, funnelState, errorCount } = useFunnel();
  const { stepIdentifier, stepNumber, stepNameSelector } = useFunnelStep();
  const { subStepIdentifier, subStepSelector, subStepNameSelector } = useFunnelSubStep();

  const showWarning = warningText && !errorText;

  if (warningText && errorText) {
    warnOnce('FileUpload', 'Both `errorText` and `warningText` exist. `warningText` will not be shown.');
  }

  const slotIds = getSlotIds(
    formFieldId,
    label,
    description,
    constraintText,
    errorText,
    showWarning ? warningText : undefined
  );

  const ariaDescribedBy = getAriaDescribedBy(slotIds);

  const gridDefinition = getGridDefinition(stretch, !!secondaryControl, isRefresh);

  const {
    ariaLabelledby: parentAriaLabelledby,
    ariaDescribedby: parentAriaDescribedby,
    invalid: parentInvalid,
    warning: parentWarning,
  } = useFormFieldContext({});

  const contextValuesWithoutControlId = {
    ariaLabelledby: joinStrings(parentAriaLabelledby, slotIds.label) || undefined,
    ariaDescribedby: joinStrings(parentAriaDescribedby, ariaDescribedBy) || undefined,
    invalid: !!errorText || !!parentInvalid,
    warning: (!!warningText && !errorText) || (!!parentWarning && !parentInvalid),
  };

  const analyticsAttributes = {
    [DATA_ATTR_FIELD_LABEL]: slotIds.label ? getFieldSlotSeletor(slotIds.label) : undefined,
    [DATA_ATTR_FIELD_ERROR]: slotIds.error ? getFieldSlotSeletor(slotIds.error) : undefined,
  };

  useEffect(() => {
    if (funnelInteractionId && errorText && funnelState.current !== 'complete') {
      const stepName = getTextFromSelector(stepNameSelector);
      const subStepName = getTextFromSelector(subStepNameSelector);

      errorCount.current++;

      // We don't want to report an error if it is hidden, e.g. inside an Expandable Section.
      const errorIsVisible = (__internalRootRef?.current?.getBoundingClientRect()?.width ?? 0) > 0;

      if (errorIsVisible) {
        FunnelMetrics.funnelSubStepError({
          funnelInteractionId,
          funnelIdentifier,
          subStepSelector,
          subStepName,
          subStepNameSelector,
          subStepIdentifier,
          stepNumber,
          stepName,
          stepNameSelector,
          stepIdentifier,
          fieldErrorSelector: `${getFieldSlotSeletor(slotIds.error)} .${styles.error__message}`,
          fieldLabelSelector: getFieldSlotSeletor(slotIds.label),
          subStepAllSelector: getSubStepAllSelector(),
          fieldIdentifier: __analyticsMetadata?.instanceIdentifier,
          errorContext: __analyticsMetadata?.errorContext,
        });
      }

      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        errorCount.current--;
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funnelInteractionId, errorText, submissionAttempt, errorCount]);

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.root)}
      style={__style}
      ref={__internalRootRef}
      {...analyticsAttributes}
      {...copyAnalyticsMetadataAttribute(rest)}
    >
      <div className={clsx(styles['label-wrapper'], __hideLabel && styles['visually-hidden'])}>
        {label && (
          <label
            className={clsx(styles.label, analyticsSelectors.label)}
            id={slotIds.label}
            htmlFor={generatedControlId}
          >
            {label}
          </label>
        )}
        <InfoLinkLabelContext.Provider value={slotIds.label}>
          {!__hideLabel && info && <span className={styles.info}>{info}</span>}
        </InfoLinkLabelContext.Provider>
      </div>

      {description && (
        <div className={styles.description} id={slotIds.description}>
          {description}
        </div>
      )}

      <div className={clsx(styles.controls, __hideLabel && styles['label-hidden'])}>
        <InternalGrid gridDefinition={gridDefinition} disableGutters={__disableGutters}>
          <FormFieldContext.Provider
            value={{
              controlId: generatedControlId,
              ...contextValuesWithoutControlId,
            }}
          >
            {children && <div className={styles.control}>{children}</div>}
          </FormFieldContext.Provider>

          {secondaryControl && (
            <FormFieldContext.Provider value={contextValuesWithoutControlId}>
              <div className={styles['secondary-control']}>{secondaryControl}</div>
            </FormFieldContext.Provider>
          )}
        </InternalGrid>
      </div>

      {(constraintText || errorText || warningText) && (
        <div className={styles.hints}>
          {errorText && (
            <FormFieldError id={slotIds.error} errorIconAriaLabel={i18nStrings?.errorIconAriaLabel}>
              {errorText}
            </FormFieldError>
          )}
          {showWarning && (
            <FormFieldWarning id={slotIds.warning} warningIconAriaLabel={i18nStrings?.warningIconAriaLabel}>
              {warningText}
            </FormFieldWarning>
          )}
          {constraintText && (
            <ConstraintText id={slotIds.constraint} hasValidationText={!!errorText || !!warningText}>
              {constraintText}
            </ConstraintText>
          )}
        </div>
      )}
    </div>
  );
}
