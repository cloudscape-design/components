// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';

import TopNavigation from '~components/top-navigation';
import Input, { InputProps } from '~components/input';
import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import logo from './logos/simple-logo.svg';
import { I18N_STRINGS } from './common';

export default function TopNavigationPage() {
  const [valueAutosuggest, setValueAutosuggest] = useState('');
  const [valueInput, setValueInput] = useState('');
  const inputRef = useRef<InputProps.Ref>(null);
  const autosuggestRef = useRef<AutosuggestProps.Ref>(null);
  return (
    <article>
      <h1>TopNavigation with search</h1>
      <TopNavigation
        i18nStrings={I18N_STRINGS}
        identity={{
          logo: { src: logo, alt: 'Logo' },
          href: '#',
          title: 'Input as a search',
        }}
        search={
          <Input
            ref={inputRef}
            ariaLabel="Input field"
            value={valueInput}
            onChange={({ detail }) => setValueInput(detail.value)}
          />
        }
      />
      <br />
      <TopNavigation
        i18nStrings={I18N_STRINGS}
        identity={{
          href: '#',
          title: 'Autosuggest as a search',
        }}
        search={
          <Autosuggest
            ref={autosuggestRef}
            ariaLabel="Input field"
            onChange={({ detail }) => setValueAutosuggest(detail.value)}
            value={valueAutosuggest}
            options={[
              { value: 'Suggestion 1' },
              { value: 'Suggestion 2' },
              { value: 'Suggestion 3' },
              { value: 'Suggestion 4' },
            ]}
            enteredTextLabel={value => `Use: "${value}"`}
            placeholder="Enter value"
            empty="No matches found"
          />
        }
      />
      <br />
      <button onClick={() => inputRef.current?.focus()}>Focus input</button>
      <button onClick={() => autosuggestRef.current?.focus()}>Focus autosuggest</button>
    </article>
  );
}
