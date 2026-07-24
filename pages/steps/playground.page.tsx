// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import FormField from '~components/form-field';
import Header from '~components/header';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';
import Steps, { StepsProps } from '~components/steps';
import Textarea from '~components/textarea';

import { SimplePage } from '../app/templates';

const statusValues: ReadonlyArray<StepsProps.Status> = [
  'log',
  'success',
  'error',
  'warning',
  'info',
  'loading',
  'in-progress',
  'pending',
  'stopped',
  'not-started',
];

const orientationOptions = [
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' },
];

const defaultStepsJson = JSON.stringify(
  [
    {
      annotation: '9:00 AM',
      header: 'Request received',
      status: 'log',
      statusIconAriaLabel: 'Log entry',
      details: 'The request was added to the activity log.',
    },
    {
      annotation: '9:05 AM',
      header: 'Processing request',
      status: 'in-progress',
      statusIconAriaLabel: 'In progress',
      details: 'The request is being processed.',
    },
    {
      annotation: '9:10 AM',
      header: 'Request completed',
      status: 'success',
      statusIconAriaLabel: 'Success',
      details: 'The request completed successfully.',
    },
  ],
  null,
  2
);

function parseSteps(value: string): { steps: ReadonlyArray<StepsProps.Step>; errorText?: string } {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      throw new Error('Enter a JSON list of steps.');
    }

    const steps = parsed.map((item, index): StepsProps.Step => {
      if (!item || typeof item !== 'object') {
        throw new Error(`Step ${index + 1} must be an object.`);
      }

      const { annotation, header, status, statusIconAriaLabel, details } = item as Record<string, unknown>;
      if (typeof header !== 'string') {
        throw new Error(`Step ${index + 1} must have a string header.`);
      }
      if (typeof status !== 'string' || !statusValues.includes(status as StepsProps.Status)) {
        throw new Error(`Step ${index + 1} has an invalid status.`);
      }
      if (annotation !== undefined && typeof annotation !== 'string') {
        throw new Error(`Step ${index + 1} annotation must be a string.`);
      }
      if (details !== undefined && typeof details !== 'string') {
        throw new Error(`Step ${index + 1} details must be a string.`);
      }
      if (statusIconAriaLabel !== undefined && typeof statusIconAriaLabel !== 'string') {
        throw new Error(`Step ${index + 1} statusIconAriaLabel must be a string.`);
      }

      return {
        annotation: annotation === undefined ? undefined : <span>{annotation}</span>,
        header: <span>{header}</span>,
        details: details === undefined ? undefined : <span>{details}</span>,
        status: status as StepsProps.Status,
        statusIconAriaLabel,
      };
    });

    return { steps };
  } catch (error) {
    return { steps: [], errorText: error instanceof Error ? error.message : 'Invalid JSON.' };
  }
}

export default function StepsPlayground() {
  const [stepsJson, setStepsJson] = useState(defaultStepsJson);
  const [orientation, setOrientation] = useState<StepsProps.Orientation>('vertical');
  const [showConnector, setShowConnector] = useState(true);
  const [isRtl, setIsRtl] = useState(false);
  const { steps, errorText } = parseSteps(stepsJson);

  return (
    <SimplePage
      title="Steps playground"
      subtitle="Edit the JSON list of steps and inspect the result."
      settings={
        <SpaceBetween size="l">
          <FormField
            label="Steps JSON"
            description="Edit the annotation, header, status, statusIconAriaLabel, and details for each step."
            errorText={errorText}
          >
            <Textarea
              value={stepsJson}
              rows={18}
              invalid={!!errorText}
              onChange={({ detail }) => setStepsJson(detail.value)}
            />
          </FormField>

          <ColumnLayout columns={2} variant="text-grid">
            <FormField label="Orientation">
              <Select
                selectedOption={orientationOptions.find(option => option.value === orientation) ?? null}
                options={orientationOptions}
                onChange={({ detail }) => setOrientation(detail.selectedOption.value as StepsProps.Orientation)}
              />
            </FormField>
          </ColumnLayout>

          <SpaceBetween direction="horizontal" size="l">
            <Checkbox checked={showConnector} onChange={({ detail }) => setShowConnector(detail.checked)}>
              Show connector
            </Checkbox>
            <Checkbox checked={isRtl} onChange={({ detail }) => setIsRtl(detail.checked)}>
              RTL
            </Checkbox>
          </SpaceBetween>
        </SpaceBetween>
      }
    >
      <Container header={<Header variant="h2">Preview</Header>}>
        <div dir={isRtl ? 'rtl' : 'ltr'}>
          <Steps
            ariaLabel="Editable steps"
            connectorLines={showConnector ? 'visible' : 'none'}
            orientation={orientation}
            steps={steps}
          />
        </div>
      </Container>
    </SimplePage>
  );
}
