// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import OptionList, { OptionListProps } from '~components/option-list';

import { SimplePage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

const plain: OptionListProps.Option[] = [
  { value: '1', label: 'Reduce cost' },
  { value: '2', label: 'Improve performance', description: 'Prioritize latency and throughput.' },
  {
    value: '3',
    label: 'Increase reliability across every Region and Availability Zone that hosts the workload',
    description: 'A long label and a long description that wrap onto multiple lines on narrow containers.',
  },
  { value: '4', label: 'Strengthen security' },
];

const withIcons = plain.map(option => ({ ...option, iconName: 'settings' as const }));

const withTags = plain.map(option => ({ ...option, labelTag: '128 GB', tags: ['CPU-v2', '2 GB RAM'] }));

const withDisabled = plain.map(option =>
  option.value === '2' || option.value === '4'
    ? { ...option, disabled: true, disabledReason: option.value === '4' ? 'Requires Enterprise support' : undefined }
    : option
);

const permutations = createPermutations<OptionListProps & { width: number }>([
  {
    width: [240, 480],
    options: [plain, withIcons, withTags, withDisabled],
    selectionType: ['single', 'multi'],
    selectedOptions: [[], [plain[1]], [plain[1], plain[2]]],
  },
]).filter(({ selectionType, selectedOptions }) => selectionType === 'multi' || (selectedOptions?.length ?? 0) < 2);

export default function OptionListPermutationsPage() {
  return (
    <SimplePage title="Option list: permutations" screenshotArea={{ disableAnimations: true }}>
      <PermutationsView
        permutations={permutations}
        render={({ width, ...props }) => (
          <div style={{ inlineSize: width }}>
            <OptionList {...props} ariaLabel="Goals" onChange={() => {}} />
          </div>
        )}
      />
    </SimplePage>
  );
}
