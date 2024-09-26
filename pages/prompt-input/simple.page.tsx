// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';

import { Box, TokenGroup } from '~components';
import ButtonGroup from '~components/button-group';
import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import FormField from '~components/form-field';
import PromptInput from '~components/prompt-input';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';

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
  }>
>;

const placeholderText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export default function PromptInputPage() {
  const [textareaValue, setTextareaValue] = useState('');
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);

  const { isDisabled, isReadOnly, isInvalid, hasWarning, hasText, hasSecondaryActions, hasSecondaryContent } =
    urlParams;
  const [items, setItems] = React.useState([
    { label: 'Item 1', dismissLabel: 'Remove item 1', disabled: isDisabled },
    { label: 'Item 2', dismissLabel: 'Remove item 2', disabled: isDisabled },
    { label: 'Item 3', dismissLabel: 'Remove item 3', disabled: isDisabled },
  ]);

  useEffect(() => {
    if (hasText) {
      setTextareaValue(placeholderText);
    }
  }, [hasText]);

  useEffect(() => {
    if (textareaValue !== placeholderText) {
      setUrlParams({ hasText: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textareaValue]);

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

  const ref = React.createRef<HTMLTextAreaElement>();

  return (
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
        </FormField>
        <button id="placeholder-text-button" onClick={() => setUrlParams({ hasText: true })}>
          Fill with placeholder text
        </button>

        <button id="focus-button" onClick={() => ref.current?.focus()}>
          Focus component
        </button>
        <button onClick={() => ref.current?.select()}>Select all text</button>

        <ColumnLayout columns={2}>
          <FormField
            errorText={(textareaValue.length > MAX_CHARS || isInvalid) && 'The query has too many characters.'}
            warningText={hasWarning && 'This input has a warning'}
            constraintText={
              <>
                This service is subject to some policy. Character count: {textareaValue.length}/{MAX_CHARS}
              </>
            }
            label={<span>User prompt</span>}
            i18nStrings={{ errorIconAriaLabel: 'Error' }}
          >
            <PromptInput
              ariaLabel="Chat input"
              actionButtonIconName="send"
              actionButtonAriaLabel="Submit prompt"
              value={textareaValue}
              onChange={(event: any) => setTextareaValue(event.detail.value)}
              onAction={event => window.alert(`Submitted the following: ${event.detail.value}`)}
              placeholder="Ask a question"
              maxRows={4}
              disabled={isDisabled}
              readOnly={isReadOnly}
              invalid={isInvalid || textareaValue.length > MAX_CHARS}
              warning={hasWarning}
              ref={ref}
              disableSecondaryActionsPaddings={true}
              secondaryActions={
                hasSecondaryActions ? (
                  <Box padding={{ left: 'xxs', top: 'xs' }}>
                    <ButtonGroup
                      ariaLabel="Chat actions"
                      items={[
                        {
                          type: 'icon-button',
                          id: 'copy',
                          iconName: 'upload',
                          text: 'Upload files',
                          disabled: isDisabled || isReadOnly,
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
                hasSecondaryContent ? (
                  <TokenGroup
                    onDismiss={({ detail: { itemIndex } }) => {
                      setItems([...items.slice(0, itemIndex), ...items.slice(itemIndex + 1)]);
                    }}
                    items={items}
                    readOnly={isReadOnly}
                  />
                ) : undefined
              }
            />
          </FormField>
          <div />
        </ColumnLayout>
      </SpaceBetween>
    </div>
  );
}
