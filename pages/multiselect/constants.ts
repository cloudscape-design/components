// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MultiselectProps } from '~components/multiselect';

export const i18nStrings = {
  tokenLimitShowFewer: 'Show fewer chosen options',
  tokenLimitShowMore: 'Show more chosen options',
};

export const deselectAriaLabel = (option: MultiselectProps.Option) => {
  const label = option?.value || option?.label;
  return label ? `Deselect ${label}` : 'no label';
};

export const getInlineAriaLabel = (selectedOptions: MultiselectProps.Options) => {
  let label;

  if (selectedOptions.length === 0) {
    label = 0;
  }

  if (selectedOptions.length === 1) {
    label = selectedOptions[0].label;
  }

  if (selectedOptions.length === 2) {
    label = `${selectedOptions[0].label} and ${selectedOptions[1].label}`;
  }

  if (selectedOptions.length > 2) {
    label = `${selectedOptions[0].label}, ${selectedOptions[1].label}, and ${selectedOptions.length - 2} more`;
  }

  return label + ' selected';
};
