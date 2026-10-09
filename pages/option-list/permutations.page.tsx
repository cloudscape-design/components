// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon from '~components/icon';
import OptionList, { OptionListProps } from '~components/option-list';

import { SimplePage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

interface Item {
  id: string;
  label: string;
  description?: string;
}

const items: Item[] = [
  { id: '1', label: 'Reduce cost' },
  { id: '2', label: 'Improve performance', description: 'Prioritize latency and throughput.' },
  {
    id: '3',
    label: 'Increase reliability across every Region and Availability Zone that hosts the workload',
    description: 'A long label and a long description that wrap onto multiple lines on narrow containers.',
  },
  { id: '4', label: 'Strengthen security' },
];

const permutations = createPermutations<OptionListProps<Item> & { width: number }>([
  {
    width: [240, 480],
    items: [items],
    selectionType: ['single', 'multi'],
    selectedIds: [[], ['2'], ['2', '3']],
    renderItem: [
      item => ({ id: item.id, content: item.label, secondaryContent: item.description }),
      item => ({
        id: item.id,
        content: item.label,
        secondaryContent: item.description,
        icon: <Icon name="settings" />,
      }),
      item => ({
        id: item.id,
        content: item.label,
        secondaryContent: item.description,
        labelTag: '128 GB',
        tags: ['CPU-v2', '2 GB RAM'],
      }),
      item => ({
        id: item.id,
        content: item.label,
        secondaryContent: item.description,
        disabled: item.id === '2' || item.id === '4',
        disabledReason: item.id === '4' ? 'Requires an Enterprise support plan' : undefined,
      }),
    ],
  },
]).filter(({ selectionType, selectedIds }) => selectionType === 'multi' || (selectedIds?.length ?? 0) < 2);

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
