// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import { TagEditor } from '~components';
import { I18nProvider, I18nProviderProps, importMessages } from '~components/i18n';

const LOCALE = 'ja';

export default function I18nDynamicPage() {
  const [messages, setMessages] = useState<ReadonlyArray<I18nProviderProps.Messages> | null>(null);
  useEffect(() => {
    importMessages(LOCALE).then(setMessages);
  }, []);

  if (messages === null) {
    return 'Loading...';
  }

  return (
    <I18nProvider locale={LOCALE} messages={messages}>
      <h1>Dynamically imported messages</h1>
      <TagEditor
        tags={[
          { key: 'Tag 1', value: 'Value 1', existing: false },
          { key: 'Tag 2', value: 'Value 2', existing: true, markedForRemoval: true },
          { key: 'Tag 2', value: '', existing: false },
        ]}
      />
    </I18nProvider>
  );
}
