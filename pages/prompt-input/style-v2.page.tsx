// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { ButtonGroup, Checkbox, FileTokenGroup, PromptInput, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';
import { i18nStrings } from '../file-upload/shared';

import styles from './style-v2.scss';

export default function StyleV2PromptInputPage() {
  const [value, setValue] = useState('Tell me about AWS Lambda cold starts');
  const [files, setFiles] = useState<File[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);

  return (
    <SimplePage
      title="PromptInput with Style API v2"
      screenshotArea={{}}
      settings={
        <SpaceBetween size="xs">
          <Checkbox checked={disabled} onChange={({ detail }) => setDisabled(detail.checked)}>
            disabled
          </Checkbox>
          <Checkbox checked={invalid} onChange={({ detail }) => setInvalid(detail.checked)}>
            invalid
          </Checkbox>
        </SpaceBetween>
      }
    >
      <div className={styles['styled-prompt-input']}>
        <PromptInput
          value={value}
          onChange={({ detail }) => setValue(detail.value)}
          placeholder="Ask a question..."
          actionButtonIconName="send"
          actionButtonAriaLabel="Send"
          disabled={disabled}
          invalid={invalid}
          minRows={2}
          secondaryActions={
            <ButtonGroup
              ariaLabel="Prompt actions"
              variant="icon"
              onFilesChange={({ detail }) => detail.id === 'files' && setFiles(detail.files)}
              items={[
                { type: 'icon-file-input', id: 'files', text: 'Upload files', multiple: true },
                { type: 'icon-button', id: 'mic', iconName: 'microphone', text: 'Voice input' },
              ]}
            />
          }
          secondaryContent={
            files.length > 0 ? (
              <FileTokenGroup
                items={files.map(file => ({ file }))}
                showFileThumbnail={true}
                onDismiss={({ detail }) => setFiles(prev => prev.filter((_, i) => i !== detail.fileIndex))}
                i18nStrings={i18nStrings}
                alignment="horizontal"
              />
            ) : undefined
          }
        />
      </div>
    </SimplePage>
  );
}
