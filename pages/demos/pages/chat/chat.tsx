// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useRef, useState } from 'react';

import { SupportPromptGroupProps } from '@cloudscape-design/chat-components/support-prompt-group';
import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import FileDropzone, { useFilesDragging } from '@cloudscape-design/components/file-dropzone';
import FileInput from '@cloudscape-design/components/file-input';
import FileTokenGroup from '@cloudscape-design/components/file-token-group';
import Header from '@cloudscape-design/components/header';
import Icon from '@cloudscape-design/components/icon';
import Link from '@cloudscape-design/components/link';
import PromptInput from '@cloudscape-design/components/prompt-input';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { isVisualRefresh } from '../../common/apply-mode';
import { FittedContainer, ScrollableContainer } from './common-components';
import {
  fileTokenGroupI18nStrings,
  getInitialMessages,
  getInvalidPromptResponse,
  getLoadingMessage,
  Message,
  responseList,
  supportPromptItems,
  supportPromptMessageOne,
  supportPromptMessageTwo,
  VALID_PROMPTS,
  validLoadingPrompts,
} from './config';
import Messages from './messages';
import { asyncCallback } from './pending-callbacks';

import '../../styles/chat.scss';

export default function Chat() {
  const waitTimeBeforeLoading = 300;
  // The loading state will be shown for 4 seconds for loading prompt and 1.5 seconds for rest of the prompts
  const waitTimeBeforeResponse = (isLoadingPrompt: boolean = false) => (isLoadingPrompt ? 4000 : 1500);

  const [prompt, setPrompt] = useState('');
  const [isGenAiResponseLoading, setIsGenAiResponseLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const { areFilesDragging } = useFilesDragging();

  const onSupportPromptClick = (detail: SupportPromptGroupProps.ItemClickDetail) => {
    let newMessage: Message;

    if (detail.id === 'typescript') {
      newMessage = supportPromptMessageOne;
    }

    if (detail.id === 'expand') {
      newMessage = supportPromptMessageTwo;
    }

    const supportPromptText = supportPromptItems.find(item => item.id === detail.id)?.text;

    const newUserMessage: Message = {
      type: 'chat-bubble',
      authorId: 'user-jane-doe',
      content: supportPromptText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage]);

    promptInputRef.current?.focus();

    asyncCallback(() => {
      setIsGenAiResponseLoading(true);
      setMessages(prevMessages => [...prevMessages, getLoadingMessage()]);

      asyncCallback(() => {
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          updatedMessages.splice(prevMessages.length - 1, 1, newMessage);
          return updatedMessages;
        });

        setIsGenAiResponseLoading(false);
      }, waitTimeBeforeResponse());
    }, waitTimeBeforeLoading);
  };

  const setShowFeedbackDialog = (index: number, show: boolean) => {
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages];
      const updatedMessage = { ...prevMessages[index], showFeedbackDialog: show };
      updatedMessages.splice(index, 1, updatedMessage);
      return updatedMessages;
    });
  };

  const lastMessageContent = messages[messages.length - 1]?.content;

  useEffect(() => {
    setMessages(getInitialMessages(onSupportPromptClick));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Scroll to the bottom to show the new/latest message
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 0);
  }, [lastMessageContent]);

  const onPromptSend = ({ detail: { value } }: { detail: { value: string } }) => {
    if ((!value && files.length === 0) || (value.length === 0 && files.length === 0) || isGenAiResponseLoading) {
      return;
    }

    const newMessage: Message = {
      type: 'chat-bubble',
      authorId: 'user-jane-doe',
      content: value,
      timestamp: new Date().toLocaleTimeString(),
      files,
    };

    let fileValue = files;

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setPrompt('');
    setFiles([]);

    const lowerCasePrompt = value.toLowerCase();

    const isLoadingPrompt = validLoadingPrompts.includes(lowerCasePrompt);

    // Show loading state
    asyncCallback(() => {
      setIsGenAiResponseLoading(true);
      setMessages(prevMessages => [...prevMessages, getLoadingMessage()]);

      asyncCallback(() => {
        const validPrompt =
          fileValue.length > 0
            ? VALID_PROMPTS.find(({ prompt }) => prompt.includes('file'))
            : VALID_PROMPTS.find(({ prompt }) => prompt.includes(lowerCasePrompt));

        // Send Gen-AI response, replacing the loading chat bubble
        setMessages(prevMessages => {
          const response = validPrompt ? validPrompt.getResponse(onSupportPromptClick) : getInvalidPromptResponse();
          const updatedMessages = [...prevMessages];
          updatedMessages.splice(prevMessages.length - 1, 1, response);
          return updatedMessages;
        });
        setIsGenAiResponseLoading(false);
        fileValue = [];
      }, waitTimeBeforeResponse(isLoadingPrompt));
    }, waitTimeBeforeLoading);
  };

  const addMessage = (index: number, message: Message) => {
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages];
      updatedMessages.splice(index, 0, message);
      return updatedMessages;
    });
  };

  return (
    <div className={`chat-container ${!isVisualRefresh && 'classic'}`}>
      {showAlert && (
        <Alert dismissible={true} statusIconAriaLabel="Info" onDismiss={() => setShowAlert(false)}>
          <ExpandableSection
            variant="inline"
            headerText="This demo showcases how to use generative AI components to build a generative AI chat. The interactions and
          functionality are limited."
          >
            {responseList}
          </ExpandableSection>
        </Alert>
      )}

      <FittedContainer>
        <Container
          data-testid="chat-container"
          header={<Header variant="h3">Generative AI chat</Header>}
          fitHeight={true}
          disableContentPaddings={true}
          footer={
            <>
              {/* During loading, action button looks enabled but functionality is disabled. */}
              {/* This will be fixed once prompt input receives an update where the action button can receive focus while being disabled. */}
              {/* In the meantime, changing aria labels of prompt input and action button to reflect this. */}
              <PromptInput
                ref={promptInputRef}
                onChange={({ detail }) => setPrompt(detail.value)}
                onAction={onPromptSend}
                value={prompt}
                actionButtonAriaLabel={isGenAiResponseLoading ? 'Send message button - suppressed' : 'Send message'}
                actionButtonIconName="send"
                ariaLabel={isGenAiResponseLoading ? 'Prompt input - suppressed' : 'Prompt input'}
                placeholder="Ask a question"
                autoFocus={true}
                disableSecondaryActionsPaddings={true}
                secondaryActions={
                  <Box padding={{ left: 'xxs', top: 'xs' }}>
                    <FileInput
                      ariaLabel="Chat demo file input"
                      variant="icon"
                      multiple={true}
                      value={files}
                      onChange={({ detail }) => setFiles(prev => [...prev, ...detail.value])}
                    />
                  </Box>
                }
                secondaryContent={
                  areFilesDragging ? (
                    <FileDropzone onChange={({ detail }) => setFiles(prev => [...prev, ...detail.value])}>
                      <SpaceBetween size="xs" alignItems="center">
                        <Icon name="upload" />
                        <Box>Drop files here</Box>
                      </SpaceBetween>
                    </FileDropzone>
                  ) : (
                    files.length > 0 && (
                      <FileTokenGroup
                        items={files.map(file => ({ file }))}
                        onDismiss={({ detail }) => {
                          setFiles(files => files.filter((_, index) => index !== detail.fileIndex));
                          if (files.length === 1) {
                            promptInputRef.current?.focus();
                          }
                        }}
                        limit={3}
                        alignment="horizontal"
                        showFileThumbnail={true}
                        i18nStrings={fileTokenGroupI18nStrings}
                      />
                    )
                  )
                }
              />
              <Box color="text-body-secondary" margin={{ top: 'xs' }} fontSize="body-s">
                Use of this service is subject to the{' '}
                <Link href="#" external={true} variant="primary" fontSize="inherit">
                  AWS Responsible AI Policy
                </Link>
                .
              </Box>
            </>
          }
        >
          <ScrollableContainer ref={messagesContainerRef}>
            <Messages messages={messages} setShowFeedbackDialog={setShowFeedbackDialog} addMessage={addMessage} />
          </ScrollableContainer>
        </Container>
      </FittedContainer>
    </div>
  );
}
