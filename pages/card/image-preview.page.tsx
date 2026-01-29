// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import Avatar from '@cloudscape-design/chat-components/avatar';
import ChatBubble from '@cloudscape-design/chat-components/chat-bubble';

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
import image from '../container/images/16-9.png';
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
      title="Image preview"
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
            Create an image of a dog standing in aquamarine water.
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
            <div style={{ minInlineSize: 500 }}>
              <Card
                header="image-title.jpg"
                description="Metadata about file - 4GB"
                actions={
                  <ButtonGroup
                    onItemClick={() => null}
                    items={[
                      {
                        type: 'icon-button',
                        id: 'download',
                        iconName: 'download',
                        text: 'Download',
                      },
                      {
                        type: 'icon-button',
                        id: 'expand',
                        iconName: 'expand',
                        text: 'Expand',
                      },
                    ]}
                    variant={'icon'}
                  />
                }
                disableContentPaddings={true}
                reducedBorderRadius={reducedBorderRadius}
                reducedPadding={reducedPadding}
              >
                <div
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    width: '100%',
                    height: 300,
                  }}
                />
              </Card>
            </div>
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
            <Box>Here you go – an image of a dog standing in aquamarine water.</Box>
          </ChatBubble>
        </SpaceBetween>
      </Container>
    </CardPage>
  );
}
