// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import Avatar from '@cloudscape-design/chat-components/avatar';
import ChatBubble from '@cloudscape-design/chat-components/chat-bubble';
import CodeView from '@cloudscape-design/code-view/code-view';

// import pythonHighlight from '@cloudscape-design/code-view/highlight/python';
import Box from '~components/box';
import ButtonGroup from '~components/button-group';
import Container from '~components/container';
import Header from '~components/header';
import Card from '~components/internal/components/card';
import PromptInput from '~components/prompt-input';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';
import { spaceScaledXs } from '~design-tokens';

import AppContext, { AppContextType } from '../app/app-context';
import { CardPage } from './common';

type PageContext = React.Context<
  AppContextType<{
    reducedBorderRadius?: boolean;
    reducedPadding?: boolean;
  }>
>;

export default function ButtonsScenario() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const [promptValue, setPromptValue] = useState('');

  const reducedBorderRadius = urlParams.reducedBorderRadius ?? false;
  const reducedPadding = urlParams.reducedPadding ?? false;

  return (
    <CardPage
      title="Code snippet"
      settings={
        <SpaceBetween size="s">
          <Toggle
            checked={reducedBorderRadius}
            onChange={({ detail }) => setUrlParams({ reducedBorderRadius: detail.checked })}
          >
            Reduced border radius (8px)
          </Toggle>
          <Toggle checked={reducedPadding} onChange={({ detail }) => setUrlParams({ reducedPadding: detail.checked })}>
            Reduced padding (12px)
          </Toggle>
        </SpaceBetween>
      }
    >
      <Container
        header={<Header variant="h2">Generative AI assistant</Header>}
        footer={
          <PromptInput
            value={promptValue}
            onChange={({ detail }) => setPromptValue(detail.value)}
            onAction={() => {
              console.log('Submitted:', promptValue);
              setPromptValue('');
            }}
            actionButtonAriaLabel="Submit prompt"
            actionButtonIconName="send"
            placeholder="Ask a question or describe what you need..."
            secondaryActions={
              <ButtonGroup
                variant="icon"
                items={[
                  { type: 'icon-button', id: 'attach', iconName: 'upload', text: 'Attach file' },
                  { type: 'icon-button', id: 'at', iconName: 'contact', text: 'Mention' },
                  { type: 'icon-button', id: 'slash', iconName: 'status-info', text: 'Commands' },
                ]}
              />
            }
          />
        }
      >
        <SpaceBetween size="l">
          <ChatBubble
            type="outgoing"
            avatar={<Avatar ariaLabel="User avatar" iconName="user-profile" />}
            ariaLabel="User message"
          >
            Show me the simplest Lambda function to log S3 uploads
          </ChatBubble>

          <div style={{ display: 'flex', gap: spaceScaledXs }}>
            <div style={{ paddingBlockStart: spaceScaledXs }}>
              <Avatar
                color="gen-ai"
                iconName="gen-ai"
                ariaLabel="Generative AI assistant"
                tooltipText="Generative AI assistant"
              />
            </div>
            <Card
              header="Python"
              actions={
                <ButtonGroup
                  variant="icon"
                  items={[
                    { type: 'icon-button', id: 'download', iconName: 'download', text: 'Download code' },
                    { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy code' },
                  ]}
                />
              }
              reducedBorderRadius={reducedBorderRadius}
              reducedPadding={reducedPadding}
            >
              <CodeView
                // highlight={pythonHighlight}
                content={`def lambda_handler(event, context):
  bucket = event['Records'][0]['s3']['bucket']['name']
  key = event['Records'][0]['s3']['object']['key']
  print(f'New file uploaded: {key} in bucket {bucket}')
  return {'statusCode': 200}`}
              />
            </Card>
          </div>

          <ChatBubble
            type="incoming"
            avatar={<Avatar ariaLabel="AI assistant avatar" iconName="gen-ai" color="gen-ai" />}
            ariaLabel="AI assistant response"
            hideAvatar={true}
            actions={
              <ButtonGroup
                variant="icon"
                items={[
                  { type: 'icon-button', id: 'thumbs-up', iconName: 'thumbs-up', text: 'Good response' },
                  { type: 'icon-button', id: 'thumbs-down', iconName: 'thumbs-down', text: 'Bad response' },
                  { type: 'icon-button', id: 'refresh', iconName: 'refresh', text: 'Regenerate' },
                ]}
              />
            }
          >
            <SpaceBetween size="m">
              <Box>Here is a a snippet of the simplest Lambda function to log S3 uploads.</Box>
            </SpaceBetween>
          </ChatBubble>
        </SpaceBetween>
      </Container>
    </CardPage>
  );
}
