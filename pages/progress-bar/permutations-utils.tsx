// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { ProgressBarProps } from '~components/progress-bar';
import createPermutations from '../utils/permutations';

const repeat = (text: string, times: number): string => {
  const returnArray = [];
  for (let i = 0; i < times; i++) {
    returnArray.push(text);
  }
  return returnArray.join('');
};

const permutations = createPermutations<ProgressBarProps>([
  {
    value: [99.6],
    label: [<span key={0}>{repeat('very long label', 15)}</span>],
    description: [<span key={0}>{repeat('very long description', 15)}</span>],
    additionalInfo: [<span key={0}>{repeat('very long additional text', 15)}</span>],
  },
  {
    value: [47],
    label: [repeat('verylonglabel', 15)],
    description: [<span key={0}>{repeat('verylongdescription', 15)}</span>],
    additionalInfo: [<span key={0}>{repeat('verylongadditionaltext', 15)}</span>],
  },
  {
    status: ['error'],
    resultText: [repeat('result text', 15), repeat('resulttext', 15)],
    resultButtonText: [undefined, 'Result button text'],
    label: ['Label'],
    description: ['description'],
    additionalInfo: ['additional info'],
  },
  {
    value: [0, 100],
    label: ['Label'],
    description: ['description'],
    additionalInfo: ['additional info'],
  },
  {
    value: [47],
    label: [undefined, 'Label'],
    description: [undefined, 'description'],
    additionalInfo: [undefined, 'additional info'],
  },
  {
    status: ['error', 'success'],
    resultText: ['result text'],
    resultButtonText: [undefined, 'Result button text'],
    label: [undefined, 'Label'],
    description: [undefined, 'description'],
    type: ['percentage'],
    additionalInfo: [undefined, 'additional info'],
  },
  {
    value: [8],
    maxValue: [9],
    label: [undefined, 'Label'],
    description: [undefined, 'description'],
    additionalInfo: [undefined, 'additional info'],
    type: ['ratio'],
    ariaValueText: [undefined, `${8} of ${9} tasks`],
  },
]);

export default permutations;
