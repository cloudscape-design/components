// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import clsx from 'clsx';

import { PromptInput, PromptInputProps, SpaceBetween } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

const menus: PromptInputProps.MenuDefinition[] = [
  {
    id: 'mentions',
    trigger: '@',
    filteringType: 'auto',
    options: [
      { value: 'user-1', label: 'Alice' },
      { value: 'user-2', label: 'Bob' },
      { value: 'user-3', label: 'Charlie', disabled: true },
    ],
  },
];

const referenceTokens: PromptInputProps.InputToken[] = [
  { type: 'text', value: 'Ask ' },
  { type: 'reference', id: 'ref-1', label: 'Alice', value: 'user-1', menuId: 'mentions' },
  { type: 'text', value: ' about the release' },
];

// Reference token ids become element ids, so the second instance on the page needs its own.
const disabledReferenceTokens: PromptInputProps.InputToken[] = [
  { type: 'text', value: 'Ask ' },
  { type: 'reference', id: 'ref-2', label: 'Alice', value: 'user-1', menuId: 'mentions' },
  { type: 'text', value: ' about the release' },
];

function getStyleClassNames({ invalid, warning, disabled, readOnly }: PromptInputProps) {
  const state = invalid ? 'invalid' : warning ? 'warning' : disabled ? 'disabled' : readOnly ? 'readonly' : null;
  return {
    root: state ? styles[`root-${state}`] : styles.root,
    textarea: clsx({
      [styles['textarea-disabled']]: disabled,
      [styles['textarea-readonly']]: readOnly && !disabled,
      [styles.textarea]: !disabled && !readOnly,
    }),
    actionButton: styles['action-button'],
    token: disabled ? styles['token-disabled'] : styles.token,
    menu: styles.menu,
  };
}

function StyledPromptInput({ value: initialValue = '', ...rest }: Omit<PromptInputProps, 'tokens' | 'menus'>) {
  const [value, setValue] = useState(initialValue);
  return (
    <PromptInput
      actionButtonAriaLabel="Send"
      {...rest}
      value={value}
      onChange={({ detail }) => setValue(detail.value)}
      {...{ styleClassNames: getStyleClassNames(rest) }}
    />
  );
}

function StyledTokenPromptInput({ tokens: initialTokens = [], ...rest }: Omit<PromptInputProps, 'value' | 'menus'>) {
  const [tokens, setTokens] = useState<readonly PromptInputProps.InputToken[]>(initialTokens);
  return (
    <PromptInput
      actionButtonAriaLabel="Send"
      {...rest}
      menus={menus}
      tokens={tokens}
      onChange={({ detail }) => setTokens(detail.tokens ?? [])}
      {...{ styleClassNames: getStyleClassNames(rest) }}
    />
  );
}

type IntegContext = React.Context<AppContextType<{ textareaPadding: string }>>;

function IntegPromptInput({ textareaPadding }: { textareaPadding: string }) {
  const [value, setValue] = useState('');
  const textareaClass = textareaPadding === 'extra' ? styles['integ-textarea-extra'] : styles['integ-textarea'];
  return (
    <PromptInput
      data-testid="integ-prompt-input"
      ariaLabel="Integration test input"
      minRows={1}
      maxRows={3}
      value={value}
      onChange={({ detail }) => setValue(detail.value)}
      {...{ styleClassNames: { root: styles['integ-root'], textarea: textareaClass } }}
    />
  );
}

function IntegTokenPromptInput() {
  const [tokens, setTokens] = useState<readonly PromptInputProps.InputToken[]>([]);
  return (
    <PromptInput
      data-testid="integ-token-prompt-input"
      ariaLabel="Integration test token input"
      minRows={1}
      maxRows={3}
      menus={menus}
      tokens={tokens}
      onChange={({ detail }) => setTokens(detail.tokens ?? [])}
      {...{ styleClassNames: { root: styles['integ-root'], textarea: styles['integ-textarea'] } }}
    />
  );
}

export default function () {
  const { urlParams } = useContext(AppContext as IntegContext);

  return (
    <>
      <SimplePage title="Prompt input - Style API v2" screenshotArea={{ disableAnimations: true }} i18n={{}}>
        <SpaceBetween size="m" direction="horizontal">
          <StyledPromptInput ariaLabel="Default prompt" value="Summarize the release notes" />
          <StyledPromptInput ariaLabel="Prompt with placeholder" placeholder="Ask a question" />
          <StyledPromptInput
            ariaLabel="Prompt with action button"
            value="Summarize the release notes"
            actionButtonIconName="send"
          />
        </SpaceBetween>
        <SpaceBetween size="m" direction="horizontal">
          <StyledPromptInput ariaLabel="Invalid prompt" value="Too short" invalid={true} actionButtonIconName="send" />
          <StyledPromptInput
            ariaLabel="Warning prompt"
            value="Almost at the limit"
            warning={true}
            actionButtonIconName="send"
          />
          <StyledPromptInput
            ariaLabel="Read-only prompt"
            value="Read-only text"
            readOnly={true}
            actionButtonIconName="send"
          />
        </SpaceBetween>
        <SpaceBetween size="m" direction="horizontal">
          <StyledPromptInput
            ariaLabel="Disabled prompt"
            value="Cannot be edited"
            disabled={true}
            actionButtonIconName="send"
          />
          <StyledPromptInput
            ariaLabel="Disabled prompt with placeholder"
            placeholder="Ask a question"
            disabled={true}
          />
        </SpaceBetween>
        <SpaceBetween size="m" direction="horizontal">
          <StyledTokenPromptInput
            ariaLabel="Prompt with references"
            tokens={referenceTokens}
            actionButtonIconName="send"
          />
          <StyledTokenPromptInput
            ariaLabel="Disabled prompt with references"
            tokens={disabledReferenceTokens}
            disabled={true}
          />
          <StyledTokenPromptInput ariaLabel="Token mode prompt with placeholder" placeholder="Ask a question" />
          <StyledTokenPromptInput
            ariaLabel="Disabled token mode prompt with placeholder"
            placeholder="Ask a question"
            disabled={true}
          />
        </SpaceBetween>
      </SimplePage>
      <div style={{ padding: '16px' }}>
        <IntegPromptInput textareaPadding={urlParams.textareaPadding ?? ''} />
        <IntegTokenPromptInput />
        <p data-testid="integ-away">Integration test area</p>
      </div>
    </>
  );
}
