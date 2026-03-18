// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Mock styles.css.js since it's a build artifact not available in unit tests
jest.mock('../styles.css.js', () => ({}), { virtual: true });

import {
  areAllTokensPinned,
  detectTriggersInText,
  enforcePinnedTokenOrdering,
  findAdjacentToken,
  mergeConsecutiveTextTokens,
  validateTrigger,
  validateTriggerWithPinnedTokens,
} from '../core/token-utils';
import { PromptInputProps } from '../interfaces';

// Helpers to create tokens concisely
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

const pinnedRef = (id: string, label: string, value: string, menuId: string): PromptInputProps.ReferenceToken =>
  ref(id, label, value, menuId, true);

describe('enforcePinnedTokenOrdering', () => {
  test('returns copy when no pinned tokens', () => {
    const tokens = [text('hello'), ref('r1', '@user', 'uid', 'mentions')];
    const result = enforcePinnedTokenOrdering(tokens);
    expect(result).toEqual(tokens);
    expect(result).not.toBe(tokens);
  });

  test('moves pinned tokens to the front', () => {
    const tokens = [text('hello '), pinnedRef('p1', '#file', 'fid', 'files'), text(' world')];
    const result = enforcePinnedTokenOrdering(tokens);
    expect(result[0]).toEqual(pinnedRef('p1', '#file', 'fid', 'files'));
    // Content before pinned token moves after it
    expect(result[1]).toEqual(text('hello '));
    expect(result[2]).toEqual(text(' world'));
  });

  test('preserves order of multiple pinned tokens', () => {
    const tokens = [
      pinnedRef('p1', '#a', 'a', 'files'),
      text('between'),
      pinnedRef('p2', '#b', 'b', 'files'),
      text('after'),
    ];
    const result = enforcePinnedTokenOrdering(tokens);
    expect(result[0]).toEqual(pinnedRef('p1', '#a', 'a', 'files'));
    expect(result[1]).toEqual(pinnedRef('p2', '#b', 'b', 'files'));
    expect(result[2]).toEqual(text('between'));
    expect(result[3]).toEqual(text('after'));
  });
});

describe('mergeConsecutiveTextTokens', () => {
  test('merges adjacent text tokens', () => {
    const tokens = [text('hello'), text(' '), text('world')];
    const result = mergeConsecutiveTextTokens(tokens);
    expect(result).toEqual([text('hello world')]);
  });

  test('does not merge text tokens separated by other types', () => {
    const tokens = [text('before'), ref('r1', '@u', 'uid', 'm'), text('after')];
    const result = mergeConsecutiveTextTokens(tokens);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual(text('before'));
    expect(result[2]).toEqual(text('after'));
  });

  test('returns copy of tokens when nothing to merge', () => {
    const tokens = [text('only')];
    const result = mergeConsecutiveTextTokens(tokens);
    expect(result).toEqual([text('only')]);
    expect(result[0]).not.toBe(tokens[0]);
  });

  test('handles empty array', () => {
    expect(mergeConsecutiveTextTokens([])).toEqual([]);
  });

  test('handles break tokens between text tokens', () => {
    const tokens = [text('line1'), brk(), text('line2')];
    const result = mergeConsecutiveTextTokens(tokens);
    expect(result).toHaveLength(3);
  });
});

describe('areAllTokensPinned', () => {
  test('returns true when all tokens are pinned references', () => {
    const tokens = [pinnedRef('p1', '#a', 'a', 'f'), pinnedRef('p2', '#b', 'b', 'f')];
    expect(areAllTokensPinned(tokens)).toBe(true);
  });

  test('returns false when any token is not pinned', () => {
    const tokens = [pinnedRef('p1', '#a', 'a', 'f'), text('hello')];
    expect(areAllTokensPinned(tokens)).toBe(false);
  });

  test('returns true for empty array', () => {
    expect(areAllTokensPinned([])).toBe(true);
  });

  test('returns false for unpinned reference tokens', () => {
    expect(areAllTokensPinned([ref('r1', '@u', 'uid', 'm')])).toBe(false);
  });
});

describe('validateTriggerWithPinnedTokens', () => {
  const useAtStartMenu: PromptInputProps.MenuDefinition = {
    id: 'files',
    trigger: '#',
    options: [],
    useAtStart: true,
  };
  const normalMenu: PromptInputProps.MenuDefinition = {
    id: 'mentions',
    trigger: '@',
    options: [],
  };

  test('returns true for useAtStart menu when all preceding tokens are pinned', () => {
    expect(validateTriggerWithPinnedTokens(useAtStartMenu, [pinnedRef('p1', '#a', 'a', 'f')])).toBe(true);
  });

  test('returns true for useAtStart menu when no preceding tokens', () => {
    expect(validateTriggerWithPinnedTokens(useAtStartMenu, [])).toBe(true);
  });

  test('returns false for useAtStart menu when preceding tokens include non-pinned', () => {
    expect(validateTriggerWithPinnedTokens(useAtStartMenu, [text('hello')])).toBe(false);
  });

  test('returns true for normal menu regardless of preceding tokens', () => {
    expect(validateTriggerWithPinnedTokens(normalMenu, [text('hello')])).toBe(true);
    expect(validateTriggerWithPinnedTokens(normalMenu, [])).toBe(true);
  });
});

describe('validateTrigger', () => {
  const useAtStartMenu: PromptInputProps.MenuDefinition = {
    id: 'files',
    trigger: '#',
    options: [],
    useAtStart: true,
  };
  const normalMenu: PromptInputProps.MenuDefinition = {
    id: 'mentions',
    trigger: '@',
    options: [],
  };

  test('validates trigger at start of text for normal menu', () => {
    expect(validateTrigger(normalMenu, 0, '@user', [])).toBe(true);
  });

  test('validates trigger after whitespace for normal menu', () => {
    expect(validateTrigger(normalMenu, 6, 'hello @user', [])).toBe(true);
  });

  test('rejects trigger in middle of word for normal menu', () => {
    expect(validateTrigger(normalMenu, 5, 'hello@user', [])).toBe(false);
  });

  test('validates useAtStart trigger at position 0 with all pinned preceding', () => {
    expect(validateTrigger(useAtStartMenu, 0, '#file', [pinnedRef('p1', '#a', 'a', 'f')])).toBe(true);
  });

  test('rejects useAtStart trigger not at position 0', () => {
    expect(validateTrigger(useAtStartMenu, 5, 'text #file', [])).toBe(false);
  });

  test('rejects useAtStart trigger at position 0 with non-pinned preceding tokens', () => {
    expect(validateTrigger(useAtStartMenu, 0, '#file', [text('hello')])).toBe(false);
  });
});

describe('detectTriggersInText', () => {
  const mentionsMenu: PromptInputProps.MenuDefinition = {
    id: 'mentions',
    trigger: '@',
    options: [],
  };
  const filesMenu: PromptInputProps.MenuDefinition = {
    id: 'files',
    trigger: '#',
    options: [],
    useAtStart: true,
  };

  test('detects trigger at start of text', () => {
    const result = detectTriggersInText('@user', [mentionsMenu], []);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('trigger');
    expect((result[0] as PromptInputProps.TriggerToken).value).toBe('user');
    expect((result[0] as PromptInputProps.TriggerToken).triggerChar).toBe('@');
  });

  test('detects trigger after whitespace', () => {
    const result = detectTriggersInText('hello @user', [mentionsMenu], []);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(expect.objectContaining({ type: 'text', value: 'hello ' }));
    expect(result[1]).toEqual(expect.objectContaining({ type: 'trigger', value: 'user', triggerChar: '@' }));
  });

  test('returns text token when no trigger found', () => {
    const result = detectTriggersInText('hello world', [mentionsMenu], []);
    expect(result).toEqual([{ type: 'text', value: 'hello world' }]);
  });

  test('does not detect trigger in middle of word', () => {
    const result = detectTriggersInText('email@example.com', [mentionsMenu], []);
    expect(result).toEqual([{ type: 'text', value: 'email@example.com' }]);
  });

  test('detects trigger with empty filter text', () => {
    const result = detectTriggersInText('hello @', [mentionsMenu], []);
    expect(result).toHaveLength(2);
    expect(result[1]).toEqual(expect.objectContaining({ type: 'trigger', value: '', triggerChar: '@' }));
  });

  test('stops filter text at whitespace', () => {
    const result = detectTriggersInText('@user rest', [mentionsMenu], []);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(expect.objectContaining({ type: 'trigger', value: 'user', triggerChar: '@' }));
    expect(result[1]).toEqual(expect.objectContaining({ type: 'text', value: ' rest' }));
  });

  test('respects onTriggerDetected cancellation', () => {
    const onTriggerDetected = jest.fn().mockReturnValue(true); // cancelled
    const result = detectTriggersInText('@user', [mentionsMenu], [], onTriggerDetected);
    expect(onTriggerDetected).toHaveBeenCalledWith(
      expect.objectContaining({ menuId: 'mentions', triggerChar: '@', position: 0 })
    );
    expect(result).toEqual([{ type: 'text', value: '@user' }]);
  });

  test('does not detect useAtStart trigger when preceding tokens are not all pinned', () => {
    const result = detectTriggersInText('#file', [filesMenu], [text('hello')]);
    expect(result).toEqual([{ type: 'text', value: '#file' }]);
  });

  test('detects useAtStart trigger when preceding tokens are all pinned', () => {
    const result = detectTriggersInText('#file', [filesMenu], [pinnedRef('p1', '#a', 'a', 'files')]);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('trigger');
  });

  test('returns text token for empty string input', () => {
    const result = detectTriggersInText('', [mentionsMenu], []);
    expect(result).toEqual([{ type: 'text', value: '' }]);
  });

  test('detects multiple triggers from different menus', () => {
    const slashMenu: PromptInputProps.MenuDefinition = {
      id: 'commands',
      trigger: '/',
      options: [],
    };
    const result = detectTriggersInText('hello @user /cmd', [mentionsMenu, slashMenu], []);
    expect(result).toHaveLength(4);
    expect(result[0]).toEqual(expect.objectContaining({ type: 'text', value: 'hello ' }));
    expect(result[1]).toEqual(expect.objectContaining({ type: 'trigger', triggerChar: '@', value: 'user' }));
    expect(result[2]).toEqual(expect.objectContaining({ type: 'text', value: ' ' }));
    expect(result[3]).toEqual(expect.objectContaining({ type: 'trigger', triggerChar: '/', value: 'cmd' }));
  });
});

describe('findAdjacentToken', () => {
  test('detects reference token to the left of a text node at offset 0', () => {
    const container = document.createElement('p');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', 'reference');
    const textNode = document.createTextNode('hello');
    container.appendChild(refSpan);
    container.appendChild(textNode);

    const result = findAdjacentToken(textNode, 0, 'left');
    expect(result.isReferenceToken).toBe(true);
    expect(result.sibling).toBe(refSpan);
  });

  test('detects reference token to the right of a text node at end', () => {
    const container = document.createElement('p');
    const textNode = document.createTextNode('hello');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', 'reference');
    container.appendChild(textNode);
    container.appendChild(refSpan);

    const result = findAdjacentToken(textNode, 5, 'right');
    expect(result.isReferenceToken).toBe(true);
    expect(result.sibling).toBe(refSpan);
  });

  test('returns no reference token when not at boundary', () => {
    const container = document.createElement('p');
    const textNode = document.createTextNode('hello');
    container.appendChild(textNode);

    const result = findAdjacentToken(textNode, 2, 'left');
    expect(result.isReferenceToken).toBe(false);
    expect(result.sibling).toBeNull();
  });

  test('handles HTMLElement container with left direction', () => {
    const container = document.createElement('p');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', 'pinned');
    const textNode = document.createTextNode('hello');
    container.appendChild(refSpan);
    container.appendChild(textNode);

    // offset=1 means cursor is after childNodes[0] (the refSpan)
    const result = findAdjacentToken(container, 1, 'left');
    expect(result.isReferenceToken).toBe(true);
  });

  test('handles HTMLElement container with right direction', () => {
    const container = document.createElement('p');
    const textNode = document.createTextNode('hello');
    const refSpan = document.createElement('span');
    refSpan.setAttribute('data-type', 'reference');
    container.appendChild(textNode);
    container.appendChild(refSpan);

    // offset=1 means cursor is before childNodes[1] (the refSpan)
    const result = findAdjacentToken(container, 1, 'right');
    expect(result.isReferenceToken).toBe(true);
  });

  test('returns false for non-reference sibling', () => {
    const container = document.createElement('p');
    const textNode = document.createTextNode('hello');
    const span = document.createElement('span');
    span.setAttribute('data-type', 'trigger');
    container.appendChild(textNode);
    container.appendChild(span);

    const result = findAdjacentToken(textNode, 5, 'right');
    expect(result.isReferenceToken).toBe(false);
    expect(result.sibling).toBe(span);
  });

  test('handles left at offset 0 in HTMLElement container', () => {
    const container = document.createElement('p');
    const textNode = document.createTextNode('hello');
    container.appendChild(textNode);

    // offset=0, left direction - checks previousSibling of container
    const result = findAdjacentToken(container, 0, 'left');
    expect(result.sibling).toBeNull();
  });

  test('handles right at end of HTMLElement container', () => {
    const container = document.createElement('p');
    const textNode = document.createTextNode('hello');
    container.appendChild(textNode);

    // offset equals childNodes.length - checks nextSibling
    const result = findAdjacentToken(container, 1, 'right');
    expect(result.sibling).toBeNull();
  });
});
