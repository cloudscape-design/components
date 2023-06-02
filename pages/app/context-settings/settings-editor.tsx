// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { CodeEditor, CodeEditorProps, SpaceBetween, StatusIndicator, Textarea } from '~components';
import { i18nStrings as codeEditorI18nStrings } from '../../code-editor/base-props';
import { useEffectOnUpdate } from '~components/internal/hooks/use-effect-on-update';

export function SettingsEditor<S extends object>({
  settings,
  onChange,
  readonly,
}: {
  settings: S;
  onChange(settings: S): void;
  readonly?: boolean;
}) {
  const [ace, setAce] = useState<CodeEditorProps['ace']>();
  const [propsStr, setPropsStr] = useState(JSON.stringify(settings, null, 2));
  const [aceLoading, setAceLoading] = useState(true);
  useEffect(() => {
    import('ace-builds').then(ace => {
      ace.config.set('basePath', './ace/');
      ace.config.set('useStrictCSP', true);
      setAce(ace);
      setAceLoading(false);
    });
  }, []);

  const [isUpdating, setIsUpdating] = useState(false);
  useEffectOnUpdate(() => {
    setIsUpdating(true);

    const timeoutId = setTimeout(() => {
      try {
        onChange(JSON.parse(propsStr));
      } catch {
        // ignore
      }
      setIsUpdating(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsStr]);

  useEffect(() => {
    setPropsStr(JSON.stringify(settings, null, 2));
  }, [settings]);

  if (readonly) {
    return <Textarea value={propsStr} readOnly={true} rows={propsStr.split('\n').length} />;
  }

  return (
    <SpaceBetween size="s">
      <CodeEditor
        ace={ace}
        value={propsStr}
        language="json"
        onDelayedChange={event => setPropsStr(event.detail.value)}
        onPreferencesChange={() => {}}
        loading={aceLoading}
        i18nStrings={codeEditorI18nStrings}
      />

      {isUpdating && <StatusIndicator type="loading">Updating...</StatusIndicator>}
    </SpaceBetween>
  );
}
