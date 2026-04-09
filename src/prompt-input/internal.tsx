// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useEffect, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { useDensityMode, useStableCallback, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import InternalButton from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import { convertAutoComplete } from '../input/utils';
import { getBaseProps } from '../internal/base-component';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireCancelableEvent, fireKeyboardEvent, fireNonCancelableEvent } from '../internal/events';
import * as designTokens from '../internal/generated/styles/tokens';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { isDevelopment } from '../internal/is-development';
import { SomeRequired } from '../internal/types';
import InternalLiveRegion from '../live-region/internal';
import TextareaMode from './components/textarea-mode';
import TokenMode from './components/token-mode';
import { CaretController } from './core/caret-controller';
import { DEFAULT_MAX_ROWS } from './core/constants';
import { getPromptText } from './core/token-operations';
import { supportsTokenMode } from './core/token-renderer';
import { isPinnedReferenceToken } from './core/type-guards';
import { PromptInputProps } from './interfaces';
import { getPromptInputStyles } from './styles';
import { useTokenMode } from './tokens/use-token-mode';
import { insertTextIntoContentEditable } from './utils/insert-text-content-editable';

import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';

interface InternalPromptInputProps
  extends SomeRequired<PromptInputProps, 'maxRows' | 'minRows'>,
    InternalBaseComponentProps {}

const InternalPromptInput = React.forwardRef(
  (
    {
      value: valueProp,
      actionButtonAriaLabel,
      actionButtonIconName,
      actionButtonIconUrl,
      actionButtonIconSvg,
      actionButtonIconAlt,
      ariaLabel,
      autoFocus,
      autoComplete,
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
      customPrimaryAction,
      secondaryActions,
      secondaryContent,
      disableSecondaryActionsPaddings,
      disableSecondaryContentPaddings,
      nativeTextareaAttributes,
      style,
      tokens,
      tokensToText,
      menus,
      maxMenuHeight,
      onMenuItemSelect,
      onMenuFilter,
      onMenuLoadItems,
      onTriggerDetected,
      i18nStrings,
      __internalRootRef,
      ...rest
    }: InternalPromptInputProps,
    ref: Ref<PromptInputProps.Ref | HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { ariaLabelledby, ariaDescribedby, controlId, invalid, warning } = useFormFieldContext(rest);
    const baseProps = getBaseProps(rest);

    const i18n = useInternalI18n('prompt-input');

    const effectiveI18nStrings: PromptInputProps.I18nStrings = {
      actionButtonAriaLabel: i18n(
        'i18nStrings.actionButtonAriaLabel',
        i18nStrings?.actionButtonAriaLabel ?? actionButtonAriaLabel
      ),
      menuErrorIconAriaLabel: i18n('i18nStrings.menuErrorIconAriaLabel', i18nStrings?.menuErrorIconAriaLabel),
      menuRecoveryText: i18n('i18nStrings.menuRecoveryText', i18nStrings?.menuRecoveryText),
      menuLoadingText: i18n('i18nStrings.menuLoadingText', i18nStrings?.menuLoadingText),
      menuFinishedText: i18n('i18nStrings.menuFinishedText', i18nStrings?.menuFinishedText),
      menuErrorText: i18n('i18nStrings.menuErrorText', i18nStrings?.menuErrorText),
      tokenInsertedAriaLabel: i18n(
        'i18nStrings.tokenInsertedAriaLabel',
        i18nStrings?.tokenInsertedAriaLabel,
        format => token => format({ token__label: token.label || token.value })
      ),
      tokenPinnedAriaLabel: i18n(
        'i18nStrings.tokenPinnedAriaLabel',
        i18nStrings?.tokenPinnedAriaLabel,
        format => token => format({ token__label: token.label || token.value })
      ),
      tokenRemovedAriaLabel: i18n(
        'i18nStrings.tokenRemovedAriaLabel',
        i18nStrings?.tokenRemovedAriaLabel,
        format => token => format({ token__label: token.label || token.value })
      ),
    };

    const isTokenMode = !!tokens && supportsTokenMode;

    if (isDevelopment) {
      if ((menus || tokens) && !supportsTokenMode) {
        warnOnce(
          'PromptInput',
          'Shortcuts features require React 18 or later. The `menus` and `tokens` props will be ignored and shortcuts features will not function.'
        );
      }
    }

    const value = valueProp ?? '';

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const editableElementRef = useRef<HTMLDivElement>(null);
    const caretControllerRef = useRef<CaretController | null>(null);

    const isRefresh = useVisualRefresh();
    useDensityMode(textareaRef);
    useDensityMode(editableElementRef);

    const PADDING = isRefresh ? designTokens.spaceXxs : designTokens.spaceXxxs;
    const LINE_HEIGHT = designTokens.lineHeightBodyM;

    const getActiveElement = useStableCallback(() => {
      return isTokenMode ? editableElementRef.current : textareaRef.current;
    });

    /**
     * Dynamically adjusts the input height based on content and row constraints.
     */
    const adjustInputHeight = useStableCallback(() => {
      const element = getActiveElement();
      if (!element) {
        return;
      }

      const scrollTop = element.scrollTop;
      element.style.height = 'auto';

      const minRowsHeight = isTokenMode
        ? `calc(${minRows} * (${LINE_HEIGHT} + ${PADDING} / 2) + ${PADDING})`
        : `calc(${LINE_HEIGHT} + ${designTokens.spaceScaledXxs} * 2)`;
      const scrollHeight = `calc(${element.scrollHeight}px)`;

      if (maxRows === -1) {
        element.style.height = `max(${scrollHeight}, ${minRowsHeight})`;
      } else {
        const effectiveMaxRows = maxRows <= 0 ? DEFAULT_MAX_ROWS : maxRows;
        const maxRowsHeight = `calc(${effectiveMaxRows} * (${LINE_HEIGHT} + ${PADDING} / 2) + ${PADDING})`;
        element.style.height = `min(max(${scrollHeight}, ${minRowsHeight}), ${maxRowsHeight})`;
      }

      if (isTokenMode) {
        element.scrollTop = scrollTop;
      }
    });

    useEffect(() => {
      if (isTokenMode) {
        requestAnimationFrame(() => adjustInputHeight());
      } else {
        adjustInputHeight();
      }
    }, [isTokenMode, tokens, adjustInputHeight, value]);

    const plainTextValue = isTokenMode
      ? tokensToText
        ? tokensToText(tokens ?? [])
        : getPromptText(tokens ?? [])
      : value;

    const tokenMode = useTokenMode({
      editableElementRef,
      caretControllerRef,
      tokens,
      tokensToText,
      menus,
      disabled,
      readOnly,
      autoFocus,
      placeholder,
      invalid,
      warning,
      ariaLabel,
      ariaLabelledby,
      ariaDescribedby,
      ariaRequired: rest.ariaRequired,
      disableBrowserAutocorrect,
      spellcheck,
      onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => {
        fireNonCancelableEvent(onChange, detail);
      },
      onTriggerDetected: onTriggerDetected ? detail => fireCancelableEvent(onTriggerDetected, detail) : undefined,
      onAction,
      onBlur,
      onFocus,
      onKeyDown,
      onKeyUp,
      onMenuItemSelect,
      onMenuFilter,
      onMenuLoadItems,
      i18nStrings: effectiveI18nStrings,
      adjustInputHeight,
    });

    const handleInsertText = useStableCallback((text: string, caretStart?: number, caretEnd?: number) => {
      if (disabled || readOnly) {
        return;
      }

      if (!isTokenMode || !editableElementRef.current || !tokens || !caretControllerRef.current) {
        return;
      }

      let adjustedCaretStart: number;
      let adjustedCaretEnd: number | undefined;

      if (caretStart === undefined) {
        const currentPos = caretControllerRef.current.getPosition();
        const pinnedCount = tokens.filter(isPinnedReferenceToken).length;

        // If the caret is before or between pinned tokens, move it after them.
        // Text inserted here would get pushed after pinned tokens by enforcePinnedTokenOrdering,
        // but the caret wouldn't follow — so we preemptively position it correctly.
        adjustedCaretStart = pinnedCount > 0 && currentPos < pinnedCount ? pinnedCount : currentPos;
        adjustedCaretEnd = undefined;
      } else {
        const pinnedTokens = tokens.filter(isPinnedReferenceToken);
        const pinnedOffset = pinnedTokens.length;

        adjustedCaretStart = caretStart + pinnedOffset;
        adjustedCaretEnd = caretEnd !== undefined ? caretEnd + pinnedOffset : undefined;
      }

      insertTextIntoContentEditable(
        editableElementRef.current,
        text,
        adjustedCaretStart,
        adjustedCaretEnd,
        caretControllerRef.current
      );
    });

    useImperativeHandle(
      ref,
      () => ({
        focus(...args: Parameters<HTMLElement['focus']>) {
          getActiveElement()?.focus(...args);
        },
        select() {
          if (isTokenMode) {
            if (editableElementRef.current && caretControllerRef.current) {
              caretControllerRef.current.selectAll();
            }
          } else {
            textareaRef.current?.select();
          }
        },
        setSelectionRange(...args: Parameters<HTMLTextAreaElement['setSelectionRange']>) {
          if (isTokenMode && caretControllerRef.current) {
            const [start, end] = args;
            const actualEnd = end ?? undefined;
            caretControllerRef.current.setPosition(start ?? 0, actualEnd);
          } else {
            textareaRef.current?.setSelectionRange(...args);
          }
        },
        insertText: handleInsertText,
      }),
      [getActiveElement, isTokenMode, handleInsertText]
    );

    const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      fireKeyboardEvent(onKeyDown, event);

      if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
        if (event.currentTarget.form && !event.isDefaultPrevented()) {
          event.currentTarget.form.requestSubmit();
        }
        event.preventDefault();
        fireNonCancelableEvent(onAction, {
          value: plainTextValue,
        });
      }
    };

    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isTokenMode) {
        tokenMode.markTokensAsSent(tokens ?? []);
      }
      const detail: PromptInputProps.ChangeDetail = {
        value: event.target.value,
      };
      fireNonCancelableEvent(onChange, detail);
      adjustInputHeight();
    };

    const hasActionButton = !!(
      actionButtonIconName ||
      actionButtonIconSvg ||
      actionButtonIconUrl ||
      customPrimaryAction
    );

    const textareaAttributes: React.TextareaHTMLAttributes<HTMLTextAreaElement> = {
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
      autoCorrect: disableBrowserAutocorrect ? 'off' : undefined,
      autoCapitalize: disableBrowserAutocorrect ? 'off' : undefined,
      spellCheck: spellcheck,
      disabled,
      readOnly: readOnly ? true : undefined,
      rows: minRows,
      value: value || '',
      onKeyDown: handleTextareaKeyDown,
      onKeyUp: onKeyUp && (event => fireKeyboardEvent(onKeyUp, event)),
      onChange: handleTextareaChange,
      onBlur: onBlur && (() => fireNonCancelableEvent(onBlur)),
      onFocus: onFocus && (() => fireNonCancelableEvent(onFocus)),
    };

    const actionButton = (
      <div className={clsx(styles['primary-action'], testutilStyles['primary-action'])}>
        {customPrimaryAction ?? (
          <InternalButton
            className={clsx(styles['action-button'], testutilStyles['action-button'])}
            ariaLabel={effectiveI18nStrings.actionButtonAriaLabel}
            disabled={disabled || readOnly || disableActionButton}
            __focusable={readOnly}
            iconName={actionButtonIconName}
            iconUrl={actionButtonIconUrl}
            iconSvg={actionButtonIconSvg}
            iconAlt={actionButtonIconAlt}
            onClick={() => {
              fireNonCancelableEvent(onAction, {
                value: plainTextValue,
                ...(isTokenMode && { tokens: tokens ?? [] }),
              });
            }}
            variant="icon"
          />
        )}
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
        style={getPromptInputStyles(style)}
      >
        <InternalLiveRegion tagName="span" hidden={true} assertive={true} delay={0}>
          {tokenMode.tokenOperationAnnouncement}
        </InternalLiveRegion>

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
          {isTokenMode ? (
            <TokenMode
              editableElementRef={editableElementRef}
              triggerWrapperRef={tokenMode.triggerWrapperRef}
              controlId={controlId}
              menuListId={tokenMode.menuListId}
              menuFooterControlId={tokenMode.menuFooterControlId}
              highlightedMenuOptionId={tokenMode.highlightedMenuOptionId}
              name={name}
              plainTextValue={plainTextValue}
              menuIsOpen={tokenMode.menuIsOpen}
              triggerWrapperReady={tokenMode.triggerWrapperReady}
              shouldRenderMenuDropdown={tokenMode.shouldRenderMenuDropdown}
              activeMenu={tokenMode.activeMenu}
              activeTriggerToken={tokenMode.activeTriggerToken}
              menuFilterText={tokenMode.menuFilterText}
              menuItemsState={tokenMode.menuItemsState}
              menuItemsHandlers={tokenMode.menuItemsHandlers}
              menuDropdownStatus={tokenMode.menuDropdownStatus}
              maxMenuHeight={maxMenuHeight}
              handleInput={tokenMode.handleInput}
              handleLoadMore={tokenMode.handleLoadMore}
              editableElementAttributes={tokenMode.editableElementAttributes}
              i18nStrings={effectiveI18nStrings}
            />
          ) : (
            <TextareaMode
              textareaRef={textareaRef}
              controlId={controlId}
              textareaAttributes={textareaAttributes}
              nativeTextareaAttributes={nativeTextareaAttributes}
            />
          )}
          {hasActionButton && !secondaryActions && actionButton}
        </div>

        {/* Render reference tokens into their DOM containers via portals */}
        {isTokenMode && tokenMode.portals}

        {secondaryActions && (
          <div
            className={clsx(styles['action-stripe'], {
              [styles.invalid]: invalid,
              [styles.warning]: warning,
            })}
          >
            <div
              className={clsx(styles['secondary-actions'], testutilStyles['secondary-actions'], {
                [styles['with-paddings']]: !disableSecondaryActionsPaddings,
                [styles['with-paddings-and-actions']]: !disableSecondaryActionsPaddings && hasActionButton,
                [styles.invalid]: invalid,
                [styles.warning]: warning,
              })}
            >
              {secondaryActions}
            </div>
            <div className={styles.buffer} onClick={() => getActiveElement()?.focus()} />
            {hasActionButton && actionButton}
          </div>
        )}
      </div>
    );
  }
);

export default InternalPromptInput;
