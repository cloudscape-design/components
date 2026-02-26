// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PromptInputProps } from '../interfaces';

// DOM TYPE GUARDS

export function isHTMLElement(node: Node | null | undefined): node is HTMLElement {
  return node?.nodeType === Node.ELEMENT_NODE;
}

export function isTextNode(node: Node | null): node is Text {
  return node?.nodeType === Node.TEXT_NODE;
}

/**
 * Type guard to check if a node is a BR element, optionally with a specific data-id
 * @param node The node to check
 * @param dataId Optional data-id to match (e.g., ELEMENT_TYPES.TRAILING_BREAK)
 * @returns True if the node is a BR element (and matches the data-id if provided)
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

// TOKEN TYPE GUARDS

export function isTextToken(token: PromptInputProps.InputToken): token is PromptInputProps.TextToken {
  return token.type === 'text';
}

export function isBreakToken(token: PromptInputProps.InputToken): token is PromptInputProps.TextToken {
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
