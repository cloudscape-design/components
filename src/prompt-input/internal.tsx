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
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { convertAutoComplete } from '../input/utils';

export interface InternalPromptInputProps extends PromptInputProps, InternalBaseComponentProps {}

const InternalPromptInput = React.forwardRef(
  (
    {
      value,
      actionButtonAriaLabel,
      actionButtonIconName,
      actionButtonIconUrl,
      actionButtonIconSvg,
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
      __internalRootRef = null,
      ...rest
    }: InternalPromptInputProps,
    ref: Ref<PromptInputProps.Ref>
  ) => {
    const { ariaLabelledby, ariaDescribedby, controlId, invalid, warning } = useFormFieldContext(rest);

    const baseProps = getBaseProps(rest);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useForwardFocus(ref, textareaRef);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (onKeyDown) {
        fireKeyboardEvent(onKeyDown, event);
      }

      if (event.key === 'Enter' && !event.shiftKey) {
        if ('form' in event.target && event.target.form !== null && !event.isDefaultPrevented()) {
          (event.target.form as HTMLFormElement).requestSubmit();
        }

        event.preventDefault();
        fireNonCancelableEvent(onAction, { value });
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      fireNonCancelableEvent(onChange, { value: event.target.value });
      adjustTextareaHeight();
    };

    const adjustTextareaHeight = useCallback(() => {
      const PADDING = 4;
      const LINE_HEIGHT = 20;
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';

        // eslint-disable-next-line no-warning-comments
        // TODO: calculatenodeheight for this newHeight
        const newHeight = Math.min(
          textareaRef.current.scrollHeight + PADDING,
          (maxRows ?? 3) * LINE_HEIGHT + PADDING + PADDING / 2
        );
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
        [styles['textarea-with-button']]: actionButtonIconName,
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

    const hasActionButton = actionButtonIconName || actionButtonIconSvg || actionButtonIconUrl;

    if (disableBrowserAutocorrect) {
      attributes.autoCorrect = 'off';
      attributes.autoCapitalize = 'off';
    }

    return (
      <div {...baseProps} className={clsx(styles.root, baseProps.className)} ref={__internalRootRef}>
        <textarea ref={textareaRef} id={controlId} {...attributes} />
        {hasActionButton && (
          <div className={styles.button}>
            <InternalButton
              className={styles['action-button']}
              ariaLabel={actionButtonAriaLabel}
              disabled={disabled || readOnly || disableActionButton}
              iconName={actionButtonIconName}
              iconUrl={actionButtonIconUrl}
              iconSvg={actionButtonIconSvg}
              onClick={() => fireNonCancelableEvent(onAction, { value })}
              variant="icon"
            />
          </div>
        )}
      </div>
    );
  }
);

export default InternalPromptInput;
