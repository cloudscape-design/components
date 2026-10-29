// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import FormField from '~components/form-field';
import Header from '~components/header';
import Icon from '~components/icon';
import OptionList, { OptionListProps } from '~components/option-list';
import SegmentedControl from '~components/segmented-control';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

/**
 * Options selected when the page loads:
 * - `first` and `last`: the first or last option of each list.
 * - `two`: the second and fourth options, given in reverse order so selection order differs from list order.
 *   Multi selection only; single-selection lists start empty.
 */
type Preselected = 'none' | 'first' | 'last' | 'two';

type PageContext = React.Context<AppContextType<{ preselected?: Preselected }>>;

const goals: OptionListProps.Option[] = [
  {
    value: 'cost',
    label: 'Reduce cost',
    description: 'Prioritize cheaper instance types and storage tiers.',
    icon: <Icon name="settings" />,
  },
  { value: 'performance', label: 'Improve performance', description: 'Prioritize latency and throughput.' },
  { value: 'reliability', label: 'Increase reliability', description: 'Add redundancy across Availability Zones.' },
  { value: 'security', label: 'Strengthen security', description: 'Tighten IAM policies and encryption settings.' },
];

const services: OptionListProps.Options = [
  {
    value: 'compute',
    label: 'Compute',
    options: [
      { value: 'ec2', label: 'Amazon EC2' },
      { value: 'lambda', label: 'AWS Lambda' },
    ],
  },
  {
    value: 'storage',
    label: 'Storage',
    options: [
      { value: 's3', label: 'Amazon S3' },
      { value: 'efs', label: 'Amazon EFS', disabled: true, disabledReason: 'Not available in this Region.' },
    ],
  },
];

/**
 * Labels share first letters within and across groups, so repeated letters cycle through matches, and a
 * child's first letter differs from its group's (typing `e` should reach "EC2", not "Compute").
 */
const typeAheadServices: OptionListProps.Options = [
  {
    value: 'compute',
    label: 'Compute',
    options: [
      { value: 'ec2', label: 'EC2' },
      { value: 'elastic-beanstalk', label: 'Elastic Beanstalk' },
      { value: 'lambda', label: 'Lambda' },
    ],
  },
  {
    value: 'containers',
    label: 'Containers',
    options: [
      { value: 'ecs', label: 'ECS' },
      { value: 'eks', label: 'EKS' },
      { value: 'fargate', label: 'Fargate' },
    ],
  },
  {
    value: 'storage',
    label: 'Storage',
    options: [
      { value: 's3', label: 'S3' },
      { value: 'efs', label: 'EFS' },
      { value: 'glacier', label: 'Glacier' },
    ],
  },
];

const groupKey: keyof OptionListProps.OptionGroup = 'options';

const leafOptions = (options: OptionListProps.Options): OptionListProps.Option[] =>
  options.flatMap(option => (groupKey in option ? [...(option as OptionListProps.OptionGroup).options] : [option]));

function initialSelection(
  options: OptionListProps.Options,
  selectionType: OptionListProps.SelectionType,
  preselected: Preselected
): ReadonlyArray<OptionListProps.Option> {
  const leaves = leafOptions(options);
  switch (preselected) {
    case 'first':
      return [leaves[0]];
    case 'last':
      return [leaves[leaves.length - 1]];
    case 'two':
      return selectionType === 'multi' ? [leaves[3], leaves[1]] : [];
    default:
      return [];
  }
}

function Section({
  id,
  title,
  description,
  options,
  selectionType,
  preselected,
  listRef,
}: {
  id: string;
  title: string;
  description?: string;
  options: OptionListProps.Options;
  selectionType: OptionListProps.SelectionType;
  preselected: Preselected;
  listRef: React.RefObject<OptionListProps.Ref>;
}) {
  const [selectedOptions, setSelectedOptions] = useState(() => initialSelection(options, selectionType, preselected));
  return (
    <SpaceBetween size="xs">
      {/* Header's `id` is on its root element, so a header description would become part of the list's name. */}
      <Header variant="h2" id={`${id}-heading`}>
        {title}
      </Header>
      {description && <Box variant="p">{description}</Box>}
      <OptionList
        ref={listRef}
        data-testid={id}
        ariaLabelledby={`${id}-heading`}
        options={options}
        selectionType={selectionType}
        selectedOptions={selectedOptions}
        onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
      />
      <Box variant="small" data-testid={`${id}-value`}>
        Selected: {selectedOptions.map(option => option.value).join(', ') || 'none'}
      </Box>
    </SpaceBetween>
  );
}

export default function OptionListSimplePage() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const preselected = urlParams.preselected ?? 'none';

  const singleRef = useRef<OptionListProps.Ref>(null);
  const multiRef = useRef<OptionListProps.Ref>(null);
  const groupsRef = useRef<OptionListProps.Ref>(null);
  const typeAheadRef = useRef<OptionListProps.Ref>(null);

  return (
    <SimplePage
      title="Option list"
      settings={
        <SpaceBetween size="m">
          <FormField label="Already selected">
            <SegmentedControl
              selectedId={preselected}
              onChange={({ detail }) => setUrlParams({ preselected: detail.selectedId as Preselected })}
              options={[
                { id: 'none', text: 'None' },
                { id: 'first', text: 'First' },
                { id: 'last', text: 'Last' },
                { id: 'two', text: 'Second and fourth (multi only)' },
              ]}
            />
          </FormField>
          {/* Moves focus with `ref.focus()`, the way a builder's own dropdown does when it opens. */}
          <FormField label="Move focus into a list">
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => singleRef.current?.focus()}>Focus single selection</Button>
              <Button onClick={() => multiRef.current?.focus()}>Focus multi selection</Button>
              <Button onClick={() => groupsRef.current?.focus()}>Focus multi selection with groups</Button>
              <Button onClick={() => typeAheadRef.current?.focus()}>Focus type-ahead</Button>
            </SpaceBetween>
          </FormField>
        </SpaceBetween>
      }
      screenshotArea={{}}
    >
      <div style={{ maxInlineSize: 520 }}>
        {/* Remount when the setting changes so the initial selection follows it. */}
        <SpaceBetween size="xl" key={preselected}>
          <Section
            id="single"
            title="Single selection"
            options={goals}
            selectionType="single"
            preselected={preselected}
            listRef={singleRef}
          />
          <Section
            id="multi"
            title="Multi selection"
            options={goals}
            selectionType="multi"
            preselected={preselected}
            listRef={multiRef}
          />
          <Section
            id="groups"
            title="Multi selection with groups"
            options={services}
            selectionType="multi"
            preselected={preselected}
            listRef={groupsRef}
          />
          <Section
            id="type-ahead"
            title="Type-ahead"
            description="Type letters to move the highlight. Wait about a second between searches."
            options={typeAheadServices}
            selectionType="multi"
            preselected={preselected}
            listRef={typeAheadRef}
          />
        </SpaceBetween>
      </div>
    </SimplePage>
  );
}
