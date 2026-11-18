// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon from '~components/icon';
import OptionList, { OptionListProps } from '~components/option-list';

import { PermutationsPage } from '../app/templates';
import PermutationsView from '../utils/permutations-view';

export const plain: OptionListProps.Option[] = [
  { value: '1', label: 'Reduce cost' },
  { value: '2', label: 'Improve performance', description: 'Prioritize latency and throughput.' },
  {
    value: '3',
    label: 'Increase reliability across every Region and Availability Zone that hosts the workload',
    description: 'A long label and a long description that wrap onto multiple lines on narrow containers.',
  },
  { value: '4', label: 'Strengthen security' },
];

const withIcons = plain.map(option => ({ ...option, icon: <Icon name="settings" /> }));

const withTags = plain.map(option => ({ ...option, labelTag: '128 GB', tags: ['CPU-v2', '2 GB RAM'] }));

const withDisabled = plain.map(option =>
  option.value === '2' || option.value === '4'
    ? { ...option, disabled: true, disabledReason: option.value === '4' ? 'Requires Enterprise support' : undefined }
    : option
);

export const grouped: OptionListProps.Options = [
  { value: 'group-1', label: 'Goals', options: plain.slice(0, 2) },
  { value: 'group-2', label: 'More goals', options: plain.slice(2) },
];

export const allOptions = [plain, withIcons, withTags, withDisabled, grouped];

export const renderOption: OptionListProps['renderOption'] = ({ item }) => <strong>{item.option.label}</strong>;

export type OptionListPermutation = OptionListProps & { width: number };

export function OptionListPermutations({
  title,
  permutations,
}: {
  title: string;
  permutations: ReadonlyArray<OptionListPermutation>;
}) {
  return (
    <PermutationsPage title={title} screenshotArea={{ disableAnimations: true }}>
      <PermutationsView
        permutations={permutations}
        render={({ width, ...props }) => (
          <div style={{ inlineSize: width }}>
            <OptionList {...props} ariaLabel="Goals" onChange={() => {}} />
          </div>
        )}
      />
    </PermutationsPage>
  );
}
