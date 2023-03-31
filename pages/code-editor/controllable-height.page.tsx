// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import CodeEditor, { CodeEditorProps } from '~components/code-editor';
import { i18nStrings } from './base-props';
import ScreenshotArea from '../utils/screenshot-area';

import { sayHelloSample } from './code-samples';

export default function () {
  const [ace, setAce] = useState<CodeEditorProps['ace']>();
  const [value, setValue] = useState(sayHelloSample);
  const [loading, setLoading] = useState(true);
  const [resizingHeight, setResizingHeight] = useState(240);
  useEffect(() => {
    import('ace-builds').then(ace => {
      ace.config.set('basePath', './ace/');
      ace.config.set('useStrictCSP', true);
      setAce(ace);
      setLoading(false);
    });
  }, []);

  return (
    <article>
      <h1>Code Editor - controllable Height</h1>
      <ScreenshotArea style={{ maxWidth: 960 }}>
        <CodeEditor
          ace={ace}
          value={value}
          language="javascript"
          onDelayedChange={event => setValue(event.detail.value)}
          onPreferencesChange={() => {}}
          loading={loading}
          i18nStrings={i18nStrings}
          editorContentHeight={resizingHeight}
          onEditorContentResize={event => setResizingHeight(event.detail.height)}
          id={'code-editor-controlled'}
        />
        <div id="event-content">current Height : {resizingHeight}</div>

        <CodeEditor
          ace={ace}
          value={value}
          language="javascript"
          onDelayedChange={event => setValue(event.detail.value)}
          onPreferencesChange={() => {}}
          loading={loading}
          i18nStrings={i18nStrings}
          editorContentHeight={10}
          onEditorContentResize={() => {}}
          id={'editor-minheight'}
        />
      </ScreenshotArea>
    </article>
  );
}
