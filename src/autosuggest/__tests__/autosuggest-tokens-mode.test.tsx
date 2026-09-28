// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { act, render } from '@testing-library/react';

import { KeyCode } from '@cloudscape-design/test-utils-core/utils';

import Autosuggest, { AutosuggestProps } from '../../../lib/components/autosuggest';
import createWrapper from '../../../lib/components/test-utils/dom';

const defaultOptions: AutosuggestProps.Options = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'eu-west-1', label: 'Europe (Ireland)' },
];

function makeToken(value: string): AutosuggestProps.Token {
  return { label: value, dismissLabel: `Remove ${value}` };
}

function StatefulAutosuggest(props: Partial<AutosuggestProps> & { initTokens?: AutosuggestProps.Token[] }) {
  const { initTokens = [], ...rest } = props;
  const [value, setValue] = useState('');
  const [tokens, setTokens] = useState<ReadonlyArray<AutosuggestProps.Token>>(initTokens);

  return (
    <Autosuggest
      mode="tokens"
      value={value}
      onChange={({ detail }) => setValue(detail.value)}
      tokens={tokens}
      onTokensChange={({ detail }) => setTokens(detail.tokens)}
      options={defaultOptions.filter(o => !value || o.value!.includes(value))}
      {...rest}
    />
  );
}

function renderStateful(props?: Partial<AutosuggestProps> & { initTokens?: AutosuggestProps.Token[] }) {
  const { container } = render(<StatefulAutosuggest {...props} />);
  const wrapper = createWrapper(container).findAutosuggest()!;
  return { container, wrapper };
}

describe('Autosuggest mode=tokens', () => {
  // ---------------------------------------------------------------------------
  // onSelectItem: token mode branch (internal.tsx lines 108–111)
  // ---------------------------------------------------------------------------
  test('selecting a dropdown option adds it as a token and clears the input', () => {
    const { wrapper } = renderStateful();

    // ArrowDown opens dropdown and highlights first option, Enter selects it
    act(() => wrapper.findNativeInput().keydown(KeyCode.down));
    act(() => wrapper.findNativeInput().keydown(KeyCode.enter));

    // The input should be cleared
    expect(wrapper.findNativeInput().getElement()).toHaveValue('');
  });

  test('selecting a dropdown option fires onTokensChange with the new token', () => {
    const onTokensChange = jest.fn();
    const { container } = render(
      <Autosuggest
        mode="tokens"
        value="us"
        onChange={() => {}}
        tokens={[]}
        onTokensChange={onTokensChange}
        options={defaultOptions}
      />
    );
    const wrapper = createWrapper(container).findAutosuggest()!;
    // ArrowDown opens dropdown: first position is the entered-text item ("Add us"),
    // second ArrowDown moves to the first real option (us-east-1).
    act(() => wrapper.findNativeInput().keydown(KeyCode.down));
    act(() => wrapper.findNativeInput().keydown(KeyCode.down));
    act(() => wrapper.findNativeInput().keydown(KeyCode.enter));

    expect(onTokensChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          tokens: [{ label: 'us-east-1', dismissLabel: 'us-east-1' }],
        },
      })
    );
  });

  test('selecting a dropdown option fires onChange with empty string to clear input', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Autosuggest
        mode="tokens"
        value="us"
        onChange={onChange}
        tokens={[]}
        onTokensChange={() => {}}
        options={defaultOptions}
      />
    );
    const wrapper = createWrapper(container).findAutosuggest()!;
    act(() => wrapper.findNativeInput().keydown(KeyCode.down));
    act(() => wrapper.findNativeInput().keydown(KeyCode.down));
    act(() => wrapper.findNativeInput().keydown(KeyCode.enter));

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: '' } }));
  });

  test('existing tokens are preserved when a new one is selected', () => {
    const onTokensChange = jest.fn();
    const existing = [makeToken('eu-west-1')];
    const { container } = render(
      <Autosuggest
        mode="tokens"
        value="us"
        onChange={() => {}}
        tokens={existing}
        onTokensChange={onTokensChange}
        options={defaultOptions}
      />
    );
    const wrapper = createWrapper(container).findAutosuggest()!;
    act(() => wrapper.findNativeInput().keydown(KeyCode.down));
    act(() => wrapper.findNativeInput().keydown(KeyCode.down));
    act(() => wrapper.findNativeInput().keydown(KeyCode.enter));

    expect(onTokensChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          tokens: [makeToken('eu-west-1'), { label: 'us-east-1', dismissLabel: 'us-east-1' }],
        },
      })
    );
  });

  // ---------------------------------------------------------------------------
  // defaultEnteredTextLabel: Add vs Use (internal.tsx lines 93–94)
  // ---------------------------------------------------------------------------
  test('entered-text label defaults to Add in tokens mode without explicit enteredTextLabel', () => {
    const { wrapper } = renderStateful();
    act(() => wrapper.setInputValue('my-region'));
    const enteredOption = wrapper.findEnteredTextOption();
    expect(enteredOption!.getElement()).toHaveTextContent('Add "my-region"');
  });

  test('explicit enteredTextLabel prop overrides the tokens-mode default', () => {
    const { wrapper } = renderStateful({ enteredTextLabel: v => `Use: "${v}"` });
    act(() => wrapper.setInputValue('my-region'));
    const enteredOption = wrapper.findEnteredTextOption();
    expect(enteredOption!.getElement()).toHaveTextContent('Use: "my-region"');
  });

  // ---------------------------------------------------------------------------
  // Enter key adds token via the entered-text item
  // ---------------------------------------------------------------------------
  test('pressing Enter adds a token and clears the input', () => {
    const { wrapper } = renderStateful();
    act(() => wrapper.setInputValue('ap-southeast-1'));
    // Press Enter to select the entered-text option
    act(() => wrapper.findNativeInput().keydown(KeyCode.enter));
    expect(wrapper.findNativeInput().getElement()).toHaveValue('');
  });
});
