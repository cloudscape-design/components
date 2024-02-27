// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
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

const THEME_GROUPS = [
  // Default (dawn/tomorrow_night_bright)
  { light: ['dawn', 'github'], dark: ['tomorrow_night_bright', 'dracula'] },
  // Default if cloud editor themes are provided (cloud_editor/cloud_editor_dark)
  { light: ['cloud_editor', 'dawn'], dark: ['cloud_editor_dark', 'tomorrow_night_bright'] },
];

interface IState {
  ace: any;
  value: string;
  language: CodeEditorProps.Language;
  preferences?: CodeEditorProps.Preferences;
  loading: boolean;
}

export default class App extends React.PureComponent<null, IState> {
  initialValue = sayHelloSample;

  constructor(props: null) {
    super(props);
    this.state = {
      ace: undefined,
      value: this.initialValue,
      language: 'javascript',
      preferences: undefined,
      loading: true,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    import('ace-builds').then(ace => {
      ace.config.set('basePath', './ace/');
      ace.config.set('themePath', './ace/');
      ace.config.set('modePath', './ace/');
      ace.config.set('workerPath', './ace/');
      ace.config.set('useStrictCSP', true);
      this.setState({ ace, loading: false });
    });
  }

  onPreferencesChange(preferences: CodeEditorProps.Preferences) {
    this.setState({ preferences });
  }

  render() {
    return (
      <article>
        <h1>Code Editor - themes</h1>
        <ScreenshotArea style={{ maxWidth: 960 }}>
          <SpaceBetween size="xs">
            {THEME_GROUPS.map((themes, i) => (
              <CodeEditor
                key={i}
                ace={this.state.ace}
                value={this.state.value}
                language="javascript"
                onDelayedChange={e => this.setState({ value: e.detail.value })}
                preferences={this.state.preferences}
                onPreferencesChange={e => this.onPreferencesChange(e.detail)}
                loading={this.state.loading}
                themes={themes}
                i18nStrings={i18nStrings}
              />
            ))}
          </SpaceBetween>
        </ScreenshotArea>
      </article>
    );
  }
}
