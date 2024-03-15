// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useRef } from 'react';
import { getBaseProps } from '../internal/base-component';
import { fireKeyboardEvent, fireNonCancelableEvent } from '../internal/events';
import { TextareaProps } from './interfaces';
import { useFormFieldContext } from '../internal/context/form-field-context';
import useForwardFocus from '../internal/hooks/forward-focus';
import clsx from 'clsx';
import styles from './styles.css.js';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { convertAutoComplete } from '../input/utils';

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
      ...rest
    }: TextareaProps,
    ref: Ref<TextareaProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent('Textarea', {
      props: { autoComplete, autoFocus, disableBrowserAutocorrect, disableBrowserSpellcheck, readOnly, spellcheck },
    });
    const { ariaLabelledby, ariaDescribedby, controlId, invalid } = useFormFieldContext(rest);
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

    return (
      <span {...baseProps} className={clsx(styles.root, baseProps.className)} ref={__internalRootRef}>
        <textarea ref={textareaRef} id={controlId} {...attributes} />
      </span>
    );
  }
);

applyDisplayName(Textarea, 'Textarea');
export default Textarea;
