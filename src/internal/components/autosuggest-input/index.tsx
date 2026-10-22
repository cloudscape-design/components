// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref, useEffect, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { AutosuggestProps } from '../../../autosuggest/interfaces';
import { ExpandToViewport } from '../../../dropdown/interfaces';
import InternalDropdown from '../../../dropdown/internal';
import InternalIcon from '../../../icon/internal';
import {
  BaseChangeDetail,
  BaseInputProps,
  InputAutoCorrect,
  InputClearLabel,
  InputKeyEvents,
  InputProps,
} from '../../../input/interfaces';
import InternalInput from '../../../input/internal';
import InternalLiveRegion from '../../../live-region/internal';
import InternalToken from '../../../token/internal';
import { BaseComponentProps } from '../../../types/base-component';
import { BaseKeyDetail, NonCancelableEventHandler } from '../../../types/events';
import { FormFieldValidationControlProps } from '../../../types/form-field';
import { getBaseProps } from '../../base-component';
import { getBreakpointValue } from '../../breakpoints';
import { ResetGroupedControlContext, useGroupedControlContext } from '../../context/control-group-context';
import { useFormFieldContext } from '../../context/form-field-context';
import { fireCancelableEvent, fireNonCancelableEvent } from '../../events';
import { InternalBaseComponentProps } from '../../hooks/use-base-component';
import { useIMEComposition } from '../../hooks/use-ime-composition';
import { useListFocusController } from '../../hooks/use-list-focus-controller';
import { KeyCode } from '../../keycode';
import { getDropdownMinWidth } from '../../utils/get-dropdown-min-width';
import { getInputStylesCss } from '../../utils/input-styles';
import { nodeBelongs } from '../../utils/node-belongs';
import { processAttributes } from '../../utils/with-native-attributes';
import ButtonTrigger from '../button-trigger';
import { getGroupedControlClassNames } from '../control-group-styles/grouped-control-styles';
import { InlineTokens, InlineTokensRef } from './inline-tokens';
import { useTokenOverflow } from './use-token-overflow';

import styles from './styles.css.js';

interface AutosuggestInputProps
  extends BaseComponentProps,
    BaseInputProps,
    InputAutoCorrect,
    InputKeyEvents,
    InputClearLabel,
    FormFieldValidationControlProps,
    ExpandToViewport,
    InternalBaseComponentProps {
  ariaControls?: string;
  ariaActivedescendant?: string;
  dropdownExpanded?: boolean;
  dropdownContentKey?: string;
  dropdownContentFocusable?: boolean;
  dropdownContent?: React.ReactNode;
  dropdownFooter?: React.ReactNode;
  dropdownWidth?: number;
  loopFocus?: boolean;
  onCloseDropdown?: NonCancelableEventHandler<null>;
  onDelayedInput?: NonCancelableEventHandler<BaseChangeDetail>;
  onPressArrowDown?: () => void;
  onPressArrowUp?: () => void;
  onPressEnter?: () => boolean;
  style?: InputProps['style'];
  tokens?: ReadonlyArray<AutosuggestProps.Token>;
  tokenOverflowAriaLabel?: (hiddenCount: number) => string;
  tokenInsertedAnnouncement?: (value: string) => string;
  tokenDismissLabel?: (value: string) => string;
}

interface AutosuggestInputFocusOptions {
  preventDropdown?: boolean;
}

export interface AutosuggestInputRef extends AutosuggestProps.Ref {
  focus(options?: AutosuggestInputFocusOptions): void;
  open(): void;
  close(): void;
  addToken(value: string): void;
}

const AutosuggestInput = React.forwardRef(
  (
    {
      value,
      onChange,
      onBlur,
      onFocus,
      onKeyUp,
      onKeyDown,
      name,
      placeholder,
      disabled,
      readOnly,
      autoFocus,
      ariaLabel,
      ariaRequired,
      disableBrowserAutocorrect = false,
      expandToViewport,
      ariaControls,
      ariaActivedescendant,
      clearAriaLabel,
      dropdownExpanded = true,
      dropdownContentKey,
      dropdownContentFocusable = false,
      dropdownContent = null,
      dropdownFooter = null,
      dropdownWidth,
      loopFocus,
      nativeInputAttributes,
      onCloseDropdown,
      onDelayedInput,
      onPressArrowDown,
      onPressArrowUp,
      onPressEnter,
      style,
      tokens,
      tokenOverflowAriaLabel,
      tokenInsertedAnnouncement,
      tokenDismissLabel,
      __internalRootRef,
      ...restProps
    }: AutosuggestInputProps,
    ref: Ref<AutosuggestInputRef>
  ) => {
    const isTokenMode = !!tokens;
    const tokenList = tokens ?? [];

    const baseProps = getBaseProps(restProps);
    const formFieldContext = useFormFieldContext(restProps);
    const groupedControlProps = useGroupedControlContext();

    const inputRef = useRef<HTMLInputElement>(null);
    // The field box, not the borderless native input, is the visible trigger whose width the dropdown follows.
    const inputContainerRef = useRef<HTMLDivElement>(null);
    const dropdownContentRef = useRef<HTMLDivElement>(null);
    const dropdownFooterRef = useRef<HTMLDivElement>(null);
    const preventOpenOnFocusRef = useRef(false);
    const preventCloseOnBlurRef = useRef(false);

    const fieldRef = useRef<HTMLDivElement>(null);
    const leadingIconRef = useRef<HTMLSpanElement>(null);
    const inputWrapperRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const measureTriggerRef = useRef<HTMLButtonElement>(null);
    const inlineTokensRef = useRef<InlineTokensRef>(null);

    const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
    useResizeObserver(
      () => (isTokenMode ? fieldRef.current : inputContainerRef.current),
      entry => entry.borderBoxWidth > 0 && setTriggerWidth(entry.borderBoxWidth)
    );

    const [open, setOpen] = useState(false);
    const [tokensOverflowOpen, setTokensOverflowOpen] = useState(false);
    const [announcement, setAnnouncement] = useState('');

    const { containerRef, visibleCount } = useTokenOverflow({
      enabled: isTokenMode,
      tokenCount: tokenList.length,
      tokenContentKey: tokenList.map(token => `${token.value}::${token.icon ? 'icon' : 'no-icon'}`).join('\n'),
      measureRef,
      measureTriggerRef,
      fieldRef,
      leadingIconRef,
      inputWrapperRef,
      layoutKey: [
        formFieldContext.invalid,
        formFieldContext.warning,
        disabled,
        readOnly,
        groupedControlProps.position,
      ].join(),
    });
    const hiddenCount = tokenList.length - visibleCount;

    const [nextFocusTokenIndex, setNextFocusTokenIndex] = useState<number | null>(null);
    const focusControllerRef = useListFocusController({
      nextFocusIndex: nextFocusTokenIndex === null ? null : Math.max(0, nextFocusTokenIndex - hiddenCount),
      onFocusMoved: (target, targetType) => {
        if (targetType === 'fallback') {
          preventOpenOnFocusRef.current = true;
        }
        target.focus();
        setNextFocusTokenIndex(null);
      },
      listItemSelector: `.${styles['token-list-item']} button`,
      showMoreSelector: `.${styles['token-overflow-trigger']}`,
      fallbackSelector: 'input',
    });
    const mergedFieldRef = useMergeRefs(fieldRef, focusControllerRef);

    useEffect(() => {
      if (!tokensOverflowOpen || (hiddenCount > 0 && !disabled)) {
        return;
      }
      setTokensOverflowOpen(false);
      if (!disabled && !nodeBelongs(fieldRef.current, document.activeElement)) {
        setNextFocusTokenIndex(0);
      }
    }, [tokensOverflowOpen, hiddenCount, disabled]);

    const openDropdown = () => !readOnly && setOpen(true);

    const closeDropdown = () => {
      setOpen(false);
      fireNonCancelableEvent(onCloseDropdown, null);
    };

    const { isComposing } = useIMEComposition(inputRef);

    const addToken = (tokenValue: string) => {
      if (!tokenValue || readOnly || disabled) {
        return;
      }
      fireNonCancelableEvent(onChange, { value: '', tokens: [...tokenList, { value: tokenValue }] });
      setAnnouncement(tokenInsertedAnnouncement?.(tokenValue) ?? tokenValue);
    };

    const removeToken = (index: number, source: 'inline' | 'overflow') => {
      fireNonCancelableEvent(onChange, { value, tokens: tokenList.filter((_, i) => i !== index) });
      if (source === 'inline') {
        setNextFocusTokenIndex(index);
      }
    };

    useImperativeHandle(ref, () => ({
      focus(options?: AutosuggestInputFocusOptions) {
        if (options?.preventDropdown) {
          preventOpenOnFocusRef.current = true;
        }
        inputRef.current?.focus();
      },
      select() {
        inputRef.current?.select();
      },
      open: openDropdown,
      close: closeDropdown,
      addToken,
    }));

    const handleBlur = () => {
      if (!preventCloseOnBlurRef.current) {
        closeDropdown();
        fireNonCancelableEvent(onBlur, null);
      }
    };

    const handleFocus = () => {
      if (!preventOpenOnFocusRef.current) {
        openDropdown();
        fireNonCancelableEvent(onFocus, null);
      }
      preventOpenOnFocusRef.current = false;
    };

    const fireKeydown = (event: CustomEvent<BaseKeyDetail>) => fireCancelableEvent(onKeyDown, event.detail, event);

    const clearValue = () =>
      fireNonCancelableEvent(onChange, isTokenMode ? { value: '', tokens: tokenList } : { value: '' });

    // Shared ESC key handler logic for both input and dropdown elements
    // When returnFocus is true (from dropdown elements), focus returns to input after closing
    const handleEscapeKey = (returnFocus: boolean) => {
      if (open) {
        closeDropdown();
        if (returnFocus) {
          // Return focus to input when closing from dropdown elements (e.g., recovery button)
          inputRef.current?.focus();
        }
      } else if (value) {
        clearValue();
      }
    };

    const handleKeyDown = (event: CustomEvent<BaseKeyDetail>) => {
      switch (event.detail.keyCode) {
        case KeyCode.down: {
          onPressArrowDown?.();
          openDropdown();
          event.preventDefault();
          break;
        }
        case KeyCode.up: {
          onPressArrowUp?.();
          openDropdown();
          event.preventDefault();
          break;
        }
        case KeyCode.enter: {
          if (isComposing()) {
            event.preventDefault();
            return;
          }

          if (open) {
            if (!onPressEnter?.()) {
              closeDropdown();
            }
            event.preventDefault();
          } else if (isTokenMode && value) {
            addToken(value.trim());
            event.preventDefault();
          }
          fireKeydown(event);
          break;
        }
        case KeyCode.backspace: {
          if (isTokenMode && !readOnly && !disabled && value === '' && tokenList.length > 0) {
            inlineTokensRef.current?.focusLast();
            event.preventDefault();
          }
          fireKeydown(event);
          break;
        }
        case KeyCode.escape: {
          // Use shared ESC handler, without focus restoration since ESC came from input
          handleEscapeKey(false);
          if (open || value) {
            event.stopPropagation();
          }
          event.preventDefault();
          fireKeydown(event);
          break;
        }
        default: {
          fireKeydown(event);
        }
      }
    };

    const handleChange = (value: string) => {
      openDropdown();
      fireNonCancelableEvent(onChange, isTokenMode ? { value, tokens: tokenList } : { value });
    };

    const handleDelayedInput = (value: string) => {
      fireNonCancelableEvent(onDelayedInput, { value });
    };

    const handleDropdownMouseDown: React.MouseEventHandler = event => {
      // Prevent currently focused element from losing focus.
      if (!dropdownContentFocusable) {
        event.preventDefault();
      }
      // Prevent closing dropdown on click inside.
      else {
        preventCloseOnBlurRef.current = true;
        requestAnimationFrame(() => {
          preventCloseOnBlurRef.current = false;
        });
      }
    };

    const expanded = open && dropdownExpanded;
    const nativeAttributes: BaseInputProps['nativeInputAttributes'] = {
      name,
      placeholder,
      autoFocus,
      onClick: openDropdown,
      role: 'combobox',
      'aria-autocomplete': 'list',
      'aria-expanded': expanded,
      'aria-controls': open ? ariaControls : undefined,
      // 'aria-owns' needed for safari+vo to announce activedescendant content
      'aria-owns': open ? ariaControls : undefined,
      'aria-label': ariaLabel,
      'aria-activedescendant': ariaActivedescendant,
      ...(isTokenMode && formFieldContext.invalid ? { 'aria-invalid': 'true' as const } : {}),
    };

    // Closes dropdown when outside click is detected.
    // Similar to the internal dropdown implementation but includes the target as well.
    useEffect(() => {
      if (!open) {
        return;
      }

      const clickListener = (event: MouseEvent) => {
        if (
          !nodeBelongs(inputContainerRef.current, event.target) &&
          !nodeBelongs(dropdownContentRef.current, event.target) &&
          !nodeBelongs(dropdownFooterRef.current, event.target) &&
          !nodeBelongs(fieldRef.current, event.target)
        ) {
          closeDropdown();
        }
      };

      window.addEventListener('mousedown', clickListener);

      return () => {
        window.removeEventListener('mousedown', clickListener);
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleDropdownKeyDown: React.KeyboardEventHandler = event => {
      // Handle ESC key from focusable elements inside the dropdown (e.g., recovery button)
      // but NOT from the input itself (that's handled by handleKeyDown)
      const isFromInput = event.target === inputRef.current || nodeBelongs(inputRef.current, event.target);

      if (event.key === 'Escape' && !isFromInput) {
        event.stopPropagation();
        event.preventDefault();
        // Use shared ESC handler with focus restoration since ESC came from dropdown element
        handleEscapeKey(true);
      }
    };

    const sharedInputProps = {
      value,
      onChange: (event: { detail: BaseChangeDetail }) => handleChange(event.detail.value),
      __onDelayedInput: (event: { detail: BaseChangeDetail }) => handleDelayedInput(event.detail.value),
      onKeyDown: handleKeyDown,
      onKeyUp,
      disabled,
      disableBrowserAutocorrect,
      readOnly,
      ariaRequired,
      clearAriaLabel,
      ref: inputRef,
      __internalRootRef: inputContainerRef,
      autoComplete: false,
      nativeInputAttributes: processAttributes(nativeAttributes, 'Autosuggest', nativeInputAttributes),
      __skipNativeAttributesWarnings: Object.keys(nativeAttributes),
    };

    const tokenField = isTokenMode && (
      <div
        ref={mergedFieldRef}
        className={clsx(
          styles['token-field'],
          formFieldContext.invalid && styles['token-field-invalid'],
          formFieldContext.warning && !formFieldContext.invalid && styles['token-field-warning'],
          disabled && styles['token-field-disabled'],
          readOnly && !disabled && styles['token-field-readonly'],
          getGroupedControlClassNames(styles, groupedControlProps)
        )}
        style={getInputStylesCss(style)}
      >
        <span ref={leadingIconRef} className={styles['token-field-icon']}>
          <InternalIcon name="search" variant={disabled ? 'disabled' : 'subtle'} />
        </span>
        {tokenList.length > 0 && (
          <InlineTokens
            ref={inlineTokensRef}
            tokens={tokenList}
            visibleCount={visibleCount}
            disabled={disabled}
            readOnly={readOnly}
            expandToViewport={expandToViewport}
            overflowOpen={tokensOverflowOpen}
            tokenDismissLabel={tokenDismissLabel}
            tokenOverflowAriaLabel={tokenOverflowAriaLabel}
            onOverflowOpenChange={isOpen => {
              if (isOpen) {
                closeDropdown();
              }
              setTokensOverflowOpen(isOpen);
            }}
            onDismiss={removeToken}
            onFocusEnter={() => (preventOpenOnFocusRef.current = true)}
            onNavigateToInput={() => {
              setTokensOverflowOpen(false);
              inputRef.current?.focus();
            }}
          />
        )}
        <div ref={inputWrapperRef} className={styles['token-input-wrapper']}>
          <InternalInput
            type="text"
            {...sharedInputProps}
            __noBorder={true}
            {...(!disabled && !readOnly && value
              ? {
                  __endIcon: 'close' as const,
                  __onEndIconClick: () => {
                    inputRef.current?.focus();
                    clearValue();
                  },
                }
              : {})}
            {...formFieldContext}
            invalid={false}
            warning={false}
          />
        </div>
      </div>
    );

    const dropdown = (
      <InternalDropdown
        minWidth={getDropdownMinWidth({ expandToViewport, triggerWidth, dropdownWidth })}
        maxWidth={getBreakpointValue('xxs')} // AWSUI-19898
        contentKey={dropdownContentKey}
        onFocus={handleFocus}
        onBlur={handleBlur}
        trigger={
          tokenField || <InternalInput type="visualSearch" {...sharedInputProps} style={style} {...formFieldContext} />
        }
        onMouseDown={handleDropdownMouseDown}
        open={open && (!!dropdownContent || !!dropdownFooter)}
        footer={
          dropdownFooterRef && (
            <div ref={dropdownFooterRef} className={styles['dropdown-footer']} onKeyDown={handleDropdownKeyDown}>
              <ResetGroupedControlContext>{open && dropdownFooter ? dropdownFooter : null}</ResetGroupedControlContext>
            </div>
          )
        }
        expandToViewport={expandToViewport}
        loopFocus={loopFocus}
        content={
          open && dropdownContent ? (
            <div ref={dropdownContentRef} className={styles['dropdown-content']}>
              <ResetGroupedControlContext>{dropdownContent}</ResetGroupedControlContext>
            </div>
          ) : null
        }
      />
    );

    return (
      <div
        {...baseProps}
        className={clsx(baseProps.className, styles.root)}
        ref={__internalRootRef}
        {...(isTokenMode && {
          role: 'group',
          'aria-label': formFieldContext.ariaLabelledby ? undefined : ariaLabel,
          'aria-labelledby': formFieldContext.ariaLabelledby,
        })}
      >
        {isTokenMode ? (
          <>
            <InternalLiveRegion tagName="span" hidden={true} assertive={true} delay={1}>
              {announcement}
            </InternalLiveRegion>
            <div ref={measureRef} className={styles['measurement-container']}>
              {tokenList.map((token, index) => (
                <span key={index} className={styles['measurement-token']}>
                  <InternalToken label={token.value} icon={token.icon} variant="inline" onDismiss={() => {}} />
                </span>
              ))}
              <ButtonTrigger ref={measureTriggerRef} compact={true} tabIndex={-1} ariaHasPopup={false}>
                {`+${tokenList.length}`}
              </ButtonTrigger>
            </div>
            <div ref={containerRef} className={styles['token-field-container']}>
              {dropdown}
            </div>
          </>
        ) : (
          dropdown
        )}
      </div>
    );
  }
);

export default AutosuggestInput;
