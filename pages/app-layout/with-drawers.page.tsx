// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  AppLayout,
  Button,
  Form,
  FormField,
  HelpPanel,
  Input,
  NonCancelableCustomEvent,
  SpaceBetween,
} from '~components';
import appLayoutLabels from './utils/labels';
import ScreenshotArea from '../utils/screenshot-area';

export default function WithDrawers() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);

  const drawers = {
    drawers: {
      ariaLabel: 'Drawers',
      activeDrawerId: activeDrawerId,
      widths: {
        'cloudscape-help': 600,
      },
      items: [
        {
          ariaLabels: {
            closeButton: 'Cloudscape Assistant close button',
            content: 'Cloudscape Assistant drawer content',
            triggerButton: 'Cloudscape Assistant trigger button',
            resizeHandle: 'Cloudscape Assistant resize handle',
          },
          content: <CloudscapeAssistant />,
          id: 'cloudscape-help',
          trigger: {
            iconName: 'contact',
          },
        },
      ],
      onChange: (event: NonCancelableCustomEvent<string>) => {
        setActiveDrawerId(event.detail);
      },
    },
  };

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={appLayoutLabels}
        {...drawers}
        content={
          <div style={{ width: 700, display: 'flex', height: '100%' }}>
            <CloudscapeAssistant />
          </div>
        }
      />
    </ScreenshotArea>
  );
}

function ChatMessage({ message }: any) {
  return <ReactMarkdown>{message}</ReactMarkdown>;
}

function CloudscapeAssistant() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello there! Is there anything I can help you with?',
    },
  ]);

  const handleSend = () => {
    setLoading(true);
    fetch('http://localhost:3000', {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: [...messages, { role: 'user', content: value }] }),
    })
      .then(async response => {
        if (response.status === 200) {
          return response.json();
        }

        const data = await response.json();
        throw new Error(data.error);
      })
      .then(response => {
        setMessages(response.messages);
      })
      .catch(err => {
        setErrorMessage(err.message);
      })
      .finally(() => {
        setLoading(false);
        setValue('');
      });
  };

  return (
    <HelpPanel header={<h2>My Assistant</h2>}>
      <Form errorText={errorMessage}>
        <SpaceBetween size="l">
          {messages.map(({ content }, index) => (
            <ChatMessage key={index} message={content} />
          ))}
        </SpaceBetween>
        {loading && <>Loading</>}
        <FormField secondaryControl={<Button onClick={handleSend}>Send</Button>}>
          <Input
            placeholder="Ask me anything"
            value={value}
            onChange={event => setValue(event.detail.value)}
            type="search"
          />
        </FormField>
      </Form>
    </HelpPanel>
  );
}
