// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId, warnOnce } from '@cloudscape-design/component-toolkit/internal';
import {
  copyAnalyticsMetadataAttribute,
  getAnalyticsMetadataAttribute,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalButton from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import { IconProps } from '../icon/interfaces';
import InternalIcon from '../icon/internal';
import { getBaseProps } from '../internal/base-component';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireKeyboardEvent, fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useDebounceCallback } from '../internal/hooks/use-debounce-callback';
import { isDevelopment } from '../internal/is-development';
import WithNativeAttributes, { SkipWarnings } from '../internal/utils/with-native-attributes';
import { BaseComponentProps } from '../types/base-component';
import { NonCancelableEventHandler } from '../types/events';
import { FormFieldValidationControlProps } from '../types/form-field';
import {
  GeneratedAnalyticsMetadataInputClearInput,
  GeneratedAnalyticsMetadataInputComponent,
} from './analytics-metadata/interfaces';
import { BaseChangeDetail, BaseInputProps, InputAutoCorrect, InputProps } from './interfaces';
import { getInputStyles } from './styles';
import { convertAutoComplete, useSearchProps } from './utils';

import styles from './styles.css.js';

export interface InternalInputProps
  extends BaseComponentProps,
    BaseInputProps,
    Omit<InputProps, 'type'>,
    InputAutoCorrect,
    FormFieldValidationControlProps,
    InternalBaseComponentProps {
  type?: InputProps['type'] | 'visualSearch';
  __startIcon?: IconProps['name'];
  __startIconVariant?: IconProps['variant'];
  __onStartIconClick?: () => void;

  __endIcon?: IconProps['name'];
  __onEndIconClick?: () => void;

  __noBorderRadius?: boolean;

  __onDelayedInput?: NonCancelableEventHandler<BaseChangeDetail>;
  __onBlurWithDetail?: NonCancelableEventHandler<{ relatedTarget: Node | null }>;

  __inheritFormFieldProps?: boolean;
  __injectAnalyticsComponentMetadata?: boolean;
  __skipNativeAttributesWarnings?: SkipWarnings;
  __fullWidth?: boolean;
}

function InternalInput(
  {
    type = 'text',
    step,
    inputMode,
    autoComplete = true,
    ariaLabel,
    clearAriaLabel: clearAriaLabelOverride,
    name,
    value,
    placeholder,
    autoFocus,
    disabled,
    readOnly,
    disableBrowserAutocorrect,
    spellcheck,
    __noBorderRadius,

    __startIcon,
    __startIconVariant = 'subtle',
    __onStartIconClick,

    ariaRequired,

    __endIcon,
    __onEndIconClick,

    onKeyDown,
    onKeyUp,
    onChange,
    __onDelayedInput,
    __onBlurWithDetail,
    onBlur,
    onFocus,
    nativeInputAttributes,
    __internalRootRef,
    __inheritFormFieldProps,
    __injectAnalyticsComponentMetadata,
    __skipNativeAttributesWarnings,
    __fullWidth,
    style,
    prefix,
    suffix,
    inlineLabelText,
    ...rest
  }: InternalInputProps,
  ref: Ref<HTMLInputElement>
) {
  const baseProps = getBaseProps(rest);
  const i18n = useInternalI18n('input');
  const fireDelayedInput = useDebounceCallback((value: string) => fireNonCancelableEvent(__onDelayedInput, { value }));

  const handleChange = (value: string) => {
    fireDelayedInput(value);
    fireNonCancelableEvent(onChange, { value });
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const searchProps = useSearchProps(type, disabled, readOnly, value, inputRef, handleChange);
  __startIcon = __startIcon ?? searchProps.__startIcon;
  __endIcon = __endIcon ?? searchProps.__endIcon;
  __onEndIconClick = __onEndIconClick ?? searchProps.__onEndIconClick;

  // Search inputs use built-in search and clear icons that would overlap adornments.
  const isSearch = type === 'search' || type === 'visualSearch';
  if (isDevelopment) {
    if (isSearch && (prefix !== undefined || suffix !== undefined)) {
      warnOnce('Input', 'prefix and suffix are ignored when type is search.');
    }
  }
  if (isSearch) {
    prefix = undefined;
    suffix = undefined;
  }

  const formFieldContext = useFormFieldContext(rest);
  const {
    ariaLabelledby,
    ariaDescribedby,
    controlId: controlIdFromFormFieldContext,
    invalid,
    warning,
  } = __inheritFormFieldProps ? formFieldContext : rest;

  // When an inline label is rendered, the native input must have an id so the
  // label's htmlFor can reference it. Fall back to a generated id if none was provided.
  const generatedControlId = useUniqueId('input');
  const controlId = controlIdFromFormFieldContext ?? (inlineLabelText ? generatedControlId : undefined);

  const hasPrefix = !!prefix;
  const hasSuffix = !!suffix;
  const hasPrefixOrSuffix = hasPrefix || hasSuffix;
  const inputStyles = getInputStyles(style);
  const nativeInputStyles =
    hasPrefixOrSuffix && inputStyles
      ? { ...inputStyles, borderRadius: undefined, borderWidth: undefined }
      : inputStyles;
  const adornedContainerStyles =
    hasPrefixOrSuffix && inputStyles
      ? { ...inputStyles, paddingBlock: undefined, paddingInline: undefined }
      : undefined;

  const attributes: React.InputHTMLAttributes<HTMLInputElement> = {
    'aria-label': ariaLabel,
    // aria-labelledby has precedence over aria-label in accessible name calculation.
    // When aria-label is provided for Input, it should override aria-labelledBy from form-field context.
    // If both aria-label and aria-labelledby come from Input props, aria-labelledby will be used in accessible name
    'aria-labelledby': ariaLabel && !rest.ariaLabelledby ? undefined : ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    name,
    placeholder,
    autoFocus,
    id: controlId,
    className: clsx(
      styles.input,
      type && styles[`input-type-${type}`],
      __endIcon && styles['input-has-icon-end'],
      __startIcon && styles['input-has-icon-start'],
      __noBorderRadius && styles['input-has-no-border-radius'],
      hasPrefixOrSuffix && styles['input-adorned'],
      {
        [styles['input-readonly']]: readOnly,
        [styles['input-invalid']]: invalid && !hasPrefixOrSuffix,
        [styles['input-warning']]: warning && !invalid && !hasPrefixOrSuffix,
      }
    ),
    autoComplete: convertAutoComplete(autoComplete),
    disabled,
    readOnly,
    type,
    step,
    inputMode,
    spellCheck: spellcheck,
    onKeyDown: onKeyDown && (event => fireKeyboardEvent(onKeyDown, event)),
    onKeyUp: onKeyUp && (event => fireKeyboardEvent(onKeyUp, event)),
    // We set a default value on the component in order to force it into the controlled mode.
    value: value ?? '',
    onChange: onChange && (event => handleChange(event.target.value)),
    onBlur: e => {
      fireNonCancelableEvent(onBlur);
      fireNonCancelableEvent(__onBlurWithDetail, { relatedTarget: e.relatedTarget });
    },
    onFocus: onFocus && (() => fireNonCancelableEvent(onFocus)),
  };

  if (type === 'number') {
    // Chrome and Safari have a weird built-in behavior of letting focused
    // number inputs be controlled by scrolling on them. However, they don't
    // lock the browser's scroll, so it's very easy to accidentally increment
    // the input while scrolling down the page.
    attributes.onWheel = event => event.currentTarget.blur();
  }

  if (disableBrowserAutocorrect) {
    attributes.autoCorrect = 'off';
    attributes.autoCapitalize = 'off';
  }

  // ensure aria properties are string literal "true"
  if (ariaRequired) {
    attributes['aria-required'] = 'true';
  }
  if (invalid) {
    attributes['aria-invalid'] = 'true';
  }

  const mergedRef = useMergeRefs(ref, inputRef);

  // type = "visualSearch" renders a type="text' input
  if (attributes.type === 'visualSearch') {
    attributes.type = 'text';
  }

  const componentAnalyticsMetadata: GeneratedAnalyticsMetadataInputComponent = {
    name: 'awsui.Input',
    label: 'input',
    properties: {
      value: value || '',
    },
  };

  const mainInput = (
    <WithNativeAttributes
      {...attributes}
      tag="input"
      componentName="Input"
      nativeAttributes={nativeInputAttributes}
      skipWarnings={__skipNativeAttributesWarnings}
      ref={mergedRef}
      style={nativeInputStyles}
    />
  );

  const renderedId = nativeInputAttributes?.id || controlId;

  const endIcon = __endIcon ? (
    <span
      className={styles['input-icon-end']}
      {...(__endIcon === 'close'
        ? getAnalyticsMetadataAttribute({
            action: 'clearInput',
          } as Partial<GeneratedAnalyticsMetadataInputClearInput>)
        : {})}
    >
      <InternalButton
        // Used for test utils
        className={styles['input-button-right']}
        variant="inline-icon-pointer-target"
        formAction="none"
        iconName={__endIcon}
        onClick={__onEndIconClick}
        ariaLabel={i18n('clearAriaLabel', clearAriaLabelOverride)}
        disabled={disabled}
      />
    </span>
  ) : null;

  // Root-level props (base component props, root class/ref, and analytics metadata)
  // are applied to the outermost rendered element so the component root always
  // contains the whole component, including the inline label when present.
  const rootProps = {
    ...baseProps,
    className: baseProps.className,
    ref: __internalRootRef,
    ...(__injectAnalyticsComponentMetadata
      ? getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })
      : copyAnalyticsMetadataAttribute(rest)),
  };

  const renderInputWithPrefixSuffix = (
    extraProps: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> } = {}
  ) => (
    <div
      {...extraProps}
      className={clsx(extraProps.className, styles['input-container'])}
      dir={type === 'email' ? 'ltr' : undefined}
    >
      {__startIcon && (
        <span onClick={__onStartIconClick} className={styles['input-icon-start']}>
          <InternalIcon name={__startIcon} variant={disabled ? 'disabled' : readOnly ? 'subtle' : __startIconVariant} />
        </span>
      )}
      {hasPrefixOrSuffix ? (
        // [prefix][divider][input][divider][suffix] - one flex bar owns the border and focus ring.
        <div
          className={clsx(
            styles['input-adorned-container'],
            invalid && styles['input-adorned-container-invalid'],
            warning && !invalid && styles['input-adorned-container-warning'],
            disabled && styles['input-adorned-container-disabled'],
            readOnly && !disabled && styles['input-adorned-container-readonly']
          )}
          aria-disabled={disabled || undefined}
          style={adornedContainerStyles}
        >
          {hasPrefix && (
            <>
              <span className={styles['input-prefix']} aria-hidden="true">
                <span className={styles['input-adornment-content']}>{prefix}</span>
              </span>
              <span className={styles['input-adornment-divider']} />
            </>
          )}
          {mainInput}
          {hasSuffix && (
            <>
              <span className={styles['input-adornment-divider']} />
              <span className={styles['input-suffix']} aria-hidden="true">
                <span className={styles['input-adornment-content']}>{suffix}</span>
              </span>
            </>
          )}
          {endIcon}
        </div>
      ) : (
        mainInput
      )}
      {!hasPrefixOrSuffix && endIcon}
    </div>
  );

  const inputWithLabel = inlineLabelText ? (
    <div
      {...rootProps}
      className={clsx(
        rootProps.className,
        styles['inline-label-wrapper'],
        __fullWidth && styles['inline-label-wrapper-full-width']
      )}
    >
      <label htmlFor={renderedId} className={clsx(styles['inline-label'], disabled && styles['inline-label-disabled'])}>
        {inlineLabelText}
      </label>
      <div
        className={clsx(
          styles['inline-label-trigger-wrapper'],
          __fullWidth && styles['inline-label-trigger-wrapper-full-width']
        )}
      >
        {renderInputWithPrefixSuffix()}
      </div>
    </div>
  ) : (
    renderInputWithPrefixSuffix(rootProps)
  );
  return inputWithLabel;
}

export default React.forwardRef(InternalInput);
