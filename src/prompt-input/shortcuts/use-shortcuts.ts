// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useRef, useState } from 'react';

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { getFirstScrollableParent } from '../../internal/utils/scrollable-containers';
import { ELEMENT_TYPES } from '../core/constants';
import { processTokens, type UpdateSource } from '../core/token-engine';
import { getPromptText } from '../core/token-extractor';
import { isHTMLElement, isTextNode, isTriggerToken } from '../core/type-guards';
import { findElement, getCurrentSelection, getFirstRange } from '../core/utils';
import type { PromptInputProps } from '../interfaces';

// ============================================================================
// TYPES
// ============================================================================

export interface UseShortcutsConfig {
  isTokenMode: boolean;
  tokens?: readonly PromptInputProps.InputToken[];
  menus?: readonly PromptInputProps.MenuDefinition[];
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void;
  editableElementRef: React.RefObject<HTMLDivElement>;
}

export interface UseShortcutsResult {
  // State
  cursorInTrigger: boolean;
  setCursorInTrigger: (inTrigger: boolean) => void;
  ignoreCursorDetection: React.MutableRefObject<boolean>;
  triggerValueWhenClosed: string;

  // Menu state
  activeTriggerToken: PromptInputProps.TriggerToken | null;
  activeMenu: PromptInputProps.MenuDefinition | null;
  menuIsOpen: boolean;
  menuFilterText: string;

  // Trigger wrapper for dropdown positioning
  triggerWrapperRef: React.MutableRefObject<HTMLElement | null>;
  triggerWrapperReady: boolean;

  // Processing
  processUserInput: (tokens: PromptInputProps.InputToken[]) => void;
  processWithCursor: (
    tokens: PromptInputProps.InputToken[],
    options?: {
      source?: UpdateSource;
      cursorAdjustment?: (savedPos: number, oldTokens: readonly PromptInputProps.InputToken[]) => number;
    }
  ) => void;

  // Update tracking
  markTokensAsSent: (tokens: readonly PromptInputProps.InputToken[]) => void;
  setUpdateSource: (source: UpdateSource) => void;
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

interface ShortcutsState {
  cursorInTrigger: boolean;
  setCursorInTrigger: (inTrigger: boolean) => void;
  ignoreCursorDetection: React.MutableRefObject<boolean>;
  triggerValueWhenClosed: React.MutableRefObject<string>;
  lastSentTokens: React.MutableRefObject<readonly PromptInputProps.InputToken[] | undefined>;
  updateSource: React.MutableRefObject<UpdateSource>;
  isExternalUpdate: (tokens: readonly PromptInputProps.InputToken[] | undefined) => boolean;
  markTokensAsSent: (tokens: readonly PromptInputProps.InputToken[]) => void;
  setUpdateSource: (source: UpdateSource) => void;
}

function useShortcutsState(): ShortcutsState {
  const [cursorInTrigger, setCursorInTrigger] = useState(false);
  const ignoreCursorDetection = useRef(false);
  const triggerValueWhenClosed = useRef<string>('');
  const lastSentTokens = useRef<readonly PromptInputProps.InputToken[] | undefined>(undefined);
  const updateSource = useRef<UpdateSource>('external');

  const isExternalUpdate = useStableCallback((tokens: readonly PromptInputProps.InputToken[] | undefined): boolean => {
    return lastSentTokens.current !== tokens;
  });

  const markTokensAsSent = useStableCallback((tokens: readonly PromptInputProps.InputToken[]) => {
    lastSentTokens.current = tokens;
  });

  const setUpdateSource = useStableCallback((source: UpdateSource) => {
    updateSource.current = source;
  });

  return {
    cursorInTrigger,
    setCursorInTrigger,
    ignoreCursorDetection,
    triggerValueWhenClosed,
    lastSentTokens,
    updateSource,
    isExternalUpdate,
    markTokensAsSent,
    setUpdateSource,
  };
}

// ============================================================================
// TOKEN PROCESSING
// ============================================================================

interface ProcessorConfig {
  tokens?: readonly PromptInputProps.InputToken[];
  menus?: readonly PromptInputProps.MenuDefinition[];
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void;
  editableElementRef: React.RefObject<HTMLDivElement>;
  state: ShortcutsState;
}

function useTokenProcessor(config: ProcessorConfig) {
  const { tokens, menus, tokensToText, onChange, state } = config;
  const previousTokensRef = useRef(tokens);

  const emitTokenChange = useStableCallback((newTokens: PromptInputProps.InputToken[]) => {
    const value = tokensToText ? tokensToText(newTokens) : getPromptText(newTokens);
    state.markTokensAsSent(newTokens);
    onChange({ value, tokens: newTokens });
  });

  const processUserInput = useStableCallback((inputTokens: PromptInputProps.InputToken[]) => {
    const processed = processTokens(
      inputTokens,
      { menus, tokensToText },
      {
        source: 'user-input',
        detectTriggers: true,
      }
    );

    // Don't preserve cursor during trigger detection - cursor is already correct in DOM
    emitTokenChange(processed);
  });

  const processWithCursor = useStableCallback(
    (
      newTokens: PromptInputProps.InputToken[],
      options: {
        source?: UpdateSource;
        cursorAdjustment?: (savedPos: number, oldTokens: readonly PromptInputProps.InputToken[]) => number;
      } = {}
    ) => {
      const source = options.source ?? 'internal';
      state.setUpdateSource(source);

      // Just emit the token change - cursor stays where it is in DOM
      emitTokenChange(newTokens);
    }
  );

  // Effect: Process external token updates
  useEffect(() => {
    if (previousTokensRef.current === tokens) {
      return;
    }

    previousTokensRef.current = tokens;

    if (!state.isExternalUpdate(tokens)) {
      return;
    }

    state.setUpdateSource('external');

    if (!tokens || !menus) {
      return;
    }

    const processed = processTokens(
      tokens,
      { menus, tokensToText },
      {
        source: 'external',
        detectTriggers: true,
      }
    );

    const hasChanges = processed.length !== tokens.length || processed.some((t, i) => t !== tokens[i]);

    if (hasChanges) {
      processWithCursor(processed, { source: 'external' });
    }
  }, [tokens, menus, tokensToText, state, processWithCursor]);

  return {
    processUserInput,
    processWithCursor,
  };
}

// ============================================================================
// EFFECTS
// ============================================================================

interface EffectsConfig {
  isTokenMode: boolean;
  tokens?: readonly PromptInputProps.InputToken[];
  editableElementRef: React.RefObject<HTMLDivElement>;
  state: ShortcutsState;
  activeTriggerToken: PromptInputProps.TriggerToken | null;
}

function isElementInView(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();

  // Find scrollable parent
  const scrollableParent = getFirstScrollableParent(element);

  if (scrollableParent) {
    // Check against scrollable parent
    const parentRect = scrollableParent.getBoundingClientRect();

    // Calculate visible portion
    const visibleTop = Math.max(rect.top, parentRect.top);
    const visibleBottom = Math.min(rect.bottom, parentRect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const totalHeight = rect.height;

    // Consider visible if at least 50% is showing
    return visibleHeight / totalHeight >= 0.5;
  }

  // Check against viewport
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, viewportHeight);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
  const totalHeight = rect.height;

  // Consider visible if at least 50% is showing
  return visibleHeight / totalHeight >= 0.5;
}

function isCursorInTriggerElement(): boolean {
  const selection = getCurrentSelection();
  if (!selection?.rangeCount) {
    return false;
  }

  const range = getFirstRange();
  if (!range?.collapsed) {
    return false;
  }

  let startElement: HTMLElement | null = null;
  if (isHTMLElement(range.startContainer)) {
    startElement = range.startContainer;
  } else if (range.startContainer.parentElement) {
    startElement = range.startContainer.parentElement;
  }

  if (!startElement) {
    return false;
  }

  const triggerElement = findUpUntil(startElement, node => node.getAttribute('data-type') === ELEMENT_TYPES.TRIGGER);

  if (!triggerElement) {
    return false;
  }

  if (isTextNode(range.startContainer) && range.startContainer.parentElement === triggerElement) {
    // Cursor must be after the trigger character (first character)
    const result = range.startOffset > 0;
    return result;
  }

  return true;
}

function useShortcutsEffects(config: EffectsConfig) {
  const { activeTriggerToken, editableElementRef, state, tokens } = config;

  // Effect: Track trigger value when menu closes
  useEffect(() => {
    if (!state.cursorInTrigger && activeTriggerToken) {
      state.triggerValueWhenClosed.current = activeTriggerToken.value;
    } else if (state.cursorInTrigger) {
      state.triggerValueWhenClosed.current = '';
    }
  }, [state.cursorInTrigger, activeTriggerToken, state.triggerValueWhenClosed]);

  // Effect: Menu state management (cursor position + visibility)
  useEffect(() => {
    const hasTriggers = tokens?.some(isTriggerToken);

    if (!hasTriggers || !editableElementRef.current) {
      state.setCursorInTrigger(false);
      return;
    }

    // Unified check for menu state: cursor in trigger AND trigger visible
    const checkMenuState = () => {
      if (!editableElementRef.current || state.ignoreCursorDetection.current) {
        return;
      }

      const isInTrigger = isCursorInTriggerElement();

      // When cursor is in a trigger, check if THAT trigger is visible (not necessarily activeTriggerToken)
      let triggerIsVisible = false;
      if (isInTrigger) {
        const selection = getCurrentSelection();
        if (selection?.rangeCount) {
          const range = getFirstRange();
          if (range) {
            let startElement: HTMLElement | null = null;
            if (isHTMLElement(range.startContainer)) {
              startElement = range.startContainer;
            } else if (range.startContainer.parentElement) {
              startElement = range.startContainer.parentElement;
            }

            if (startElement) {
              const triggerElement = findUpUntil(
                startElement,
                node => node.getAttribute('data-type') === ELEMENT_TYPES.TRIGGER
              );
              if (triggerElement) {
                triggerIsVisible = isElementInView(triggerElement);
              }
            }
          }
        }
      }

      // Menu should be open if cursor is in trigger AND that trigger is visible
      const shouldBeOpen = isInTrigger && triggerIsVisible;

      if (shouldBeOpen !== state.cursorInTrigger) {
        state.setCursorInTrigger(shouldBeOpen);
      }
    };

    // Initial check
    checkMenuState();

    // Listen to cursor changes
    document.addEventListener('selectionchange', checkMenuState);

    // Listen to scroll changes
    const scrollableParent = getFirstScrollableParent(editableElementRef.current);
    if (scrollableParent) {
      scrollableParent.addEventListener('scroll', checkMenuState);
    }

    return () => {
      document.removeEventListener('selectionchange', checkMenuState);
      if (scrollableParent) {
        scrollableParent.removeEventListener('scroll', checkMenuState);
      }
    };
  }, [tokens, state, editableElementRef, activeTriggerToken]);
}

// MAIN HOOK

export function useShortcuts(config: UseShortcutsConfig): UseShortcutsResult {
  const { isTokenMode, tokens, menus, tokensToText, onChange, editableElementRef } = config;

  // Initialize state
  const state = useShortcutsState();

  // Derive active trigger token - find the one where cursor is located
  // This needs to update whenever cursor moves, not just when cursorInTrigger changes
  const [cursorUpdateTrigger, setCursorUpdateTrigger] = useState(0);

  const activeTriggerToken = useMemo((): PromptInputProps.TriggerToken | null => {
    if (!tokens) {
      return null;
    }

    // Always return first trigger for cursor detection effect to work
    const firstTrigger = tokens.find(isTriggerToken) ?? null;

    if (!firstTrigger) {
      return null;
    }

    // If cursor is in trigger and we have DOM access, find the specific trigger at cursor
    if (state.cursorInTrigger && editableElementRef.current) {
      const selection = getCurrentSelection();
      if (selection?.rangeCount) {
        const range = getFirstRange();
        if (range?.collapsed) {
          let startElement: HTMLElement | null = null;
          if (isHTMLElement(range.startContainer)) {
            startElement = range.startContainer;
          } else if (range.startContainer.parentElement) {
            startElement = range.startContainer.parentElement;
          }

          if (startElement) {
            const triggerElement = findUpUntil(
              startElement,
              node => node.getAttribute('data-type') === ELEMENT_TYPES.TRIGGER
            );

            if (triggerElement) {
              const instanceId = triggerElement.getAttribute('data-id');
              if (instanceId) {
                // Find trigger with matching instanceId
                const matchingTrigger = tokens.find(t => isTriggerToken(t) && t.id === instanceId) as
                  | PromptInputProps.TriggerToken
                  | undefined;
                if (matchingTrigger) {
                  return matchingTrigger;
                }
              }
            }
          }
        }
      }
    }

    // Fallback to first trigger
    return firstTrigger;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, state.cursorInTrigger, editableElementRef, cursorUpdateTrigger]);

  // Listen to cursor changes to update activeTriggerToken
  useEffect(() => {
    const handleSelectionChange = () => {
      if (state.cursorInTrigger) {
        setCursorUpdateTrigger(prev => prev + 1);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [state.cursorInTrigger]);

  // Also trigger update when cursorInTrigger changes to true
  useEffect(() => {
    if (state.cursorInTrigger) {
      setCursorUpdateTrigger(prev => prev + 1);
    }
  }, [state.cursorInTrigger]);

  const activeMenu = useMemo(
    () =>
      activeTriggerToken && state.cursorInTrigger
        ? (menus?.find(m => m.trigger === activeTriggerToken.triggerChar) ?? null)
        : null,
    [activeTriggerToken, state.cursorInTrigger, menus]
  );

  const menuIsOpen = !!activeMenu;
  const menuFilterText = activeTriggerToken?.value ?? '';

  // Initialize processor
  const processor = useTokenProcessor({
    tokens,
    menus,
    tokensToText,
    onChange,
    editableElementRef,
    state,
  });

  // Setup effects
  useShortcutsEffects({
    isTokenMode,
    tokens,
    editableElementRef,
    state,
    activeTriggerToken,
  });

  // Manage trigger wrapper ref for dropdown positioning
  const triggerWrapperRef = useRef<HTMLElement | null>(null);
  const [triggerWrapperReady, setTriggerWrapperReady] = useState(false);

  useEffect(() => {
    // Only update ref when menu is actually open (cursor is in a trigger)
    if (activeTriggerToken && menuIsOpen && editableElementRef.current) {
      const triggerElement = findElement(editableElementRef.current, {
        tokenType: ELEMENT_TYPES.TRIGGER,
        tokenId: activeTriggerToken.id,
      });

      if (triggerElement) {
        triggerWrapperRef.current = triggerElement;
        setTriggerWrapperReady(true);
      }
    } else if (!menuIsOpen) {
      triggerWrapperRef.current = null;
      setTriggerWrapperReady(false);
    }
  }, [activeTriggerToken, menuIsOpen, editableElementRef]);

  return {
    cursorInTrigger: state.cursorInTrigger,
    setCursorInTrigger: state.setCursorInTrigger,
    ignoreCursorDetection: state.ignoreCursorDetection,
    triggerValueWhenClosed: state.triggerValueWhenClosed.current,
    activeTriggerToken,
    activeMenu,
    menuIsOpen,
    menuFilterText,
    triggerWrapperRef,
    triggerWrapperReady,
    processUserInput: processor.processUserInput,
    processWithCursor: processor.processWithCursor,
    markTokensAsSent: state.markTokensAsSent,
    setUpdateSource: state.setUpdateSource,
  };
}
