// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { useDensityMode } from '@cloudscape-design/component-toolkit/internal';

import InternalButton from '../button/internal';
import { convertAutoComplete } from '../input/utils';
import { getBaseProps } from '../internal/base-component';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireKeyboardEvent, fireNonCancelableEvent } from '../internal/events';
import * as tokens from '../internal/generated/styles/tokens';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { PromptInputProps } from './interfaces';

import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';

export interface InternalPromptInputProps extends PromptInputProps, InternalBaseComponentProps {}

const InternalPromptInput = React.forwardRef(
  (
    {
      value,
      actionButtonAriaLabel,
      actionButtonIconName,
      actionButtonIconUrl,
      actionButtonIconSvg,
      actionButtonIconAlt,
      ariaLabel,
      autoComplete,
      autoFocus,
      disableActionButton,
      disableBrowserAutocorrect,
      disabled,
      maxRows = 3,
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
      secondaryActions,
      secondaryContent,
      disableSecondaryActionsPaddings,
      disableSecondaryContentPaddings,
      __internalRootRef = null,
      ...rest
    }: InternalPromptInputProps,
    ref: Ref<PromptInputProps.Ref>
  ) => {
    const { ariaLabelledby, ariaDescribedby, controlId, invalid, warning } = useFormFieldContext(rest);

    const baseProps = getBaseProps(rest);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const isRefresh = useVisualRefresh();
    const isCompactMode = useDensityMode(textareaRef) === 'compact';

    const PADDING = isRefresh ? tokens.spaceXxs : tokens.spaceXxxs;
    const LINE_HEIGHT = tokens.lineHeightBodyM;

    useImperativeHandle(
      ref,
      () => ({
        focus(...args: Parameters<HTMLElement['focus']>) {
          textareaRef.current?.focus(...args);
        },
        select() {
          textareaRef.current?.select();
        },
      }),
      [textareaRef]
    );

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

    const hasActionButton = actionButtonIconName || actionButtonIconSvg || actionButtonIconUrl;

    const adjustTextareaHeight = useCallback(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        const maxRowsHeight = `calc(${maxRows <= 0 ? 3 : maxRows} * (${LINE_HEIGHT} + ${PADDING} / 2) + ${PADDING})`;
        const scrollHeight = `calc(${textareaRef.current.scrollHeight}px)`;
        textareaRef.current.style.height = `min(${scrollHeight}, ${maxRowsHeight})`;
      }
    }, [maxRows, LINE_HEIGHT, PADDING]);

    useEffect(() => {
      const handleResize = () => {
        adjustTextareaHeight();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [adjustTextareaHeight]);

    useEffect(() => {
      adjustTextareaHeight();
    }, [value, adjustTextareaHeight, maxRows, isCompactMode]);

    const attributes: React.TextareaHTMLAttributes<HTMLTextAreaElement> = {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      'aria-invalid': invalid ? 'true' : undefined,
      name,
      placeholder,
      autoFocus,
      className: clsx(styles.textarea, testutilStyles.textarea),
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

    const action = (
      <div className={styles.button}>
        <InternalButton
          className={clsx(styles['action-button'], testutilStyles['action-button'])}
          ariaLabel={actionButtonAriaLabel}
          disabled={disabled || readOnly || disableActionButton}
          iconName={actionButtonIconName}
          iconUrl={actionButtonIconUrl}
          iconSvg={actionButtonIconSvg}
          iconAlt={actionButtonIconAlt}
          onClick={() => fireNonCancelableEvent(onAction, { value })}
          variant="icon"
        />
      </div>
    );

    return (
      <div
        {...baseProps}
        className={clsx(styles.root, testutilStyles.root, baseProps.className, {
          [styles['textarea-readonly']]: readOnly,
          [styles['textarea-invalid']]: invalid,
          [styles['textarea-warning']]: warning && !invalid,
          [styles.disabled]: disabled,
        })}
        ref={__internalRootRef}
      >
        {secondaryContent && (
          <div
            className={clsx(styles['secondary-content'], testutilStyles['secondary-content'], {
              [styles['with-paddings']]: !disableSecondaryContentPaddings,
            })}
          >
            {secondaryContent}
          </div>
        )}
        <div className={styles['textarea-wrapper']}>
          <textarea ref={textareaRef} id={controlId} {...attributes} />
          {hasActionButton && !secondaryActions && action}
        </div>
        {secondaryActions && (
          <div
            className={clsx(styles['secondary-actions'], testutilStyles['secondary-actions'], {
              [styles['with-paddings']]: !disableSecondaryActionsPaddings,
            })}
          >
            {secondaryActions}
            {hasActionButton && action}
          </div>
        )}
      </div>
    );
  }
);

export default InternalPromptInput;
