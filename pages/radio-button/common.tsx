// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import RadioButton, { RadioButtonProps } from '~components/radio-button';

import createPermutations from '../utils/permutations';

const shortText = 'Short text';

export const longText =
  'Long text, long enough to wrap.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Whatever.';

type Permutation = Omit<RadioButtonProps, 'name'>;

export const permutations = createPermutations<Permutation>([
  {
    description: [undefined, shortText, longText],
    children: [undefined, shortText, longText],
    readOnly: [false, true],
    disabled: [false, true],
    checked: [true, false],
  },
]);

export const RadioButtonPermutation = ({
  children,
  description,
  readOnly,
  disabled,
  checked,
  index,
}: Permutation & { index?: number }) => {
  const commonProps = {
    children,
    description,
    readOnly,
    disabled,
    checked,
    name: `radio-group-${index}`,
  };
  if (children) {
    return <RadioButton {...commonProps} />;
  } else {
    // If no visual label provided, add a label for screen readers
    return (
      <label aria-label={`Select ${index}`}>
        <RadioButton {...commonProps} />
      </label>
    );
  }
};
