// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import range from 'lodash/range';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import img from './images/icon.png';

// enteredTextLabel is built in render from this prefix. A function in the permutations would put its minified
// source in the permutation ID, which changes between builds and stops screenshot tests from matching permutations.
type AutosuggestPermutation = Omit<AutosuggestProps, 'enteredTextLabel'> & { enteredTextPrefix: string };

const permutations = createPermutations<AutosuggestPermutation>([
  {
    ariaLabel: ['some label'],
    placeholder: [undefined, 'Enter some data'],
    invalid: [false, true],
    value: ['', 'op', 'Option 2', 'Other Option'],
    options: [
      [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
      undefined,
    ],
    enteredTextPrefix: ['Use: '],
  },
  {
    ariaLabel: ['some label'],
    placeholder: ['Enter some data'],
    warning: [true],
    value: ['op'],
    options: [
      [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
      undefined,
    ],
    enteredTextPrefix: ['Use: '],
  },
  {
    ariaLabel: ['some label'],
    placeholder: ['Enter some data'],
    invalid: [true],
    warning: [true],
    value: ['op'],
    options: [
      [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
      ],
    ],
    enteredTextPrefix: ['Use: '],
  },
  {
    ariaLabel: ['some label'],
    options: [undefined],
    value: ['', 'Some value'],
    empty: [
      undefined,
      'No options',
      <>
        No options, but <a>a link</a>
      </>,
    ],
    enteredTextPrefix: ['Use: '],
  },
  {
    ariaLabel: ['some label'],
    disabled: [true, false],
    invalid: [true, false],
    value: ['', 'Some option'],
    placeholder: ['Enter some data'],
    enteredTextPrefix: ['Use: '],
  },
  {
    ariaLabel: ['some label'],
    disabled: [true, false],
    warning: [true],
    value: ['', 'Some option'],
    placeholder: ['Enter some data'],
    enteredTextPrefix: ['Use: '],
  },
  {
    ariaLabel: ['some label'],
    readOnly: [true],
    value: ['', 'Some option'],
    placeholder: ['Enter some data'],
    enteredTextPrefix: ['Use: '],
  },
  {
    value: [''],
    ariaLabel: ['some label'],
    statusType: ['loading'],
    loadingText: ['Loading more items', undefined],
    enteredTextPrefix: ['Use: '],
  },
  {
    value: [''],
    ariaLabel: ['some label'],
    statusType: ['error'],
    errorText: ['Error while loading', undefined],
    enteredTextPrefix: ['Use: '],
  },
  {
    value: ['', 'op', 'Option 2', 'tag1', 'this is a label tag', 'thisisafilteringtag'],
    options: [
      [
        { value: 'option1', label: 'Option 1', tags: ['tag1', 'tag2'] },
        { value: 'option2', label: 'Option 2', filteringTags: ['thisisafilteringtag'] },
      ],
      [
        { value: 'option1', label: 'Option 1', labelTag: 'this is a label tag' },
        { value: 'option2', label: 'Option 2' },
      ],
      [
        { value: 'option1', label: 'Option 1', tags: ['tag1', 'tag2'], labelTag: 'this is a label tag' },
        { value: 'option2', label: 'Option 2' },
      ],
      [
        { value: 'option1', label: 'Option 1', tags: ['tag1', 'tag2'], description: 'Description1' },
        { value: 'option2', label: 'Option 2' },
      ],
      [
        {
          value: 'option1',
          label: 'Option 1',
          iconAriaLabel: 'amazon-logo',
          iconUrl: img,
        },
        {
          value: 'option2',
          label: 'Option 2',
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
              <circle cx="8" cy="8" r="7" />
              <circle cx="8" cy="8" r="3" />
            </svg>
          ),
        },
      ],
      [
        {
          value: 'option1',
          label: 'Option 1',
          tags: ['tag1', 'tag2'],
          iconSvg: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
              <circle cx="8" cy="8" r="7" />
              <circle cx="8" cy="8" r="3" />
            </svg>
          ),
        },
        { value: 'option2', label: 'Option 2' },
      ],
    ],
    enteredTextPrefix: ['Use: '],
  },
  {
    value: [''],
    enteredTextPrefix: ['Use: '],
    options: [range(20).map(i => ({ value: `option${i}`, label: `Option ${i}` }))],
    virtualScroll: [true, false],
  },
  {
    value: ['some value'],
    enteredTextPrefix: ['Use: '],
    options: [[]],
    virtualScroll: [true, false],
  },
]);

export default function () {
  return (
    <>
      <h1>Autosuggest permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={({ enteredTextPrefix, ...permutation }) => (
            <div style={{ marginBottom: '100px' }}>
              <Autosuggest
                ariaLabel="Input field"
                clearAriaLabel="Clear"
                onChange={() => {
                  /*empty handler to suppress react controlled property warning*/
                }}
                {...permutation}
                enteredTextLabel={value => `${enteredTextPrefix}${value}`}
              />
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
