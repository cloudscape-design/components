// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import Autosuggest, { AutosuggestProps } from '~components/autosuggest';

const enteredTextLabel = (value: string) => `Use: ${value}`;
const permutations = createPermutations<AutosuggestProps & { defaultOpen?: boolean }>([
  {
    options: [
      [
        { value: 'option1', label: 'First' },
        { value: 'option2', label: 'Second' },
      ],
      [],
    ],
    statusType: ['loading', 'pending', 'error', 'finished'],
    loadingText: ['Loading'],
    empty: ['No options'],
    errorText: ['Error'],
    recoveryText: ['Retry'],
    finishedText: ['Displayed all'],
    enteredTextLabel: [enteredTextLabel],
    value: [''],
  },
]);

export default function () {
  return (
    <>
      <h1>Autosuggest async permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div style={{ marginBottom: '100px' }}>
              <Autosuggest
                ariaLabel="Input field"
                onChange={() => {
                  /*empty handler to suppress react controlled property warning*/
                }}
                onLoadItems={() => {
                  /* handler is required to render retry button */
                }}
                {...permutation}
              />
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
