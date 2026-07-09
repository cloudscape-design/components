// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import PromptInput, { PromptInputProps } from '~components/prompt-input';

const menuStyle: PromptInputProps.Style['menu'] = {
  backgroundColor: 'light-dark(#faf5ff, #2d1b4e)',
  borderColor: '#a78bfa',
  borderRadius: '12px',
  borderWidth: '1.5px',
};

const options: PromptInputProps.MenuDefinition['options'] = [
  { value: 'help', label: '/help', description: 'Show help' },
  { value: 'search', label: '/search', description: 'Search content' },
  { value: 'clear', label: '/clear', description: 'Clear the input' },
];

export default function MenuStylePage() {
  const [value, setValue] = useState('');
  const [tokens, setTokens] = useState<readonly PromptInputProps.InputToken[]>([]);

  return (
    <>
      <h1>PromptInput — menu style override</h1>
      <p>
        Type <code>/</code> to open the command menu. The dropdown uses the custom <code>style.menu</code> overrides
        (purple border, rounded corners, themed background).
      </p>
      <PromptInput
        ariaLabel="Prompt input with styled menu"
        value={value}
        tokens={tokens}
        menus={[{ id: 'commands', trigger: '/', options, filteringType: 'auto' }]}
        style={{ menu: menuStyle }}
        onChange={({ detail }) => {
          setValue(detail.value);
          if (detail.tokens) {
            setTokens(detail.tokens);
          }
        }}
        onAction={() => {}}
        i18nStrings={{ actionButtonAriaLabel: 'Send' }}
      />
    </>
  );
}
