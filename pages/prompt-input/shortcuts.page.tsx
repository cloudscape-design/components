// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';
import { HashRouter } from 'react-router-dom';

import {
  Box,
  ButtonGroup,
  ButtonGroupProps,
  Checkbox,
  ColumnLayout,
  FileTokenGroup,
  FormField,
  KeyValuePairs,
  PromptInput,
  PromptInputProps,
  SpaceBetween,
} from '~components';
import { OptionDefinition, OptionGroup } from '~components/internal/components/option/interfaces';

import AppContext, { AppContextProvider, AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { i18nStrings } from '../file-upload/shared';
import { IframeWrapper } from '../utils/iframe-wrapper';

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
    useIframe: boolean;
  }>
>;

const placeholderText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

// Sample data for menus
const firstNames = [
  'John',
  'Jane',
  'Bob',
  'Alice',
  'Charlie',
  'Diana',
  'Evan',
  'Fiona',
  'George',
  'Hannah',
  'Ian',
  'Julia',
  'Kevin',
  'Laura',
  'Michael',
  'Nina',
  'Oliver',
  'Patricia',
  'Quinn',
  'Rachel',
  'Samuel',
  'Teresa',
  'Uma',
  'Victor',
  'Wendy',
  'Xavier',
  'Yara',
  'Zachary',
];
const lastNames = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Perez',
  'Thompson',
  'White',
  'Harris',
  'Sanchez',
  'Clark',
  'Ramirez',
  'Lewis',
  'Robinson',
];
const roles = [
  'Software Engineer',
  'Senior Software Engineer',
  'Staff Software Engineer',
  'Principal Engineer',
  'Engineering Manager',
  'Senior Engineering Manager',
  'Product Manager',
  'Senior Product Manager',
  'Designer',
  'Senior Designer',
  'UX Researcher',
  'Data Scientist',
  'Senior Data Scientist',
  'DevOps Engineer',
  'Security Engineer',
  'QA Engineer',
  'Technical Writer',
  'Solutions Architect',
];
const teams = [
  'Backend Services',
  'Frontend Platform',
  'AI/ML Products',
  'Customer Experience',
  'Design Systems',
  'Component Library',
  'Infrastructure',
  'DevOps',
  'Application Security',
  'Data Platform',
  'Analytics',
  'Mobile Apps',
  'API Gateway',
  'Cloud Services',
];

// Generate 50 realistic user options
const mentionOptions: OptionDefinition[] = Array.from({ length: 50 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length];
  const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
  const role = roles[i % roles.length];
  const team = teams[i % teams.length];

  return {
    value: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i}`,
    label: `${firstName} ${lastName}`,
    description: `${role} - ${team}`,
    iconName: 'user-profile',
  };
});

const commandOptions: OptionDefinition[] = [
  { value: 'dev', label: 'Developer Mode', description: 'Optimized for code generation' },
  { value: 'creative', label: 'Creative Mode', description: 'Optimized for creative writing' },
  { value: 'analyze', label: 'Analyze Mode', description: 'Optimized for data analysis' },
  { value: 'summarize', label: 'Summarize Mode', description: 'Optimized for summarization' },
];

const topicOptions: (OptionDefinition | OptionGroup)[] = [
  { value: 'aws', label: 'AWS', description: 'Amazon Web Services' },
  {
    label: 'Cloudscape',
    options: [
      { value: 'components', label: 'Components', description: 'UI components' },
      { value: 'design-tokens', label: 'Design Tokens', description: 'Design system tokens' },
    ],
  },
  { value: 'react', label: 'React', description: 'JavaScript library' },
  { value: 'typescript', label: 'TypeScript', description: 'Typed JavaScript' },
  { value: 'accessibility', label: 'Accessibility', description: 'A11y best practices' },
  { value: 'performance', label: 'Performance', description: 'Optimization tips' },
];

export default function PromptInputShortcutsPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);
  const { useIframe } = urlParams;

  return (
    <div>
      <div style={{ padding: '8px 16px' }}>
        <Checkbox checked={useIframe} onChange={() => setUrlParams({ useIframe: !useIframe })}>
          Render in iframe
        </Checkbox>
      </div>
      {useIframe ? (
        <IframeWrapper id="shortcuts-iframe" AppComponent={ShortcutsDemoWithProviders} />
      ) : (
        <ShortcutsDemo />
      )}
    </div>
  );
}

function ShortcutsDemoWithProviders() {
  return (
    <HashRouter>
      <AppContextProvider>
        <ShortcutsDemo />
      </AppContextProvider>
    </HashRouter>
  );
}

function ShortcutsDemo() {
  const [tokens, setTokens] = useState<readonly PromptInputProps.InputToken[]>([]);
  const [plainTextValue, setPlainTextValue] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [extractedText, setExtractedText] = useState<string>('');
  const [selectionStart, setSelectionStart] = useState<string>('0');
  const [selectionEnd, setSelectionEnd] = useState<string>('0');
  const [maxPinnedTokens, setMaxPinnedTokens] = useState<number>(1);

  // Async menu with pagination and filtering
  const asyncAllItems: OptionDefinition[] = Array.from({ length: 500 }, (_, i) => ({
    value: `async-${i}`,
    label: `Async Item ${i}`,
    description: `Simulated async item ${i}`,
    iconName: 'search',
  }));

  const [asyncOptions, setAsyncOptions] = useState<OptionDefinition[]>([]);
  const [asyncMenuStatus, setAsyncMenuStatus] = useState<'pending' | 'loading' | 'finished' | 'error'>('pending');
  const asyncPageSize = 15;
  const asyncCurrentPageRef = React.useRef(0);
  const asyncLoadingRef = React.useRef(false);
  const asyncLastLoadedFilterRef = React.useRef<string | null>(null);
  const asyncFilterTimeoutRef = React.useRef<number | null>(null);

  const loadAsyncPage = (firstPage: boolean, filterText: string = '', immediate: boolean = false) => {
    // Clear any pending filter timeout
    if (asyncFilterTimeoutRef.current) {
      clearTimeout(asyncFilterTimeoutRef.current);
      asyncFilterTimeoutRef.current = null;
    }

    // Prevent concurrent loads
    if (asyncLoadingRef.current) {
      return;
    }

    // If firstPage and we've already loaded this exact filter, skip
    if (firstPage && filterText === asyncLastLoadedFilterRef.current) {
      return;
    }

    setAsyncMenuStatus('loading');

    // For filter changes, debounce unless immediate
    if (firstPage && !immediate && filterText !== asyncLastLoadedFilterRef.current) {
      asyncFilterTimeoutRef.current = window.setTimeout(() => {
        loadAsyncPage(firstPage, filterText, true);
      }, 300);
      return;
    }

    asyncLoadingRef.current = true;

    if (firstPage) {
      asyncCurrentPageRef.current = 0;
      setAsyncOptions([]);
      asyncLastLoadedFilterRef.current = filterText;
    }

    // Simulate API delay
    setTimeout(() => {
      // Filter items based on filter text
      const filteredSource = filterText
        ? asyncAllItems.filter(
            item =>
              (item.label?.toLowerCase() || '').includes(filterText.toLowerCase()) ||
              (item.value?.toLowerCase() || '').includes(filterText.toLowerCase())
          )
        : asyncAllItems;

      const startIndex = asyncCurrentPageRef.current * asyncPageSize;
      const endIndex = startIndex + asyncPageSize;
      const newItems = filteredSource.slice(startIndex, endIndex);

      setAsyncOptions(prev => (firstPage ? newItems : [...prev, ...newItems]));
      asyncCurrentPageRef.current++;

      // If no items at all, show finished (not pending)
      const hasMore = endIndex < filteredSource.length;
      const newStatus = filteredSource.length === 0 ? 'finished' : hasMore ? 'pending' : 'finished';
      setAsyncMenuStatus(newStatus);
      asyncLoadingRef.current = false;
    }, 800);
  };

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
  } = urlParams;

  const [items, setItems] = React.useState([
    { label: 'Item 1', dismissLabel: 'Remove item 1', disabled: isDisabled },
    { label: 'Item 2', dismissLabel: 'Remove item 2', disabled: isDisabled },
    { label: 'Item 3', dismissLabel: 'Remove item 3', disabled: isDisabled },
  ]);

  const [triggerCounter, setTriggerCounter] = React.useState(0);

  // Define menus for shortcuts
  const menus: PromptInputProps.MenuDefinition[] = React.useMemo(() => {
    const pinnedValues = new Set(
      tokens
        .filter((t): t is PromptInputProps.ReferenceToken => t.type === 'reference' && t.pinned === true)
        .map(t => t.value)
    );

    return [
      {
        id: 'mentions',
        trigger: '@',
        options: mentionOptions,
        filteringType: 'auto',
        empty: 'No mentions found',
      },
      {
        id: 'mode',
        trigger: '/',
        options: commandOptions.filter(opt => !pinnedValues.has(opt.value!)),
        filteringType: 'auto',
        useAtStart: true,
        empty: 'No commands found',
      },
      {
        id: 'topics',
        trigger: '#',
        options: topicOptions,
        filteringType: 'auto',
        empty: 'No topics found',
      },
      {
        id: 'async',
        trigger: '$',
        options: asyncOptions,
        filteringType: 'manual',
        statusType: asyncMenuStatus,
        empty: 'No async items found',
      },
    ];
  }, [asyncOptions, asyncMenuStatus, tokens]);

  // Reset async menu when trigger is removed
  useEffect(() => {
    const hasAsyncTrigger = tokens.some(t => t.type === 'trigger' && t.triggerChar === '$');
    if (!hasAsyncTrigger && asyncLastLoadedFilterRef.current !== null) {
      asyncLastLoadedFilterRef.current = null;
      setAsyncOptions([]);
      setAsyncMenuStatus('pending');
      asyncCurrentPageRef.current = 0;
      if (asyncFilterTimeoutRef.current) {
        clearTimeout(asyncFilterTimeoutRef.current);
        asyncFilterTimeoutRef.current = null;
      }
    }
  }, [tokens]);

  useEffect(() => {
    if (hasText) {
      setTokens([{ type: 'text', value: placeholderText }]);
    }
  }, [hasText]);

  useEffect(() => {
    if (plainTextValue !== placeholderText) {
      setUrlParams({ hasText: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plainTextValue]);

  useEffect(() => {
    if (items.length === 0 && enableAutoFocus) {
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

  const ref = React.useRef<PromptInputProps.Ref>(null);

  const buttonGroupRef = React.useRef<ButtonGroupProps.Ref>(null);

  const onDismiss = (event: { detail: { fileIndex: number } }) => {
    const newItems = [...files];
    newItems.splice(event.detail.fileIndex, 1);
    setFiles(newItems);
  };

  return (
    <SimplePage title="PromptInput Shortcuts Demo">
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
            onChange={() => setUrlParams({ hasSecondaryContent: !hasSecondaryContent })}
          >
            Secondary content
          </Checkbox>
          <Checkbox
            checked={hasSecondaryActions}
            onChange={() => setUrlParams({ hasSecondaryActions: !hasSecondaryActions })}
          >
            Secondary actions
          </Checkbox>
          <Checkbox
            checked={hasPrimaryActions}
            onChange={() => setUrlParams({ hasPrimaryActions: !hasPrimaryActions })}
          >
            Custom primary actions
          </Checkbox>
          <Checkbox
            checked={hasInfiniteMaxRows}
            onChange={() => setUrlParams({ hasInfiniteMaxRows: !hasInfiniteMaxRows })}
          >
            Infinite max rows
          </Checkbox>
          <Checkbox
            checked={disableActionButton}
            onChange={() => setUrlParams({ disableActionButton: !disableActionButton })}
          >
            Disable action button
          </Checkbox>
          <Checkbox
            checked={disableBrowserAutocorrect}
            onChange={() => setUrlParams({ disableBrowserAutocorrect: !disableBrowserAutocorrect })}
          >
            Disable browser autocorrect
          </Checkbox>
          <Checkbox checked={enableSpellcheck} onChange={() => setUrlParams({ enableSpellcheck: !enableSpellcheck })}>
            Enable spellcheck
          </Checkbox>
          <Checkbox checked={hasName} onChange={() => setUrlParams({ hasName: !hasName })}>
            Has name attribute (for forms)
          </Checkbox>
          <Checkbox checked={enableAutoFocus} onChange={() => setUrlParams({ enableAutoFocus: !enableAutoFocus })}>
            Enable auto focus
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

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label>
            Max pinned tokens:
            <input
              type="number"
              min="0"
              value={maxPinnedTokens}
              onChange={e => setMaxPinnedTokens(Math.max(0, parseInt(e.target.value, 10) || 0))}
              style={{ width: '60px', marginLeft: '4px' }}
            />
          </label>
        </div>

        <p>Trigger counter value: {triggerCounter}</p>

        {extractedText || tokens.length > 0 ? (
          <KeyValuePairs
            columns={1}
            items={[
              ...(extractedText
                ? [
                    {
                      label: 'Last submitted text',
                      value: <code style={{ whiteSpace: 'pre' }}>{extractedText}</code>,
                    },
                  ]
                : []),
              ...(tokens.length > 0
                ? [
                    {
                      label: 'Current tokens',
                      value: <code style={{ whiteSpace: 'pre' }}>{JSON.stringify(tokens, null, 2)}</code>,
                    },
                  ]
                : []),
            ]}
          />
        ) : null}

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
              errorText={(plainTextValue.length > MAX_CHARS || isInvalid) && 'The query has too many characters.'}
              warningText={hasWarning && 'This input has a warning'}
              constraintText={
                <>
                  This service is subject to some policy. Character count: {plainTextValue.length}/{MAX_CHARS}
                </>
              }
              i18nStrings={{ errorIconAriaLabel: 'Error' }}
            >
              <PromptInput
                data-testid="prompt-input"
                ariaLabel="Chat input"
                actionButtonIconName="send"
                actionButtonAriaLabel="Submit prompt"
                tokens={tokens}
                maxMenuHeight={400}
                onChange={event => {
                  setTokens(event.detail.tokens ?? []);
                  setPlainTextValue(event.detail.value ?? '');
                }}
                onAction={({ detail }) => {
                  setExtractedText(detail.value ?? '');

                  // Keep all pinned tokens after submission, deduplicated by value
                  const pinnedTokens = (detail.tokens ?? []).filter(
                    (token): token is PromptInputProps.ReferenceToken =>
                      token.type === 'reference' && token.pinned === true
                  );

                  // Deduplicate by value
                  const uniquePinnedTokens = pinnedTokens.filter(
                    (token, index, arr) => arr.findIndex(t => t.value === token.value) === index
                  );

                  setTokens(uniquePinnedTokens);
                  setPlainTextValue('');

                  window.alert(
                    `Submitted:\n\nPlain text: ${detail.value ?? ''}\n\nTokens: ${JSON.stringify(
                      detail.tokens,
                      null,
                      2
                    )}`
                  );
                }}
                placeholder="Ask a question"
                maxRows={hasInfiniteMaxRows ? -1 : 4}
                disabled={isDisabled}
                readOnly={isReadOnly}
                invalid={isInvalid || plainTextValue.length > MAX_CHARS}
                warning={hasWarning}
                ref={ref}
                disableSecondaryActionsPaddings={true}
                disableActionButton={disableActionButton}
                disableBrowserAutocorrect={disableBrowserAutocorrect}
                spellcheck={enableSpellcheck}
                name={hasName ? 'user-prompt' : undefined}
                autoFocus={enableAutoFocus}
                menus={menus}
                onMenuItemSelect={event => {
                  console.log('Menu selection:', event.detail);
                }}
                onTriggerDetected={event => {
                  setTriggerCounter(c => ++c);
                  // Count current pinned tokens
                  const currentPinnedCount = tokens.filter(
                    token => token.type === 'reference' && token.pinned === true
                  ).length;

                  // Find the menu for this trigger
                  const menu = menus.find(m => m.trigger === event.detail.triggerChar);

                  // If this is a useAtStart menu and we're at the limit, cancel
                  if (menu?.useAtStart && currentPinnedCount >= maxPinnedTokens) {
                    event.preventDefault();
                  }
                }}
                onMenuLoadItems={event => {
                  if (event.detail.menuId === 'async' && !event.detail.samePage) {
                    loadAsyncPage(event.detail.firstPage, event.detail.filteringText || '');
                  }
                }}
                onMenuFilter={event => {
                  if (event.detail.menuId === 'async') {
                    // Reload with new filter (debounced in loadAsyncPage)
                    loadAsyncPage(true, event.detail.filteringText);
                  }
                }}
                i18nStrings={{
                  actionButtonAriaLabel: 'Submit prompt',
                  menuErrorIconAriaLabel: 'Error',
                  menuRecoveryText: 'Retry',
                  menuLoadingText: 'Loading suggestions...',
                  menuFinishedText: 'End of results',
                  menuErrorText: 'Error loading suggestions',
                  tokenInsertedAriaLabel: (token: { label?: string; value: string }) =>
                    `${token.label || token.value} inserted`,
                  tokenPinnedAriaLabel: (token: { label?: string; value: string }) =>
                    `${token.label || token.value} pinned`,
                  tokenRemovedAriaLabel: (token: { label?: string; value: string }) =>
                    `${token.label || token.value} removed`,
                }}
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
                          disabled: isDisabled || isReadOnly || disableActionButton,
                        },
                        {
                          type: 'icon-button',
                          id: 'submit',
                          text: 'Submit',
                          iconName: 'send',
                          disabled: isDisabled || isReadOnly || disableActionButton,
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
                        onItemClick={({ detail }) => {
                          if (detail.id === 'slash') {
                            // Filter out only pinned references to check content after them
                            const nonPinnedTokens = tokens.filter(
                              token => !(token.type === 'reference' && token.pinned)
                            );

                            // Determine if we need to add space after slash
                            let needsSpace = false;
                            if (nonPinnedTokens.length > 0) {
                              const firstToken = nonPinnedTokens[0];
                              needsSpace = firstToken.type !== 'text' || !firstToken.value.startsWith(' ');
                            }

                            ref.current?.insertText(needsSpace ? '/ ' : '/', 0, 1);
                          }
                          if (detail.id === 'at') {
                            ref.current?.insertText('@');
                          }
                        }}
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
                          {
                            type: 'icon-button',
                            id: 'slash',
                            iconName: 'slash',
                            text: 'Insert slash',
                            disabled:
                              isDisabled ||
                              isReadOnly ||
                              tokens.filter(t => t.type === 'reference' && t.pinned === true).length >= maxPinnedTokens,
                          },
                          {
                            type: 'icon-button',
                            id: 'at',
                            iconName: 'at-symbol',
                            text: 'Insert at symbol',
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
    </SimplePage>
  );
}
