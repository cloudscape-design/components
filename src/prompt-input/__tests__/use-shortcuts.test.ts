// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Mock styles.css.js since it's a build artifact not available in unit tests
jest.mock('../styles.css.js', () => ({}), { virtual: true });

import { renderHook } from '../../__tests__/render-hook';
import { PromptInputProps } from '../interfaces';
import { ShortcutsState, useShortcutsEffects } from '../tokens/use-shortcuts';

function renderShortcutsEffects(caretInTrigger: string | null, tokens?: readonly PromptInputProps.InputToken[]) {
  const setCaretInTrigger = jest.fn();
  const editableElementRef = { current: null };
  const caretController = { current: null };
  // useShortcutsState returns a new object on every render, so the effect runs after every render.
  const createState = (): ShortcutsState => ({
    caretInTrigger,
    setCaretInTrigger,
    triggerElementsRef: { current: new Map() },
    cancelledTriggerIds: { current: new Set() },
    menuJustClosed: { current: null },
    lastEmittedTokensRef: { current: undefined },
    markTokensAsSent: () => {},
  });
  const { rerender } = renderHook(() =>
    useShortcutsEffects({
      tokens,
      editableElementRef,
      state: createState(),
      activeTriggerToken: null,
      caretController,
    })
  );
  return { setCaretInTrigger, rerender: () => rerender(undefined) };
}

describe('useShortcutsEffects without trigger tokens', () => {
  test('does not set state on re-render when the caret is not in a trigger', () => {
    const { setCaretInTrigger, rerender } = renderShortcutsEffects(null);
    for (let i = 0; i < 5; i++) {
      rerender();
    }
    expect(setCaretInTrigger).not.toHaveBeenCalled();
  });

  test('does not set state on re-render when tokens have no triggers', () => {
    const { setCaretInTrigger, rerender } = renderShortcutsEffects(null, [{ type: 'text', value: 'hello' }]);
    rerender();
    expect(setCaretInTrigger).not.toHaveBeenCalled();
  });

  test('clears a stale trigger when the triggers are gone', () => {
    const { setCaretInTrigger } = renderShortcutsEffects('trigger-1', [{ type: 'text', value: 'hello' }]);
    expect(setCaretInTrigger).toHaveBeenCalledWith(null);
  });
});
