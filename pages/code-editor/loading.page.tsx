// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import CodeEditor from '~components/code-editor';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './base-props';

export default function () {
  return (
    <article>
      <h1>Code Editor - loading</h1>
      <ScreenshotArea style={{ maxWidth: 960 }}>
        <CodeEditor
          ace={null}
          value=""
          loading={true}
          i18nStrings={i18nStrings}
          language="javascript"
          onPreferencesChange={() => {}}
        />
      </ScreenshotArea>
    </article>
  );
}
