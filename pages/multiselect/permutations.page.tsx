// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { OptionDefinition, OptionGroup } from '~components/internal/components/option/interfaces';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings, deselectAriaLabel } from './constants';

const options: MultiselectProps.Options = [
  { value: 'first', label: 'Simple' },
  { value: 'second', label: 'With small icon', iconName: 'folder' },
  { value: 'third', label: 'With big icon icon', description: 'Very big option', iconName: 'heart' },
  {
    label: 'Option group',
    options: [{ value: 'forth', label: 'Nested option' }],
  },
  {
    label: 'Option group 2',
    options: [
      { value: 'fifth', label: 'Complex' },
      { value: 'sixth', label: 'Complex With small icon', iconName: 'folder', disabled: true },
      { value: 'seventh', label: 'Complex With big icon icon', description: 'Very big option', iconName: 'heart' },
    ],
  },
  { value: 'more1', label: 'More options with very long texts 1' },
  { value: 'more2', label: 'More options with very long texts 2' },
  { value: 'more3', label: 'More options with very long texts 3' },
  { value: 'more4', label: 'More options with very long texts 4' },
];

const _getGroupOptions = (option: OptionDefinition | OptionGroup) => ('options' in option ? option.options : [option]);
const _getFirstChild = (option: OptionDefinition | OptionGroup) => ('options' in option ? option.options[0] : option);

const permutations = createPermutations<MultiselectProps & { inlineTokens?: boolean }>([
  {
    placeholder: ['Select an item'],
    disabled: [false, true],
    hideTokens: [false, true],
    tokenLimit: [undefined, 2, 0],
    options: [options],
    selectedOptions: [
      [],
      [options[3]],
      [options[1], options[2]],
      [..._getGroupOptions(options[4])],
      [_getFirstChild(options[4])],
    ],
    deselectAriaLabel: [deselectAriaLabel],
    i18nStrings: [i18nStrings],
    inlineTokens: [undefined, true],
  },
  {
    placeholder: ['Select an item'],
    invalid: [false, true],
    warning: [false, true],
    tokenLimit: [2],
    options: [options],
    selectedOptions: [[], [options[0], options[1]]],
    deselectAriaLabel: [deselectAriaLabel],
    i18nStrings: [i18nStrings],
    inlineTokens: [undefined, true],
  },
  // Inline tokens with many selected options
  {
    placeholder: ['Select an item'],
    disabled: [false, true],
    options: [options],
    selectedOptions: [
      [
        options[0],
        options[1],
        options[2],
        ..._getGroupOptions(options[4]),
        options[5],
        options[6],
        options[7],
        options[8],
      ],
    ],
    i18nStrings: [i18nStrings],
    inlineTokens: [true],
  },
]);

export default function MultiselectPermutations() {
  return (
    <>
      <h1>Multiselect permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <Multiselect {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
