// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import padStart from 'lodash/padStart';
import range from 'lodash/range';

import { BoxProps } from '@cloudscape-design/components/box';
import { FlashbarProps } from '@cloudscape-design/components/flashbar';
import { MultiselectProps } from '@cloudscape-design/components/multiselect';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import { SelectProps } from '@cloudscape-design/components/select';
import { StatusIndicatorProps } from '@cloudscape-design/components/status-indicator';

let seed = 1;
export default function pseudoRandom() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const items = [
  { id: '1', title: 'Item 1', description: 'Description 1' },
  { id: '2', title: 'Item 2', description: 'Description 2' },
  { id: '3', title: 'Item 3', description: 'Description 3' },
];

export type InstanceState = 'PENDING' | 'RUNNING' | 'STOPPING' | 'STOPPED' | 'TERMINATING' | 'TERMINATED';

export interface Instance {
  id: string;
  name: string;
  description: string;
  state: InstanceState;
  type: string;
  imageId: string;
  dnsName?: string;
}

export function id() {
  const id = Math.ceil(pseudoRandom() * Math.pow(16, 8)).toString(16);
  return padStart(id, 8, '0');
}

function state() {
  const states = [
    'PENDING',
    'RUNNING',
    'RUNNING',
    'RUNNING',
    'STOPPING',
    'STOPPED',
    'STOPPED',
    'TERMINATED',
    'TERMINATING',
  ] as const;
  return states[Math.floor(pseudoRandom() * states.length)];
}

function number() {
  return 1 + Math.floor(pseudoRandom() * 256);
}

function dnsName() {
  return `ec2-${number()}-${number()}-${number()}-${number()}.eu-west-1.compute.amazonaws.com`;
}

export const flashbarItems: FlashbarProps.MessageDefinition[] = [
  {
    header: 'Success',
    type: 'success',
    content: 'This is a success message -- check it out!',
    dismissible: true,
    dismissLabel: 'Dismiss success message',
    id: 'success',
  },
  {
    header: 'Warning',
    type: 'warning',
    content: 'This is a warning message -- check it out!',
    dismissible: true,
    dismissLabel: 'Dismiss warning message',
    id: 'warning',
  },
  {
    header: 'Error',
    type: 'error',
    content: 'This is an error message -- check it out!',
    dismissible: true,
    dismissLabel: 'Dismiss error message',
    id: 'error',
  },
  {
    header: 'Info',
    type: 'info',
    content: 'This is an info message -- check it out!',
    dismissible: true,
    dismissLabel: 'Dismiss info message',
    id: 'info',
  },
  {
    header: 'In-progress',
    type: 'in-progress',
    content: (
      <>
        This is an in-progress flash -- check it out!
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
    content: 'This is a loading flash -- check it out!',
    dismissible: true,
    dismissLabel: 'Dismiss loading message',
    id: 'loading',
  },
];

export interface RandomData {
  description: string;
  name: string;
  amount: string;
  increase: boolean;
}

const collectionData: RandomData[] = [
  {
    description: 'volutpat. Nulla dignissim. Maecenas ornare egestas ligula. Nullam feugiat placerat',
    name: 'Velit Egestas LLP',
    amount: '$68.54',
    increase: true,
  },
  {
    description: 'vestibulum lorem, sit amet ultricies sem magna nec quam. Curabitur',
    name: 'Mattis Velit Justo Company',
    amount: '$80.38',
    increase: true,
  },
  {
    description: 'aliquet odio. Etiam ligula tortor, dictum eu, placerat eget, venenatis',
    name: 'Tempor LLP',
    amount: '$1.66',
    increase: false,
  },
  {
    description: 'ridiculus mus. Donec dignissim magna a tortor. Nunc commodo auctor',
    name: 'Egestas Hendrerit Neque Corporation',
    amount: '$31.74',
    increase: true,
  },
  {
    description: 'Vivamus molestie dapibus ligula. Aliquam erat volutpat. Nulla dignissim. Maecenas',
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
    description: 'Phasellus at augue id ante dictum cursus. Nunc mauris elit,',
    name: 'Nulla Facilisi Foundation',
    amount: '$97.03',
    increase: true,
  },
  {
    description: 'Sed nec metus facilisis lorem tristique aliquet. Phasellus fermentum convallis',
    name: 'Donec Vitae Corp',
    amount: '$15.88',
    increase: false,
  },
];

export const cardItems = collectionData.slice(0, 2);
export const tableItems = collectionData;

export const fontSizes: BoxProps.FontSize[] = [
  'body-s',
  'body-m',
  'heading-xs',
  'heading-s',
  'heading-m',
  'heading-l',
  'heading-xl',
  'display-l',
];

export const statusToText: [StatusIndicatorProps.Type, string][] = [
  ['error', 'Error'],
  ['warning', 'Warning'],
  ['success', 'Success'],
  ['info', 'Info'],
  ['stopped', 'Stopped'],
  ['pending', 'Pending'],
  ['in-progress', 'In progress'],
  ['loading', 'Loading'],
];

export function instanceType() {
  const types = [
    't1.micro',
    't2.nano',
    't2.small',
    't2.xlarge',
    't2.2xlarge',
    'm3.medium',
    'm3.large',
    'm3.xlarge',
    'm3.2xlarge',
    'm4.large',
    'm4.xlarge',
    'm4.2xlarge',
    'm4.4xlarge',
    'm4.10xlarge',
    'm4.16xlarge',
    'cr1.8xlarge',
    'r5.large',
    'r5.xlarge',
    'r5.2xlarge',
    'r5.metal',
    'r5d.xlarge',
    'r5d.2xlarge',
    'r5d.4xlarge',
    'r5d.8xlarge',
    'r5d.12xlarge',
    'r5d.16xlarge',
    'r5d.24xlarge',
    'r5d.metal',
    'i3.large',
    'i3.xlarge',
    'i3.2xlarge',
    'i3.16xlarge',
    'c3.large',
    'c3.xlarge',
    'c4.2xlarge',
    'c5.large',
    'c5.4xlarge ',
    'g2.2xlarge',
    'p2.xlarge',
    'm5.large',
    'm5.xlarge',
    'm5.2xlarge',
    'u-6tb1.metal',
  ];
  return types[Math.floor(pseudoRandom() * types.length)];
}

function imageId() {
  return `ami-${id()}`;
}

export function generateCollectionItems(count = 5): Instance[] {
  return range(count).map(() => {
    const value: Instance = {
      id: id(),
      name: `Instance ${id()}`,
      description: '',
      state: state(),
      type: instanceType(),
      imageId: imageId(),
    };
    if (value.state !== 'PENDING') {
      value.dnsName = dnsName();
    }
    return value;
  });
}

export const generateDropdownOptions = (count = 25): SelectProps.Options | MultiselectProps.Options => {
  return [...Array(count).keys()].map(n => {
    const numberToDisplay = (n + 1).toString();
    const baseOption = {
      id: numberToDisplay,
      value: numberToDisplay,
      label: `Option ${numberToDisplay}`,
    };
    if (n === 0 || n === 24 || n === 49) {
      return { ...baseOption, disabled: true, disabledReason: 'disabled reason' };
    }
    return baseOption;
  });
};
