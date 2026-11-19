// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { FormField, RadioGroup, SpaceBetween } from '~components';
import PromptInput, { PromptInputProps } from '~components/prompt-input';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

const longText =
  'This is a long message that should cause the prompt input to grow in height when the container becomes narrower, because the text wraps to more lines. Adding even more text to ensure wrapping.';

const sampleTokens: PromptInputProps.InputToken[] = [
  { type: 'text', value: longText },
  { type: 'reference', id: 'ref-1', label: 'Alice', value: 'alice', menuId: 'mentions' },
  { type: 'text', value: ' and some more text that adds to the wrapping behavior of the component.' },
];

const menus: PromptInputProps.MenuDefinition[] = [
  {
    id: 'mentions',
    trigger: '@',
    options: [
      { value: 'alice', label: 'Alice' },
      { value: 'bob', label: 'Bob' },
    ],
  },
];

type PageContext = React.Context<AppContextType<{ inputMode: string; containerWidth: string }>>;

export default function ContainerResizePage() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const isTokenMode = urlParams.inputMode === 'token';
  const containerWidth = Number(urlParams.containerWidth) || 400;

  const [tokens, setTokens] = useState<readonly PromptInputProps.InputToken[]>(sampleTokens);
  const [value, setValue] = useState(
    longText + ' Alice and some more text that adds to the wrapping behavior of the component.'
  );

  return (
    <SimplePage
      title="Prompt Input - Container Resize"
      subtitle="Tests that the prompt input adjusts height when its container resizes (not just window resize)"
    >
      <SpaceBetween size="m">
        <SpaceBetween size="l" direction="horizontal">
          <FormField label="Container width">
            <RadioGroup
              data-testid="width-radio"
              value={String(containerWidth)}
              onChange={({ detail }) => setUrlParams({ containerWidth: detail.value })}
              items={[
                { value: '400', label: '400px' },
                { value: '600', label: '600px' },
                { value: '800', label: '800px' },
                { value: '1200', label: '1200px' },
              ]}
            />
          </FormField>

          <FormField label="Mode">
            <RadioGroup
              value={isTokenMode ? 'token' : 'plain'}
              onChange={({ detail }) => setUrlParams({ inputMode: detail.value })}
              items={[
                { value: 'token', label: 'Token mode' },
                { value: 'plain', label: 'Plain text' },
              ]}
            />
          </FormField>
        </SpaceBetween>

        <div
          data-testid="resizable-container"
          style={{
            width: containerWidth,
          }}
        >
          <PromptInput
            value={isTokenMode ? undefined : value}
            onChange={event => {
              setValue(event.detail.value);
              if (event.detail.tokens) {
                setTokens(event.detail.tokens);
              }
            }}
            tokens={isTokenMode ? tokens : undefined}
            menus={isTokenMode ? menus : undefined}
            maxRows={10}
            placeholder="Type here..."
            data-testid="prompt-input"
          />
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
