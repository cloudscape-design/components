// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { Ace } from 'ace-builds';
import { useResizeObserver, useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { useEffect, useRef } from 'react';

export function useAutoHeight(editor: null | Ace.Editor, value: string, wrapLines?: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  const updateEditorHeight = useStableCallback(() => {
    if (!editor) {
      return;
    }
    const lineHeight = editor.renderer.lineHeight || 20;
    const scrollbarHeight = wrapLines ? 0 : 15;
    const newHeight = editor.getSession().getScreenLength() * lineHeight + scrollbarHeight + 'px';
    if (editor.container.style.height !== newHeight) {
      editor.container.style.height = newHeight;
      editor.resize();
    }
  });

  useResizeObserver(containerRef, updateEditorHeight);
  useEffect(updateEditorHeight, [editor, value, wrapLines, updateEditorHeight]);

  return containerRef;
}
