// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Token from '../token/internal';

/**
 * Extracts text from a PromptInput value.
 * By default, returns full token values (for form submission).
 * Set labelsOnly=true to get just the visible labels (for UI display/counting).
 *
 * @param value - The PromptInput value (ReactNode)
 * @param labelsOnly - If true, returns only visible text; if false, returns full token values
 *
 * @example
 * const value = <>Hello <Token label="user" value="<file_content>user</file_content>" /></>;
 * getPromptText(value); // "Hello <file_content>user</file_content>"
 * getPromptText(value, true); // "Hello user"
 */
export function getPromptText(value: React.ReactNode, labelsOnly = false): string {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(child => getPromptText(child, labelsOnly)).join('');
  }

  // React element (Token or Fragment)
  const element = value as React.ReactElement;
  if (element.type === Token) {
    // Return label or full value based on labelsOnly flag
    return labelsOnly ? element.props.label || '' : element.props.value || element.props.label || '';
  }
  return getPromptText(element.props.children, labelsOnly);
}

export default getPromptText;
