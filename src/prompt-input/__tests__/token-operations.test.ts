// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Mock styles.css.js since it's a build artifact not available in unit tests
jest.mock('../styles.css.js', () => ({}), { virtual: true });

import { ElementType, SPECIAL_CHARS } from '../core/constants';
import { handleMenuSelection } from '../core/menu-state';
import {
  detectTriggersInTokens,
  extractTokensFromDOM,
  findLastPinnedTokenIndex,
  getPromptText,
  processTokens,
} from '../core/token-operations';
import { PortalContainer } from '../core/token-renderer';
import { isReferenceToken, isTriggerToken } from '../core/type-guards';
import { PromptInputProps } from '../interfaces';

// Token helpers
const text = (value: string): PromptInputProps.TextToken => ({ type: 'text', value });
const brk = (): PromptInputProps.TextToken => ({ type: 'break', value: '\n' });
const ref = (
  id: string,
  label: string,
  value: string,
  menuId: string,
  pinned?: boolean
): PromptInputProps.ReferenceToken => ({
  type: 'reference',
  id,
  label,
  value,
  menuId,
  ...(pinned !== undefined && { pinned }),
});
const trigger = (value: string, triggerChar: string, id: string = 'trigger-id'): PromptInputProps.TriggerToken => ({
  type: 'trigger',
  value,
  triggerChar,
  id,
});
const pinnedRef = (id: string, label: string, value: string, menuId: string): PromptInputProps.ReferenceToken =>
  ref(id, label, value, menuId, true);

/** Creates a portal containers map for testing extractTokensFromDOM. */
function createPortals(
  ...entries: Array<{ id: string; label: string; value: string; menuId: string }>
): Map<string, PortalContainer> {
  const map = new Map<string, PortalContainer>();
  for (const entry of entries) {
    map.set(entry.id, { ...entry, element: document.createElement('span') });
  }
  return map;
}

const mentionsMenu: PromptInputProps.MenuDefinition = {
  id: 'mentions',
  trigger: '@',
  options: [
    { value: 'user-1', label: 'Alice' },
    { value: 'user-2', label: 'Bob' },
  ],
};

describe('getPromptText', () => {
  test('joins text token values', () => {
    expect(getPromptText([text('hello'), text(' world')])).toBe('hello world');
  });

  test('includes trigger char + value for trigger tokens', () => {
    expect(getPromptText([text('hello '), trigger('user', '@')])).toBe('hello @user');
  });

  test('uses label for reference tokens', () => {
    expect(getPromptText([text('hi '), ref('r1', '@Alice', 'user-1', 'mentions')])).toBe('hi @Alice');
  });

  test('handles break tokens', () => {
    expect(getPromptText([text('line1'), brk(), text('line2')])).toBe('line1\nline2');
  });

  test('returns empty string for empty array', () => {
    expect(getPromptText([])).toBe('');
  });

  test('handles mixed token types', () => {
    const tokens: PromptInputProps.InputToken[] = [
      pinnedRef('p1', '#file.ts', 'file-1', 'files'),
      text('hello '),
      trigger('us', '@'),
    ];
    expect(getPromptText(tokens)).toBe('#file.ts hello @us');
  });
});

describe('findLastPinnedTokenIndex', () => {
  test('returns -1 when no pinned tokens', () => {
    expect(findLastPinnedTokenIndex([text('hello'), ref('r1', '@u', 'uid', 'm')])).toBe(-1);
  });

  test('returns index of last pinned token', () => {
    const tokens = [pinnedRef('p1', '#a', 'a', 'f'), text('hello'), pinnedRef('p2', '#b', 'b', 'f'), text('world')];
    expect(findLastPinnedTokenIndex(tokens)).toBe(2);
  });

  test('returns 0 when only first token is pinned', () => {
    expect(findLastPinnedTokenIndex([pinnedRef('p1', '#a', 'a', 'f'), text('hello')])).toBe(0);
  });

  test('returns -1 for empty array', () => {
    expect(findLastPinnedTokenIndex([])).toBe(-1);
  });
});

describe('extractTokensFromDOM', () => {
  function createContentEditable(): HTMLDivElement {
    const el = document.createElement('div');
    el.setAttribute('contenteditable', 'true');
    document.body.appendChild(el);
    return el;
  }

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('returns empty array for empty element', () => {
    const el = createContentEditable();
    expect(extractTokensFromDOM(el)).toEqual([]);
  });

  test('returns empty array for single empty paragraph with trailing break', () => {
    const el = createContentEditable();
    const p = document.createElement('p');
    const br = document.createElement('br');
    br.setAttribute('data-id', ElementType.TrailingBreak);
    p.appendChild(br);
    el.appendChild(p);
    expect(extractTokensFromDOM(el)).toEqual([]);
  });

  test('extracts text from single paragraph', () => {
    const el = createContentEditable();
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('hello world'));
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el);
    expect(tokens).toEqual([text('hello world')]);
  });

  test('extracts break tokens between paragraphs', () => {
    const el = createContentEditable();
    const p1 = document.createElement('p');
    p1.appendChild(document.createTextNode('line1'));
    const p2 = document.createElement('p');
    p2.appendChild(document.createTextNode('line2'));
    el.appendChild(p1);
    el.appendChild(p2);
    const tokens = extractTokensFromDOM(el);
    expect(tokens).toEqual([text('line1'), brk(), text('line2')]);
  });

  test('extracts trigger tokens', () => {
    const el = createContentEditable();
    const p = document.createElement('p');
    const triggerSpan = document.createElement('span');
    triggerSpan.setAttribute('data-type', ElementType.Trigger);
    triggerSpan.id = 'trigger-1';
    triggerSpan.textContent = '@user';
    p.appendChild(triggerSpan);
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el, [mentionsMenu]);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toBe('trigger');
    expect((tokens[0] as PromptInputProps.TriggerToken).value).toBe('user');
    expect((tokens[0] as PromptInputProps.TriggerToken).triggerChar).toBe('@');
  });

  test('extracts reference tokens from portal containers', () => {
    const el = createContentEditable();
    const p = document.createElement('p');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', ElementType.Reference);
    refSpan.id = 'ref-1';
    refSpan.appendChild(document.createTextNode('Alice'));
    p.appendChild(refSpan);
    el.appendChild(p);
    const portals = createPortals({ id: 'ref-1', label: 'Alice', value: 'user-1', menuId: 'mentions' });
    const tokens = extractTokensFromDOM(el, [mentionsMenu], portals);
    expect(tokens).toHaveLength(1);
    expect(tokens[0].type).toBe('reference');
    const refToken = tokens[0] as PromptInputProps.ReferenceToken;
    expect(refToken.label).toBe('Alice');
    expect(refToken.value).toBe('user-1');
    expect(refToken.menuId).toBe('mentions');
  });

  test('extracts pinned reference tokens', () => {
    const el = createContentEditable();
    const p = document.createElement('p');
    const pinnedSpan = document.createElement('span');
    pinnedSpan.setAttribute('data-type', ElementType.Pinned);
    pinnedSpan.id = 'pinned-1';
    pinnedSpan.appendChild(document.createTextNode('Alice'));
    p.appendChild(pinnedSpan);
    el.appendChild(p);
    const portals = createPortals({ id: 'pinned-1', label: 'Alice', value: 'user-1', menuId: 'mentions' });
    const tokens = extractTokensFromDOM(el, [mentionsMenu], portals);
    expect(tokens).toHaveLength(1);
    const refToken = tokens[0] as PromptInputProps.ReferenceToken;
    expect(refToken.pinned).toBe(true);
  });

  test('strips zero-width characters from text content', () => {
    const el = createContentEditable();
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(`hello${SPECIAL_CHARS.ZERO_WIDTH_CHARACTER}world`));
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el);
    expect(tokens).toEqual([text('helloworld')]);
  });

  test('skips empty/corrupted reference tokens without labels', () => {
    const el = createContentEditable();
    const p = document.createElement('p');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', ElementType.Reference);
    // No text content = empty label
    p.appendChild(refSpan);
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el, [mentionsMenu]);
    expect(tokens).toHaveLength(0);
  });

  test('handles trigger with no trigger character found as text', () => {
    const el = createContentEditable();
    const p = document.createElement('p');
    const triggerSpan = document.createElement('span');
    triggerSpan.setAttribute('data-type', ElementType.Trigger);
    triggerSpan.textContent = 'noTriggerChar';
    p.appendChild(triggerSpan);
    el.appendChild(p);
    // No menus provided, so no trigger char can be found
    const tokens = extractTokensFromDOM(el);
    expect(tokens).toEqual([text('noTriggerChar')]);
  });

  test('extracts text from cursor spots around reference tokens', () => {
    const el = createContentEditable();
    const p = document.createElement('p');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', ElementType.Reference);
    refSpan.id = 'ref-1';
    const cursorBefore = document.createElement('span');
    cursorBefore.setAttribute('data-type', ElementType.CaretSpotBefore);
    cursorBefore.textContent = 'before';
    const labelText = document.createTextNode('Alice');
    const cursorAfter = document.createElement('span');
    cursorAfter.setAttribute('data-type', ElementType.CaretSpotAfter);
    cursorAfter.textContent = 'after';
    refSpan.appendChild(cursorBefore);
    refSpan.appendChild(labelText);
    refSpan.appendChild(cursorAfter);
    p.appendChild(refSpan);
    el.appendChild(p);
    const portals = createPortals({ id: 'ref-1', label: 'Alice', value: 'user-1', menuId: 'mentions' });
    const tokens = extractTokensFromDOM(el, [mentionsMenu], portals);
    // Should have: text("before"), reference(Alice), text("after")
    expect(tokens).toHaveLength(3);
    expect(tokens[0]).toEqual(text('before'));
    expect(tokens[1].type).toBe('reference');
    expect(tokens[2]).toEqual(text('after'));
  });
});

describe('detectTriggersInTokens', () => {
  test('detects triggers in text tokens', () => {
    const tokens = [text('hello @user')];
    const result = detectTriggersInTokens(tokens, [mentionsMenu]);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(text('hello '));
    expect(result[1].type).toBe('trigger');
    expect((result[1] as PromptInputProps.TriggerToken).triggerChar).toBe('@');
    expect((result[1] as PromptInputProps.TriggerToken).value).toBe('user');
  });

  test('passes through non-text tokens unchanged', () => {
    const tokens = [ref('r1', '@Alice', 'user-1', 'mentions'), brk(), text('hello')];
    const result = detectTriggersInTokens(tokens, [mentionsMenu]);
    expect(result[0]).toEqual(tokens[0]);
    expect(result[1]).toEqual(tokens[1]);
  });

  test('returns original tokens when no triggers found', () => {
    const tokens = [text('hello world')];
    const result = detectTriggersInTokens(tokens, [mentionsMenu]);
    expect(result).toEqual([text('hello world')]);
  });

  test('collapses empty trigger + adjacent text back into trigger with filter text', () => {
    // Simulates backspace removing space: "@" + "bob rest" → trigger("bob") + text(" rest")
    const tokens = [trigger('', '@', 'trig-1'), text('bob rest')];
    const result = detectTriggersInTokens(tokens, [mentionsMenu]);
    expect(result).toEqual([
      expect.objectContaining({ type: 'trigger', value: 'bob', triggerChar: '@', id: 'trig-1' }),
      { type: 'text', value: ' rest' },
    ]);
  });

  test('merges non-empty trigger + adjacent text when space was deleted', () => {
    // Simulates delete key removing space: trigger("bob") + text("hello world") → trigger("bobhello") + text(" world")
    const tokens = [trigger('bob', '@', 'trig-1'), text('hello world')];
    const result = detectTriggersInTokens(tokens, [mentionsMenu]);
    expect(result).toEqual([
      expect.objectContaining({ type: 'trigger', value: 'bobhello', triggerChar: '@', id: 'trig-1' }),
      { type: 'text', value: ' world' },
    ]);
  });

  test('does not merge trigger with space-prefixed text', () => {
    const tokens = [trigger('bob', '@', 'trig-1'), text(' hello')];
    const result = detectTriggersInTokens(tokens, [mentionsMenu]);
    expect(result).toEqual([trigger('bob', '@', 'trig-1'), { type: 'text', value: ' hello' }]);
  });
});

describe('handleMenuSelection', () => {
  test('replaces trigger with reference token (non-pinned)', () => {
    const activeTrigger = trigger('us', '@', 'trigger-1');
    const tokens: PromptInputProps.InputToken[] = [text('hello '), activeTrigger];
    const result = handleMenuSelection(tokens, { value: 'user-1', label: 'Alice' }, 'mentions', false, activeTrigger);
    expect(result.tokens).toHaveLength(2);
    expect(result.tokens[0]).toEqual(text('hello '));
    expect(result.tokens[1].type).toBe('reference');
    const inserted = result.tokens[1] as PromptInputProps.ReferenceToken;
    expect(inserted.label).toBe('Alice');
    expect(inserted.value).toBe('user-1');
    expect(inserted.menuId).toBe('mentions');
    expect(inserted.pinned).toBeUndefined();
    expect(result.insertedToken).toBe(inserted);
    expect(result.caretPosition).toBe(7);
  });

  test('inserts pinned token at correct position', () => {
    const activeTrigger = trigger('fi', '#', 'trigger-1');
    const tokens: PromptInputProps.InputToken[] = [
      pinnedRef('p1', '#existing', 'existing-id', 'files'),
      activeTrigger,
      text('hello'),
    ];
    const result = handleMenuSelection(tokens, { value: 'file-1', label: '#newfile' }, 'files', true, activeTrigger);
    // Trigger should be removed, pinned token inserted after existing pinned tokens
    const pinnedTokens = result.tokens.filter(
      t => t.type === 'reference' && (t as PromptInputProps.ReferenceToken).pinned
    );
    expect(pinnedTokens).toHaveLength(2);
    expect(result.insertedToken.pinned).toBe(true);
  });

  test('handles selection when trigger is the only token', () => {
    const activeTrigger = trigger('user', '@', 'trigger-1');
    const tokens: PromptInputProps.InputToken[] = [activeTrigger];
    const result = handleMenuSelection(tokens, { value: 'user-1', label: 'Alice' }, 'mentions', false, activeTrigger);
    expect(result.tokens).toHaveLength(1);
    expect(result.tokens[0].type).toBe('reference');
  });

  test('uses value as label fallback when label is empty', () => {
    const activeTrigger = trigger('', '@', 'trigger-1');
    const tokens: PromptInputProps.InputToken[] = [activeTrigger];
    const result = handleMenuSelection(tokens, { value: 'user-1', label: '' }, 'mentions', false, activeTrigger);
    expect(result.insertedToken.label).toBe('user-1');
  });
});

describe('processTokens', () => {
  test('detects triggers when detectTriggers is true', () => {
    const tokens = [text('hello @user')];
    const config = { menus: [mentionsMenu] };
    const { tokens: result } = processTokens(tokens, config, { source: 'user-input', detectTriggers: true });
    expect(result.some(t => t.type === 'trigger')).toBe(true);
  });

  test('does not detect triggers when detectTriggers is false', () => {
    const tokens = [text('hello @user')];
    const config = { menus: [mentionsMenu] };
    const { tokens: result } = processTokens(tokens, config, { source: 'user-input', detectTriggers: false });
    expect(result.every(t => t.type === 'text')).toBe(true);
  });

  test('preserves consumer-provided IDs on trigger tokens', () => {
    const tokens: PromptInputProps.InputToken[] = [trigger('user', '@', 'trig-1')];
    const { tokens: result } = processTokens(tokens, {}, { source: 'user-input' });
    const token = result[0];
    expect(isTriggerToken(token)).toBe(true);
    if (isTriggerToken(token)) {
      expect(token.id).toBe('trig-1');
    }
  });

  test('preserves consumer-provided IDs on reference tokens', () => {
    const tokens: PromptInputProps.InputToken[] = [
      { type: 'reference', id: 'ref-alice', label: 'Alice', value: 'user-1', menuId: 'mentions' },
    ];
    const { tokens: result } = processTokens(tokens, {}, { source: 'user-input' });
    const token = result[0];
    expect(isReferenceToken(token)).toBe(true);
    if (isReferenceToken(token)) {
      expect(token.id).toBe('ref-alice');
    }
  });

  test('preserves existing IDs', () => {
    const tokens: PromptInputProps.InputToken[] = [trigger('user', '@', 'existing-id')];
    const { tokens: result } = processTokens(tokens, {}, { source: 'user-input' });
    const token = result[0];
    expect(isTriggerToken(token)).toBe(true);
    if (isTriggerToken(token)) {
      expect(token.id).toBe('existing-id');
    }
  });

  test('does not detect triggers when menus config is undefined', () => {
    const tokens = [text('hello @user')];
    const { tokens: result } = processTokens(tokens, {}, { source: 'user-input', detectTriggers: true });
    expect(result.every(t => t.type === 'text')).toBe(true);
  });

  test('passes through text tokens unchanged when no trigger detection', () => {
    const tokens = [text('hello'), brk(), text('world')];
    const { tokens: result } = processTokens(tokens, {}, { source: 'external' });
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(expect.objectContaining({ type: 'text', value: 'hello' }));
    expect(result[1]).toEqual(expect.objectContaining({ type: 'break' }));
  });
});

describe('extractTokensFromDOM - advanced cases', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('handles trigger with text before trigger character', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const triggerSpan = document.createElement('span');
    triggerSpan.setAttribute('data-type', ElementType.Trigger);
    triggerSpan.textContent = 'prefix@user';
    p.appendChild(triggerSpan);
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el, [mentionsMenu]);
    // Should extract "prefix" as text and "@user" as trigger
    expect(tokens.some(t => t.type === 'text' && t.value === 'prefix')).toBe(true);
    expect(tokens.some(t => t.type === 'trigger')).toBe(true);
  });

  test('handles grouped options in menu lookup', () => {
    const groupedMenu: PromptInputProps.MenuDefinition = {
      id: 'grouped',
      trigger: '@',
      options: [
        {
          label: 'Team A',
          options: [
            { value: 'user-a1', label: 'Alice' },
            { value: 'user-a2', label: 'Amy' },
          ],
        } as any,
      ],
    };
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', ElementType.Reference);
    refSpan.id = 'ref-1';
    refSpan.appendChild(document.createTextNode('Alice'));
    p.appendChild(refSpan);
    el.appendChild(p);
    const portals = createPortals({ id: 'ref-1', label: 'Alice', value: 'user-a1', menuId: 'grouped' });
    const tokens = extractTokensFromDOM(el, [groupedMenu], portals);
    expect(tokens).toHaveLength(1);
    const refToken = tokens[0] as PromptInputProps.ReferenceToken;
    expect(refToken.value).toBe('user-a1');
    expect(refToken.label).toBe('Alice');
  });

  test('handles mixed text and reference tokens in a paragraph', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('hello '));
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', ElementType.Reference);
    refSpan.id = 'ref-1';
    refSpan.appendChild(document.createTextNode('Alice'));
    p.appendChild(refSpan);
    p.appendChild(document.createTextNode(' world'));
    el.appendChild(p);
    const portals = createPortals({ id: 'ref-1', label: 'Alice', value: 'user-1', menuId: 'mentions' });
    const tokens = extractTokensFromDOM(el, [mentionsMenu], portals);
    expect(tokens).toHaveLength(3);
    expect(tokens[0]).toEqual(text('hello '));
    expect(tokens[1].type).toBe('reference');
    expect(tokens[2]).toEqual(text(' world'));
  });

  test('skips BR elements in paragraphs', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('hello'));
    p.appendChild(document.createElement('br'));
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el);
    expect(tokens).toEqual([text('hello')]);
  });

  test('handles nested trigger with space before it', () => {
    const slashMenu: PromptInputProps.MenuDefinition = {
      id: 'commands',
      trigger: '/',
      options: [],
    };
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const triggerSpan = document.createElement('span');
    triggerSpan.setAttribute('data-type', ElementType.Trigger);
    triggerSpan.textContent = '@user /cmd';
    p.appendChild(triggerSpan);
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el, [mentionsMenu, slashMenu]);
    const triggerTokens = tokens.filter(t => t.type === 'trigger') as PromptInputProps.TriggerToken[];
    expect(triggerTokens).toHaveLength(2);
    expect(triggerTokens[0].triggerChar).toBe('@');
    expect(triggerTokens[0].value).toBe('user');
    expect(triggerTokens[1].triggerChar).toBe('/');
    expect(triggerTokens[1].value).toBe('cmd');
  });

  test('handles empty trigger span', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const triggerSpan = document.createElement('span');
    triggerSpan.setAttribute('data-type', ElementType.Trigger);
    triggerSpan.textContent = '';
    p.appendChild(triggerSpan);
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el);
    expect(tokens).toHaveLength(0);
  });

  test('returns empty array for single paragraph with only a plain BR (not trailing-break)', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    // A plain BR without data-id=trailing-break should NOT be treated as empty
    p.appendChild(document.createElement('br'));
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el);
    // Plain BR is skipped by extractTokensFromNode, so paragraph yields no tokens
    expect(tokens).toHaveLength(0);
  });

  test('handles comment node inside paragraph (non-text, non-HTMLElement)', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    p.appendChild(document.createTextNode('hello'));
    p.appendChild(document.createComment('a comment'));
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el);
    expect(tokens).toEqual([text('hello')]);
  });

  test('recurses into unknown element types', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const unknownSpan = document.createElement('span');
    // No data-type attribute — unknown element
    unknownSpan.appendChild(document.createTextNode('nested text'));
    p.appendChild(unknownSpan);
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el);
    expect(tokens).toEqual([text('nested text')]);
  });

  test('handles nested trigger without space before it (no split)', () => {
    const slashMenu: PromptInputProps.MenuDefinition = {
      id: 'commands',
      trigger: '/',
      options: [],
    };
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const triggerSpan = document.createElement('span');
    triggerSpan.setAttribute('data-type', ElementType.Trigger);
    // Nested trigger without whitespace before it — should NOT split
    triggerSpan.textContent = '@user/cmd';
    p.appendChild(triggerSpan);
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el, [mentionsMenu, slashMenu]);
    // The @ trigger is found first; the / is inside the filter text without preceding space
    const triggerTokens = tokens.filter(t => t.type === 'trigger');
    expect(triggerTokens).toHaveLength(1);
    expect((triggerTokens[0] as PromptInputProps.TriggerToken).triggerChar).toBe('@');
  });

  test('handles adjacent trigger characters (nested trigger at index 0)', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const triggerSpan = document.createElement('span');
    triggerSpan.setAttribute('data-type', ElementType.Trigger);
    triggerSpan.textContent = '@@bob';
    p.appendChild(triggerSpan);
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el, [mentionsMenu]);
    const triggerTokens = tokens.filter(t => t.type === 'trigger');
    expect(triggerTokens).toHaveLength(2);
    expect((triggerTokens[0] as PromptInputProps.TriggerToken).value).toBe('');
    expect((triggerTokens[1] as PromptInputProps.TriggerToken).value).toBe('bob');
  });

  test('extractReferenceToken skips reference token when label is empty (only cursor spots)', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', ElementType.Reference);
    refSpan.id = 'ref-empty';
    // Only cursor spots with zero-width characters, no actual label content
    const cursorBefore = document.createElement('span');
    cursorBefore.setAttribute('data-type', ElementType.CaretSpotBefore);
    cursorBefore.textContent = '\u200C';
    const cursorAfter = document.createElement('span');
    cursorAfter.setAttribute('data-type', ElementType.CaretSpotAfter);
    cursorAfter.textContent = '\u200C';
    refSpan.appendChild(cursorBefore);
    refSpan.appendChild(cursorAfter);
    p.appendChild(refSpan);
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el, [mentionsMenu]);
    // Empty label means the reference token itself is skipped,
    // but cursor spot zero-width chars may produce text tokens
    const refTokens = tokens.filter(t => t.type === 'reference');
    expect(refTokens).toHaveLength(0);
  });

  test('reference without portal container has empty values', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', ElementType.Reference);
    refSpan.id = 'ref-noportal';
    refSpan.appendChild(document.createTextNode('Unknown'));
    p.appendChild(refSpan);
    el.appendChild(p);
    // No portal containers provided — reference has empty value/label/menuId
    const tokens = extractTokensFromDOM(el);
    const refTokens = tokens.filter(t => t.type === 'reference');
    expect(refTokens).toHaveLength(0); // Skipped because label is empty
  });
});

describe('getPromptText - space insertion', () => {
  test('inserts space between reference and adjacent text without whitespace', () => {
    const tokens: PromptInputProps.InputToken[] = [ref('r1', 'Alice', 'user-1', 'mentions'), text('hello')];
    const result = getPromptText(tokens);
    expect(result).toBe('Alice hello');
  });

  test('does not insert space when text starts with space', () => {
    const tokens: PromptInputProps.InputToken[] = [ref('r1', 'Alice', 'user-1', 'mentions'), text(' hello')];
    expect(getPromptText(tokens)).toBe('Alice hello');
  });

  test('does not insert space after newline', () => {
    const tokens: PromptInputProps.InputToken[] = [text('line1'), brk(), ref('r1', 'Alice', 'user-1', 'mentions')];
    expect(getPromptText(tokens)).toBe('line1\nAlice');
  });

  test('inserts space between two adjacent references', () => {
    const tokens: PromptInputProps.InputToken[] = [
      ref('r1', 'Alice', 'user-1', 'mentions'),
      ref('r2', 'Bob', 'user-2', 'mentions'),
    ];
    expect(getPromptText(tokens)).toBe('Alice Bob');
  });

  test('skips empty text segments', () => {
    const tokens: PromptInputProps.InputToken[] = [text(''), ref('r1', 'Alice', 'user-1', 'mentions')];
    expect(getPromptText(tokens)).toBe('Alice');
  });

  test('uses value as fallback when reference has no label', () => {
    const tokens: PromptInputProps.InputToken[] = [ref('r1', '', 'user-1', 'mentions')];
    expect(getPromptText(tokens)).toBe('user-1');
  });

  test('inserts space before reference when previous token is text without trailing space', () => {
    const tokens: PromptInputProps.InputToken[] = [text('hello'), ref('r1', 'Alice', 'user-1', 'mentions')];
    expect(getPromptText(tokens)).toBe('hello Alice');
  });
});

describe('detectTriggersInTokens - edge cases', () => {
  test('skips cancelled triggers without re-parsing', () => {
    const cancelledIds = new Set(['trig-1']);
    const tokens: PromptInputProps.InputToken[] = [trigger('user', '@', 'trig-1')];
    const result = detectTriggersInTokens(tokens, [mentionsMenu], undefined, cancelledIds);
    expect(result).toHaveLength(1);
    expect((result[0] as PromptInputProps.TriggerToken).id).toBe('trig-1');
  });

  test('empty trigger at end of tokens array is not collapsed with next', () => {
    const tokens: PromptInputProps.InputToken[] = [trigger('', '@', 'trig-1')];
    const result = detectTriggersInTokens(tokens, [mentionsMenu]);
    expect(result).toHaveLength(1);
    expect((result[0] as PromptInputProps.TriggerToken).value).toBe('');
  });

  test('empty trigger followed by space-prefixed text is not collapsed', () => {
    const tokens: PromptInputProps.InputToken[] = [trigger('', '@', 'trig-1'), text(' hello')];
    const result = detectTriggersInTokens(tokens, [mentionsMenu]);
    expect(result).toHaveLength(2);
    expect((result[0] as PromptInputProps.TriggerToken).value).toBe('');
    expect(result[1]).toEqual(text(' hello'));
  });

  test('non-empty trigger at end of tokens array is not merged with next', () => {
    const tokens: PromptInputProps.InputToken[] = [trigger('bob', '@', 'trig-1')];
    const result = detectTriggersInTokens(tokens, [mentionsMenu]);
    expect(result).toHaveLength(1);
    expect((result[0] as PromptInputProps.TriggerToken).value).toBe('bob');
  });

  test('calls onTriggerDetected callback when trigger is detected in text', () => {
    const onTriggerDetected = jest.fn().mockReturnValue(true);
    const tokens: PromptInputProps.InputToken[] = [text('hello @user')];
    detectTriggersInTokens(tokens, [mentionsMenu], onTriggerDetected);
    expect(onTriggerDetected).toHaveBeenCalled();
  });
});

describe('extractTokensFromDOM - reference values from portal containers', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('reference without portal container is skipped (no label)', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', ElementType.Reference);
    refSpan.id = 'ref-1';
    refSpan.appendChild(document.createTextNode('SomeLabel'));
    p.appendChild(refSpan);
    el.appendChild(p);
    // No portal containers — label/value come back empty, reference is skipped
    const tokens = extractTokensFromDOM(el, [mentionsMenu]);
    const refTokens = tokens.filter(t => t.type === 'reference');
    expect(refTokens).toHaveLength(0);
  });

  test('reference with portal container has correct value and label', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', ElementType.Reference);
    refSpan.id = 'ref-1';
    refSpan.appendChild(document.createTextNode('Alice'));
    p.appendChild(refSpan);
    el.appendChild(p);
    const portals = createPortals({ id: 'ref-1', label: 'Alice', value: 'user-1', menuId: 'mentions' });
    const tokens = extractTokensFromDOM(el, [mentionsMenu], portals);
    expect(tokens).toHaveLength(1);
    const refToken = tokens[0] as PromptInputProps.ReferenceToken;
    expect(refToken.value).toBe('user-1');
    expect(refToken.label).toBe('Alice');
    expect(refToken.menuId).toBe('mentions');
  });

  test('extractTokensFromDOM with useAtStart menu skips nested trigger detection', () => {
    const useAtStartMenu: PromptInputProps.MenuDefinition = {
      id: 'commands',
      trigger: '/',
      options: [],
      useAtStart: true,
    };
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const triggerSpan = document.createElement('span');
    triggerSpan.setAttribute('data-type', ElementType.Trigger);
    triggerSpan.textContent = '@user /cmd';
    p.appendChild(triggerSpan);
    el.appendChild(p);
    // useAtStart menus are skipped during nested trigger detection
    const tokens = extractTokensFromDOM(el, [mentionsMenu, useAtStartMenu]);
    const triggerTokens = tokens.filter(t => t.type === 'trigger') as PromptInputProps.TriggerToken[];
    // Only the @ trigger should be found; / is useAtStart so skipped for nesting
    expect(triggerTokens).toHaveLength(1);
    expect(triggerTokens[0].triggerChar).toBe('@');
    expect(triggerTokens[0].value).toBe('user /cmd');
  });

  test('extractTokensFromDOM with empty text node returns no tokens', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(''));
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el);
    expect(tokens).toHaveLength(0);
  });
});

describe('processTokens - onTriggerDetected callback', () => {
  test('passes onTriggerDetected to detectTriggersInTokens', () => {
    const onTriggerDetected = jest.fn().mockReturnValue(true);
    const tokens = [text('hello @user')];
    const config = { menus: [mentionsMenu] };
    processTokens(tokens, config, { source: 'user-input', detectTriggers: true }, onTriggerDetected);
    expect(onTriggerDetected).toHaveBeenCalled();
  });
});

describe('extractTokensFromDOM - trigger token edge cases', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('trigger element uses its DOM id', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const triggerSpan = document.createElement('span');
    triggerSpan.setAttribute('data-type', ElementType.Trigger);
    triggerSpan.id = 'trig-dom-1';
    triggerSpan.textContent = '@user';
    p.appendChild(triggerSpan);
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el, [mentionsMenu]);
    const triggerToken = tokens.find(t => t.type === 'trigger') as PromptInputProps.TriggerToken;
    expect(triggerToken).toBeDefined();
    expect(triggerToken.id).toBe('trig-dom-1');
  });

  test('reference element with HTMLElement child uses portal container for label', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', ElementType.Reference);
    refSpan.id = 'ref-1';
    const labelSpan = document.createElement('span');
    labelSpan.setAttribute('contenteditable', 'false');
    labelSpan.textContent = 'Alice';
    refSpan.appendChild(labelSpan);
    p.appendChild(refSpan);
    el.appendChild(p);
    const portals = createPortals({ id: 'ref-1', label: 'Alice', value: 'user-1', menuId: 'mentions' });
    const tokens = extractTokensFromDOM(el, [mentionsMenu], portals);
    expect(tokens).toHaveLength(1);
    const refToken = tokens[0] as PromptInputProps.ReferenceToken;
    expect(refToken.label).toBe('Alice');
    expect(refToken.value).toBe('user-1');
  });

  test('reference element with text node child uses portal container for label', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', ElementType.Reference);
    refSpan.id = 'ref-1';
    refSpan.appendChild(document.createTextNode('Bob'));
    p.appendChild(refSpan);
    el.appendChild(p);
    const portals = createPortals({ id: 'ref-1', label: 'Bob', value: 'user-2', menuId: 'mentions' });
    const tokens = extractTokensFromDOM(el, [mentionsMenu], portals);
    expect(tokens).toHaveLength(1);
    const refToken = tokens[0] as PromptInputProps.ReferenceToken;
    expect(refToken.label).toBe('Bob');
    expect(refToken.value).toBe('user-2');
  });

  test('reference without portal container is skipped', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', ElementType.Reference);
    refSpan.id = 'ref-1';
    refSpan.appendChild(document.createTextNode('Alice'));
    p.appendChild(refSpan);
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el);
    const refTokens = tokens.filter(t => t.type === 'reference');
    expect(refTokens).toHaveLength(0);
  });

  test('extractTokensFromDOM handles non-HTMLElement non-text node', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    // Add a processing instruction or comment node
    const comment = document.createComment('test');
    p.appendChild(comment);
    p.appendChild(document.createTextNode('hello'));
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el);
    expect(tokens).toEqual([text('hello')]);
  });
});

describe('detectTriggersInTokens - empty trigger followed by empty text', () => {
  test('empty trigger followed by empty text token is not collapsed', () => {
    const tokens: PromptInputProps.InputToken[] = [trigger('', '@', 'trig-1'), text('')];
    const result = detectTriggersInTokens(tokens, [mentionsMenu]);
    // Empty text token has length 0, so the collapse condition (next.value.length > 0) is false
    expect(result.some(t => t.type === 'trigger')).toBe(true);
  });

  test('non-empty trigger followed by empty text token is not merged', () => {
    const tokens: PromptInputProps.InputToken[] = [trigger('bob', '@', 'trig-1'), text('')];
    const result = detectTriggersInTokens(tokens, [mentionsMenu]);
    expect(result.some(t => t.type === 'trigger' && (t as PromptInputProps.TriggerToken).value === 'bob')).toBe(true);
  });
});

describe('extractTokensFromDOM - nested trigger split with whitespace', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('splits trigger when nested trigger has whitespace before it (space before nested)', () => {
    const slashMenu: PromptInputProps.MenuDefinition = {
      id: 'commands',
      trigger: '/',
      options: [],
    };
    const el = document.createElement('div');
    document.body.appendChild(el);
    const p = document.createElement('p');
    const triggerSpan = document.createElement('span');
    triggerSpan.setAttribute('data-type', ElementType.Trigger);
    // Trigger text with space before nested trigger: "@user /cmd"
    // This should split into trigger(@, "user"), text(" "), trigger(/, "cmd")
    triggerSpan.textContent = '@user  /cmd';
    p.appendChild(triggerSpan);
    el.appendChild(p);
    const tokens = extractTokensFromDOM(el, [mentionsMenu, slashMenu]);
    const triggerTokens = tokens.filter(t => t.type === 'trigger') as PromptInputProps.TriggerToken[];
    expect(triggerTokens.length).toBe(2);
    expect(triggerTokens[0].triggerChar).toBe('@');
    expect(triggerTokens[0].value).toBe('user');
    expect(triggerTokens[1].triggerChar).toBe('/');
    expect(triggerTokens[1].value).toBe('cmd');
    // There should be a space text token between them
    const textTokens = tokens.filter(t => t.type === 'text');
    expect(textTokens.length).toBeGreaterThanOrEqual(1);
  });
});

describe('getPromptText - empty trigger segment', () => {
  test('skips trigger with empty value and empty triggerChar', () => {
    // This is an edge case where a trigger token produces an empty segment
    const tokens: PromptInputProps.InputToken[] = [
      text('hello'),
      { type: 'trigger', value: '', triggerChar: '', id: 'empty-trig' } as any,
      text(' world'),
    ];
    const result = getPromptText(tokens);
    // Empty trigger segment is skipped
    expect(result).toBe('hello world');
  });
});
