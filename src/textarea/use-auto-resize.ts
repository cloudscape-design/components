// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useRef } from 'react';

import * as designTokens from '../internal/generated/styles/tokens';

/**
 * Adjusts the height of a <textarea> element to fit its content.
 *
 * @param enabled - when false the hook is a no-op (rows prop controls height).
 * @param value   - the current textarea value; triggers re-measurement on change.
 * @param maxRows - optional upper bound on the number of visible rows.
 */
export function useAutoResize(
  enabled: boolean,
  value: string,
  maxRows: number | undefined
): React.RefCallback<HTMLTextAreaElement> {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = useCallback(() => {
    const element = textareaRef.current;
    if (!element || !enabled) {
      return;
    }

    // Reset to 'auto' so scrollHeight reflects actual content height.
    element.style.height = 'auto';

    const LINE_HEIGHT = designTokens.lineHeightBodyM;
    const PADDING = designTokens.spaceFieldVertical;

    const scrollHeight = `calc(${element.scrollHeight}px)`;
    const minHeight = `calc(${LINE_HEIGHT} + ${PADDING} * 2)`;

    if (maxRows !== undefined && maxRows > 0) {
      const maxHeight = `calc(${maxRows} * ${LINE_HEIGHT} + ${PADDING} * 2)`;
      element.style.height = `min(max(${scrollHeight}, ${minHeight}), ${maxHeight})`;
      element.style.overflowY = `auto`;
    } else {
      element.style.height = `max(${scrollHeight}, ${minHeight})`;
      element.style.overflowY = `hidden`;
    }
  }, [enabled, maxRows]);

  // Re-measure whenever value changes.
  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  // Stable ref-callback: attach to the textarea element.
  const refCallback: React.RefCallback<HTMLTextAreaElement> = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;
      if (node) {
        adjustHeight();
      }
    },
    [adjustHeight]
  );

  return refCallback;
}
