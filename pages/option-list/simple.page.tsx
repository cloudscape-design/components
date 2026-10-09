// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Dialog from '~components/dialog';
import Header from '~components/header';
import Icon from '~components/icon';
import OptionList, { OptionListProps } from '~components/option-list';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

interface Goal {
  id: string;
  label: string;
  description: string;
}

const goals: Goal[] = [
  { id: 'cost', label: 'Reduce cost', description: 'Prioritize cheaper instance types and storage tiers.' },
  { id: 'performance', label: 'Improve performance', description: 'Prioritize latency and throughput.' },
  { id: 'reliability', label: 'Increase reliability', description: 'Add redundancy across Availability Zones.' },
  { id: 'security', label: 'Strengthen security', description: 'Tighten IAM policies and encryption settings.' },
];

const renderGoal = (goal: Goal): OptionListProps.RenderItemResult => ({
  id: goal.id,
  content: goal.label,
  secondaryContent: goal.description,
});

const renderGoalLabelOnly = (goal: Goal): OptionListProps.RenderItemResult => ({ id: goal.id, content: goal.label });

const renderGoalWithDisabled = (goal: Goal): OptionListProps.RenderItemResult => ({
  ...renderGoal(goal),
  disabled: goal.id === 'reliability',
  disabledReason: goal.id === 'reliability' ? 'The workload already runs in three Availability Zones.' : undefined,
});

const renderGoalWithIcon = (goal: Goal): OptionListProps.RenderItemResult => ({
  ...renderGoal(goal),
  icon: <Icon name="settings" />,
  labelTag: 'Recommended',
  tags: ['Cost', 'Quick win'],
});

function FollowUpQuestion() {
  const [selectedIds, setSelectedIds] = useState<ReadonlyArray<string>>([]);
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <SpaceBetween size="xs">
      <Dialog
        header={<span id="follow-up-question">What should we optimize for?</span>}
        onDismiss={() => setSubmitted('Dismissed')}
        i18nStrings={{ dismissAriaLabel: 'Close' }}
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setSubmitted('Skipped')}>Skip</Button>
              <Button
                variant="primary"
                disabled={selectedIds.length === 0}
                onClick={() => setSubmitted(`Submitted: ${selectedIds.join(', ')}`)}
              >
                Continue
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <OptionList
          ariaLabelledby="follow-up-question"
          items={goals}
          renderItem={renderGoalLabelOnly}
          selectionType="single"
          selectedIds={selectedIds}
          onChange={({ detail }) => setSelectedIds(detail.selectedIds)}
        />
      </Dialog>
      <Box variant="small" data-testid="follow-up-result">
        {submitted ?? 'Not submitted'}
      </Box>
    </SpaceBetween>
  );
}

export default function OptionListSimplePage() {
  const [singleSelectedIds, setSingleSelectedIds] = useState<ReadonlyArray<string>>([]);
  const [multiSelectedIds, setMultiSelectedIds] = useState<ReadonlyArray<string>>([]);
  const [iconSelectedIds, setIconSelectedIds] = useState<ReadonlyArray<string>>(['performance']);
  const [disabledSelectedIds, setDisabledSelectedIds] = useState<ReadonlyArray<string>>([]);

  return (
    <SimplePage title="Option list">
      <div style={{ maxInlineSize: 520 }}>
        <SpaceBetween size="xl">
          <SpaceBetween size="xs">
            <Header variant="h2" id="single-heading">
              Single selection
            </Header>
            <OptionList
              data-testid="single"
              ariaLabelledby="single-heading"
              items={goals}
              renderItem={renderGoal}
              selectionType="single"
              selectedIds={singleSelectedIds}
              onChange={({ detail }) => setSingleSelectedIds(detail.selectedIds)}
            />
            <Box variant="small" data-testid="single-value">
              Selected: {singleSelectedIds.join(', ') || 'none'}
            </Box>
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Header variant="h2" id="multi-heading">
              Multi selection
            </Header>
            <OptionList
              data-testid="multi"
              ariaLabelledby="multi-heading"
              items={goals}
              renderItem={renderGoal}
              selectionType="multi"
              selectedIds={multiSelectedIds}
              onChange={({ detail }) => setMultiSelectedIds(detail.selectedIds)}
            />
            <Box variant="small" data-testid="multi-value">
              Selected: {multiSelectedIds.join(', ') || 'none'}
            </Box>
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Header variant="h2" id="icon-heading">
              With icons, label tag, tags and a preselected option
            </Header>
            <OptionList
              ariaLabelledby="icon-heading"
              items={goals}
              renderItem={renderGoalWithIcon}
              selectionType="single"
              selectedIds={iconSelectedIds}
              onChange={({ detail }) => setIconSelectedIds(detail.selectedIds)}
            />
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Header variant="h2" id="disabled-heading">
              With a disabled option
            </Header>
            <OptionList
              data-testid="disabled"
              ariaLabelledby="disabled-heading"
              items={goals}
              renderItem={renderGoalWithDisabled}
              selectionType="multi"
              selectedIds={disabledSelectedIds}
              onChange={({ detail }) => setDisabledSelectedIds(detail.selectedIds)}
            />
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Header variant="h2" id="uncontrolled-heading">
              Uncontrolled
            </Header>
            <OptionList
              ariaLabelledby="uncontrolled-heading"
              items={goals}
              renderItem={renderGoalLabelOnly}
              selectionType="multi"
            />
          </SpaceBetween>

          <SpaceBetween size="xs">
            <Header variant="h2">In the follow-up questions Dialog</Header>
            <FollowUpQuestion />
          </SpaceBetween>
        </SpaceBetween>
      </div>
    </SimplePage>
  );
}
