// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';

export interface DescriptionFormatArgs {
  hasFeedback: boolean;
  Feedback: (chunks: ReactNode[]) => ReactNode;
}

/**
 * Formats a consumer-supplied description string the way `intl-messageformat` would, for the subset of ICU
 * syntax a description can meaningfully use: `<Feedback>` tags, `{hasFeedback, select, …}` arguments, and
 * apostrophe quoting.
 *
 * `hasFeedback` and `Feedback` are the only arguments the fallback provides, so `intl-messageformat` threw on
 * any other argument or tag. This throws in the same cases, so that the caller renders the string as written.
 *
 * Messages that come from an i18n provider are not formatted here. They go through the provider's own
 * formatter, which supports the full ICU syntax.
 */
export function formatDescription(message: string, { hasFeedback, Feedback }: DescriptionFormatArgs): ReactNode {
  let index = 0;

  function consume(pattern: RegExp): RegExpExecArray {
    pattern.lastIndex = index;
    const match = pattern.exec(message);
    if (!match) {
      throw new Error(`Unsupported syntax at position ${index} of the description.`);
    }
    index = pattern.lastIndex;
    return match;
  }

  // Stops at the end of the message, a closing tag, or (when nested) a closing brace. The caller checks which.
  function parseContent(nested: boolean): ReactNode[] {
    const chunks: ReactNode[] = [];
    while (index < message.length) {
      const char = message[index];
      if ((char === '}' && nested) || message.startsWith('</', index)) {
        break;
      } else if (char === '{') {
        chunks.push(...parseSelect());
      } else if (char === '<' && /[A-Za-z]/.test(message[index + 1] ?? '')) {
        chunks.push(parseTag());
      } else {
        chunks.push(parseText(nested));
      }
    }
    return mergeText(chunks);
  }

  function parseText(nested: boolean): string {
    let text = '';
    while (index < message.length) {
      const char = message[index];
      const next = message[index + 1] ?? '';
      if (char === '{' || (char === '}' && nested) || (char === '<' && /[A-Za-z/]/.test(next))) {
        break;
      }
      index++;
      if (char === "'" && next === "'") {
        text += "'";
        index++;
      } else if (char === "'" && /[{}<>]/.test(next)) {
        // A quoted section runs to the next lone apostrophe, or to the end of the message.
        for (; index < message.length; index++) {
          if (message[index] === "'") {
            if (message[index + 1] !== "'") {
              index++;
              break;
            }
            index++;
          }
          text += message[index];
        }
      } else {
        text += char;
      }
    }
    return text;
  }

  function parseSelect(): ReactNode[] {
    consume(/\{\s*hasFeedback\s*,\s*select\s*,/y);
    const options = new Map<string, ReactNode[]>();
    while (!consume(/\s*(\}?)/y)[1]) {
      const [, key] = consume(/([^\s{}]+)\s*\{/y);
      if (options.has(key)) {
        throw new Error(`Duplicate select option "${key}" in the description.`);
      }
      options.set(key, parseContent(true));
      consume(/\}/y);
    }
    const selected = options.get(String(hasFeedback)) ?? options.get('other');
    if (!options.has('other') || !selected) {
      throw new Error('The hasFeedback select in the description needs an "other" option.');
    }
    return selected;
  }

  function parseTag(): ReactNode {
    const [, name, selfClosing] = consume(/<([A-Za-z][\w.-]*)\s*(\/?)>/y);
    if (selfClosing) {
      return `<${name}/>`;
    }
    if (name !== 'Feedback') {
      throw new Error(`Unsupported tag <${name}> in the description.`);
    }
    const children = parseContent(true);
    consume(/<\/Feedback\s*>/y);
    return Feedback(children);
  }

  const chunks = parseContent(false);
  if (index < message.length) {
    throw new Error(`Unmatched closing tag at position ${index} of the description.`);
  }
  return chunks.length > 1 ? chunks : (chunks[0] ?? '');
}

function mergeText(chunks: ReactNode[]): ReactNode[] {
  const merged: ReactNode[] = [];
  for (const chunk of chunks) {
    const last = merged.length - 1;
    if (typeof chunk === 'string' && typeof merged[last] === 'string') {
      merged[last] += chunk;
    } else {
      merged.push(chunk);
    }
  }
  return merged;
}
