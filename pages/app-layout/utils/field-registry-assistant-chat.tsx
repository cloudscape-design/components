// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { Box, Button, Container, PromptInput, SpaceBetween, StatusIndicator, Table } from '~components';
import type { FieldDescriptor } from '~components/internal/field-registry';
import awsuiPlugins from '~components/internal/plugins';

type Write = [label: string, value: unknown];
type Decision = 'approve' | 'allow' | 'skip';

interface WriteResult {
  label: string;
  type: 'success' | 'warning' | 'error';
  message: string;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
  results?: ReadonlyArray<WriteResult>;
}

const EXAMPLE_VALUES: ReadonlyArray<Write> = [
  ['Function name', 'my function'],
  ['Runtime', 'Python 3.13'],
  ['Region', 'EU (Ireland)'],
  ['Architecture', 'arm64'],
  ['Account ID', '999999999999'],
  ['Execution role', 'lambda-basic-execution'],
  ['Enable logging', true],
  ['Log level', 'DEBUG'],
  ['Description', 'Created by the form assistant'],
  ['Ephemeral storage (MB)', '1024'],
  ['Subnets', ['subnet-a', 'subnet-b']],
  ['Security group', 'sg-web'],
  ['Enable flow logs', true],
  ['I acknowledge the terms', true],
];

const HELP = 'Try "fill example values", "set Function name to my-function" or "list fields".';

const findField = (fields: ReadonlyArray<FieldDescriptor>, label: string) =>
  fields.find(field => field.label.toLowerCase() === label.trim().toLowerCase());

function parseValue(raw: string, field?: FieldDescriptor): unknown {
  const text = raw.trim().replace(/^["']|["']$/g, '');
  if (field?.type === 'multiselect') {
    return text
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }
  if (field?.type === 'checkbox' || field?.type === 'toggle') {
    return /^(on|true|yes|checked)$/i.test(text) ? true : /^(off|false|no|unchecked)$/i.test(text) ? false : text;
  }
  return text;
}

const describeValue = (value: unknown) => (Array.isArray(value) ? value.join(', ') : String(value));

export default function AssistantChat() {
  const [fields, setFields] = useState<ReadonlyArray<FieldDescriptor>>([]);
  const latestFields = useRef(fields);
  const [messages, setMessages] = useState<ReadonlyArray<Message>>([
    { role: 'assistant', text: `Hi, I can fill in the form on this page. ${HELP}` },
  ]);
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState<Write | null>(null);
  const decide = useRef<((decision: Decision) => void) | null>(null);
  const allowedForChat = useRef(false);

  useEffect(
    () =>
      awsuiPlugins.fieldRegistry.registerListener(next => {
        latestFields.current = next;
        setFields(next);
      }),
    []
  );

  const say = (message: Message) => setMessages(current => [...current, message]);
  const replaceLast = (message: Message) => setMessages(current => [...current.slice(0, -1), message]);

  const confirm = (write: Write) =>
    new Promise<Decision>(resolve => {
      decide.current = resolve;
      setConfirmation(write);
    });

  const answer = (decision: Decision) => {
    setConfirmation(null);
    decide.current?.(decision);
    decide.current = null;
  };

  const run = async (writes: ReadonlyArray<Write>, intro: string) => {
    const results: WriteResult[] = [];
    say({ role: 'assistant', text: intro, results });
    for (const [label, value] of writes) {
      const field = findField(latestFields.current, label);
      const decision = field && !allowedForChat.current ? await confirm([field.label, value]) : 'approve';
      if (decision === 'allow') {
        allowedForChat.current = true;
      }
      let result: WriteResult;
      if (!field) {
        result = { label, type: 'error', message: 'Not on this page' };
      } else if (decision === 'skip') {
        result = { label: field.label, type: 'warning', message: 'Skipped' };
      } else {
        try {
          const written = await awsuiPlugins.fieldRegistry.setValue(field.id, value);
          result = written.errorText
            ? { label: field.label, type: 'warning', message: written.errorText }
            : { label: field.label, type: 'success', message: 'Set' };
        } catch (error) {
          const message = field.statusType === 'loading' ? 'Its options are still loading' : (error as Error).message;
          result = { label: field.label, type: 'error', message };
        }
      }
      results.push(result);
      replaceLast({ role: 'assistant', text: intro, results: [...results] });
    }
    const attention = results.filter(result => result.type !== 'success').length;
    const total = results.length === 1 ? '1 field' : `${results.length} fields`;
    say({
      role: 'assistant',
      text: attention ? `Done. ${attention} of ${total} need your attention.` : `Done. Set ${total}.`,
    });
  };

  const send = async (text: string) => {
    const command = text.trim();
    if (!command || busy) {
      return;
    }
    setPrompt('');
    say({ role: 'user', text: command });
    setBusy(true);
    const set = /^set (.+?) to (.+)$/i.exec(command);
    if (set) {
      const field = findField(latestFields.current, set[1]);
      await run([[set[1], parseValue(set[2], field)]], `I'll set ${field?.label ?? set[1]}.`);
    } else if (/^fill\b|\bexample/i.test(command)) {
      await run(EXAMPLE_VALUES, "I'll fill in the form with example values.");
    } else if (/\bfields?\b/i.test(command)) {
      const labels = latestFields.current.map(field => field.label);
      say({
        role: 'assistant',
        text: labels.length ? `I can see ${labels.length} fields: ${labels.join(', ')}.` : "I can't see any fields.",
      });
    } else {
      say({ role: 'assistant', text: `I didn't understand that. ${HELP}` });
    }
    setBusy(false);
  };

  return (
    <SpaceBetween size="l">
      <SpaceBetween size="m">
        {messages.map((message, index) => (
          <div key={index} data-testid={`${message.role}-message`}>
            <Box variant="awsui-key-label">{message.role === 'user' ? 'You' : 'Assistant'}</Box>
            <Box>{message.text}</Box>
            {message.results && (
              <SpaceBetween size="xxs">
                {message.results.map(result => (
                  <StatusIndicator key={result.label} data-testid="write-result" type={result.type}>
                    {result.label}: {result.message}
                  </StatusIndicator>
                ))}
              </SpaceBetween>
            )}
          </div>
        ))}
        {confirmation && (
          <Container data-testid="confirmation">
            <SpaceBetween size="s">
              <Box>
                Set <b>{confirmation[0]}</b> to <b>{describeValue(confirmation[1])}</b>?
              </Box>
              <SpaceBetween direction="horizontal" size="xs">
                <Button data-testid="approve" variant="primary" onClick={() => answer('approve')}>
                  Approve
                </Button>
                <Button data-testid="allow-for-chat" onClick={() => answer('allow')}>
                  Allow for this chat
                </Button>
                <Button data-testid="skip" variant="link" onClick={() => answer('skip')}>
                  Skip
                </Button>
              </SpaceBetween>
            </SpaceBetween>
          </Container>
        )}
      </SpaceBetween>
      <PromptInput
        data-testid="assistant-prompt"
        ariaLabel="Message the form assistant"
        placeholder="Ask me to fill in the form"
        value={prompt}
        disabled={busy}
        actionButtonIconName="send"
        actionButtonAriaLabel="Send"
        onChange={({ detail }) => setPrompt(detail.value)}
        onAction={({ detail }) => send(detail.value)}
      />
      <Table
        data-testid="assistant-fields"
        variant="embedded"
        header={<Box variant="h4">Fields the assistant can see</Box>}
        items={[...fields]}
        trackBy="id"
        columnDefinitions={[
          { id: 'label', header: 'Label', cell: field => field.label },
          { id: 'type', header: 'Type', cell: field => field.type },
          {
            id: 'value',
            header: 'Value',
            cell: field => (field.statusType === 'loading' ? 'Loading options…' : JSON.stringify(field.value)),
          },
          { id: 'error', header: 'Error', cell: field => field.errorText ?? '-' },
        ]}
      />
    </SpaceBetween>
  );
}
