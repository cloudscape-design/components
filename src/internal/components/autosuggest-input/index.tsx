// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

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
import InternalToken from '../../../token/internal';
import { BaseComponentProps } from '../../../types/base-component';
import { BaseKeyDetail, NonCancelableEventHandler } from '../../../types/events';
import { FormFieldValidationControlProps } from '../../../types/form-field';
import { getBaseProps } from '../../base-component';
import { getBreakpointValue } from '../../breakpoints';
import { useFormFieldContext } from '../../context/form-field-context';
import { fireCancelableEvent, fireNonCancelableEvent } from '../../events';
import { InternalBaseComponentProps } from '../../hooks/use-base-component';
import { useIMEComposition } from '../../hooks/use-ime-composition';
import { KeyCode, KeyCodeDelete } from '../../keycode';
import { getDropdownMinWidth } from '../../utils/get-dropdown-min-width';
import { nodeBelongs } from '../../utils/node-belongs';
import { processAttributes } from '../../utils/with-native-attributes';

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
  // mode="tokens"
  tokens?: ReadonlyArray<AutosuggestProps.Token>;
  onTokensChange?: NonCancelableEventHandler<AutosuggestProps.TokensChangeDetail>;
  tokenVariant?: AutosuggestProps.TokenVariant;
}

interface AutosuggestInputFocusOptions {
  preventDropdown?: boolean;
}

export interface AutosuggestInputRef extends AutosuggestProps.Ref {
  focus(options?: AutosuggestInputFocusOptions): void;
  open(): void;
  close(): void;
}

// ---------------------------------------------------------------------------
// OverflowDropdown — focus-managed portal for hidden tokens
// ---------------------------------------------------------------------------
function OverflowDropdown({
  tokens,
  triggerRef,
  panelRef,
  label,
  tokenVariant,
  onDismiss,
  onClose,
}: {
  tokens: ReadonlyArray<AutosuggestProps.Token>;
  triggerRef: React.RefObject<HTMLButtonElement>;
  panelRef: React.RefObject<HTMLDivElement>;
  label: string;
  tokenVariant: AutosuggestProps.TokenVariant;
  onDismiss: (index: number) => void;
  onClose: () => void;
}) {
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!triggerRef.current) {
      return;
    }
    const rect = triggerRef.current.getBoundingClientRect();
    setPanelStyle({ position: 'fixed', top: rect.bottom + 4, left: rect.left, zIndex: 9000 });
  }, [triggerRef]);

  useEffect(() => {
    const first = panelRef.current?.querySelector<HTMLElement>('button');
    first?.focus();
  }, [panelRef]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.keyCode === KeyCode.escape) {
        e.stopPropagation();
        onClose();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey, true);
    return () => document.removeEventListener('keydown', handleKey, true);
  }, [onClose, triggerRef]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose, panelRef, triggerRef]);

  return ReactDOM.createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-label={label}
      aria-modal="true"
      onMouseDown={e => e.preventDefault()} // prevent input blur when clicking in the panel
      style={{
        ...panelStyle,
        background: 'var(--color-background-container-content, #fff)',
        border: '1px solid var(--color-border-container-divider, #aab7b8)',
        borderRadius: 8,
        boxShadow: '0 4px 20px rgba(0,0,0,.15)',
        padding: 12,
        minWidth: 160,
        maxWidth: 320,
      }}
    >
      <ul
        role="list"
        style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        {tokens.map((token, i) => (
          <li key={i} role="listitem">
            <InternalToken
              label={token.label}
              dismissLabel={token.dismissLabel ?? token.label}
              variant={tokenVariant}
              onDismiss={() => onDismiss(i)}
            />
          </li>
        ))}
      </ul>
    </div>,
    document.body
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
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
      onTokensChange,
      tokenVariant = 'inline',
      __internalRootRef,
      ...restProps
    }: AutosuggestInputProps,
    ref: Ref<AutosuggestInputRef>
  ) => {
    const isTokenMode = !!tokens;
    const tokenList = tokens ?? [];

    const baseProps = getBaseProps(restProps);
    const formFieldContext = useFormFieldContext(restProps);
    const { invalid, warning } = formFieldContext;

    const inputRef = useRef<HTMLInputElement>(null);
    const triggerRowRef = useRef<HTMLDivElement>(null);
    const tokenListRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const overflowPillRef = useRef<HTMLButtonElement>(null);
    const overflowPanelRef = useRef<HTMLDivElement>(null);
    const dropdownContentRef = useRef<HTMLDivElement>(null);
    const dropdownFooterRef = useRef<HTMLDivElement>(null);
    const preventOpenOnFocusRef = useRef(false);
    const preventCloseOnBlurRef = useRef(false);

    // Index of the token that currently has keyboard focus (-1 = none)
    const [focusedTokenIndex, setFocusedTokenIndex] = useState(-1);
    const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
    const [visibleCount, setVisibleCount] = useState<number | undefined>(undefined);
    const [tokenListMaxWidth, setTokenListMaxWidth] = useState<number | undefined>(undefined);
    const [, setMeasuredWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [overflowOpen, setOverflowOpen] = useState(false);
    const [open, setOpen] = useState(false);

    // ---------------------------------------------------------------------------
    // Dropdown width measurement
    // ---------------------------------------------------------------------------
    useResizeObserver(
      () => (isTokenMode ? triggerRowRef.current : inputRef.current),
      entry => entry.borderBoxWidth > 0 && setTriggerWidth(entry.borderBoxWidth)
    );

    // Track the true available width of the token field container (FormField-constrained)
    useResizeObserver(
      () => (isTokenMode ? containerRef.current : null),
      entry => entry.borderBoxWidth > 0 && setMeasuredWidth(entry.borderBoxWidth)
    );

    // ---------------------------------------------------------------------------
    // Token overflow measurement — newest tokens visible, oldest collapse to +N
    // Budget: containerWidth - padding - icon - (20% reserved for input)
    // ---------------------------------------------------------------------------
    useLayoutEffect(() => {
      if (!isTokenMode || !measureRef.current || !containerRef.current) {
        return;
      }
      // Read trigger width synchronously via offsetWidth — always accurate in useLayoutEffect
      // since React has already committed the DOM. triggerRowRef points to the .token-trigger div.
      const containerWidth = containerRef.current?.offsetWidth ?? 0;
      if (containerWidth <= 0) {
        return;
      }

      const tokenEls = Array.from(measureRef.current.querySelectorAll<HTMLElement>('[data-measure-token]'));
      if (tokenEls.length === 0) {
        setVisibleCount(0);
        return;
      }

      const pillEl = measureRef.current.querySelector<HTMLElement>('[data-measure-pill]');
      const pillWidth = pillEl?.offsetWidth ?? 0;
      const gap = 4; // $space-xxs
      const iconWidth = 16; // search icon (~20px) + gap before first token
      const inputMinWidth = Math.floor(containerWidth * 0.2); // 20% hard floor, matches CSS min-inline-size: 20%
      const padding = 24; // $control-padding-horizontal * 2 (left + right)

      const tokenWidths = tokenEls.map(el => el.offsetWidth);
      const totalAll = tokenWidths.reduce((s, w) => s + w, 0) + gap * Math.max(tokenWidths.length - 1, 0);
      // Available space for tokens when the input holds its 20% minimum
      const budget = containerWidth - padding - iconWidth - inputMinWidth - pillWidth - gap - gap;

      if (totalAll <= budget) {
        // All tokens fit without a pill
        setVisibleCount(tokenList.length);
        setTokenListMaxWidth(undefined);
        return;
      }

      // Tokens overflow — reserve pill width and find how many fit from the END (newest visible)
      let used = 0;
      let count = 0;
      for (let i = tokenWidths.length - 1; i >= 0; i--) {
        const g = gap;
        if (used + g + tokenWidths[i] > budget) {
          break;
        }
        used += g + tokenWidths[i];
        count++;
      }
      setVisibleCount(count);
      // Cap token list width so it can't push the pill out of the flex row
      setTokenListMaxWidth(budget);
    }, [isTokenMode, tokenList.length]);
    // No deps — runs after every render. setVisibleCount/setTokenListMaxWidth only fire
    // when values change so there's no infinite loop.

    // ---------------------------------------------------------------------------
    // Dropdown open/close
    // ---------------------------------------------------------------------------
    const openDropdown = () => !readOnly && setOpen(true);
    const closeDropdown = () => {
      setOpen(false);
      fireNonCancelableEvent(onCloseDropdown, null);
    };

    const { isComposing } = useIMEComposition(inputRef);

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
    }));

    // ---------------------------------------------------------------------------
    // Token helpers
    // ---------------------------------------------------------------------------
    const addToken = (label: string) => {
      if (!label.trim()) {
        return;
      }
      const updated = [...tokenList, { label: label.trim(), dismissLabel: label.trim() }];
      fireNonCancelableEvent(onTokensChange, { tokens: updated });
      fireNonCancelableEvent(onChange, { value: '' });
    };

    const removeToken = (index: number) => {
      preventOpenOnFocusRef.current = true; // prevent autosuggest dropdown opening when focus returns to input
      const updated = tokenList.filter((_, i) => i !== index);
      fireNonCancelableEvent(onTokensChange, { tokens: updated });
      // Focus: move to previous token, or back to input if none left
      if (updated.length === 0) {
        setFocusedTokenIndex(-1);
        inputRef.current?.focus();
      } else {
        const nextFocus = Math.min(index, updated.length - 1);
        setFocusedTokenIndex(nextFocus);
      }
    };

    // Visible tokens: last `visibleCount` items (newest first, oldest collapsed)
    const effectiveVisible = visibleCount === undefined ? tokenList.length : visibleCount;
    const visibleTokens = tokenList.slice(tokenList.length - effectiveVisible);
    const hiddenTokens = tokenList.slice(0, tokenList.length - effectiveVisible);
    const hiddenStartIndex = 0; // hidden tokens are always the older ones (index 0..N)

    // ---------------------------------------------------------------------------
    // Keyboard
    // ---------------------------------------------------------------------------
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

    const handleEscapeKey = (returnFocus: boolean) => {
      if (open) {
        closeDropdown();
        if (returnFocus) {
          inputRef.current?.focus();
        }
      } else if (value) {
        fireNonCancelableEvent(onChange, { value: '' });
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
            const selected = onPressEnter?.();
            if (!selected) {
              closeDropdown();
              // In token mode, add the typed value when no dropdown option was selected
              if (isTokenMode && value) {
                addToken(value);
              }
            }
            event.preventDefault();
          } else if (isTokenMode && value) {
            // Add token on Enter when dropdown is closed
            addToken(value);
            event.preventDefault();
          }
          fireKeydown(event);
          break;
        }
        case KeyCode.backspace: {
          if (isTokenMode && value === '' && tokenList.length > 0) {
            // Backspace on empty input: focus the last visible token
            setFocusedTokenIndex(tokenList.length - 1);
            event.preventDefault();
          }
          fireKeydown(event);
          break;
        }
        case KeyCode.escape: {
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

    const handleChange = (val: string) => {
      openDropdown();
      fireNonCancelableEvent(onChange, { value: val });
    };

    const handleDelayedInput = (val: string) => {
      fireNonCancelableEvent(onDelayedInput, { value: val });
    };

    const handleDropdownMouseDown: React.MouseEventHandler = event => {
      if (!dropdownContentFocusable) {
        event.preventDefault();
      } else {
        preventCloseOnBlurRef.current = true;
        requestAnimationFrame(() => {
          preventCloseOnBlurRef.current = false;
        });
      }
    };

    // Outside click closes dropdown
    useEffect(() => {
      if (!open) {
        return;
      }
      const clickListener = (event: MouseEvent) => {
        if (
          !nodeBelongs(inputRef.current, event.target) &&
          !nodeBelongs(dropdownContentRef.current, event.target) &&
          !nodeBelongs(dropdownFooterRef.current, event.target) &&
          !nodeBelongs(triggerRowRef.current, event.target) &&
          !nodeBelongs(overflowPanelRef.current, event.target)
        ) {
          closeDropdown();
        }
      };
      window.addEventListener('mousedown', clickListener);
      return () => window.removeEventListener('mousedown', clickListener);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleDropdownKeyDown: React.KeyboardEventHandler = event => {
      const isFromInput = event.target === inputRef.current || nodeBelongs(inputRef.current, event.target);
      if (event.key === 'Escape' && !isFromInput) {
        event.stopPropagation();
        event.preventDefault();
        handleEscapeKey(true);
      }
    };

    // Focus the dismiss button of the token at focusedTokenIndex.
    // Only fires when focusedTokenIndex changes — NOT when tokenList.length changes —
    // so adding a token (which changes tokenList.length) never steals focus away from
    // the input. Only removeToken explicitly calls setFocusedTokenIndex with a new value.

    useEffect(() => {
      if (focusedTokenIndex < 0) {
        return;
      }
      const visibleStart = tokenList.length - effectiveVisible;
      const positionInVisible = focusedTokenIndex - visibleStart;
      if (positionInVisible < 0) {
        // Token is hidden in overflow — can't focus directly, just focus input
        inputRef.current?.focus();
        return;
      }
      // Find all dismiss buttons in the visible token list
      const dismissButtons = tokenListRef.current?.querySelectorAll<HTMLButtonElement>('button');
      if (dismissButtons && dismissButtons[positionInVisible]) {
        dismissButtons[positionInVisible].focus();
      }
    }, [effectiveVisible, focusedTokenIndex, tokenList.length]); // intentionally excludes tokenList.length — see comment above

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
      'aria-owns': open ? ariaControls : undefined,
      'aria-label': ariaLabel,
      'aria-activedescendant': ariaActivedescendant,
    };

    // ---------------------------------------------------------------------------
    // Render: default mode (no tokens)
    // ---------------------------------------------------------------------------
    if (!isTokenMode) {
      return (
        <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
          <InternalDropdown
            minWidth={getDropdownMinWidth({ expandToViewport, triggerWidth, dropdownWidth })}
            maxWidth={getBreakpointValue('xxs')}
            contentKey={dropdownContentKey}
            onFocus={handleFocus}
            onBlur={handleBlur}
            trigger={
              <InternalInput
                type="visualSearch"
                value={value}
                onChange={event => handleChange(event.detail.value)}
                __onDelayedInput={event => handleDelayedInput(event.detail.value)}
                onKeyDown={handleKeyDown}
                onKeyUp={onKeyUp}
                disabled={disabled}
                disableBrowserAutocorrect={disableBrowserAutocorrect}
                readOnly={readOnly}
                ariaRequired={ariaRequired}
                clearAriaLabel={clearAriaLabel}
                ref={inputRef}
                autoComplete={false}
                nativeInputAttributes={processAttributes(nativeAttributes, nativeInputAttributes, 'Autosuggest')}
                __skipNativeAttributesWarnings={Object.keys(nativeAttributes)}
                style={style}
                {...formFieldContext}
              />
            }
            onMouseDown={handleDropdownMouseDown}
            open={open && (!!dropdownContent || !!dropdownFooter)}
            footer={
              dropdownFooterRef && (
                <div ref={dropdownFooterRef} className={styles['dropdown-footer']} onKeyDown={handleDropdownKeyDown}>
                  {open && dropdownFooter ? dropdownFooter : null}
                </div>
              )
            }
            expandToViewport={expandToViewport}
            loopFocus={loopFocus}
            content={
              open && dropdownContent ? (
                <div ref={dropdownContentRef} className={styles['dropdown-content']}>
                  {dropdownContent}
                </div>
              ) : null
            }
          />
        </div>
      );
    }

    // ---------------------------------------------------------------------------
    // Render: mode="tokens" — single bordered row with token pills + input
    // ---------------------------------------------------------------------------
    return (
      <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
        {/* Off-screen measurement div — sibling of InternalDropdown so it is never shared
            across instances. Inherits font/token styles via the root class. */}
        {isTokenMode && (
          <div
            ref={measureRef}
            style={{
              position: 'fixed',
              top: -9999,
              left: 0,
              visibility: 'hidden',
              pointerEvents: 'none',
              display: 'flex',
              flexWrap: 'nowrap',
              gap: 4,
            }}
            aria-hidden="true"
          >
            {tokenList.map((token, i) => (
              <span key={`measure-${i}`} data-measure-token="true" style={{ display: 'inline-flex', flexShrink: 0 }}>
                <InternalToken label={token.label} variant={tokenVariant} onDismiss={() => undefined} />
              </span>
            ))}
            {/* Pill measurement — render with a representative count so width is accurate */}
            <button
              data-measure-pill="true"
              className={styles['token-overflow-pill']}
              style={{ visibility: 'hidden', pointerEvents: 'none' }}
              tabIndex={-1}
              aria-hidden="true"
            >
              {`+${Math.max(tokenList.length, 1)}`}
            </button>
          </div>
        )}
        <div ref={containerRef} style={{ inlineSize: '100%' }}>
          <InternalDropdown
            minWidth={getDropdownMinWidth({ expandToViewport, triggerWidth, dropdownWidth })}
            maxWidth={getBreakpointValue('xxs')}
            contentKey={dropdownContentKey}
            onFocus={handleFocus}
            onBlur={handleBlur}
            trigger={
              <div
                ref={triggerRowRef}
                className={clsx(
                  styles['token-trigger'],
                  invalid && styles['token-trigger-invalid'],
                  warning && !invalid && styles['token-trigger-warning'],
                  disabled && styles['token-trigger-disabled'],
                  readOnly && !disabled && styles['token-trigger-readonly']
                )}
              >
                {/* Search icon — rendered first, before tokens */}
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    color: 'var(--color-text-input-placeholder, #687078)',
                  }}
                >
                  <InternalIcon name="search" variant={disabled ? 'disabled' : 'subtle'} />
                </span>

                {/* Visible token list — newest tokens at right, older collapsed to +N */}
                {visibleTokens.length > 0 && (
                  <div
                    ref={tokenListRef}
                    className={styles['token-list']}
                    style={tokenListMaxWidth !== undefined ? { maxInlineSize: tokenListMaxWidth } : undefined}
                  >
                    {visibleTokens.map((token, i) => {
                      const realIndex = tokenList.length - effectiveVisible + i;
                      return (
                        <span
                          key={realIndex}
                          onKeyDown={(e: React.KeyboardEvent) => {
                            if (e.keyCode === KeyCode.backspace || e.keyCode === KeyCodeDelete) {
                              e.preventDefault();
                              removeToken(realIndex);
                            } else if (e.keyCode === KeyCode.left) {
                              e.preventDefault();
                              if (realIndex > 0) {
                                setFocusedTokenIndex(realIndex - 1);
                              }
                            } else if (e.keyCode === KeyCode.right) {
                              e.preventDefault();
                              if (realIndex < tokenList.length - 1) {
                                setFocusedTokenIndex(realIndex + 1);
                              } else {
                                inputRef.current?.focus();
                              }
                            }
                          }}
                        >
                          <InternalToken
                            label={token.label}
                            dismissLabel={token.dismissLabel ?? token.label}
                            variant={tokenVariant}
                            disabled={disabled}
                            readOnly={readOnly}
                            onDismiss={() => removeToken(realIndex)}
                          />
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* +N overflow pill */}
                {hiddenTokens.length > 0 && (
                  <>
                    <button
                      ref={overflowPillRef}
                      type="button"
                      className={styles['token-overflow-pill']}
                      aria-haspopup="dialog"
                      aria-expanded={overflowOpen}
                      aria-label={`${hiddenTokens.length} more tokens`}
                      onClick={() => setOverflowOpen(v => !v)}
                    >
                      {`+${hiddenTokens.length}`}
                    </button>
                    {overflowOpen && (
                      <OverflowDropdown
                        tokens={hiddenTokens}
                        triggerRef={overflowPillRef}
                        panelRef={overflowPanelRef}
                        label={`${hiddenTokens.length} more tokens`}
                        tokenVariant={tokenVariant}
                        onDismiss={i => {
                          removeToken(hiddenStartIndex + i);
                        }}
                        onClose={() => {
                          setOverflowOpen(false);
                          overflowPillRef.current?.focus();
                        }}
                      />
                    )}
                  </>
                )}

                {/* Borderless input — flex:1 fills remaining space; min-inline-size:20% is a hard CSS floor */}
                <div style={{ flex: '1 1 0', minInlineSize: '20%', overflow: 'hidden' }}>
                  <InternalInput
                    type="text"
                    value={value}
                    onChange={event => handleChange(event.detail.value)}
                    __onDelayedInput={event => handleDelayedInput(event.detail.value)}
                    onKeyDown={handleKeyDown}
                    onKeyUp={onKeyUp}
                    disabled={disabled}
                    disableBrowserAutocorrect={disableBrowserAutocorrect}
                    readOnly={readOnly}
                    ariaRequired={ariaRequired}
                    clearAriaLabel={clearAriaLabel}
                    ref={inputRef}
                    autoComplete={false}
                    nativeInputAttributes={processAttributes(nativeAttributes, nativeInputAttributes, 'Autosuggest')}
                    __skipNativeAttributesWarnings={Object.keys(nativeAttributes)}
                    style={{
                      root: {
                        borderColor: {
                          default: 'transparent',
                          focus: 'transparent',
                          hover: 'transparent',
                          disabled: 'transparent',
                          readonly: 'transparent',
                        },
                        boxShadow: {
                          default: 'none',
                          focus: 'none',
                          hover: 'none',
                          disabled: 'none',
                          readonly: 'none',
                        },
                        backgroundColor: {
                          default: 'transparent',
                          focus: 'transparent',
                          hover: 'transparent',
                          disabled: 'transparent',
                          readonly: 'transparent',
                        },
                      },
                    }}
                    {...{ ...formFieldContext, invalid: false, warning: false }}
                  />
                </div>
              </div>
            }
            onMouseDown={handleDropdownMouseDown}
            open={open && (!!dropdownContent || !!dropdownFooter)}
            footer={
              dropdownFooterRef && (
                <div ref={dropdownFooterRef} className={styles['dropdown-footer']} onKeyDown={handleDropdownKeyDown}>
                  {open && dropdownFooter ? dropdownFooter : null}
                </div>
              )
            }
            expandToViewport={expandToViewport}
            loopFocus={loopFocus}
            content={
              open && dropdownContent ? (
                <div ref={dropdownContentRef} className={styles['dropdown-content']}>
                  {dropdownContent}
                </div>
              ) : null
            }
          />
        </div>
      </div>
    );
  }
);

export default AutosuggestInput;
