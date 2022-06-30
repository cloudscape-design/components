// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useRef, useState } from 'react';

import { NonCancelableCustomEvent } from '~components';
import TagEditor, { TagEditorProps } from '~components/tag-editor';

import { I18N_STRINGS } from './shared';

interface PendingRequest {
  resolve: (data: ReadonlyArray<string>) => void;
  reject: () => void;
  data: Record<string, string>;
}

interface LocaleChangeEvent extends CustomEvent {
  detail: {
    value: 'en' | 'de';
  };
}

const pendingKeyRequests: PendingRequest[] = ((window as any).__pendingKeyRequests = []);
const pendingValueRequests: PendingRequest[] = ((window as any).__pendingValueRequests = []);

const onKeyRequest = (data: Record<string, string>): Promise<ReadonlyArray<string>> =>
  new Promise((resolve, reject) => {
    pendingKeyRequests.push({ resolve, reject, data });
  });

const onValueRequest = (data: Record<string, string>): Promise<ReadonlyArray<string>> =>
  new Promise((resolve, reject) => {
    pendingValueRequests.push({ resolve, reject, data });
  });

const initialTags = [
  { key: 'key-1', value: 'value-1', existing: true },
  { key: 'key-2', value: 'value-2', existing: true, markedForRemoval: true },
  { key: '', value: '', existing: false },
  { key: 'key-3', value: '', existing: false },
];

export const localizedI18nStrings = {
  en: I18N_STRINGS,
  de: {
    ...I18N_STRINGS,
    keyHeader: 'Key2',
    valueHeader: 'Value2',
    keysSuggestionLoading: 'Loading key values2',
    valuesSuggestionLoading: 'Loading tag values2',
  },
};

export default function Page() {
  const tagEditorRef = useRef<TagEditorProps.Ref | null>(null);
  const [tags, setTags] = useState<ReadonlyArray<TagEditorProps.Tag>>(initialTags);
  const [locale, setLocale] = useState<'en' | 'de'>('en');

  document.addEventListener('onlocalechange', (({ detail }: LocaleChangeEvent) => {
    setLocale(detail.value);
  }) as EventListener);

  const onChange = useCallback((event: NonCancelableCustomEvent<TagEditorProps.ChangeDetail>) => {
    setTags(event.detail.tags);
  }, []);

  return (
    <>
      <h1>Tag editor</h1>
      <button id="btnFocus" onClick={() => tagEditorRef.current?.focus()}>
        Focus Tag Editor
      </button>
      <TagEditor
        ref={tagEditorRef}
        i18nStrings={localizedI18nStrings[locale]}
        tagLimit={4}
        tags={tags}
        loading={false}
        onChange={onChange}
        keysRequest={key => onKeyRequest({ key })}
        valuesRequest={(key: string, value: string) => onValueRequest({ key, value })}
      />
    </>
  );
}
