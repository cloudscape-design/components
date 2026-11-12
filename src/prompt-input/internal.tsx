// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useEffect, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import {
  useDensityMode,
  useMergeRefs,
  useStableCallback,
  warnOnce,
} from '@cloudscape-design/component-toolkit/internal';

import InternalButton from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import { convertAutoComplete } from '../input/utils';
import { getBaseProps } from '../internal/base-component';
import { useFormFieldContext } from '../internal/context/form-field-context';
import { fireCancelableEvent, fireKeyboardEvent, fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useWidthChange } from '../internal/hooks/use-width-change';
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
import { PromptInputInternalStyle } from './internal-interfaces';
import { getPromptInputStyles } from './styles';
import { useTokenMode } from './tokens/use-token-mode';
import { insertTextIntoContentEditable } from './utils/insert-text-content-editable';

import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';

// Style API v2
export interface StyleClassNames {
  root?: string;
  textarea?: string;
  actionButton?: string;
  token?: string;
  menu?: string;
}

interface InternalPromptInputProps
  extends SomeRequired<PromptInputProps, 'maxRows' | 'minRows'>,
    InternalBaseComponentProps {
  styleClassNames?: StyleClassNames;
}

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
      styleClassNames,
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

    // Empty tokens array is valid token-mode state; only fall back to
    // textarea mode when the prop is absent.
    const isTokenMode = tokens !== undefined && supportsTokenMode;

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

    const textareaDensityMode = useDensityMode(textareaRef);
    const editableDensityMode = useDensityMode(editableElementRef);
    const isCompactMode = (isTokenMode ? editableDensityMode : textareaDensityMode) === 'compact';

    const getActiveElement = useStableCallback(() => {
      return isTokenMode ? editableElementRef.current : textareaRef.current;
    });

    /**
     * Sizes the text element from its own computed line-height, padding and border, so padding from any source counts.
     */
    const adjustInputHeight = useStableCallback(() => {
      const element = getActiveElement();
      if (!element) {
        return;
      }

      const computed = window.getComputedStyle(element);
      const lineHeight = parseFloat(computed.lineHeight);
      const paddingTop = parseFloat(computed.paddingTop);
      const paddingBottom = parseFloat(computed.paddingBottom);
      const borderTop = parseFloat(computed.borderTopWidth);
      const borderBottom = parseFloat(computed.borderBottomWidth);

      // jsdom returns empty strings for layout properties; skip rather than write NaNpx.
      if ([lineHeight, paddingTop, paddingBottom, borderTop, borderBottom].some(isNaN)) {
        return;
      }

      const borders = borderTop + borderBottom;
      const box = paddingTop + paddingBottom;
      const effectiveMaxRows = maxRows <= 0 ? DEFAULT_MAX_ROWS : maxRows;

      const scrollTop = element.scrollTop;
      element.style.height = 'auto';
      const scrollHeight = element.scrollHeight;

      const minHeight = minRows * lineHeight + box + borders;
      const maxHeight = maxRows === -1 ? Infinity : effectiveMaxRows * lineHeight + box + borders;
      const clampedHeight = Math.min(Math.max(scrollHeight + borders, minHeight), maxHeight);

      element.style.height = `${clampedHeight}px`;

      if (isTokenMode) {
        element.scrollTop = scrollTop;
      }
    });

    // Height is adjusted per-mode. `value` must not be a dependency in token
    // mode — it's unused there, and re-running the effect on `value` changes
    // resets the contentEditable caret to offset 0.
    useEffect(() => {
      if (isTokenMode) {
        requestAnimationFrame(() => adjustInputHeight());
      }
    }, [isTokenMode, tokens, adjustInputHeight, isCompactMode, placeholder]);

    // When minRows/maxRows change, recalculate height synchronously — these prop
    // changes don't involve caret position so no RAF deferral is needed.
    useEffect(() => {
      if (isTokenMode) {
        adjustInputHeight();
      }
    }, [isTokenMode, adjustInputHeight, minRows, maxRows]);

    useEffect(() => {
      if (!isTokenMode) {
        adjustInputHeight();
      }
    }, [isTokenMode, value, adjustInputHeight, isCompactMode, placeholder, minRows, maxRows]);

    // Padding from any source changes the content box; the frame hop avoids Chrome's ResizeObserver loop error.
    useEffect(() => {
      const element = getActiveElement();
      if (!element || typeof ResizeObserver === 'undefined') {
        return;
      }
      const observer = new ResizeObserver(() => requestAnimationFrame(() => adjustInputHeight()));
      observer.observe(element, { box: 'content-box' });
      return () => observer.disconnect();
    }, [isTokenMode, getActiveElement, adjustInputHeight]);

    // Observe width changes on the component's root element to handle container resizes.
    // We need a separate RefObject because __internalRootRef may be a callback ref,
    // and useWidthChange needs a RefObject with .current to read the DOM node.
    const rootElementRef = useRef<HTMLDivElement>(null);
    const mergedRootRef = useMergeRefs(__internalRootRef, rootElementRef);
    useWidthChange(rootElementRef, adjustInputHeight);

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
      styleClassNames,
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
      className: clsx(styleClassNames?.textarea, styles.textarea, testutilStyles.textarea, {
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
            styleClassNames={{ root: styleClassNames?.actionButton }}
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
        className={clsx(styleClassNames?.root, styles.root, testutilStyles.root, baseProps.className, {
          [styles['textarea-readonly']]: readOnly,
          [styles['textarea-invalid']]: invalid,
          [styles['textarea-warning']]: warning && !invalid,
          [styles.disabled]: disabled,
        })}
        ref={mergedRootRef}
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
              menuStyle={(style as PromptInputInternalStyle | undefined)?._menu}
              styleClassNames={{ menu: styleClassNames?.menu }}
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
