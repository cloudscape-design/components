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
      actionButtonAriaLabel,
      actionButtonIconName,
      ariaLabel,
      autoComplete = true,
      autoFocus,
      disableActionButton,
      disableBrowserAutocorrect,
      disabled,
      maxRows,
      minRows,
      name,
      onAction,
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      onKeyUp,
      placeholder,
      readOnly,
      spellcheck,
      ...rest
    }: PromptInputProps,
    ref: Ref<PromptInputProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent('Textarea', {
      props: { autoComplete, autoFocus, disableBrowserAutocorrect, readOnly, spellcheck },
    });
    const { ariaLabelledby, ariaDescribedby, controlId, invalid, warning } = useFormFieldContext(rest);

    const baseProps = getBaseProps(rest);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useForwardFocus(ref, textareaRef);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        onAction && onAction();
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
      const handleResize = () => {
        adjustTextareaHeight();
      };

      const handleFontLoad = () => {
        adjustTextareaHeight();
      };

      window.addEventListener('resize', handleResize);

      if (document.fonts) {
        document.fonts.addEventListener('loadingdone', handleFontLoad);
      }

      return () => {
        window.removeEventListener('resize', handleResize);

        if (document.fonts) {
          document.fonts.removeEventListener('loadingdone', handleFontLoad);
        }
      };
    }, [adjustTextareaHeight]);

    useEffect(() => {
      adjustTextareaHeight();
    }, [value, adjustTextareaHeight, maxRows]);

    const attributes: React.TextareaHTMLAttributes<HTMLTextAreaElement> = {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
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

    return (
      <span {...baseProps} className={clsx(styles.root, baseProps.className)} ref={__internalRootRef}>
        <textarea ref={textareaRef} id={controlId} {...attributes} />
        <div className={styles.button}>
          {actionButtonIconName && (
            <InternalButton
              ariaLabel={actionButtonAriaLabel}
              disabled={disableActionButton}
              iconName={actionButtonIconName}
              onClick={() => onAction && onAction()}
              variant="icon"
            />
          )}
        </div>
      </span>
    );
  }
);

applyDisplayName(PromptInput, 'PromptInput');
export default PromptInput;
