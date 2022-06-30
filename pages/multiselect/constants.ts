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
