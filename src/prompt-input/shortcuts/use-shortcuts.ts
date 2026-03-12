// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useRef, useState } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { getFirstScrollableParent } from '../../internal/utils/scrollable-containers';
import { CursorController } from '../core/cursor-controller';
import { processTokens, type UpdateSource } from '../core/token-operations';
import { getPromptText } from '../core/token-operations';
import { isTriggerToken } from '../core/type-guards';
import type { PromptInputProps } from '../interfaces';

export interface UseShortcutsConfig {
  isTokenMode: boolean;
  tokens?: readonly PromptInputProps.InputToken[];
  menus?: readonly PromptInputProps.MenuDefinition[];
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void;
  editableElementRef: React.RefObject<HTMLDivElement>;
  cursorController: React.RefObject<CursorController | null>;
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

interface EffectsConfig {
  isTokenMode: boolean;
  tokens?: readonly PromptInputProps.InputToken[];
  editableElementRef: React.RefObject<HTMLDivElement>;
  state: ShortcutsState;
  activeTriggerToken: PromptInputProps.TriggerToken | null;
  cursorController: React.RefObject<CursorController | null>;
}

function useShortcutsEffects(config: EffectsConfig) {
  const { activeTriggerToken, editableElementRef, state, tokens, cursorController } = config;

  // Effect: Track trigger value when menu closes
  useEffect(() => {
    if (!state.cursorInTrigger && activeTriggerToken) {
      state.triggerValueWhenClosed.current = activeTriggerToken.value;
    } else if (state.cursorInTrigger) {
      state.triggerValueWhenClosed.current = '';
    }
  }, [state.cursorInTrigger, activeTriggerToken, state.triggerValueWhenClosed]);

  // Effect: Menu state management using cursor controller
  useEffect(() => {
    const hasTriggers = tokens?.some(isTriggerToken);

    if (!hasTriggers || !editableElementRef.current) {
      state.setCursorInTrigger(false);
      return;
    }

    // Check menu state using cursor controller
    const checkMenuState = () => {
      const ctrl = cursorController.current;
      if (!editableElementRef.current || !ctrl || state.ignoreCursorDetection.current) {
        return;
      }

      // Use cursor controller to check if in trigger
      const isInTrigger = ctrl.isInTrigger();

      // Menu should be open if cursor is in trigger
      const shouldBeOpen = isInTrigger;

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
  }, [tokens, state, editableElementRef, cursorController, activeTriggerToken]);
}

// MAIN HOOK

export function useShortcuts(config: UseShortcutsConfig): UseShortcutsResult {
  const { isTokenMode, tokens, menus, tokensToText, onChange, editableElementRef, cursorController } = config;

  // Initialize state
  const state = useShortcutsState();

  // Derive active trigger token using cursor controller
  const [cursorUpdateTrigger, setCursorUpdateTrigger] = useState(0);

  const activeTriggerToken = useMemo((): PromptInputProps.TriggerToken | null => {
    if (!tokens || !cursorController.current) {
      return null;
    }

    // Get active trigger ID from cursor controller
    const activeTriggerID = cursorController.current.getActiveTriggerID();

    if (!activeTriggerID) {
      return null;
    }

    // Find the trigger token with matching ID
    const matchingTrigger = tokens.find(t => isTriggerToken(t) && t.id === activeTriggerID) as
      | PromptInputProps.TriggerToken
      | undefined;

    return matchingTrigger || null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens, cursorController, cursorUpdateTrigger]);

  // Listen to cursor changes to update activeTriggerToken
  useEffect(() => {
    const handleSelectionChange = () => {
      // Trigger re-evaluation of activeTriggerToken
      setCursorUpdateTrigger(prev => prev + 1);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

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
    cursorController,
  });

  // Manage trigger wrapper ref for dropdown positioning
  const triggerWrapperRef = useRef<HTMLElement | null>(null);
  const [triggerWrapperReady, setTriggerWrapperReady] = useState(false);

  useEffect(() => {
    // Only update ref when menu is actually open (cursor is in a trigger)
    if (activeTriggerToken && menuIsOpen && editableElementRef.current) {
      // Use standard DOM API to find trigger by ID (triggers use standard id attribute)
      const triggerElement = activeTriggerToken.id
        ? editableElementRef.current.querySelector<HTMLElement>(`#${CSS.escape(activeTriggerToken.id)}`)
        : null;

      if (triggerElement) {
        triggerWrapperRef.current = triggerElement;
        setTriggerWrapperReady(true);
      } else {
        triggerWrapperRef.current = null;
        setTriggerWrapperReady(false);
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
