// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { FlashbarProps } from '~components/flashbar';
import { MultiselectProps } from '~components/multiselect';
import ProgressBar from '~components/progress-bar';
import { SelectProps } from '~components/select';

let seed = 1;
export default function pseudoRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export interface RandomData {
  description: string;
  name: string;
  amount: string;
  increase: boolean;
}

const collectionData: RandomData[] = [
  {
    description: 'volutpat. Nulla dignissim. Maecenas ornare egestas ligula.',
    name: 'Velit Egestas LLP',
    amount: '$68.54',
    increase: true,
  },
  {
    description: 'vestibulum lorem, sit amet ultricies sem magna nec quam.',
    name: 'Mattis Velit Justo Company',
    amount: '$80.38',
    increase: true,
  },
  {
    description: 'aliquet odio. Etiam ligula tortor, dictum eu, placerat eget.',
    name: 'Tempor LLP',
    amount: '$1.66',
    increase: false,
  },
  {
    description: 'ridiculus mus. Donec dignissim magna a tortor. Nunc commodo.',
    name: 'Egestas Hendrerit Neque Corporation',
    amount: '$31.74',
    increase: true,
  },
  {
    description: 'Vivamus molestie dapibus ligula. Aliquam erat volutpat.',
    name: 'Aenean Incorporated',
    amount: '$53.61',
    increase: true,
  },
  {
    description: 'Cras sed leo. Cras vehicula aliquet libero. Integer in magna.',
    name: 'Proin Ltd',
    amount: '$42.19',
    increase: false,
  },
  {
    description: 'Phasellus at augue id ante dictum cursus. Nunc mauris elit.',
    name: 'Nulla Facilisi Foundation',
    amount: '$97.03',
    increase: true,
  },
  {
    description: 'Sed nec metus facilisis lorem tristique aliquet.',
    name: 'Donec Vitae Corp',
    amount: '$15.88',
    increase: false,
  },
];

export const cardItems = collectionData.slice(0, 2);
export const tableItems = collectionData;

export const flashbarItems: FlashbarProps.MessageDefinition[] = [
  {
    header: 'Success',
    type: 'success',
    content: 'This is a success message.',
    dismissible: true,
    dismissLabel: 'Dismiss success message',
    id: 'success',
  },
  {
    header: 'Warning',
    type: 'warning',
    content: 'This is a warning message.',
    dismissible: true,
    dismissLabel: 'Dismiss warning message',
    id: 'warning',
  },
  {
    header: 'Error',
    type: 'error',
    content: 'This is an error message.',
    dismissible: true,
    dismissLabel: 'Dismiss error message',
    id: 'error',
  },
  {
    header: 'Info',
    type: 'info',
    content: 'This is an info message.',
    dismissible: true,
    dismissLabel: 'Dismiss info message',
    id: 'info',
  },
  {
    header: 'In-progress',
    type: 'in-progress',
    content: (
      <>
        This is an in-progress flash.
        <ProgressBar value={37} variant="flash" />
      </>
    ),
    dismissible: true,
    dismissLabel: 'Dismiss in-progress message',
    id: 'in-progress',
  },
  {
    header: 'Loading',
    type: 'in-progress',
    loading: true,
    content: 'This is a loading flash.',
    dismissible: true,
    dismissLabel: 'Dismiss loading message',
    id: 'loading',
  },
];

export const generateDropdownOptions = (count = 25): SelectProps.Options | MultiselectProps.Options => {
  return [...Array(count).keys()].map(n => {
    const numberToDisplay = (n + 1).toString();
    const baseOption = { id: numberToDisplay, value: numberToDisplay, label: `Option ${numberToDisplay}` };
    if (n === 0 || n === 24 || n === 49) {
      return { ...baseOption, disabled: true, disabledReason: 'disabled reason' };
    }
    return baseOption;
  });
};
