// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { getFirstScrollableParent } from '../../internal/utils/scrollable-containers';
import { CaretController } from '../core/caret-controller';
import { normalizeCaretIntoTrigger } from '../core/dom-utils';
import { getPromptText, processTokens } from '../core/token-operations';
import { isTriggerToken } from '../core/type-guards';
import { PromptInputProps } from '../interfaces';

/** Tracks the state of a trigger element — its DOM node, dismissal, and cancellation status. */
export interface TriggerState {
  element: HTMLElement | null;
  dismissed: boolean;
  dismissedValue: string | null;
  cancelled: boolean;
}

export interface ShortcutsState {
  /** The ID of the trigger the caret is currently in, or null if not in any trigger. */
  caretInTrigger: string | null;
  setCaretInTrigger: (triggerId: string | null) => void;
  triggerStates: React.MutableRefObject<Map<string, TriggerState>>;
  lastSentTokens: React.MutableRefObject<readonly PromptInputProps.InputToken[] | undefined>;
  isExternalUpdate: (tokens: readonly PromptInputProps.InputToken[] | undefined) => boolean;
  markTokensAsSent: (tokens: readonly PromptInputProps.InputToken[]) => void;
}

export function useShortcutsState(): ShortcutsState {
  const [caretInTrigger, setCaretInTrigger] = useState<string | null>(null);
  const triggerStates = useRef<Map<string, TriggerState>>(new Map());
  const lastSentTokens = useRef<readonly PromptInputProps.InputToken[] | undefined>(undefined);

  const isExternalUpdate = useStableCallback((tokens: readonly PromptInputProps.InputToken[] | undefined): boolean => {
    return lastSentTokens.current !== tokens;
  });

  const markTokensAsSent = useStableCallback((tokens: readonly PromptInputProps.InputToken[]) => {
    lastSentTokens.current = tokens;
  });

  return {
    caretInTrigger,
    setCaretInTrigger,
    triggerStates,
    lastSentTokens,
    isExternalUpdate,
    markTokensAsSent,
  };
}

interface ProcessorConfig {
  tokens?: readonly PromptInputProps.InputToken[];
  menus?: readonly PromptInputProps.MenuDefinition[];
  tokensToText?: (tokens: readonly PromptInputProps.InputToken[]) => string;
  onChange: (detail: { value: string; tokens: PromptInputProps.InputToken[] }) => void;
  onTriggerDetected?: (detail: PromptInputProps.TriggerDetectedDetail) => boolean;
  state: ShortcutsState;
}

export function useTokenProcessor(config: ProcessorConfig) {
  const { tokens, menus, tokensToText, onChange, onTriggerDetected, state } = config;
  const previousTokensRef = useRef(tokens);

  const emitTokenChange = useStableCallback((newTokens: PromptInputProps.InputToken[]) => {
    const value = tokensToText ? tokensToText(newTokens) : getPromptText(newTokens);
    state.markTokensAsSent(newTokens);
    onChange({ value, tokens: newTokens });
  });

  const markCancelledTriggers = useStableCallback((cancelledIds: Set<string>) => {
    for (const id of cancelledIds) {
      const existing = state.triggerStates.current.get(id);
      if (existing) {
        existing.cancelled = true;
      } else {
        // Pre-populate — element will be filled in when renderTokens runs
        state.triggerStates.current.set(id, {
          element: null,
          dismissed: false,
          dismissedValue: null,
          cancelled: true,
        });
      }
    }
  });

  const processUserInput = useStableCallback((inputTokens: PromptInputProps.InputToken[]) => {
    const { tokens: processed, cancelledIds } = processTokens(
      inputTokens,
      { menus, tokensToText },
      {
        source: 'user-input',
        detectTriggers: true,
      },
      onTriggerDetected
    );

    markCancelledTriggers(cancelledIds);
    emitTokenChange(processed);
  });

  useEffect(() => {
    if (previousTokensRef.current === tokens) {
      return;
    }

    previousTokensRef.current = tokens;

    if (!state.isExternalUpdate(tokens)) {
      return;
    }

    if (!tokens || !menus) {
      return;
    }

    const { tokens: processed, cancelledIds } = processTokens(
      tokens,
      { menus, tokensToText },
      {
        source: 'external',
        detectTriggers: true,
      }
    );

    markCancelledTriggers(cancelledIds);

    const hasChanges = processed.length !== tokens.length || processed.some((t, i) => t !== tokens[i]);

    if (hasChanges) {
      emitTokenChange(processed);
    }
  }, [tokens, menus, tokensToText, state, emitTokenChange, markCancelledTriggers]);

  return {
    processUserInput,
  };
}

interface EffectsConfig {
  tokens?: readonly PromptInputProps.InputToken[];
  editableElementRef: React.RefObject<HTMLDivElement>;
  state: ShortcutsState;
  activeTriggerToken: PromptInputProps.TriggerToken | null;
  caretController: React.RefObject<CaretController | null>;
}

export function useShortcutsEffects(config: EffectsConfig) {
  const { activeTriggerToken, editableElementRef, state, tokens, caretController } = config;

  useEffect(() => {
    const hasTriggers = tokens?.some(isTriggerToken);

    if (!hasTriggers || !editableElementRef.current) {
      state.setCaretInTrigger(null);
      return;
    }

    const checkMenuState = () => {
      const ctrl = caretController.current;
      if (!editableElementRef.current || !ctrl) {
        return;
      }

      const cancelledIds = new Set<string>();
      state.triggerStates.current.forEach((ts, id) => {
        if (ts.cancelled) {
          cancelledIds.add(id);
        }
      });
      normalizeCaretIntoTrigger(editableElementRef.current, cancelledIds);

      const activeTrigger = ctrl.findActiveTrigger();
      let activeTriggerIdForMenu: string | null = null;

      if (activeTrigger) {
        const triggerState = state.triggerStates.current.get(activeTrigger.id);

        // Skip cancelled triggers entirely
        if (triggerState?.cancelled) {
          activeTriggerIdForMenu = null;
        } else {
          activeTriggerIdForMenu = activeTrigger.id;

          // Check dismissed state — reopen if filter text changed since dismissal
          if (triggerState?.dismissed) {
            const currentValue = activeTrigger.textContent?.slice(1) ?? '';
            if (currentValue !== triggerState.dismissedValue) {
              triggerState.dismissed = false;
              triggerState.dismissedValue = null;
            } else {
              activeTriggerIdForMenu = null;
            }
          }
        }

        // Clear dismissed state on all other triggers — navigating away resets dismissal
        state.triggerStates.current.forEach((ts, id) => {
          if (id !== activeTrigger.id && ts.dismissed) {
            ts.dismissed = false;
            ts.dismissedValue = null;
          }
        });
      } else {
        // Caret is not in any trigger — clear all dismissed states
        state.triggerStates.current.forEach(ts => {
          if (ts.dismissed) {
            ts.dismissed = false;
            ts.dismissedValue = null;
          }
        });
      }

      if (activeTriggerIdForMenu !== state.caretInTrigger) {
        state.setCaretInTrigger(activeTriggerIdForMenu);
      }
    };

    checkMenuState();

    const ownerDoc = editableElementRef.current.ownerDocument;
    ownerDoc.addEventListener('selectionchange', checkMenuState);

    const scrollableParent = getFirstScrollableParent(editableElementRef.current);
    if (scrollableParent) {
      scrollableParent.addEventListener('scroll', checkMenuState);
    }

    return () => {
      ownerDoc.removeEventListener('selectionchange', checkMenuState);
      if (scrollableParent) {
        scrollableParent.removeEventListener('scroll', checkMenuState);
      }
    };
  }, [tokens, state, editableElementRef, caretController, activeTriggerToken]);
}
