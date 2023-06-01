// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import SplitButton, { SplitButtonProps } from '~components/split-button';
import ScreenshotArea from '../utils/screenshot-area';
import { CodeEditor, CodeEditorProps, ColumnLayout, FormField, Header } from '~components';
import { useEffect, useState } from 'react';
import { i18nStrings as codeEditorI18nStrings } from '../code-editor/base-props';

export default function SplitButtonPage() {
  const [ace, setAce] = useState<CodeEditorProps['ace']>();
  const [aceLoading, setAceLoading] = useState(true);
  useEffect(() => {
    import('ace-builds').then(ace => {
      ace.config.set('basePath', './ace/');
      ace.config.set('useStrictCSP', true);
      setAce(ace);
      setAceLoading(false);
    });
  }, []);

  const [parsedData, setParsedData] = useState<SplitButtonProps>({
    variant: 'normal',
    expandToViewport: true,
    items: [
      { id: 'launch-instance', type: 'button', text: 'Launch instance', iconName: 'add-plus' },
      { id: 'view-running-instances', type: 'link', text: 'View running instances', external: true },
      {
        id: 'instance-actions',
        type: 'button-dropdown',
        ariaLabel: 'open dropdown',
        items: [
          {
            id: 'launch-instance-from-template',
            text: 'Launch instance from template',
            disabledReason: 'No template available',
            disabled: true,
          },
        ],
      },
    ],
  });
  const [dataStr, setDataStr] = useState('');
  const [dataError, setDataError] = useState('');
  const [editorLoading, setEditorLoading] = useState(false);

  useEffect(() => {
    if (!dataStr) {
      return;
    }

    setEditorLoading(true);

    const timeoutId = setTimeout(() => {
      try {
        setParsedData(JSON.parse(dataStr));
        setDataError('');
      } catch (error: any) {
        setDataError(error.message);
      }

      setEditorLoading(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [dataStr]);

  useEffect(() => {
    if (!editorLoading && !dataError) {
      setDataStr(JSON.stringify(parsedData, null, 2));
    }
  }, [parsedData, editorLoading, dataError]);

  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <Header variant="h1">Simple SplitButton</Header>
        <ColumnLayout columns={2}>
          <FormField
            label={!editorLoading ? 'SplitButtonProps' : 'SplitButtonProps (Updating...)'}
            errorText={dataError}
            stretch={true}
          >
            <CodeEditor
              ace={ace}
              value={dataStr}
              language="json"
              onDelayedChange={event => setDataStr(event.detail.value)}
              onPreferencesChange={() => {}}
              loading={aceLoading}
              i18nStrings={codeEditorI18nStrings}
            />
          </FormField>

          <div
            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <SplitButton {...parsedData} />
          </div>
        </ColumnLayout>
      </article>
    </ScreenshotArea>
  );
}
