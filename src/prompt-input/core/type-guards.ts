// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isHTMLElement } from '../../internal/utils/dom';
import { PromptInputProps } from '../interfaces';

/** Checks if a node is a Text node. */
export function isTextNode(node: Node | null): node is Text {
  return node?.nodeType === Node.TEXT_NODE;
}

/**
 * Checks if a node is a BR element, optionally matching a specific data-id.
 * @param dataId optional data-id to match (e.g., ElementType.TrailingBreak)
 */
export function isBRElement(node: Node | null | undefined, dataId?: string): node is HTMLBRElement {
  if (node?.nodeName !== 'BR' || !isHTMLElement(node)) {
    return false;
  }
  if (dataId !== undefined) {
    return node.getAttribute('data-id') === dataId;
  }
  return true;
}

export function isTextToken(token: PromptInputProps.InputToken): token is PromptInputProps.TextToken {
  return token.type === 'text';
}

export function isBreakTextToken(token: PromptInputProps.InputToken): token is PromptInputProps.TextToken {
  return token.type === 'break';
}

export function isTriggerToken(token: PromptInputProps.InputToken): token is PromptInputProps.TriggerToken {
  return token.type === 'trigger';
}

export function isReferenceToken(token: PromptInputProps.InputToken): token is PromptInputProps.ReferenceToken {
  return token.type === 'reference';
}

export function isPinnedReferenceToken(token: PromptInputProps.InputToken): token is PromptInputProps.ReferenceToken {
  return isReferenceToken(token) && token.pinned === true;
}
