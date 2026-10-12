// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { AppLayout, Box, ContentLayout, Header, SpaceBetween } from '~components';
import { AppLayoutProps } from '~components/app-layout';
import {
  createGenaiContextPanelDrawer,
  GenaiContextPanelProps,
} from '~components/internal/components/genai-context-panel';

import appLayoutLabels from './utils/labels';

// [WIP / v0 — AWSUI-52880] Demonstrates the opt-in Global GenAI context panel
// composed into an AppLayout drawer.
const MODELS: ReadonlyArray<GenaiContextPanelProps.Model> = [
  { id: 'claude-sonnet', label: 'Claude Sonnet', description: 'Balanced quality and latency' },
  { id: 'claude-haiku', label: 'Claude Haiku', description: 'Fastest, lowest cost' },
  { id: 'nova-pro', label: 'Amazon Nova Pro', description: 'Multimodal reasoning' },
];

function makeFile(name: string, contents: string) {
  return new File([contents], name, { type: 'text/plain' });
}

export default function GenaiContextPanelPage() {
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>('genai-context-panel');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a helpful AWS assistant. Prefer concise answers and cite the docs you use.'
  );
  const [selectedModelId, setSelectedModelId] = useState<string | null>('claude-sonnet');
  const [contextFiles, setContextFiles] = useState<File[]>([
    makeFile('architecture.md', '# Architecture\nsome notes'),
    makeFile('costs.csv', 'service,cost\n'),
  ]);

  const drawer = createGenaiContextPanelDrawer({
    systemPrompt,
    onSystemPromptChange: ({ detail }) => setSystemPrompt(detail.value),
    models: MODELS,
    selectedModelId,
    onSelectedModelChange: ({ detail }) => setSelectedModelId(detail.selectedModelId),
    contextFiles,
    onContextFilesChange: ({ detail }) => setContextFiles(detail.files),
    badge: contextFiles.length > 0,
    i18nStrings: {
      headerText: 'GenAI context',
      headerDescription: 'Configure how the assistant behaves for this conversation.',
      systemPromptDescription: 'These instructions are sent with every message.',
      modelSelectorDescription: 'Choose which model responds.',
      contextFilesDescription: 'Files the assistant can reference.',
    },
  });

  return (
    <AppLayout
      ariaLabels={appLayoutLabels}
      contentType="default"
      drawers={[drawer]}
      activeDrawerId={activeDrawerId}
      onDrawerChange={({ detail }) => setActiveDrawerId(detail.activeDrawerId)}
      content={
        <ContentLayout header={<Header variant="h1">Global GenAI context panel (WIP v0)</Header>}>
          <SpaceBetween size="l">
            <Box variant="p">
              Open the <b>GenAI context</b> drawer from the right-hand toolbar to view and edit the system prompt, pick
              a model, and manage the files currently in the assistant&apos;s context.
            </Box>
            <Box variant="p" data-testid="live-system-prompt">
              Current system prompt: {systemPrompt}
            </Box>
            <Box variant="p" data-testid="live-model">
              Current model: {selectedModelId}
            </Box>
            <Box variant="p" data-testid="live-file-count">
              Files in context: {contextFiles.length}
            </Box>
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}

// exported for type-checking convenience in this demo
export type { AppLayoutProps };
