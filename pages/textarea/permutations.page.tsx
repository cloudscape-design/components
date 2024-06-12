// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Textarea, { TextareaProps } from '~components/textarea';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<TextareaProps>([
  {
    disabled: [false],
    value: [
      '',
      'Short value',
      'Long value, enough to line wrap and maybe have scroll bars.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    rows: [3, 6],
  },
  {
    disabled: [false],
    placeholder: [
      'Short placeholder',
      'Long placeholder, enough to line wrap and maybe have scroll bars.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    rows: [3, 6],
    value: [''],
  },
  {
    disabled: [false, true],
    value: ['Non-empty value: Placeholder should be hidden'],
    placeholder: ['Short placeholder'],
    invalid: [false, true],
    warning: [false, true],
  },
  {
    readOnly: [true],
    value: ['', 'a piece of text'],
    placeholder: ['Short placeholder'],
  },
  {
    placeholder: ['Placeholder with\nmultiple lines'],
    value: [''],
  },
]);

export default function TextareaPermutations() {
  return (
    <>
      <h1>Textarea permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Textarea
              ariaLabel="textarea"
              onChange={() => {
                /*empty handler to suppress react controlled property warning*/
              }}
              {...permutation}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
