// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { SupportPromptGroupProps } from '@cloudscape-design/chat-components/support-prompt-group';

import Box from '~components/box';
import Container from '~components/container';
import FileDropzone, { useFilesDragging } from '~components/file-dropzone';
import FileInput from '~components/file-input';
import FileTokenGroup from '~components/file-token-group';
import Header from '~components/header';
import Icon from '~components/icon';
import Link from '~components/link';
import PromptInput from '~components/prompt-input';
import SpaceBetween from '~components/space-between';

import { ScrollableContainer } from './common-components';
import {
  fileTokenGroupI18nStrings,
  getInitialMessages,
  getInvalidPromptResponse,
  getLoadingMessage,
  Message,
  supportPromptItems,
  supportPromptMessageOne,
  supportPromptMessageTwo,
  VALID_PROMPTS,
  validLoadingPrompts,
} from './config';
import Messages from './messages';

import styles from './chat.scss';

export default function Chat() {
  const waitTimeBeforeLoading = 300;
  // The loading state will be shown for 4 seconds for loading prompt and 1.5 seconds for rest of the prompts
  const waitTimeBeforeResponse = (isLoadingPrompt: boolean = false) => (isLoadingPrompt ? 4000 : 1500);

  const [prompt, setPrompt] = useState('');
  const [isGenAiResponseLoading, setIsGenAiResponseLoading] = useState(false);
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

    setTimeout(() => {
      setIsGenAiResponseLoading(true);
      setMessages(prevMessages => [...prevMessages, getLoadingMessage()]);

      setTimeout(() => {
        setMessages(prevMessages => {
          prevMessages.splice(prevMessages.length - 1, 1, newMessage);
          return prevMessages;
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
    setTimeout(() => {
      setIsGenAiResponseLoading(true);
      setMessages(prevMessages => [...prevMessages, getLoadingMessage()]);

      setTimeout(() => {
        const validPrompt =
          fileValue.length > 0
            ? VALID_PROMPTS.find(({ prompt }) => prompt.includes('file'))
            : VALID_PROMPTS.find(({ prompt }) => prompt.includes(lowerCasePrompt));

        // Send Gen-AI response, replacing the loading chat bubble
        setMessages(prevMessages => {
          const response = validPrompt ? validPrompt.getResponse(onSupportPromptClick) : getInvalidPromptResponse();

          prevMessages.splice(prevMessages.length - 1, 1, response);
          return prevMessages;
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
    <div className={`chat-container`}>
      <Container
        className={styles['chat-internal-container']}
        header={<Header variant="h3">Generative AI chat</Header>}
        // fitHeight={true}
        // disableContentPaddings={true}
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
    </div>
  );
}
