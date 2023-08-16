// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';
import CodeSnippet, { CodeSnippetProps } from '~components/code-snippet';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './base-props';

import { awsTemplateSample } from '../code-editor/code-samples';
import { Box, Checkbox, Header, Select, SpaceBetween } from '~components';
import AppContext, { AppContextType } from '../app/app-context';

type PageContext = React.Context<
  AppContextType<{
    showGutter: boolean;
    wrapLines: boolean;
    theme: 'dawn' | 'tomorrow_night_bright';
  }>
>;

export default function Page() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const showGutter = !!urlParams.showGutter;
  const wrapLines = !!urlParams.wrapLines;
  const theme = urlParams.theme || 'dawn';
  const themeOptions = [
    { value: 'dawn', label: 'Dawn' },
    { value: 'tomorrow_night_bright', label: 'Tomorrow Night Bright' },
  ];
  const selectedOption = themeOptions.find(option => option.value === theme) ?? themeOptions[0];

  const [ace, setAce] = useState<CodeSnippetProps['ace']>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('ace-builds').then(ace => {
      ace.config.set('basePath', './ace/');
      ace.config.set('themePath', './ace/');
      ace.config.set('modePath', './ace/');
      ace.config.set('workerPath', './ace/');
      ace.config.set('useStrictCSP', true);
      setAce(ace);
      setLoading(false);
    });
  }, []);

  return (
    <Box margin="m">
      <Box margin={{ bottom: 's' }}>
        <Header>Code snippet demo</Header>
      </Box>

      <SpaceBetween direction="horizontal" size="m" alignItems="center">
        <Checkbox checked={showGutter} onChange={e => setUrlParams({ showGutter: e.detail.checked })}>
          Show gutter
        </Checkbox>

        <Checkbox checked={wrapLines} onChange={e => setUrlParams({ wrapLines: e.detail.checked })}>
          Wrap lines
        </Checkbox>

        <SpaceBetween direction="horizontal" size="s" alignItems="center">
          <Select
            id="theme-selector"
            selectedOption={selectedOption}
            options={themeOptions}
            onChange={e => setUrlParams({ theme: e.detail.selectedOption.value as any })}
          />
          <label htmlFor="theme-selector">Theme</label>
        </SpaceBetween>
      </SpaceBetween>

      <ScreenshotArea>
        <CodeSnippet
          ace={ace}
          value={awsTemplateSample}
          language="yaml"
          preferences={{ showGutter, wrapLines, theme }}
          loading={loading}
          i18nStrings={i18nStrings}
        />
      </ScreenshotArea>
    </Box>
  );
}
