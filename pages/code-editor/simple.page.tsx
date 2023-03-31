// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Button from '~components/button';
import CodeEditor, { CodeEditorProps } from '~components/code-editor';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings, themes } from './base-props';

import { buildSample, awsTemplateSample } from './code-samples';

interface IState {
  ace: any;
  value: string;
  language: CodeEditorProps.Language;
  preferences?: CodeEditorProps.Preferences;
  loading: boolean;
}

export default class App extends React.PureComponent<null, IState> {
  initialValue = 'const pi = 3.14;';

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
        <h1>Code Editor - simple page</h1>
        <ScreenshotArea style={{ maxWidth: 960 }}>
          <CodeEditor
            ace={this.state.ace}
            value={this.state.value}
            language={this.state.language}
            onDelayedChange={e => this.setState({ value: e.detail.value })}
            preferences={this.state.preferences}
            onPreferencesChange={e => this.onPreferencesChange(e.detail)}
            loading={this.state.loading}
            i18nStrings={i18nStrings}
            themes={themes}
          />
        </ScreenshotArea>

        <SpaceBetween direction="horizontal" size="xs">
          <Button
            id="javascript_sample_button"
            onClick={() => this.setState({ language: 'javascript', value: buildSample })}
          >
            JavaScript Sample
          </Button>
          <Button onClick={() => this.setState({ language: 'yaml', value: awsTemplateSample })}>YAML Sample</Button>
          <Button onClick={() => this.setState({ value: this.initialValue })}>Reset value</Button>
        </SpaceBetween>
      </article>
    );
  }
}
