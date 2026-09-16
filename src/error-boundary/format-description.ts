// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';

export interface DescriptionFormatArgs {
  hasFeedback: boolean;
  Feedback: (chunks: ReactNode[]) => ReactNode;
}

/**
 * Formats a consumer-supplied description string, replacing `<Feedback>` pseudo-tags and resolving a
 * `{hasFeedback, select, …}` argument.
 *
 * Those are the only two constructs a description can meaningfully use: `hasFeedback` and `Feedback`
 * are the only arguments the fallback provides, so any other argument or pseudo-tag was already
 * unresolvable and left the whole string rendered as-is.
 *
 * Messages that come from an i18n provider are not formatted here. They go through the provider's
 * own formatter, which supports the full ICU syntax.
 */
export function formatDescription(
  descriptionText: string,
  { hasFeedback, Feedback }: DescriptionFormatArgs
): ReactNode {
  const message = resolveSelect(descriptionText, hasFeedback);

  // A pseudo-tag other than <Feedback> was never a provided argument, so the description was
  // rendered as-is. Keep that, rather than substituting some tags and leaving others.
  if (hasUnsupportedTag(message)) {
    return descriptionText;
  }

  const feedbackTag = /<Feedback\s*>([\s\S]*?)<\/Feedback\s*>/g;
  const chunks: ReactNode[] = [];
  let index = 0;

  for (let match = feedbackTag.exec(message); match; match = feedbackTag.exec(message)) {
    if (match.index > index) {
      chunks.push(unquote(message.slice(index, match.index)));
    }
    chunks.push(Feedback([unquote(match[1])]));
    index = match.index + match[0].length;
  }

  if (chunks.length === 0) {
    return unquote(message);
  }
  if (index < message.length) {
    chunks.push(unquote(message.slice(index)));
  }
  return chunks;
}

function resolveSelect(message: string, hasFeedback: boolean): string {
  let result = '';
  let index = 0;

  while (index < message.length) {
    const open = message.indexOf('{', index);
    if (open === -1) {
      return result + message.slice(index);
    }

    const close = findClosingBrace(message, open);
    const select =
      close === -1 ? null : /^\s*hasFeedback\s*,\s*select\s*,([\s\S]*)$/.exec(message.slice(open + 1, close));
    if (!select) {
      // Some other argument, or unbalanced braces. Copy through and keep scanning.
      result += message.slice(index, open + 1);
      index = open + 1;
      continue;
    }

    // The branch can itself contain arguments, and is always shorter than the message.
    result += message.slice(index, open) + resolveSelect(selectBranch(select[1], hasFeedback), hasFeedback);
    index = close + 1;
  }

  return result;
}

function selectBranch(branches: string, hasFeedback: boolean): string {
  const options = new Map<string, string>();
  let index = 0;

  while (index < branches.length) {
    const open = branches.indexOf('{', index);
    const close = open === -1 ? -1 : findClosingBrace(branches, open);
    if (close === -1) {
      break;
    }
    options.set(branches.slice(index, open).trim(), branches.slice(open + 1, close));
    index = close + 1;
  }

  return options.get(String(hasFeedback)) ?? options.get('other') ?? '';
}

function findClosingBrace(value: string, open: number): number {
  let depth = 0;
  for (let index = open; index < value.length; index++) {
    if (value[index] === '{') {
      depth++;
    } else if (value[index] === '}' && --depth === 0) {
      return index;
    }
  }
  return -1;
}

function hasUnsupportedTag(message: string): boolean {
  const tag = /<(\/?)([A-Za-z][A-Za-z0-9_]*)\s*>/g;
  const opened: string[] = [];

  for (let match = tag.exec(message); match; match = tag.exec(message)) {
    const [, closing, name] = match;
    if (!closing) {
      opened.push(name);
    } else if (name !== 'Feedback' && opened.includes(name)) {
      return true;
    }
  }

  return false;
}

function unquote(value: string): string {
  return value.replace(/''/g, "'");
}
