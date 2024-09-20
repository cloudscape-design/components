// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useRef, useState } from 'react';

import { NonCancelableCustomEvent, NonCancelableEventHandler } from '../../internal/events';
import { TagEditorProps } from '../interfaces';

interface UseTagEditorResult {
  created: TagEditorProps.Tag[];
  removed: TagEditorProps.Tag[];
  updated: TagEditorProps.Tag[];
  tagEditorProps: {
    tags: readonly TagEditorProps.Tag[];
    onChange: NonCancelableEventHandler<TagEditorProps.ChangeDetail>;
  };
}

export default function useTagEditor(initialTags: readonly TagEditorProps.Tag[]): UseTagEditorResult {
  const [tags, setTags] = useState<readonly TagEditorProps.Tag[]>(initialTags);
  const initialTagsRef = useRef(initialTags);

  useEffect(() => {
    if (initialTags.length === 0) {
      console.warn('Warning: initialTags is empty.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialTags !== initialTagsRef.current) {
      console.warn('Warning: initialTags has changed in the useTagEditor hook. The internal state will be reset.');
      initialTagsRef.current = initialTags;
      setTags(initialTags);
    }
  }, [initialTags]);

  const created = tags.filter(tag => !tag.existing);
  const removed = tags.filter(tag => tag.existing && tag.markedForRemoval);
  const updated = tags.filter(tag =>
    initialTags.some(({ key, value }) => tag.key === key && tag.existing && tag.value !== value)
  );

  const onChange = useCallback((event: NonCancelableCustomEvent<TagEditorProps.ChangeDetail>) => {
    setTags(event.detail.tags);
  }, []);

  const tagEditorProps = {
    tags,
    onChange,
  };

  return {
    tagEditorProps,
    created,
    removed,
    updated,
  };
}
