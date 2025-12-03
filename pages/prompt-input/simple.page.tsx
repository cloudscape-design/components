// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';

import {
  AppLayout,
  Box,
  ButtonGroup,
  ButtonGroupProps,
  Checkbox,
  ColumnLayout,
  FileTokenGroup,
  FormField,
  PromptInput,
  PromptInputProps,
  SpaceBetween,
  SplitPanel,
} from '~components';
import getPromptText from '~components/prompt-input/utils';

import AppContext, { AppContextType } from '../app/app-context';
import labels from '../app-layout/utils/labels';
import { i18nStrings } from '../file-upload/shared';

const MAX_CHARS = 2000;

type DemoContext = React.Context<
  AppContextType<{
    isDisabled: boolean;
    isReadOnly: boolean;
    isInvalid: boolean;
    hasWarning: boolean;
    hasText: boolean;
    hasSecondaryContent: boolean;
    hasSecondaryActions: boolean;
    hasPrimaryActions: boolean;
    hasInfiniteMaxRows: boolean;
    disableActionButton: boolean;
    disableBrowserAutocorrect: boolean;
    enableSpellcheck: boolean;
    hasName: boolean;
    enableAutoFocus: boolean;
    enableReferences: boolean;
  }>
>;

const placeholderText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export default function PromptInputPage() {
  const [textareaValue, setTextareaValue] = useState<string>('');
  const [tokens, setTokens] = useState<PromptInputProps.InputToken[]>([]);
  const [valueInSplitPanel, setValueInSplitPanel] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [extractedText, setExtractedText] = useState<string>('');
  const [lastCommandToken, setLastCommandToken] = useState<PromptInputProps.ReferenceInputToken | null>(null);
  const [selectionStart, setSelectionStart] = useState<string>('0');
  const [selectionEnd, setSelectionEnd] = useState<string>('0');

  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);

  const {
    isDisabled,
    isReadOnly,
    isInvalid,
    hasWarning,
    hasText,
    hasSecondaryActions,
    hasSecondaryContent,
    hasPrimaryActions,
    hasInfiniteMaxRows,
    disableActionButton,
    disableBrowserAutocorrect,
    enableSpellcheck,
    hasName,
    enableAutoFocus,
    enableReferences,
  } = urlParams;

  const [items, setItems] = React.useState([
    { label: 'Item 1', dismissLabel: 'Remove item 1', disabled: isDisabled },
    { label: 'Item 2', dismissLabel: 'Remove item 2', disabled: isDisabled },
    { label: 'Item 3', dismissLabel: 'Remove item 3', disabled: isDisabled },
  ]);

  useEffect(() => {
    if (hasText) {
      if (enableReferences) {
        setTokens([{ type: 'text', text: placeholderText }]);
      } else {
        setTextareaValue(placeholderText);
      }
    }
  }, [hasText, enableReferences]);

  useEffect(() => {
    if (enableReferences) {
      const plainText = getPromptText(tokens);
      if (plainText !== placeholderText) {
        setUrlParams({ hasText: false });
      }
    } else {
      if (textareaValue !== placeholderText) {
        setUrlParams({ hasText: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textareaValue, tokens, enableReferences]);

  useEffect(() => {
    if (items.length === 0) {
      ref.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    const newItems = items.map(item => ({
      label: item.label,
      dismissLabel: item.dismissLabel,
      disabled: isDisabled,
    }));
    setItems([...newItems]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisabled]);

  const ref = React.createRef<PromptInputProps.Ref>();

  const buttonGroupRef = React.useRef<ButtonGroupProps.Ref>(null);

  const onDismiss = (event: { detail: { fileIndex: number } }) => {
    const newItems = [...files];
    newItems.splice(event.detail.fileIndex, 1);
    setFiles(newItems);
  };

  return (
    <AppLayout
      ariaLabels={labels}
      content={
        <div style={{ padding: 10 }}>
          <h1>PromptInput demo</h1>
          <SpaceBetween size="xl">
            <FormField label="Settings">
              <Checkbox checked={isDisabled} onChange={() => setUrlParams({ isDisabled: !isDisabled })}>
                Disabled
              </Checkbox>
              <Checkbox checked={isReadOnly} onChange={() => setUrlParams({ isReadOnly: !isReadOnly })}>
                Read-only
              </Checkbox>
              <Checkbox checked={isInvalid} onChange={() => setUrlParams({ isInvalid: !isInvalid })}>
                Invalid
              </Checkbox>
              <Checkbox checked={hasWarning} onChange={() => setUrlParams({ hasWarning: !hasWarning })}>
                Warning
              </Checkbox>
              <Checkbox
                checked={hasSecondaryContent}
                onChange={() =>
                  setUrlParams({
                    hasSecondaryContent: !hasSecondaryContent,
                  })
                }
              >
                Secondary content
              </Checkbox>
              <Checkbox
                checked={hasSecondaryActions}
                onChange={() =>
                  setUrlParams({
                    hasSecondaryActions: !hasSecondaryActions,
                  })
                }
              >
                Secondary actions
              </Checkbox>
              <Checkbox
                checked={hasPrimaryActions}
                onChange={() =>
                  setUrlParams({
                    hasPrimaryActions: !hasPrimaryActions,
                  })
                }
              >
                Custom primary actions
              </Checkbox>
              <Checkbox
                checked={hasInfiniteMaxRows}
                onChange={() =>
                  setUrlParams({
                    hasInfiniteMaxRows: !hasInfiniteMaxRows,
                  })
                }
              >
                Infinite max rows
              </Checkbox>
              <Checkbox
                checked={disableActionButton}
                onChange={() =>
                  setUrlParams({
                    disableActionButton: !disableActionButton,
                  })
                }
              >
                Disable action button
              </Checkbox>
              <Checkbox
                checked={disableBrowserAutocorrect}
                onChange={() =>
                  setUrlParams({
                    disableBrowserAutocorrect: !disableBrowserAutocorrect,
                  })
                }
              >
                Disable browser autocorrect
              </Checkbox>
              <Checkbox
                checked={enableSpellcheck}
                onChange={() =>
                  setUrlParams({
                    enableSpellcheck: !enableSpellcheck,
                  })
                }
              >
                Enable spellcheck
              </Checkbox>
              <Checkbox
                checked={hasName}
                onChange={() =>
                  setUrlParams({
                    hasName: !hasName,
                  })
                }
              >
                Has name attribute (for forms)
              </Checkbox>
              <Checkbox
                checked={enableAutoFocus}
                onChange={() =>
                  setUrlParams({
                    enableAutoFocus: !enableAutoFocus,
                  })
                }
              >
                Enable auto focus
              </Checkbox>
              <Checkbox
                checked={enableReferences}
                onChange={() => {
                  setUrlParams({ enableReferences: !enableReferences });
                  // Reset values when switching modes
                  setTextareaValue('');
                  setTokens([]);
                }}
              >
                Enable references (tokens mode - supports @mentions and /commands)
              </Checkbox>
            </FormField>
            <button id="placeholder-text-button" onClick={() => setUrlParams({ hasText: true })}>
              Fill with placeholder text
            </button>

            <button id="focus-button" onClick={() => ref.current?.focus()}>
              Focus component
            </button>

            <button onClick={() => buttonGroupRef.current?.focus('files')}>Focus file input</button>
            <button onClick={() => ref.current?.select()}>Select all text</button>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label>
                Start:
                <input
                  type="number"
                  value={selectionStart}
                  onChange={e => setSelectionStart(e.target.value)}
                  style={{ width: '60px', marginLeft: '4px' }}
                />
              </label>
              <label>
                End:
                <input
                  type="number"
                  value={selectionEnd}
                  onChange={e => setSelectionEnd(e.target.value)}
                  style={{ width: '60px', marginLeft: '4px' }}
                />
              </label>
              <button
                onClick={() => {
                  const start = parseInt(selectionStart, 10);
                  const end = parseInt(selectionEnd, 10);
                  if (!isNaN(start) && !isNaN(end)) {
                    ref.current?.focus();
                    // Use setTimeout to ensure focus completes before setting selection
                    setTimeout(() => {
                      ref.current?.setSelectionRange(start, end);
                    }, 0);
                  }
                }}
              >
                Set selection range
              </button>
            </div>

            {extractedText && (
              <Box variant="awsui-key-label">
                <div>
                  <Box variant="awsui-key-label">Last extracted text (using getPromptText):</Box>
                  <Box padding={{ top: 'xs' }}>
                    <code>{extractedText}</code>
                  </Box>
                </div>
              </Box>
            )}

            {enableReferences && tokens.length > 0 && (
              <Box variant="awsui-key-label">
                <div>
                  <Box variant="awsui-key-label">Current tokens:</Box>
                  <Box padding={{ top: 'xs' }}>
                    <code>{JSON.stringify(tokens, null, 2)}</code>
                  </Box>
                </div>
              </Box>
            )}

            <form
              onSubmit={event => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                console.log('FORM SUBMITTED (fallback):', {
                  'user-prompt': formData.get('user-prompt'),
                });
              }}
            >
              <ColumnLayout columns={2}>
                <FormField
                  errorText={
                    ((enableReferences ? getPromptText(tokens, true).length : textareaValue.length) > MAX_CHARS ||
                      isInvalid) &&
                    'The query has too many characters.'
                  }
                  warningText={hasWarning && 'This input has a warning'}
                  constraintText={
                    <>
                      This service is subject to some policy. Character count:{' '}
                      {enableReferences ? getPromptText(tokens, true).length : textareaValue.length}/{MAX_CHARS}
                      {enableReferences && ' (Token mode: type @word or /command and press space)'}
                    </>
                  }
                  label={<span>User prompt {enableReferences && '(with references)'}</span>}
                  i18nStrings={{ errorIconAriaLabel: 'Error' }}
                >
                  <PromptInput
                    data-testid="prompt-input"
                    ariaLabel="Chat input"
                    actionButtonIconName="send"
                    actionButtonAriaLabel="Submit prompt"
                    value={enableReferences ? undefined : textareaValue}
                    tokens={enableReferences ? tokens : undefined}
                    onChange={(event: any) => {
                      if (enableReferences) {
                        const newTokens = event.detail.tokens;
                        setTokens(newTokens);

                        // Check if user manually removed the command token
                        const hasCommandToken = newTokens.some(
                          (token: PromptInputProps.InputToken) =>
                            token.type === 'reference' && token.id.startsWith('command:')
                        );
                        if (!hasCommandToken && lastCommandToken) {
                          // User removed the command, clear it so it doesn't come back
                          setLastCommandToken(null);
                        }
                      } else {
                        setTextareaValue(event.detail.value);
                      }
                    }}
                    onAction={({ detail }) => {
                      const plainText = enableReferences ? getPromptText(detail.tokens ?? []) : detail.value;

                      setExtractedText(plainText ?? '');

                      if (enableReferences) {
                        // Find command token in submitted tokens
                        const commandToken = detail.tokens?.find(
                          (token: PromptInputProps.InputToken) =>
                            token.type === 'reference' && token.id.startsWith('command:')
                        ) as PromptInputProps.ReferenceInputToken | undefined;

                        if (commandToken) {
                          // Save command token and restore it with a space after clearing
                          setLastCommandToken(commandToken);
                          setTokens([commandToken, { type: 'text', text: ' ' }]);
                        } else {
                          // No command token, clear everything
                          setTokens([]);
                        }
                      } else {
                        setTextareaValue('');
                      }

                      window.alert(
                        `Submitted:\n\nPlain text: ${plainText}\n\n${
                          enableReferences ? `Tokens: ${JSON.stringify(detail.tokens, null, 2)}` : ''
                        }`
                      );
                    }}
                    placeholder="Ask a question"
                    maxRows={hasInfiniteMaxRows ? -1 : 4}
                    disabled={isDisabled}
                    readOnly={isReadOnly}
                    invalid={
                      isInvalid ||
                      (enableReferences
                        ? getPromptText(tokens, true).length > MAX_CHARS
                        : textareaValue.length > MAX_CHARS)
                    }
                    warning={hasWarning}
                    ref={ref}
                    disableSecondaryActionsPaddings={true}
                    disableActionButton={disableActionButton}
                    disableBrowserAutocorrect={disableBrowserAutocorrect}
                    spellcheck={enableSpellcheck}
                    name={hasName ? 'user-prompt' : undefined}
                    autoFocus={enableAutoFocus}
                    customPrimaryAction={
                      hasPrimaryActions ? (
                        <ButtonGroup
                          variant="icon"
                          items={[
                            {
                              type: 'icon-button',
                              id: 'record',
                              text: 'Record',
                              iconName: 'microphone',
                              disabled: isDisabled || isReadOnly,
                            },
                            {
                              type: 'icon-button',
                              id: 'submit',
                              text: 'Submit',
                              iconName: 'send',
                              disabled: isDisabled || isReadOnly,
                            },
                          ]}
                        />
                      ) : undefined
                    }
                    secondaryActions={
                      hasSecondaryActions ? (
                        <Box padding={{ left: 'xxs', top: 'xs' }}>
                          <ButtonGroup
                            ref={buttonGroupRef}
                            ariaLabel="Chat actions"
                            onFilesChange={({ detail }) => detail.id.includes('files') && setFiles(detail.files)}
                            items={[
                              {
                                type: 'icon-file-input',
                                id: 'files',
                                text: 'Upload files',
                                multiple: true,
                              },
                              {
                                type: 'icon-button',
                                id: 'expand',
                                iconName: 'expand',
                                text: 'Go full page',
                                disabled: isDisabled || isReadOnly,
                              },
                              {
                                type: 'icon-button',
                                id: 'remove',
                                iconName: 'remove',
                                text: 'Remove',
                                disabled: isDisabled || isReadOnly,
                              },
                            ]}
                            variant="icon"
                          />
                        </Box>
                      ) : undefined
                    }
                    secondaryContent={
                      hasSecondaryContent && files.length > 0 ? (
                        <FileTokenGroup
                          items={files.map(file => ({
                            file,
                          }))}
                          showFileThumbnail={true}
                          onDismiss={onDismiss}
                          i18nStrings={i18nStrings}
                          alignment="horizontal"
                        />
                      ) : undefined
                    }
                  />
                </FormField>
                <div />
              </ColumnLayout>
            </form>
          </SpaceBetween>
        </div>
      }
      splitPanel={
        <SplitPanel
          header="Split panel header"
          i18nStrings={{
            preferencesTitle: 'Preferences',
            preferencesPositionLabel: 'Split panel position',
            preferencesPositionDescription: 'Choose the default split panel position for the service.',
            preferencesPositionSide: 'Side',
            preferencesPositionBottom: 'Bottom',
            preferencesConfirm: 'Confirm',
            preferencesCancel: 'Cancel',
            closeButtonAriaLabel: 'Close panel',
            openButtonAriaLabel: 'Open panel',
            resizeHandleAriaLabel: 'Slider',
            resizeHandleTooltipText: 'Drag or select to resize',
          }}
        >
          <PromptInput
            data-testid="Prompt-input-in-split-panel"
            value={valueInSplitPanel}
            onChange={event => setValueInSplitPanel(event.detail.value ?? '')}
          />
        </SplitPanel>
      }
    />
  );
}
