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
import { SomeRequired } from '../internal/types';
import { PromptInputProps } from './interfaces';

import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';

interface InternalPromptInputProps
  extends SomeRequired<PromptInputProps, 'maxRows' | 'minRows'>,
    InternalBaseComponentProps {}

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
    const DEFAULT_MAX_ROWS = 3;

    useImperativeHandle(
      ref,
      () => ({
        focus(...args: Parameters<HTMLElement['focus']>) {
          textareaRef.current?.focus(...args);
        },
        select() {
          textareaRef.current?.select();
        },
        setSelectionRange(...args: Parameters<HTMLTextAreaElement['setSelectionRange']>) {
          textareaRef.current?.setSelectionRange(...args);
        },
      }),
      [textareaRef]
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      fireKeyboardEvent(onKeyDown, event);

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
        // this is required so the scrollHeight becomes dynamic, otherwise it will be locked at the highest value for the size it reached e.g. 500px
        textareaRef.current.style.height = 'auto';

        const minTextareaHeight = `calc(${LINE_HEIGHT} +  ${tokens.spaceScaledXxs} * 2)`; // the min height of Textarea with 1 row

        if (maxRows === -1) {
          const scrollHeight = `calc(${textareaRef.current.scrollHeight}px)`;
          textareaRef.current.style.height = `max(${scrollHeight}, ${minTextareaHeight})`;
        } else {
          const maxRowsHeight = `calc(${maxRows <= 0 ? DEFAULT_MAX_ROWS : maxRows} * (${LINE_HEIGHT} + ${PADDING} / 2) + ${PADDING})`;
          const scrollHeight = `calc(${textareaRef.current.scrollHeight}px)`;
          textareaRef.current.style.height = `min(max(${scrollHeight}, ${minTextareaHeight}), ${maxRowsHeight})`;
        }
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
      className: clsx(styles.textarea, testutilStyles.textarea, {
        [styles.invalid]: invalid,
        [styles.warning]: warning,
      }),
      autoComplete: convertAutoComplete(autoComplete),
      spellCheck: spellcheck,
      disabled,
      readOnly: readOnly ? true : undefined,
      rows: minRows,
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
          __focusable={readOnly}
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
        aria-label={ariaLabel}
        className={clsx(styles.root, testutilStyles.root, baseProps.className, {
          [styles['textarea-readonly']]: readOnly,
          [styles['textarea-invalid']]: invalid,
          [styles['textarea-warning']]: warning && !invalid,
          [styles.disabled]: disabled,
        })}
        ref={__internalRootRef}
        role="region"
      >
        {secondaryContent && (
          <div
            className={clsx(styles['secondary-content'], testutilStyles['secondary-content'], {
              [styles['with-paddings']]: !disableSecondaryContentPaddings,
              [styles.invalid]: invalid,
              [styles.warning]: warning,
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
              [styles.invalid]: invalid,
              [styles.warning]: warning,
            })}
          >
            {secondaryActions}
            <div className={styles.buffer} onClick={() => textareaRef.current?.focus()} />
            {hasActionButton && action}
          </div>
        )}
      </div>
    );
  }
);

export default InternalPromptInput;
