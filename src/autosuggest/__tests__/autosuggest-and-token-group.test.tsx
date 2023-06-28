// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Autosuggest from '../../../lib/components/autosuggest';
import TokenGroup from '../../../lib/components/token-group';

const wrapper = createWrapper();

function getSelectedTokens() {
  return wrapper
    .findTokenGroup()!
    .findTokens()
    .map(token => token.findLabel().getElement().textContent!.trim());
}

function Demo() {
  const options = ['apple', 'banana', 'orange'];
  const enteredTextLabel = (value: string) => `Use: ${value}`;
  const empty = <span>Nothing found</span>;
  const [pendingValue, setPendingValue] = useState('');
  const [tokens, setTokens] = useState<Array<string>>([]);
  return (
    <>
      <Autosuggest
        value={pendingValue}
        options={options.filter(option => !tokens.includes(option)).map(option => ({ value: option }))}
        enteredTextLabel={enteredTextLabel}
        ariaLabel="Multi-suggest"
        selectedAriaLabel="Selected"
        empty={empty}
        onChange={event => setPendingValue(event.detail.value)}
        onSelect={event => {
          setTokens(tokens => [...tokens, event.detail.value]);
          setPendingValue('');
        }}
      />
      <TokenGroup
        items={tokens.map(token => ({ label: token }))}
        onDismiss={event => setTokens(tokens => tokens.filter((token, index) => event.detail.itemIndex !== index))}
      />
    </>
  );
}

test('Adding tokens from the dropdown', () => {
  render(<Demo />);
  wrapper.findAutosuggest()!.focus();
  wrapper.findAutosuggest()!.selectSuggestion(1);
  expect(wrapper.findAutosuggest()!.findNativeInput().getElement()).toHaveValue('');
  expect(getSelectedTokens()).toEqual(['apple']);
});

test('Adding custom tokens', () => {
  render(<Demo />);
  wrapper.findAutosuggest()!.setInputValue('custom');
  wrapper.findAutosuggest()!.focus();
  wrapper
    .findAutosuggest()!
    .findEnteredTextOption()!
    .fireEvent(new MouseEvent('mouseup', { bubbles: true }));
  expect(wrapper.findAutosuggest()!.findNativeInput().getElement()).toHaveValue('');
  expect(getSelectedTokens()).toEqual(['custom']);
});

test('Removing tokens', () => {
  render(<Demo />);
  wrapper.findAutosuggest()!.focus();
  wrapper.findAutosuggest()!.selectSuggestion(1);
  expect(getSelectedTokens()).toEqual(['apple']);
  wrapper.findTokenGroup()!.findToken(1)!.findDismiss().click();
  expect(getSelectedTokens()).toEqual([]);
});
