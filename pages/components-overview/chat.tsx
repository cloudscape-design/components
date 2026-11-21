// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Avatar from '@cloudscape-design/chat-components/avatar';
import ChatBubble from '@cloudscape-design/chat-components/chat-bubble';
import SupportPromptGroup from '@cloudscape-design/chat-components/support-prompt-group';

import Box from '~components/box';
import ButtonGroup from '~components/button-group';
import FileTokenGroup from '~components/file-token-group';
import Grid from '~components/grid';
import PromptInput from '~components/prompt-input';
import SpaceBetween from '~components/space-between';

import { Section } from './utils';

export default function Chat() {
  const [value, setValue] = useState('');
  const [files, setFiles] = React.useState([
    new File([new Blob(['Test content'])], 'file-1.pdf', { type: 'application/pdf', lastModified: 1590962400000 }),
    new File([new Blob(['Test content'])], 'file-2.pdf', { type: 'application/pdf', lastModified: 1590962400000 }),
  ]);
  return (
    <Section header="Chat components" level="h2" description="Imported from @cloudscape-design/chat-components">
      <Grid
        gridDefinition={[
          { colspan: { default: 12, xxs: 3 } },
          { colspan: { default: 12, xxs: 3 } },
          { colspan: { default: 12, xxs: 6 } },
        ]}
      >
        <SpaceBetween size="s">
          <ChatBubble
            avatar={<Avatar initials="JD" tooltipText="Jane Doe" ariaLabel="Jane Doe" />}
            ariaLabel="Jane Doe message"
            type="outgoing"
          >
            This is an outgoing message from a user.
          </ChatBubble>
          <ChatBubble
            avatar={<Avatar color="gen-ai" iconName="gen-ai" tooltipText="AI Assistant" ariaLabel="AI Assistant" />}
            ariaLabel="AI Assistant message"
            type="incoming"
          >
            This is an incoming message from the AI assistant.
          </ChatBubble>
          <ChatBubble
            ariaLabel="Generative AI assistant loading"
            showLoadingBar={true}
            type="incoming"
            avatar={
              <Avatar
                loading={true}
                color="gen-ai"
                iconName="gen-ai"
                ariaLabel="Generative AI assistant"
                tooltipText="Generative AI assistant"
              />
            }
          >
            <Box color="text-status-inactive">Generating response</Box>
          </ChatBubble>
        </SpaceBetween>

        <SpaceBetween size="xs">
          <SupportPromptGroup
            ariaLabel="Support prompts"
            items={[
              { text: 'How can I help you today?', id: 'help' },
              { text: 'Tell me more about this topic', id: 'more' },
              { text: 'Show me an example', id: 'example' },
            ]}
            onItemClick={() => {}}
          />
        </SpaceBetween>

        <PromptInput
          onChange={({ detail }) => setValue(detail.value)}
          value={value}
          actionButtonAriaLabel="Send message"
          actionButtonIconName="send"
          disableSecondaryActionsPaddings={true}
          placeholder="Ask a question"
          ariaLabel="Prompt input with files"
          secondaryActions={
            <Box padding={{ left: 'xxs', top: 'xs' }}>
              <ButtonGroup
                ariaLabel="Chat actions"
                items={[
                  { type: 'icon-button', id: 'upload', iconName: 'upload', text: 'Upload files' },
                  { type: 'icon-button', id: 'expand', iconName: 'expand', text: 'Go full page' },
                ]}
                variant="icon"
              />
            </Box>
          }
          secondaryContent={
            <FileTokenGroup
              items={files.map(file => ({ file }))}
              onDismiss={({ detail }) => setFiles(f => f.filter((_, i) => i !== detail.fileIndex))}
              alignment="horizontal"
              showFileSize={true}
              showFileLastModified={true}
              showFileThumbnail={true}
              i18nStrings={{
                removeFileAriaLabel: () => 'Remove file',
                limitShowFewer: 'Show fewer files',
                limitShowMore: 'Show more files',
                errorIconAriaLabel: 'Error',
                warningIconAriaLabel: 'Warning',
              }}
            />
          }
        />
      </Grid>
    </Section>
  );
}
