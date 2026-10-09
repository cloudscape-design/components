// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { isThemeActive, Theme, useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

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
import { KeyCode, KeyCodeDelete } from '../../keycode';
import { getDropdownMinWidth } from '../../utils/get-dropdown-min-width';
import { nodeBelongs } from '../../utils/node-belongs';
import { processAttributes } from '../../utils/with-native-attributes';
import { getGroupedControlClassNames } from '../control-group/grouped-control-styles';
import { OverflowDropdown } from './overflow-dropdown';
import { useTokenListFocus } from './use-token-list-focus';
import { useTokenOverflow } from './use-token-overflow';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

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
  tokenInsertedAriaLabel?: string;
  tokenDismissLabel?: (value: string) => string;
}

interface AutosuggestInputFocusOptions {
  preventDropdown?: boolean;
}

export interface AutosuggestInputRef extends AutosuggestProps.Ref {
  focus(options?: AutosuggestInputFocusOptions): void;
  open(): void;
  close(): void;
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
      tokenInsertedAriaLabel,
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
    const { invalid, warning, ariaLabelledby } = formFieldContext;
    const groupedControlProps = useGroupedControlContext();

    const inputRef = useRef<HTMLInputElement>(null);
    const triggerRowRef = useRef<HTMLDivElement>(null);
    const tokenListRef = useRef<HTMLUListElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const overflowPillRef = useRef<HTMLButtonElement>(null);
    const dropdownContentRef = useRef<HTMLDivElement>(null);
    const dropdownFooterRef = useRef<HTMLDivElement>(null);
    const preventOpenOnFocusRef = useRef(false);
    const preventCloseOnBlurRef = useRef(false);

    const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
    const [tokensOverflowOpen, setTokensOverflowOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [focusFirstVisibleAfterOverflow, setFocusFirstVisibleAfterOverflow] = useState(false);

    const tokenContentKey = tokenList.map(t => `${t.value}::${t.icon ?? ''}`).join('|');

    const { containerRef, visibleCount, tokenListMaxWidth } = useTokenOverflow(
      measureRef,
      triggerRowRef,
      tokenList.length,
      tokenContentKey,
      isTokenMode
    );

    useResizeObserver(
      () => (isTokenMode ? triggerRowRef.current : inputRef.current),
      entry => entry.borderBoxWidth > 0 && setTriggerWidth(entry.borderBoxWidth)
    );

    // No dependency array: runs after every render to keep tabIndex in sync with the
    // current DOM state. A deps array would cause a frame of stale tabIndex values
    // after token additions/removals before the next re-render syncs it.
    useLayoutEffect(() => {
      if (!isTokenMode || !tokenListRef.current) {
        return;
      }
      const dismissButtons = tokenListRef.current.querySelectorAll<HTMLButtonElement>('[data-token-item] button');
      dismissButtons.forEach((btn, idx) => {
        btn.tabIndex = !disabled && idx === 0 && hiddenTokens.length === 0 ? 0 : -1;
      });
    });

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

    const addToken = (label: string) => {
      if (!label.trim()) {
        return;
      }
      const updated = [...tokenList, { value: label.trim() }];
      fireNonCancelableEvent(onChange, { value: '', tokens: updated });
    };

    const removeToken = (index: number, suppressFocus = false) => {
      preventOpenOnFocusRef.current = true;
      const updated = tokenList.filter((_, i) => i !== index);
      fireNonCancelableEvent(onChange, { value, tokens: updated });
      if (suppressFocus) {
        return;
      }
      if (updated.length === 0) {
        inputRef.current?.focus();
      } else {
        const preRemovalVisibleStart = tokenList.length - effectiveVisible;
        const targetSlot = index - preRemovalVisibleStart;
        requestAnimationFrame(() => {
          const dismissButtons = tokenListRef.current?.querySelectorAll<HTMLButtonElement>('[data-token-item] button');
          if (!dismissButtons || dismissButtons.length === 0) {
            inputRef.current?.focus();
            return;
          }
          const positionInVisible = Math.max(0, Math.min(targetSlot, dismissButtons.length - 1));
          dismissButtons[positionInVisible].focus();
        });
      }
    };

    const effectiveVisible = visibleCount === undefined ? tokenList.length : visibleCount;
    const visibleTokens = tokenList.slice(tokenList.length - effectiveVisible);
    const hiddenTokens = tokenList.slice(0, tokenList.length - effectiveVisible);

    useEffect(() => {
      if (focusFirstVisibleAfterOverflow && hiddenTokens.length === 0) {
        setFocusFirstVisibleAfterOverflow(false);
        const buttons = tokenListRef.current?.querySelectorAll<HTMLButtonElement>('[data-token-item] button');
        if (buttons && buttons.length > 0) {
          buttons[0].focus();
        } else {
          inputRef.current?.focus();
        }
      }
    }, [focusFirstVisibleAfterOverflow, hiddenTokens.length]);

    useEffect(() => {
      if (hiddenTokens.length === 0 && tokensOverflowOpen) {
        setTokensOverflowOpen(false);
      }
    }, [hiddenTokens.length, tokensOverflowOpen]);

    const { focusTokenAtIndex } = useTokenListFocus({
      tokenListRef,
      inputRef,
      tokenListLength: tokenList.length,
      effectiveVisible,
    });

    const handleBlur = () => {
      if (!preventCloseOnBlurRef.current) {
        closeDropdown();
        fireNonCancelableEvent(onBlur, null);
      }
    };

    const handleFocus = () => {
      if (!preventOpenOnFocusRef.current && !tokensOverflowOpen) {
        openDropdown();
        fireNonCancelableEvent(onFocus, null);
      }
      preventOpenOnFocusRef.current = false;
    };

    const fireKeydown = (event: CustomEvent<BaseKeyDetail>) => fireCancelableEvent(onKeyDown, event.detail, event);

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
        fireNonCancelableEvent(onChange, isTokenMode ? { value: '', tokens: tokenList } : { value: '' });
      }
    };

    const handleKeyDown = (event: CustomEvent<BaseKeyDetail>) => {
      switch (event.detail.keyCode) {
        case KeyCode.down: {
          if (tokensOverflowOpen) {
            break;
          }
          onPressArrowDown?.();
          openDropdown();
          event.preventDefault();
          break;
        }
        case KeyCode.up: {
          if (tokensOverflowOpen) {
            break;
          }
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
            addToken(value);
            event.preventDefault();
          }
          fireKeydown(event);
          break;
        }
        case KeyCode.backspace: {
          if (!readOnly && !disabled && isTokenMode && value === '' && tokenList.length > 0) {
            if (effectiveVisible === 0) {
              overflowPillRef.current?.focus();
            } else {
              focusTokenAtIndex(tokenList.length - 1);
            }
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

    const handleChange = (val: string) => {
      openDropdown();
      fireNonCancelableEvent(onChange, isTokenMode ? { value: val, tokens: tokenList } : { value: val });
    };

    const handleDelayedInput = (val: string) => {
      fireNonCancelableEvent(onDelayedInput, { value: val });
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

    // Closes dropdown when outside click is detected.
    // Similar to the internal dropdown implementation but includes the target as well.
    useEffect(() => {
      if (!open) {
        return;
      }
      const clickListener = (event: MouseEvent) => {
        if (
          !nodeBelongs(inputRef.current, event.target) &&
          !nodeBelongs(dropdownContentRef.current, event.target) &&
          !nodeBelongs(dropdownFooterRef.current, event.target) &&
          !nodeBelongs(triggerRowRef.current, event.target)
        ) {
          closeDropdown();
        }
      };
      window.addEventListener('mousedown', clickListener);
      return () => window.removeEventListener('mousedown', clickListener);
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

    const expanded = open && dropdownExpanded;
    const pillIconName = isThemeActive(Theme.OneTheme) ? 'angle-down' : 'caret-down-filled';
    const pillIconSize = isThemeActive(Theme.OneTheme) ? 'x-small' : 'normal';
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

    const renderDropdownShell = (trigger: React.ReactNode, wrapContent = false) => (
      <InternalDropdown
        minWidth={getDropdownMinWidth({ expandToViewport, triggerWidth, dropdownWidth })}
        maxWidth={getBreakpointValue('xxs')}
        contentKey={dropdownContentKey}
        onFocus={handleFocus}
        onBlur={handleBlur}
        trigger={trigger}
        onMouseDown={handleDropdownMouseDown}
        open={open && (!!dropdownContent || !!dropdownFooter)}
        footer={
          dropdownFooterRef && (
            <div ref={dropdownFooterRef} className={styles['dropdown-footer']} onKeyDown={handleDropdownKeyDown}>
              {wrapContent ? (
                <ResetGroupedControlContext>
                  {open && dropdownFooter ? dropdownFooter : null}
                </ResetGroupedControlContext>
              ) : open && dropdownFooter ? (
                dropdownFooter
              ) : null}
            </div>
          )
        }
        expandToViewport={expandToViewport}
        loopFocus={loopFocus}
        content={
          open && dropdownContent ? (
            <div ref={dropdownContentRef} className={styles['dropdown-content']}>
              {wrapContent ? (
                <ResetGroupedControlContext>{dropdownContent}</ResetGroupedControlContext>
              ) : (
                dropdownContent
              )}
            </div>
          ) : null
        }
      />
    );

    if (!isTokenMode) {
      return (
        <div
          {...baseProps}
          className={clsx(baseProps.className, styles.root, testUtilStyles.root)}
          ref={__internalRootRef}
        >
          {renderDropdownShell(
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
            />,
            true
          )}
        </div>
      );
    }

    return (
      <div
        {...baseProps}
        className={clsx(baseProps.className, styles.root, testUtilStyles.root)}
        ref={__internalRootRef}
        role="group"
        aria-label={ariaLabelledby ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledby}
      >
        <InternalLiveRegion tagName="span" hidden={true} assertive={true} delay={1}>
          {tokenInsertedAriaLabel}
        </InternalLiveRegion>
        <div ref={measureRef} className={styles['measurement-container']} data-measure-container="true">
          {tokenList.map((token, i) => (
            <span key={`measure-${i}`} data-measure-token="true" style={{ display: 'inline-flex', flexShrink: 0 }}>
              <InternalToken label={token.value} icon={token.icon} variant="inline" onDismiss={() => undefined} />
            </span>
          ))}
          <button
            data-measure-pill="true"
            className={styles['token-overflow-pill']}
            style={{ visibility: 'hidden', pointerEvents: 'none' }}
          >
            {`+${Math.max(tokenList.length, 1)}`}
            <InternalIcon name={pillIconName} size={pillIconSize} />
          </button>
        </div>
        <div ref={containerRef} className={styles['token-trigger-container']}>
          {renderDropdownShell(
            <div
              ref={triggerRowRef}
              className={clsx(
                styles['token-trigger'],
                testUtilStyles['token-trigger'],
                invalid && styles['token-trigger-invalid'],
                warning && !invalid && styles['token-trigger-warning'],
                disabled && styles['token-trigger-disabled'],
                readOnly && !disabled && styles['token-trigger-readonly'],
                ...getGroupedControlClassNames(styles, groupedControlProps)
              )}
              style={style as React.CSSProperties}
            >
              <span data-search-icon="true" className={styles['search-icon']}>
                <InternalIcon name="search" variant={disabled ? 'disabled' : 'subtle'} />
              </span>

              {tokenList.length > 0 && (
                <ul
                  ref={tokenListRef}
                  className={clsx(styles['token-list'], testUtilStyles['token-list'])}
                  style={tokenListMaxWidth !== undefined ? { maxInlineSize: tokenListMaxWidth } : undefined}
                >
                  {hiddenTokens.length > 0 && (
                    <li className={clsx(styles['token-list-item'], testUtilStyles['token-list-item'])}>
                      <button
                        ref={overflowPillRef}
                        type="button"
                        tabIndex={0}
                        disabled={disabled}
                        className={clsx(styles['token-overflow-pill'], testUtilStyles['token-overflow-pill'])}
                        aria-haspopup="dialog"
                        aria-expanded={tokensOverflowOpen}
                        aria-label={tokenOverflowAriaLabel?.(hiddenTokens.length)}
                        onFocus={(e: React.FocusEvent) => {
                          const comingFromOutside =
                            !e.relatedTarget || !tokenListRef.current?.contains(e.relatedTarget as Node);
                          if (comingFromOutside) {
                            preventOpenOnFocusRef.current = true;
                          }
                        }}
                        onKeyDown={(e: React.KeyboardEvent) => {
                          if (e.keyCode === KeyCode.right) {
                            e.preventDefault();
                            const firstTokenButton =
                              tokenListRef.current?.querySelector<HTMLButtonElement>('[data-token-item] button');
                            if (firstTokenButton) {
                              firstTokenButton.focus();
                            }
                          }
                        }}
                        onClick={() => !disabled && (closeDropdown(), setTokensOverflowOpen(v => !v))}
                      >
                        {`+${hiddenTokens.length}`}
                        <span className={clsx(styles['pill-icon'], tokensOverflowOpen && styles['pill-icon-open'])}>
                          <InternalIcon name={pillIconName} size={pillIconSize} />
                        </span>
                      </button>
                    </li>
                  )}

                  {visibleTokens.map((token, i) => {
                    const realIndex = tokenList.length - effectiveVisible + i;
                    return (
                      <li
                        key={realIndex}
                        className={clsx(styles['token-list-item'], testUtilStyles['token-list-item'])}
                        data-token-item="true"
                        data-token-index={i + 1}
                        aria-setsize={tokenList.length}
                        aria-posinset={realIndex + 1}
                        onFocus={(e: React.FocusEvent) => {
                          const comingFromOutside =
                            !e.relatedTarget || !tokenListRef.current?.contains(e.relatedTarget as Node);
                          if (comingFromOutside) {
                            preventOpenOnFocusRef.current = true;
                          }
                        }}
                        onKeyDown={(e: React.KeyboardEvent) => {
                          if (e.keyCode === KeyCode.backspace || e.keyCode === KeyCodeDelete) {
                            e.preventDefault();
                            if (!readOnly && !disabled) {
                              removeToken(realIndex);
                            }
                          } else if (e.keyCode === KeyCode.left) {
                            e.preventDefault();
                            if (i === 0) {
                              if (hiddenTokens.length > 0) {
                                overflowPillRef.current?.focus();
                              }
                            } else {
                              focusTokenAtIndex(realIndex - 1);
                            }
                          } else if (e.keyCode === KeyCode.right) {
                            e.preventDefault();
                            if (realIndex < tokenList.length - 1) {
                              focusTokenAtIndex(realIndex + 1);
                            } else {
                              inputRef.current?.focus();
                            }
                          }
                        }}
                      >
                        <InternalToken
                          label={token.value}
                          dismissLabel={tokenDismissLabel ? tokenDismissLabel(token.value) : token.value}
                          icon={token.icon}
                          variant="inline"
                          disabled={disabled}
                          readOnly={readOnly}
                          onDismiss={() => removeToken(realIndex)}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}

              <div
                className={styles['token-input-wrapper']}
                style={{ flex: '1 1 0', minInlineSize: '20%', overflow: 'hidden' }}
              >
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
                  __noBorder={true}
                  {...(!disabled && !readOnly && value
                    ? {
                        __endIcon: 'close' as const,
                        __onEndIconClick: () => {
                          inputRef.current?.focus();
                          fireNonCancelableEvent(onChange, { value: '', tokens: tokenList });
                        },
                      }
                    : {})}
                  {...{ ...formFieldContext, invalid: false, warning: false }}
                />
              </div>
            </div>
          )}
          {hiddenTokens.length > 0 && (
            <OverflowDropdown
              tokens={hiddenTokens}
              triggerRef={overflowPillRef}
              open={tokensOverflowOpen}
              readOnly={readOnly}
              tokenDismissLabel={tokenDismissLabel}
              onDismiss={i => {
                if (hiddenTokens.length === 1) {
                  setTokensOverflowOpen(false);
                  if (tokenList.length === 1) {
                    inputRef.current?.focus();
                  } else {
                    setFocusFirstVisibleAfterOverflow(true);
                  }
                }
                removeToken(i, true);
              }}
              onClose={() => {
                setTokensOverflowOpen(false);
                overflowPillRef.current?.focus();
              }}
            />
          )}
        </div>
      </div>
    );
  }
);

export default AutosuggestInput;
