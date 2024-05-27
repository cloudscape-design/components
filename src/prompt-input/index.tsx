// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useCallback, useEffect, useRef } from 'react';
import { getBaseProps } from '../internal/base-component';
import InternalButton from '../button/internal';
import { fireKeyboardEvent, fireNonCancelableEvent } from '../internal/events';
import { PromptInputProps } from './interfaces';
import { useFormFieldContext } from '../internal/context/form-field-context';
import useForwardFocus from '../internal/hooks/forward-focus';
import clsx from 'clsx';
import styles from './styles.css.js';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { convertAutoComplete } from '../input/utils';

export { PromptInputProps };

const PromptInput = React.forwardRef(
  (
    {
      value,
      autoComplete = true,
      disabled,
      readOnly,
      disableBrowserAutocorrect,
      disableBrowserSpellcheck,
      disableSendButton,
      spellcheck,
      onKeyDown,
      onKeyUp,
      onChange,
      onBlur,
      onFocus,
      //onSend,
      ariaRequired,
      name,
      placeholder,
      autoFocus,
      ariaLabel,
      minRows,
      maxRows,
      ...rest
    }: PromptInputProps,
    ref: Ref<PromptInputProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent('Textarea', {
      props: { autoComplete, autoFocus, disableBrowserAutocorrect, disableBrowserSpellcheck, readOnly, spellcheck },
    });
    const { ariaLabelledby, ariaDescribedby, controlId, invalid, warning } = useFormFieldContext(rest);

    const baseProps = getBaseProps(rest);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useForwardFocus(ref, textareaRef);

    const onSend = () => console.log('SENDING');

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        onSend();
      }
      if (onKeyDown) {
        fireKeyboardEvent(onKeyDown, event);
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        fireNonCancelableEvent(onChange, { value: event.target.value });
      }
      adjustTextareaHeight();
    };

    const adjustTextareaHeight = useCallback(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';

        // eslint-disable-next-line no-warning-comments
        // TODO: calculatenodeheight for this newHeight
        const newHeight = Math.min(textareaRef.current.scrollHeight + 4, (maxRows ?? 3) * 22 + 4);
        textareaRef.current.style.height = `${newHeight}px`;
      }
    }, [maxRows]);

    useEffect(() => {
      adjustTextareaHeight();
    }, [value, adjustTextareaHeight]);

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
      rows: minRows || 1,
      onKeyDown: handleKeyDown,
      onKeyUp: onKeyUp && (event => fireKeyboardEvent(onKeyUp, event)),
      // We set a default value on the component in order to force it into the controlled mode.
      value: value || '',
      onChange: handleChange,
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
        <div className={styles.button}>
          <InternalButton
            onClick={onSend}
            disabled={disableSendButton}
            variant="icon"
            iconSvg={
              <svg
                focusable={true}
                xmlns="http://www.w3.org/2000/svg"
                height="100%"
                width="100%"
                fill="none"
                strokeWidth={0}
                viewBox="0 0 16 17"
              >
                <title> Send Message (enter)</title>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.44731 0.182767C1.07815 -0.00184172 0.6335 0.0593217 0.327895 0.336747C0.0222903 0.614172 -0.0814707 1.05085 0.0666757 1.4361L2.61935 8.07411L0.0668605 14.7015C-0.0814777 15.0866 0.0220426 15.5233 0.327477 15.8009C0.632912 16.0785 1.07751 16.1399 1.44676 15.9555L15.439 8.96906C15.7779 8.79981 15.9921 8.45355 15.9922 8.07469C15.9924 7.69583 15.7784 7.34944 15.4395 7.17998L1.44731 0.182767ZM4.37769 7.07439L2.85886 3.12479L10.7568 7.07439H4.37769ZM4.37731 9.07439L2.85977 13.0146L10.751 9.07439H4.37731Z"
                  fill={'#555C65'}
                />
              </svg>
            }
          />
        </div>
      </span>
    );
  }
);

applyDisplayName(PromptInput, 'PromptInput');
export default PromptInput;
