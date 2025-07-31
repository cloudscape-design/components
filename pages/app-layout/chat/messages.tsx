// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ChatBubble from '@cloudscape-design/chat-components/chat-bubble';
import Alert from '@cloudscape-design/components/alert';
import FileTokenGroup from '@cloudscape-design/components/file-token-group';
import LiveRegion from '@cloudscape-design/components/live-region';
import SpaceBetween from '@cloudscape-design/components/space-between';

import FeedbackDialog from './additional-info/feedback-dialog';
import { ChatBubbleAvatar, CodeViewActions, FeedbackActions } from './common-components';
import { AUTHORS, fileTokenGroupI18nStrings, Message, supportPromptItems } from './config';

import './chat.scss';

export default function Messages({
  messages = [],
  setShowFeedbackDialog,
  addMessage,
}: {
  messages: Array<Message>;
  setShowFeedbackDialog: (index: number, show: boolean) => void;
  addMessage: (index: number, message: Message) => void;
}) {
  const latestMessage: Message = messages[messages.length - 1];

  const promptText = supportPromptItems.map(item => item.text);

  return (
    <div className="messages" role="region" aria-label="Chat">
      <LiveRegion hidden={true} assertive={latestMessage?.type === 'alert'}>
        {latestMessage?.type === 'alert' && latestMessage.header}
        {latestMessage?.content}
        {latestMessage?.type === 'chat-bubble' &&
          latestMessage.supportPrompts &&
          `There are ${promptText.length} support prompts accompanying this message. ${promptText}`}
      </LiveRegion>

      {messages.map((message, index) => {
        if (message.type === 'alert') {
          return (
            <Alert
              key={'error-alert' + index}
              header={message.header}
              type="error"
              statusIconAriaLabel="Error"
              data-testid={'error-alert' + index}
            >
              {message.content}
            </Alert>
          );
        }

        const author = AUTHORS[message.authorId];

        return (
          <SpaceBetween size="xs" key={message.authorId + message.timestamp}>
            <ChatBubble
              avatar={<ChatBubbleAvatar {...author} loading={message.avatarLoading} />}
              ariaLabel={`${author.name} at ${message.timestamp}`}
              type={author.type === 'gen-ai' ? 'incoming' : 'outgoing'}
              hideAvatar={message.hideAvatar}
              actions={
                message.actions === 'code-view' ? (
                  <CodeViewActions contentToCopy={message.contentToCopy || ''} />
                ) : message.actions === 'feedback' ? (
                  <FeedbackActions
                    contentToCopy={message.contentToCopy || ''}
                    onNotHelpfulFeedback={() => setShowFeedbackDialog(index, true)}
                  />
                ) : null
              }
            >
              <SpaceBetween size="xs">
                <div key={message.authorId + message.timestamp + 'content'}>{message.content}</div>
                {message.files && message.files.length > 0 && (
                  <FileTokenGroup
                    readOnly={true}
                    items={message.files.map(file => ({ file }))}
                    limit={3}
                    onDismiss={() => {
                      /* empty function for read only token */
                    }}
                    alignment="horizontal"
                    showFileThumbnail={true}
                    i18nStrings={fileTokenGroupI18nStrings}
                  />
                )}
              </SpaceBetween>
            </ChatBubble>

            {message.showFeedbackDialog && (
              <div className="other-content-vertically-align">
                <FeedbackDialog
                  onDismiss={() => setShowFeedbackDialog(index, false)}
                  onSubmit={() => {
                    setShowFeedbackDialog(index, false);
                    addMessage(index + 1, {
                      type: 'chat-bubble',
                      authorId: 'gen-ai',
                      content: 'Your feedback has been submitted. Thank you for your additional feedback.',
                      timestamp: new Date().toLocaleTimeString(),
                      hideAvatar: true,
                    });
                  }}
                />
              </div>
            )}

            {latestMessage.type === 'chat-bubble' && latestMessage.supportPrompts && index === messages.length - 1 && (
              <div className="other-content-vertically-align">{message.supportPrompts}</div>
            )}
          </SpaceBetween>
        );
      })}
    </div>
  );
}
