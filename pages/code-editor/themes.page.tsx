// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import CodeEditor, { CodeEditorProps } from '~components/code-editor';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './base-props';
import { sayHelloSample } from './code-samples';

import 'ace-builds/css/ace.css';
import 'ace-builds/css/theme/dawn.css';
import 'ace-builds/css/theme/tomorrow_night_bright.css';
import 'ace-builds/css/theme/cloud_editor.css';
import 'ace-builds/css/theme/cloud_editor_dark.css';

function DemoCodeEditor({
  ace,
  loading,
  themes,
  preferences,
}: {
  ace: any;
  loading: boolean;
  themes: CodeEditorProps.AvailableThemes;
  preferences?: CodeEditorProps.Preferences;
}) {
  return (
    <CodeEditor
      ace={ace}
      value={sayHelloSample}
      language="javascript"
      preferences={preferences}
      onPreferencesChange={() => {}}
      loading={loading}
      themes={themes}
      i18nStrings={i18nStrings}
    />
  );
}

export default function ThemesPage() {
  const [ace, setAce] = useState<any>();
  console.log(ace);

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
      <h1>Code Editor - themes</h1>
      <ScreenshotArea style={{ maxWidth: 960 }}>
        <SpaceBetween size="xs">
          {/* Default (dawn/tomorrow_night_bright) */}
          <DemoCodeEditor
            ace={ace}
            loading={!ace}
            themes={{ light: ['dawn', 'github'], dark: ['tomorrow_night_bright', 'dracula'] }}
          />

          {/* Default if cloud editor themes are provided (cloud_editor/cloud_editor_dark) */}
          <DemoCodeEditor
            ace={ace}
            loading={!ace}
            themes={{ light: ['cloud_editor', 'dawn'], dark: ['cloud_editor_dark', 'tomorrow_night_bright'] }}
          />

          {/* Invalid theme value */}
          <DemoCodeEditor
            ace={ace}
            loading={!ace}
            themes={{ light: ['cloud_editor'], dark: ['cloud_editor_dark'] }}
            preferences={{ theme: 'ambiance', wrapLines: true }}
          />
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
