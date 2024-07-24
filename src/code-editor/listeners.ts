// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect } from 'react';
import { Ace } from 'ace-builds';

import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { useDebounceCallback } from '../internal/hooks/use-debounce-callback';
import { CodeEditorProps } from './interfaces';

export function useChangeEffect(
  editor: null | Ace.Editor,
  onChange?: NonCancelableEventHandler<CodeEditorProps.ChangeDetail>,
  onDelayedChange?: NonCancelableEventHandler<CodeEditorProps.ChangeDetail>
) {
  const debouncedChangeHandler = useDebounceCallback((detail: CodeEditorProps.ChangeDetail) => {
    fireNonCancelableEvent(onDelayedChange, detail);
  }, 0);
  const handleChange = useStableCallback(() => {
    const changeDetail = { value: editor?.getValue() || '' };
    fireNonCancelableEvent(onChange, changeDetail);
    debouncedChangeHandler(changeDetail);
  });
  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.on('change', handleChange);
    return () => editor.off('change', handleChange);
  }, [editor, handleChange]);
}
