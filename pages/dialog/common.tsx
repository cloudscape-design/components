// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import SpaceBetween from '~components/space-between';

// A fake chat transcript rendered above a dialog. Its purpose in these pages is
// to prove the in-flow (non-modal) behavior: when the dialog appears it pushes
// this content up (reflow, not overlay), and the Tab order flows
// transcript -> dialog -> whatever comes after (e.g. the prompt input).
export function FakeTranscript({ lines }: { lines?: Array<{ from: 'user' | 'assistant'; text: string }> }) {
  const transcript = lines ?? [
    { from: 'user', text: 'How do I resize an EBS volume?' },
    {
      from: 'assistant',
      text: 'I can help with that. First, a couple of clarifying questions so I give you the right steps.',
    },
  ];
  return (
    <SpaceBetween size="s">
      {transcript.map((line, index) => (
        <Box key={index} color={line.from === 'user' ? undefined : 'text-body-secondary'}>
          {line.text}
        </Box>
      ))}
    </SpaceBetween>
  );
}

// Constrains the width so the dialog reads like an in-context chat/card surface
// rather than stretching the full page width.
export function DialogPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article>
      <h1>{title}</h1>
      <div style={{ maxInlineSize: 520 }}>{children}</div>
    </article>
  );
}
