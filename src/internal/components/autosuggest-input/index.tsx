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
import InternalToken from '../../../token/internal';
import { BaseComponentProps } from '../../../types/base-component';
import { BaseKeyDetail, NonCancelableEventHandler } from '../../../types/events';
import { FormFieldValidationControlProps } from '../../../types/form-field';
import { getBaseProps } from '../../base-component';
import { getBreakpointValue } from '../../breakpoints';
import { ResetGroupedControlContext } from '../../context/control-group-context';
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
  tokens?: ReadonlyArray<AutosuggestProps.Token>;
  tokenOverflowAriaLabel?: (hiddenCount: number) => string;
}

interface AutosuggestInputFocusOptions {
  preventDropdown?: boolean;
}

export interface AutosuggestInputRef extends AutosuggestProps.Ref {
  focus(options?: AutosuggestInputFocusOptions): void;
  open(): void;
  close(): void;
}

export function OverflowDropdown({
  tokens,
  triggerRef,
  open,
  onDismiss,
  onClose,
}: {
  tokens: ReadonlyArray<AutosuggestProps.Token>;
  triggerRef: React.RefObject<HTMLButtonElement>;
  open: boolean;
  onDismiss: (index: number) => void;
  onClose: () => void;
}) {
  const pendingFocusAfterDismissRef = useRef<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus first button when the panel opens.
  useEffect(() => {
    if (!open) {
      return;
    }
    const first = listRef.current?.querySelector<HTMLElement>('button');
    first?.focus();
  }, [open]);

  // After a dismiss, move focus to the adjacent token.
  useEffect(() => {
    if (pendingFocusAfterDismissRef.current === null) {
      return;
    }
    const dismissedIndex = pendingFocusAfterDismissRef.current;
    pendingFocusAfterDismissRef.current = null;
    if (tokens.length === 0) {
      return;
    }
    const nextPosition = Math.min(dismissedIndex, tokens.length - 1);
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('button');
    if (buttons && buttons[nextPosition]) {
      buttons[nextPosition].focus();
    }
  });

  // Keyboard navigation — handled via React onKeyDown on the panel so it only
  // fires when focus is inside the panel, not globally.
  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      triggerRef.current?.focus();
    } else if (e.key === 'Tab') {
      // Close the dropdown and let the browser move focus naturally to the next element.
      onClose();
      // Do not prevent default — the browser handles focus movement.
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      const buttons = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
      if (buttons.length === 0) {
        return;
      }
      const focused = buttons.indexOf(document.activeElement as HTMLButtonElement);
      if (e.key === 'ArrowUp') {
        const prev = focused > 0 ? focused - 1 : buttons.length - 1;
        buttons[prev].focus();
      } else {
        const next = focused < buttons.length - 1 ? focused + 1 : 0;
        buttons[next].focus();
      }
    }
  };

  // Outside-click closes the panel.
  useEffect(() => {
    if (!open) {
      return;
    }
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
  }, [open, onClose, triggerRef]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      onMouseDown={e => e.preventDefault()}
      onKeyDown={handlePanelKeyDown}
      className={styles['overflow-panel']}
    >
      <ul ref={listRef} role="list" className={styles['overflow-panel-list']}>
        {tokens.map((token, i) => (
          <li key={i} className={styles['overflow-panel-item']}>
            <InternalToken
              label={token.value}
              dismissLabel={token.dismissLabel ?? token.value}
              variant="inline"
              onDismiss={() => {
                pendingFocusAfterDismissRef.current = i;
                onDismiss(i);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
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
    const dropdownContentRef = useRef<HTMLDivElement>(null);
    const dropdownFooterRef = useRef<HTMLDivElement>(null);
    const preventOpenOnFocusRef = useRef(false);
    const preventCloseOnBlurRef = useRef(false);

    // Index of the token that currently has keyboard focus (-1 = none)
    const [focusedTokenIndex, setFocusedTokenIndex] = useState(-1);
    const [triggerWidth, setTriggerWidth] = useState<number | null>(null);
    const [visibleCount, setVisibleCount] = useState<number | undefined>(undefined);
    const [tokenListMaxWidth, setTokenListMaxWidth] = useState<number | undefined>(undefined);
    // Incremented by the container ResizeObserver to re-trigger the overflow layout effect
    const [containerResizeCount, setContainerResizeCount] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [overflowOpen, setOverflowOpen] = useState(false);
    const [open, setOpen] = useState(false);

    useResizeObserver(
      () => (isTokenMode ? triggerRowRef.current : inputRef.current),
      entry => entry.borderBoxWidth > 0 && setTriggerWidth(entry.borderBoxWidth)
    );

    // Re-run overflow measurement whenever the container changes size (e.g. window resize,
    // panel expand/collapse, responsive layout changes).
    useResizeObserver(
      () => (isTokenMode ? containerRef.current : null),
      entry => entry.borderBoxWidth > 0 && setContainerResizeCount(n => n + 1)
    );

    useLayoutEffect(() => {
      if (!isTokenMode || !measureRef.current || !containerRef.current) {
        return;
      }
      measureRef.current.inert = true;
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

      // Read layout values from the DOM so they stay correct across themes and density changes.
      // triggerRowRef points to the .token-trigger div which owns the padding and flex gap.
      const triggerEl = triggerRowRef.current;
      const triggerStyle = triggerEl ? getComputedStyle(triggerEl) : null;
      const paddingInline = triggerStyle
        ? parseFloat(triggerStyle.paddingInlineStart) + parseFloat(triggerStyle.paddingInlineEnd)
        : 24;
      const gap = triggerStyle ? parseFloat(triggerStyle.gap) || parseFloat(triggerStyle.columnGap) || 4 : 4;

      // Icon span width — read from the real DOM element via data-search-icon attribute.
      const iconEl = triggerEl?.querySelector<HTMLElement>('[data-search-icon]');
      const iconWidth = iconEl ? iconEl.offsetWidth : 16;

      const inputMinWidth = Math.floor(containerWidth * 0.2); // 20% hard floor, matches CSS min-inline-size: 20%

      const tokenWidths = tokenEls.map(el => el.offsetWidth);
      const totalAll = tokenWidths.reduce((s, w) => s + w, 0) + gap * Math.max(tokenWidths.length - 1, 0);
      // Available space for tokens when the input holds its 20% minimum
      const budget = containerWidth - paddingInline - iconWidth - inputMinWidth - pillWidth - gap - gap;

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
        if (used + gap + tokenWidths[i] > budget) {
          break;
        }
        used += gap + tokenWidths[i];
        count++;
      }
      setVisibleCount(count);
      // Cap token list width so it can't push the pill out of the flex row
      setTokenListMaxWidth(budget);
    }, [isTokenMode, tokenList.length, containerResizeCount]);

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
      const updated = [...tokenList, { value: label.trim(), dismissLabel: label.trim() }];
      fireNonCancelableEvent(onChange, { value: '', tokens: updated });
    };

    const removeToken = (index: number, suppressFocus = false) => {
      preventOpenOnFocusRef.current = true; // prevent autosuggest dropdown opening when focus returns to input
      const updated = tokenList.filter((_, i) => i !== index);
      fireNonCancelableEvent(onChange, { value, tokens: updated });
      if (suppressFocus) {
        // Caller (e.g. OverflowDropdown) manages its own focus after dismiss
        return;
      }
      // Focus: move to next/prev token, or back to input if none left.
      if (updated.length === 0) {
        setFocusedTokenIndex(-1);
        inputRef.current?.focus();
      } else {
        // Capture the deleted token's position within the visible list, BEFORE the async
        // boundary. After re-render the layout effect may increase visibleCount (removal
        // can free overflow space), which shifts visibleStart left — any absolute-index
        // arithmetic done inside the rAF against the new visibleStart gives the wrong slot.
        //
        // The right target is always: the same slot the deleted token occupied.
        // That slot will be filled by the token that followed it (or the last slot if it
        // was the last visible token). We express this as the clamped slot index so it
        // works for last-token deletion too.
        const preRemovalVisibleStart = tokenList.length - effectiveVisible;
        // positionInVisible is 0-based within the rendered button list.
        // Clamp to (effectiveVisible - 2) because after removal there is one fewer button.
        const targetSlot = Math.min(index - preRemovalVisibleStart, effectiveVisible - 2);

        // Use the imperative DOM path (same as focusTokenAtIndex): focus the button
        // directly in the rAF instead of routing through setFocusedTokenIndex → useEffect.
        // The useEffect reads tokenFocusSnapshotRef which is overwritten by the post-removal
        // render, so it computes the wrong positionInVisible.
        setFocusedTokenIndex(-1);
        requestAnimationFrame(() => {
          const dismissButtons = tokenListRef.current?.querySelectorAll<HTMLButtonElement>('button');
          if (!dismissButtons || dismissButtons.length === 0) {
            inputRef.current?.focus();
            return;
          }
          // Use targetSlot, clamped to what actually rendered (buttons may differ if
          // visibleCount changed, but the slot intent is correct).
          const positionInVisible = Math.max(0, Math.min(targetSlot, dismissButtons.length - 1));
          dismissButtons[positionInVisible].focus();
          // Update state so ArrowLeft/Right navigation knows where focus is.
          const postRemovalVisibleStart = updated.length - dismissButtons.length;
          setFocusedTokenIndex(postRemovalVisibleStart + positionInVisible);
        });
      }
    };

    // Visible tokens: last `visibleCount` items (newest first, oldest collapsed)
    const effectiveVisible = visibleCount === undefined ? tokenList.length : visibleCount;
    const visibleTokens = tokenList.slice(tokenList.length - effectiveVisible);
    const hiddenTokens = tokenList.slice(0, tokenList.length - effectiveVisible);
    const hiddenStartIndex = 0; // hidden tokens are always the older ones (index 0..N)

    // Ref snapshot so the focus effect can read current values without listing them as deps
    const tokenFocusSnapshotRef = useRef({ tokenListLength: tokenList.length, effectiveVisible });
    tokenFocusSnapshotRef.current = { tokenListLength: tokenList.length, effectiveVisible };

    // Direct focus helper — focuses the dismiss button of the token at the given absolute index.
    // Used by ArrowLeft/Right so navigation is instant and works even when focusedTokenIndex
    // doesn't change value (e.g. pressing ArrowLeft twice to the same position).
    const focusTokenAtIndex = (absoluteIndex: number) => {
      const { tokenListLength, effectiveVisible: ev } = tokenFocusSnapshotRef.current;
      const visibleStart = tokenListLength - ev;
      const positionInVisible = absoluteIndex - visibleStart;
      if (positionInVisible < 0) {
        inputRef.current?.focus();
        return;
      }
      const dismissButtons = tokenListRef.current?.querySelectorAll<HTMLButtonElement>('button');
      if (dismissButtons && dismissButtons[positionInVisible]) {
        dismissButtons[positionInVisible].focus();
        setFocusedTokenIndex(absoluteIndex);
      }
    };

    const handleBlur = () => {
      if (!preventCloseOnBlurRef.current) {
        closeDropdown();
        fireNonCancelableEvent(onBlur, null);
      }
    };

    const handleFocus = () => {
      if (!preventOpenOnFocusRef.current && !overflowOpen) {
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
        fireNonCancelableEvent(onChange, isTokenMode ? { value: '', tokens: tokenList } : { value: '' });
      }
    };

    const handleKeyDown = (event: CustomEvent<BaseKeyDetail>) => {
      switch (event.detail.keyCode) {
        case KeyCode.down: {
          if (overflowOpen) {
            break;
          }
          onPressArrowDown?.();
          openDropdown();
          event.preventDefault();
          break;
        }
        case KeyCode.up: {
          if (overflowOpen) {
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
            // Backspace on empty input: focus the last visible token.
            // Use focusTokenAtIndex (imperative DOM focus) instead of setFocusedTokenIndex
            // so this always fires even when the index value hasn't changed — e.g. the user
            // deleted a token, tabbed back to the input, and presses Backspace again.
            // setFocusedTokenIndex alone would bail on a same-value setState and the
            // useEffect would never re-run, leaving focus stuck on the input.
            focusTokenAtIndex(tokenList.length - 1);
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
      fireNonCancelableEvent(onChange, isTokenMode ? { value: val, tokens: tokenList } : { value: val });
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
      const { tokenListLength, effectiveVisible: ev } = tokenFocusSnapshotRef.current;
      const visibleStart = tokenListLength - ev;
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
    }, [focusedTokenIndex]); // only re-run when focusedTokenIndex changes (set only by removeToken); tokenList/effectiveVisible read via ref snapshot

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
                  <ResetGroupedControlContext>
                    {open && dropdownFooter ? dropdownFooter : null}
                  </ResetGroupedControlContext>
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
        </div>
      );
    }

    return (
      <div {...baseProps} className={clsx(baseProps.className, styles.root)} ref={__internalRootRef}>
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
          >
            {tokenList.map((token, i) => (
              <span key={`measure-${i}`} data-measure-token="true" style={{ display: 'inline-flex', flexShrink: 0 }}>
                <InternalToken label={token.value} variant="inline" onDismiss={() => undefined} />
              </span>
            ))}
            {/* Pill measurement — must include the icon so offsetWidth matches the real pill */}
            <button
              data-measure-pill="true"
              className={styles['token-overflow-pill']}
              style={{ visibility: 'hidden', pointerEvents: 'none' }}
            >
              {`+${Math.max(tokenList.length, 1)}`}
              <InternalIcon
                name={isThemeActive(Theme.OneTheme) ? 'angle-down' : 'caret-down-filled'}
                size={isThemeActive(Theme.OneTheme) ? 'x-small' : 'normal'}
              />
            </button>
          </div>
        )}
        <div ref={containerRef} style={{ inlineSize: '100%', position: 'relative' }}>
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
                  data-search-icon="true"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    color: 'var(--color-text-input-placeholder, #687078)',
                  }}
                >
                  <InternalIcon name="search" variant={disabled ? 'disabled' : 'subtle'} />
                </span>

                {/* +N overflow pill — appears before the visible token list (oldest tokens collapsed).
                    The OverflowDropdown panel renders as a sibling outside the trigger row,
                    inside containerRef, so it scrolls with the page. */}
                {hiddenTokens.length > 0 && (
                  <button
                    ref={overflowPillRef}
                    type="button"
                    className={styles['token-overflow-pill']}
                    aria-haspopup="dialog"
                    aria-expanded={overflowOpen}
                    aria-label={tokenOverflowAriaLabel?.(hiddenTokens.length)}
                    onFocus={() => {
                      // Prevent the autosuggest dropdown from opening when the pill receives focus.
                      preventOpenOnFocusRef.current = true;
                    }}
                    onClick={() => setOverflowOpen(v => !v)}
                  >
                    {`+${hiddenTokens.length}`}
                    <InternalIcon
                      name={isThemeActive(Theme.OneTheme) ? 'angle-down' : 'caret-down-filled'}
                      size={isThemeActive(Theme.OneTheme) ? 'x-small' : 'normal'}
                    />
                  </button>
                )}

                {/* Visible token list — newest tokens, oldest collapsed to +N pill above */}
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
                              if (i === 0) {
                                // This is the first VISIBLE token. If there are hidden tokens,
                                // the +N pill is immediately to the left — focus it.
                                // If there are no hidden tokens, there is nothing to the left.
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
                                setFocusedTokenIndex(-1);
                              }
                            }
                          }}
                        >
                          <InternalToken
                            label={token.value}
                            dismissLabel={token.dismissLabel ?? token.value}
                            variant="inline"
                            disabled={disabled}
                            readOnly={readOnly}
                            onDismiss={() => removeToken(realIndex)}
                          />
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Borderless input — flex:1 fills remaining space; min-inline-size:20% is a hard CSS floor */}
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
                    // Show a clear (×) button when there is typed text, matching default autosuggest behaviour.
                    // We pass __endIcon directly instead of using type="visualSearch" because token mode
                    // renders its own search icon outside InternalInput and we don't want a duplicate.
                    {...(!disabled && !readOnly && value
                      ? {
                          __endIcon: 'close' as const,
                          __onEndIconClick: () => {
                            inputRef.current?.focus();
                            fireNonCancelableEvent(
                              onChange,
                              isTokenMode ? { value: '', tokens: tokenList } : { value: '' }
                            );
                          },
                        }
                      : {})}
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
          {/* Overflow panel — absolute-positioned inside containerRef, scrolls with the page */}
          {hiddenTokens.length > 0 && (
            <OverflowDropdown
              tokens={hiddenTokens}
              triggerRef={overflowPillRef}
              open={overflowOpen}
              onDismiss={i => {
                if (hiddenTokens.length === 1) {
                  setOverflowOpen(false);
                  requestAnimationFrame(() => {
                    const firstButton = tokenListRef.current?.querySelector<HTMLButtonElement>('button');
                    if (firstButton) {
                      firstButton.focus();
                    } else {
                      inputRef.current?.focus();
                    }
                  });
                }
                removeToken(hiddenStartIndex + i, true);
              }}
              onClose={() => {
                setOverflowOpen(false);
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
