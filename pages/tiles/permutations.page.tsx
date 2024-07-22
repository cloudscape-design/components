// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Tiles, { TilesProps } from '~components/tiles';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import img from './assets/amazon.svg';

const permutations = createPermutations<TilesProps>([
  {
    value: ['first'],
    readOnly: [false, true],
    items: [
      [
        { value: 'first', description: 'Short description', label: 'First Button', disabled: true },
        { value: 'second', description: 'Short description', label: 'Second Button' },
        { value: 'third', description: 'Short description', label: 'Third Button' },
        { value: 'fourth', description: 'Short description', label: 'Fourth Button' },
        { value: 'fifth', description: 'Short description', label: 'Fifth Button' },
        { value: 'sixth', description: 'Short description', label: 'Sixth Button' },
      ],
      [
        {
          value: 'first',
          description: 'Long description describes long',
          label: 'First Button',
        },
        {
          value: 'second',
          description: 'Short description',
          label: 'Label Label Label Label Label Label Label Label Label Label',
          disabled: true,
        },
        {
          value: 'third',
          description: 'ContinuouslyLongDescriptionContinuouslyLongDescriptionContinuouslyLongDescription',
          label: 'Third Button',
        },
        {
          value: 'fourth',
          description: 'Short description',
          label: 'LabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabel',
        },
        {
          value: 'fifth',
          description:
            'Long description describes long description describes long description describes long description describes long description describes long description describes long description describes long',
          label: 'Fourth Button',
        },
        { value: 'sixth', description: 'Short description', label: 'Sixth Button' },
      ],
      [
        { value: 'seventh', description: 'Short Description', label: 'First Button', disabled: true },
        { value: 'second', description: 'Short description', label: 'Second Button' },
        { value: 'ninth', description: '', label: 'Label' },
        {
          value: 'first',
          description: 'Short description',
          label: 'Third Button',
          image: <img src={img} alt="Amazon" />,
        },
        { value: 'third', description: 'Short description', label: 'Third Button' },
        {
          value: 'fourth',
          description: 'Short description',
          label: 'LabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabelLabel',
        },
        {
          value: 'fifth',
          description:
            'Long description describes long description describes long description describes long description describes long description describes long description describes long description describes long',
          label: 'Fourth Button',
        },
        {
          value: 'sixth',
          description: 'Short description',
          label: 'Third Button',
          image: <img src={img} alt="Amazon" />,
        },
      ],
      [
        { value: 'first', description: 'Short description', label: 'First Button', disabled: true },
        { value: 'second', description: 'Short description', label: 'Second Button' },
        {
          value: 'third',
          description: 'Short description',
          label: 'Third Button',
          image: <img src={img} alt="Amazon" />,
        },
        { value: 'fourth', description: 'Short description', label: 'Fourth Button' },
        { value: 'fifth', description: 'Short description', label: 'Fifth Button' },
        {
          value: 'sixth',
          description: 'Short description',
          label: 'Sixth Button Sixth Button Sixth Button Sixth Button Sixth Button',
          image: <img src={img} alt="Amazon" />,
        },
      ],
    ],
  },
  {
    value: ['first'],
    columns: [undefined, 4],
    items: [
      [
        {
          value: 'first',
          label: 'First Button',
          description: 'Short description',
          disabled: true,
          image: <img src={img} alt="Amazon" />,
        },
        {
          value: 'second',
          label: 'Second Button',
          description: 'Short description',
          image: <img src={img} alt="Amazon" />,
        },
        {
          value: 'third',
          label: 'Third Button',
          description:
            'Long text, long enough to wrap.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Whatever.',
          image: <img src={img} alt="Amazon" />,
        },
        {
          value: 'fourth',
          label: 'Fourth Button',
          description: 'Short description',
          image: <img src={img} alt="Amazon" />,
        },
        {
          value: 'fifth',
          label: 'Fourth Button',
          description: 'Short description',
          image: <img src={img} alt="Amazon" />,
        },
      ],
    ],
  },
]);

export default function AlertScenario() {
  return (
    <article>
      <h1>Tiles permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Tiles
              onChange={() => {
                /*empty handler to suppress react controlled property warning*/
              }}
              {...permutation}
            />
          )}
        />
      </ScreenshotArea>
    </article>
  );
}
