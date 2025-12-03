// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { PromptInputProps } from './interfaces';

/**
 * Extracts text from a PromptInput token array.
 * By default, returns full token values (for form submission).
 * Set labelsOnly=true to get just the visible labels (for UI display/counting).
 *
 * @param tokens - The PromptInput token array
 * @param labelsOnly - If true, returns only visible text; if false, returns full token values
 *
 * @example
 * const tokens = [
 *   { type: 'text', text: 'Hello ' },
 *   { type: 'reference', id: 'file:user', label: 'user', value: '<file_content>user</file_content>' }
 * ];
 * getPromptText(tokens); // "Hello <file_content>user</file_content>"
 * getPromptText(tokens, true); // "Hello user"
 */
export function getPromptText(tokens: readonly PromptInputProps.InputToken[], labelsOnly = false): string {
  if (!tokens) {
    return '';
  }

  return tokens
    .map(token => {
      if (token.type === 'text') {
        return token.text;
      } else if (token.type === 'reference') {
        return labelsOnly ? token.label : token.value;
      }
      return '';
    })
    .join('');
}

export default getPromptText;
