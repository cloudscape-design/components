// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect } from 'react';
import { Ace } from 'ace-builds';
import { CodeSnippetProps } from './interfaces';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { useDebounceCallback } from '../internal/hooks/use-debounce-callback';
import { useStableEventHandler } from '../internal/hooks/use-stable-event-handler';

export function useChangeEffect(
  editor?: Ace.Editor,
  onChange?: NonCancelableEventHandler<CodeSnippetProps.ChangeDetail>,
  onDelayedChange?: NonCancelableEventHandler<CodeSnippetProps.ChangeDetail>
) {
  const debouncedChangeHandler = useDebounceCallback((detail: CodeSnippetProps.ChangeDetail) => {
    fireNonCancelableEvent(onDelayedChange, detail);
  }, 0);
  const handleChange = useStableEventHandler(() => {
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
