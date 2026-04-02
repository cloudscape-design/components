// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isHTMLElement } from '../../internal/utils/dom';
import {
  isBreakTextToken,
  isBRElement,
  isPinnedReferenceToken,
  isReferenceToken,
  isTextNode,
  isTextToken,
  isTriggerToken,
} from '../core/type-guards';
import { PromptInputProps } from '../interfaces';

describe('DOM type guards', () => {
  describe('isHTMLElement', () => {
    test('returns true for an HTML element', () => {
      expect(isHTMLElement(document.createElement('div'))).toBe(true);
    });

    test('returns false for a text node', () => {
      expect(isHTMLElement(document.createTextNode('hello'))).toBe(false);
    });

    test('returns false for null', () => {
      expect(isHTMLElement(null)).toBe(false);
    });

    test('returns false for undefined', () => {
      expect(isHTMLElement(undefined)).toBe(false);
    });
  });

  describe('isTextNode', () => {
    test('returns true for a text node', () => {
      expect(isTextNode(document.createTextNode('hello'))).toBe(true);
    });

    test('returns false for an HTML element', () => {
      expect(isTextNode(document.createElement('div'))).toBe(false);
    });

    test('returns false for null', () => {
      expect(isTextNode(null)).toBe(false);
    });
  });

  describe('isBRElement', () => {
    test('returns true for a BR element', () => {
      expect(isBRElement(document.createElement('br'))).toBe(true);
    });

    test('returns false for a non-BR element', () => {
      expect(isBRElement(document.createElement('div'))).toBe(false);
    });

    test('returns false for null', () => {
      expect(isBRElement(null)).toBe(false);
    });

    test('returns false for undefined', () => {
      expect(isBRElement(undefined)).toBe(false);
    });

    test('returns false for a text node', () => {
      expect(isBRElement(document.createTextNode('text'))).toBe(false);
    });

    test('matches data-id when provided', () => {
      const br = document.createElement('br');
      br.setAttribute('data-id', 'trailing-break');
      expect(isBRElement(br, 'trailing-break')).toBe(true);
    });

    test('rejects mismatched data-id', () => {
      const br = document.createElement('br');
      br.setAttribute('data-id', 'other');
      expect(isBRElement(br, 'trailing-break')).toBe(false);
    });

    test('rejects BR without data-id when data-id is required', () => {
      const br = document.createElement('br');
      expect(isBRElement(br, 'trailing-break')).toBe(false);
    });
  });
});

describe('Token type guards', () => {
  const textToken: PromptInputProps.TextToken = { type: 'text', value: 'hello' };
  const breakToken: PromptInputProps.TextToken = { type: 'break', value: '\n' };
  const triggerToken: PromptInputProps.TriggerToken = {
    type: 'trigger',
    value: 'filter',
    triggerChar: '@',
    id: 'trig-1',
  };
  const referenceToken: PromptInputProps.ReferenceToken = {
    type: 'reference',
    id: 'ref-1',
    label: '@user',
    value: 'user-id',
    menuId: 'mentions',
  };
  const pinnedToken: PromptInputProps.ReferenceToken = {
    type: 'reference',
    id: 'ref-2',
    label: '#file',
    value: 'file-id',
    menuId: 'files',
    pinned: true,
  };
  const unpinnedReference: PromptInputProps.ReferenceToken = {
    type: 'reference',
    id: 'ref-3',
    label: '@other',
    value: 'other-id',
    menuId: 'mentions',
    pinned: false,
  };

  describe('isTextToken', () => {
    test('returns true for text tokens', () => {
      expect(isTextToken(textToken)).toBe(true);
    });

    test('returns false for non-text tokens', () => {
      expect(isTextToken(breakToken)).toBe(false);
      expect(isTextToken(triggerToken)).toBe(false);
      expect(isTextToken(referenceToken)).toBe(false);
    });
  });

  describe('isBreakTextToken', () => {
    test('returns true for break tokens', () => {
      expect(isBreakTextToken(breakToken)).toBe(true);
    });

    test('returns false for non-break tokens', () => {
      expect(isBreakTextToken(textToken)).toBe(false);
      expect(isBreakTextToken(triggerToken)).toBe(false);
    });
  });

  describe('isTriggerToken', () => {
    test('returns true for trigger tokens', () => {
      expect(isTriggerToken(triggerToken)).toBe(true);
    });

    test('returns false for non-trigger tokens', () => {
      expect(isTriggerToken(textToken)).toBe(false);
      expect(isTriggerToken(referenceToken)).toBe(false);
    });
  });

  describe('isReferenceToken', () => {
    test('returns true for reference tokens', () => {
      expect(isReferenceToken(referenceToken)).toBe(true);
      expect(isReferenceToken(pinnedToken)).toBe(true);
    });

    test('returns false for non-reference tokens', () => {
      expect(isReferenceToken(textToken)).toBe(false);
      expect(isReferenceToken(triggerToken)).toBe(false);
    });
  });

  describe('isPinnedReferenceToken', () => {
    test('returns true for pinned reference tokens', () => {
      expect(isPinnedReferenceToken(pinnedToken)).toBe(true);
    });

    test('returns false for unpinned reference tokens', () => {
      expect(isPinnedReferenceToken(referenceToken)).toBe(false);
      expect(isPinnedReferenceToken(unpinnedReference)).toBe(false);
    });

    test('returns false for non-reference tokens', () => {
      expect(isPinnedReferenceToken(textToken)).toBe(false);
      expect(isPinnedReferenceToken(triggerToken)).toBe(false);
    });
  });
});
