// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import PromptInput, { PromptInputProps } from '~components/prompt-input';

import { palette } from '../app/themes/style-api';
import ScreenshotArea from '../utils/screenshot-area';

// Exercises the full style.menu API: the dropdown surface (background, border,
// radius) plus the option rows and filtering match highlight. Because the
// option backgrounds match the surface, the whole menu body reads as themed.
const menuStyle: PromptInputProps.Style['menu'] = {
  backgroundColor: `light-dark(${palette.teal20}, ${palette.teal100})`,
  borderColor: `light-dark(${palette.teal80}, ${palette.teal40})`,
  borderRadius: '16px',
  borderWidth: '3px',
  options: {
    backgroundColor: {
      default: `light-dark(${palette.teal20}, ${palette.teal100})`,
      highlighted: `light-dark(${palette.teal30}, ${palette.teal80})`,
      selected: `light-dark(${palette.teal40}, ${palette.teal90})`,
    },
    color: {
      default: `light-dark(${palette.teal100}, ${palette.teal10})`,
      highlighted: `light-dark(${palette.teal100}, ${palette.white})`,
      disabled: `light-dark(${palette.teal60}, ${palette.teal60})`,
      groupLabel: `light-dark(${palette.teal90}, ${palette.teal20})`,
    },
  },
  filterMatch: {
    backgroundColor: `light-dark(${palette.teal40}, ${palette.teal60})`,
    color: `light-dark(${palette.teal100}, ${palette.white})`,
  },
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
    <ScreenshotArea>
      <h1>PromptInput — menu style override</h1>
      <p>
        Type <code>/</code> to open the command menu. The <code>style.menu</code> overrides theme the dropdown surface (
        <code>backgroundColor</code>, <code>borderColor</code>, <code>borderWidth</code>, <code>borderRadius</code>) as
        well as the option rows (<code>options.backgroundColor</code>, <code>options.color</code>) and the filtering
        match highlight (<code>filterMatch</code>). Filter the list to see the match highlight.
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
    </ScreenshotArea>
  );
}
