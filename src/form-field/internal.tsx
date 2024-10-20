// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { copyAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalGrid from '../grid/internal';
import { useInternalI18n } from '../i18n/context';
import InternalIcon from '../icon/internal';
import { useFunnelContext } from '../internal/analytics/hooks/use-funnel';
import { DATA_ATTR_FIELD_ERROR, DATA_ATTR_FIELD_LABEL, getFieldSlotSeletor } from '../internal/analytics/selectors';
import { getBaseProps } from '../internal/base-component';
import LiveRegion from '../internal/components/live-region';
import { FormFieldContext, useFormFieldContext } from '../internal/context/form-field-context';
import { InfoLinkLabelContext } from '../internal/context/info-link-label-context';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { joinStrings } from '../internal/utils/strings';
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
          <div role="img" aria-label={i18nErrorIconAriaLabel} className={styles['error-icon-scale-wrapper']}>
            <InternalIcon name="status-negative" size="small" />
          </div>
        </div>
        <span className={styles.error__message} ref={contentRef}>
          {children}
        </span>
      </div>

      <LiveRegion assertive={true} source={[i18nErrorIconAriaLabel, contentRef]} />
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
          <div role="img" aria-label={i18nWarningIconAriaLabel} className={styles['warning-icon-scale-wrapper']}>
            <InternalIcon name="status-warning" size="small" />
          </div>
        </div>
        <span className={styles.warning__message} ref={contentRef}>
          {children}
        </span>
      </div>

      <LiveRegion assertive={true} source={[i18nWarningIconAriaLabel, contentRef]} />
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
  ...rest
}: InternalFormFieldProps) {
  const baseProps = getBaseProps(rest);
  const isRefresh = useVisualRefresh();

  const instanceUniqueId = useUniqueId('formField');
  const funnelContext = useFunnelContext();
  const generatedControlId = controlId || instanceUniqueId;
  const formFieldId = controlId || generatedControlId;
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

  const getLabelText = () => {
    return (slotIds.label && document.getElementById(slotIds.label)?.innerText) || '';
  };

  const getErrorText = () => {
    return (slotIds.error && document.getElementById(slotIds.error)?.innerText) || '';
  };

  useEffect(() => {
    if (!funnelContext) {
      return;
    }

    const fieldLabel = getLabelText();
    const fieldError = getErrorText();

    // Move data attribute to common place
    const parentSubstepElement = __internalRootRef?.current?.closest('[data-funnel-substep-id]');
    const substepId = parentSubstepElement?.getAttribute('data-funnel-substep-id');
    funnelContext?.controller?.currentStep?.substeps.forEach(substep => {
      if (substep.id === substepId) {
        substep.error({ errorText: fieldError, scope: { type: 'field', label: fieldLabel } });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorText]);

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

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.root)}
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
              getLabelText,
              ...contextValuesWithoutControlId,
            }}
          >
            {children && <div className={styles.control}>{children}</div>}
          </FormFieldContext.Provider>

          {secondaryControl && (
            <FormFieldContext.Provider
              value={{
                getLabelText,
                ...contextValuesWithoutControlId,
              }}
            >
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
