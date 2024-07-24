// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';
import range from 'lodash/range';

import { NonCancelableCustomEvent } from '~components';
import Button from '~components/button';
import TagEditor, { TagEditorProps } from '~components/tag-editor';

import { I18N_STRINGS } from './shared';

const KEYS = range(15).map(i => `Tag ${i + 1}`);
const VALUES = range(15).map(i => `Value ${i + 1}`);

async function requestKeys(input: string): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return KEYS.filter(key => key.indexOf(input) !== -1);
}

async function requestValues(key: string, input: string): Promise<string[]> {
  if (!key) {
    return Promise.reject();
  }
  await new Promise(resolve => setTimeout(resolve, 2000));
  return VALUES.map(value => `${key} - ${value}`).filter(value => value.indexOf(input) !== -1);
}

export default function () {
  const tagEditorRef = useRef<TagEditorProps.Ref | null>(null);

  const [loading, setLoading] = useState(true);

  const [tags, setTags] = useState<ReadonlyArray<TagEditorProps.Tag>>(() => [
    ...range(10).map(i => ({ key: `Tag ${i + 1}`, value: `Tag ${i + 1} - Value ${i + 1}`, existing: true })),
    ...range(20).map(i => ({ key: `Tag ${i + 21}`, value: `Tag ${i + 21} - Value ${i + 21}`, existing: false })),
  ]);

  const onChange = useCallback((event: NonCancelableCustomEvent<TagEditorProps.ChangeDetail>) => {
    setTags(event.detail.tags);
  }, []);

  const onButtonClick = useCallback(() => {
    tagEditorRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  });

  return (
    <>
      <h1>Tag editor</h1>
      <Button onClick={onButtonClick}>Focus first error</Button>
      <TagEditor
        ref={tagEditorRef}
        i18nStrings={I18N_STRINGS}
        tagLimit={100}
        tags={tags}
        loading={loading}
        onChange={onChange}
        keysRequest={requestKeys}
        valuesRequest={requestValues}
      />
    </>
  );
}
