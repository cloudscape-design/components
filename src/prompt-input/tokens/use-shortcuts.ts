// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef, useState } from 'react';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { CaretController, getOwnerSelection } from '../core/caret-controller';
import { normalizeCaretIntoTrigger } from '../core/dom-utils';
import { isTriggerToken } from '../core/type-guards';
import { PromptInputProps } from '../interfaces';

export interface ShortcutsState {
  /** The ID of the trigger the caret is currently in, or null if not in any trigger. */
  caretInTrigger: string | null;
  setCaretInTrigger: (triggerId: string | null) => void;
  /** DOM elements for trigger spans, keyed by trigger ID. Used for dropdown positioning and render reuse. */
  triggerElementsRef: React.MutableRefObject<Map<string, HTMLElement>>;
  /** Trigger IDs cancelled by onTriggerDetected — prevents menu opening and re-detection. */
  cancelledTriggerIds: React.MutableRefObject<Set<string>>;
  /** Set to the trigger ID that was just closed. checkMenuState skips reopening
   *  this specific trigger on the next call, then clears the value. */
  menuJustClosed: React.MutableRefObject<string | null>;
  /** Tracks the last token array emitted by the component. Used to distinguish
   *  user-initiated changes from external (parent) updates. */
  lastEmittedTokensRef: React.MutableRefObject<readonly PromptInputProps.InputToken[] | undefined>;
  markTokensAsSent: (tokens: readonly PromptInputProps.InputToken[]) => void;
}

export function useShortcutsState(): ShortcutsState {
  const [caretInTrigger, setCaretInTrigger] = useState<string | null>(null);
  const triggerElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const cancelledTriggerIds = useRef<Set<string>>(new Set());
  const menuJustClosed = useRef<string | null>(null);
  const lastEmittedTokensRef = useRef<readonly PromptInputProps.InputToken[] | undefined>(undefined);

  const markTokensAsSent = useStableCallback((tokens: readonly PromptInputProps.InputToken[]) => {
    lastEmittedTokensRef.current = tokens;
  });

  return {
    caretInTrigger,
    setCaretInTrigger,
    triggerElementsRef,
    cancelledTriggerIds,
    menuJustClosed,
    lastEmittedTokensRef,
    markTokensAsSent,
  };
}

interface EffectsConfig {
  tokens?: readonly PromptInputProps.InputToken[];
  editableElementRef: React.RefObject<HTMLDivElement>;
  state: ShortcutsState;
  activeTriggerToken: PromptInputProps.TriggerToken | null;
  caretController: React.RefObject<CaretController | null>;
}

/**
 * Manages trigger menu state by listening for selection changes within the
 * editable element. Determines which trigger (if any) the caret is inside
 * and updates `caretInTrigger` accordingly.
 *
 * Supports menu suppression (via Escape) which is cleared on the next user
 * interaction that changes the selection.
 */
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

      // Only react to selection changes within this input
      const sel = getOwnerSelection(editableElementRef.current);
      if (!sel?.rangeCount || !editableElementRef.current.contains(sel.getRangeAt(0).startContainer)) {
        return;
      }

      normalizeCaretIntoTrigger(editableElementRef.current, state.cancelledTriggerIds.current);

      const activeTrigger = ctrl.findActiveTrigger();
      // The caret can land inside a cancelled trigger's DOM element (e.g. via
      // arrow keys). Without this guard, setCaretInTrigger would reopen the menu.
      const activeTriggerId =
        activeTrigger && !state.cancelledTriggerIds.current.has(activeTrigger.id) ? activeTrigger.id : null;

      // Skip reopening the trigger that was just closed via Escape.
      // Clears after one check so subsequent actions can reopen it.
      if (state.menuJustClosed.current) {
        const closedId = state.menuJustClosed.current;
        state.menuJustClosed.current = null;
        if (activeTriggerId === closedId) {
          return;
        }
      }

      if (activeTriggerId !== state.caretInTrigger) {
        state.setCaretInTrigger(activeTriggerId);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        return;
      }
      checkMenuState();
    };

    const ownerDoc = editableElementRef.current.ownerDocument ?? document;
    const element = editableElementRef.current;

    checkMenuState();

    ownerDoc.addEventListener('selectionchange', checkMenuState);
    element.addEventListener('keyup', onKeyUp);

    return () => {
      ownerDoc.removeEventListener('selectionchange', checkMenuState);
      element.removeEventListener('keyup', onKeyUp);
    };
  }, [tokens, state, editableElementRef, caretController, activeTriggerToken]);
}
