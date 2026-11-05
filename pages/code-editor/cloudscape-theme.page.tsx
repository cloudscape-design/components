// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import CodeEditor, { CodeEditorProps } from '~components/code-editor';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './base-props';
import { sayHelloSample } from './code-samples';

import 'ace-builds/css/ace.css';

// WIP (v0) demo of the opt-in Cloudscape theme. Its colors are token-driven, so
// the same theme is used for both light and dark visual modes and adapts
// automatically. Toggle the surrounding page to dark mode to see it adapt.
const cloudscapeThemes: CodeEditorProps.AvailableThemes = {
  light: ['cloudscape', 'dawn'],
  dark: ['cloudscape', 'tomorrow_night_bright'],
};

function DemoCodeEditor({ ace, loading }: { ace: any; loading: boolean }) {
  const [preferences, setPreferences] = useState<Partial<CodeEditorProps.Preferences>>({
    theme: 'cloudscape',
    wrapLines: true,
  });
  return (
    <CodeEditor
      ace={ace}
      value={sayHelloSample}
      language="javascript"
      preferences={preferences}
      onPreferencesChange={e => setPreferences(e.detail)}
      loading={loading}
      themes={cloudscapeThemes}
      i18nStrings={i18nStrings}
    />
  );
}

export default function CloudscapeThemePage() {
  const [ace, setAce] = useState<any>();

  useEffect(() => {
    import('ace-builds').then(loadedAce => {
      loadedAce.config.set('basePath', './ace/');
      loadedAce.config.set('themePath', './ace/');
      loadedAce.config.set('modePath', './ace/');
      loadedAce.config.set('workerPath', './ace/');
      loadedAce.config.set('useStrictCSP', true);
      setAce(loadedAce);
    });
  }, []);

  return (
    <article>
      <h1>Code editor - Cloudscape theme (WIP)</h1>
      <p>
        The <code>cloudscape</code> theme derives its colors from Cloudscape design tokens and adapts to the active
        visual mode. Switch the page to dark mode to see the same theme adapt.
      </p>
      <ScreenshotArea style={{ maxWidth: 960 }}>
        <SpaceBetween size="xs">
          <DemoCodeEditor ace={ace} loading={!ace} />
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
