// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalButton from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import { IconProps } from '../icon/interfaces';
import InternalIcon from '../icon/internal';
import { BaseComponentProps, getBaseProps } from '../internal/base-component';
import { FormFieldValidationControlProps, useFormFieldContext } from '../internal/context/form-field-context';
import { fireKeyboardEvent, fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useDebounceCallback } from '../internal/hooks/use-debounce-callback';
import {
  GeneratedAnalyticsMetadataInputClearInput,
  GeneratedAnalyticsMetadataInputComponent,
} from './analytics-metadata/interfaces';
import { BaseChangeDetail, BaseInputProps, InputAutoCorrect, InputProps } from './interfaces';
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
  __leftIcon?: IconProps['name'];
  __leftIconVariant?: IconProps['variant'];
  __onLeftIconClick?: () => void;

  __rightIcon?: IconProps['name'];
  __onRightIconClick?: () => void;

  __nativeAttributes?: React.InputHTMLAttributes<HTMLInputElement>;
  __noBorderRadius?: boolean;

  __onDelayedInput?: NonCancelableEventHandler<BaseChangeDetail>;
  __onBlurWithDetail?: NonCancelableEventHandler<{ relatedTarget: Node | null }>;

  __inheritFormFieldProps?: boolean;
  __injectAnalyticsComponentMetadata?: boolean;
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

    __leftIcon,
    __leftIconVariant = 'subtle',
    __onLeftIconClick,

    ariaRequired,

    __rightIcon,
    __onRightIconClick,

    onKeyDown,
    onKeyUp,
    onChange,
    __onDelayedInput,
    __onBlurWithDetail,
    onBlur,
    onFocus,
    __nativeAttributes,
    __internalRootRef,
    __inheritFormFieldProps,
    __injectAnalyticsComponentMetadata,
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
  __leftIcon = __leftIcon ?? searchProps.__leftIcon;
  __rightIcon = __rightIcon ?? searchProps.__rightIcon;
  __onRightIconClick = __onRightIconClick ?? searchProps.__onRightIconClick;

  const formFieldContext = useFormFieldContext(rest);
  const { ariaLabelledby, ariaDescribedby, controlId, invalid, warning } = __inheritFormFieldProps
    ? formFieldContext
    : rest;

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
      __rightIcon && styles['input-has-icon-right'],
      __leftIcon && styles['input-has-icon-left'],
      __noBorderRadius && styles['input-has-no-border-radius'],
      {
        [styles['input-readonly']]: readOnly,
        [styles['input-invalid']]: invalid,
        [styles['input-warning']]: warning && !invalid,
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
    ...__nativeAttributes,
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

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles['input-container'])}
      ref={__internalRootRef}
      dir={type === 'email' ? 'ltr' : undefined}
      {...(__injectAnalyticsComponentMetadata
        ? getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })
        : {})}
    >
      {__leftIcon && (
        <span onClick={__onLeftIconClick} className={styles['input-icon-left']}>
          <InternalIcon name={__leftIcon} variant={disabled || readOnly ? 'disabled' : __leftIconVariant} />
        </span>
      )}
      <input ref={mergedRef} {...attributes} />
      {__rightIcon && (
        <span
          className={styles['input-icon-right']}
          {...(__rightIcon === 'close'
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
            iconName={__rightIcon}
            onClick={__onRightIconClick}
            ariaLabel={i18n('clearAriaLabel', clearAriaLabelOverride)}
            disabled={disabled}
          />
        </span>
      )}
    </div>
  );
}

export default React.forwardRef(InternalInput);
