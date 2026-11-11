// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import PromptInput, { PromptInputProps } from '~components/prompt-input';

import AppContext, { AppContextType } from '../app/app-context';

import styles from './sizing.scss';

type PageContext = React.Context<AppContextType<{ padding: string; maxRows: string }>>;

const referenceTokens: PromptInputProps.InputToken[] = [
  { type: 'reference', id: 'ref-a', label: 'Alice', value: 'alice', menuId: 'mentions' },
  { type: 'text', value: ' and ' },
  { type: 'reference', id: 'ref-b', label: 'Bob', value: 'bob', menuId: 'mentions' },
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

export default function SizingPage() {
  const { urlParams } = useContext(AppContext as PageContext);
  const useLargePadding = urlParams.padding === 'large';
  const maxRows = urlParams.maxRows === '-1' ? -1 : 3;

  const [textareaValue, setTextareaValue] = useState('');
  const [tokens, setTokens] = useState<readonly PromptInputProps.InputToken[]>(referenceTokens);

  return (
    <div>
      <div id="away" style={{ height: 8 }} />
      <div className={useLargePadding ? styles['large-padding-wrapper'] : undefined}>
        <PromptInput
          data-testid="sizing-textarea"
          ariaLabel="Sizing textarea"
          value={textareaValue}
          onChange={e => setTextareaValue(e.detail.value)}
          minRows={1}
          maxRows={maxRows}
          placeholder="Type here"
        />
        <PromptInput
          data-testid="sizing-token"
          ariaLabel="Sizing token mode"
          tokens={tokens}
          menus={menus}
          onChange={e => {
            if (e.detail.tokens) {
              setTokens(e.detail.tokens);
            }
          }}
          minRows={1}
          maxRows={maxRows}
          placeholder="Type here"
        />
      </div>
    </div>
  );
}
