// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React, { Ref, useRef } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { convertAutoComplete } from '../input/utils';
import { getBaseProps } from '../internal/base-component';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireKeyboardEvent, fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { GeneratedAnalyticsMetadataTextareaComponent } from './analytics-metadata/interfaces';
import { TextareaProps } from './interfaces';
import { getTextareaStyles } from './styles';

import styles from './styles.css.js';

export { TextareaProps };

const Textarea = React.forwardRef(
  (
    {
      value,
      autoComplete = true,
      disabled,
      readOnly,
      disableBrowserAutocorrect,
      disableBrowserSpellcheck,
      spellcheck,
      onKeyDown,
      onKeyUp,
      onChange,
      onBlur,
      onFocus,
      ariaRequired,
      name,
      rows,
      placeholder,
      autoFocus,
      ariaLabel,
      nativeTextareaAttributes,
      style,
      ...rest
    }: TextareaProps,
    ref: Ref<TextareaProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent('Textarea', {
      props: { autoComplete, autoFocus, disableBrowserAutocorrect, disableBrowserSpellcheck, readOnly, spellcheck },
    });
    const { ariaLabelledby, ariaDescribedby, controlId, invalid, warning } = useFormFieldContext(rest);

    const baseProps = getBaseProps(rest);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useForwardFocus(ref, textareaRef);

    const attributes: React.TextareaHTMLAttributes<HTMLTextAreaElement> = {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      'aria-required': ariaRequired ? 'true' : undefined,
      'aria-invalid': invalid ? 'true' : undefined,
      name,
      placeholder,
      autoFocus,
      className: clsx(styles.textarea, {
        [styles['textarea-readonly']]: readOnly,
        [styles['textarea-invalid']]: invalid,
        [styles['textarea-warning']]: warning && !invalid,
      }),
      autoComplete: convertAutoComplete(autoComplete),
      spellCheck: spellcheck,
      disabled,
      readOnly: readOnly ? true : undefined,
      rows: rows || 3,
      onKeyDown: onKeyDown && (event => fireKeyboardEvent(onKeyDown, event)),
      onKeyUp: onKeyUp && (event => fireKeyboardEvent(onKeyUp, event)),
      // We set a default value on the component in order to force it into the controlled mode.
      value: value || '',
      onChange: onChange && (event => fireNonCancelableEvent(onChange, { value: event.target.value })),
      onBlur: onBlur && (() => fireNonCancelableEvent(onBlur)),
      onFocus: onFocus && (() => fireNonCancelableEvent(onFocus)),
    };

    if (disableBrowserAutocorrect) {
      attributes.autoCorrect = 'off';
      attributes.autoCapitalize = 'off';
    }

    if (disableBrowserSpellcheck) {
      attributes.spellCheck = 'false';
    }

    const componentAnalyticsMetadata: GeneratedAnalyticsMetadataTextareaComponent = {
      name: 'awsui.Textarea',
      label: 'textarea',
      properties: {
        value: value || '',
      },
    };

    return (
      <span
        {...baseProps}
        className={clsx(styles.root, baseProps.className)}
        ref={__internalRootRef}
        {...getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })}
      >
        <WithNativeAttributes
          {...attributes}
          tag="textarea"
          componentName="Textarea"
          nativeAttributes={nativeTextareaAttributes}
          ref={textareaRef}
          id={controlId}
          style={getTextareaStyles(style)}
        />
      </span>
    );
  }
);

applyDisplayName(Textarea, 'Textarea');
export default Textarea;
