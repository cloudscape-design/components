// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import Steps, { StepsProps } from '~components/steps';

import ScreenshotArea from '../utils/screenshot-area';

const orientationOptions: ReadonlyArray<SelectProps.Option> = [{ value: 'vertical' }, { value: 'horizontal' }];

// The three step shapes worth exercising: a status step with details, a status step without
// details, and a neutral (no status) event.
const baseEntries: ReadonlyArray<{ status?: StepsProps.Status; header: string }> = [
  { status: 'success', header: 'Created environment' },
  { status: 'error', header: 'Validation failed' },
  { status: undefined, header: 'Plain event (no status)' },
];

export default function StepsPlayground() {
  const [orientation, setOrientation] = useState<SelectProps.Option>(orientationOptions[0]);
  const [ariaLabel, setAriaLabel] = useState('Steps playground');

  const [withTimestamps, setWithTimestamps] = useState(true);
  const [timeAsElement, setTimeAsElement] = useState(true);
  const [withDetails, setWithDetails] = useState(true);
  const [useCustomRender, setUseCustomRender] = useState(false);

  const times = ['09:00 AM', '10:30 AM', '2 hr ago'];

  const getHeaderStart = (timeText: string): React.ReactNode => {
    if (!withTimestamps) {
      return undefined;
    }
    if (timeAsElement) {
      return (
        <time dateTime="2024-05-01T15:01:23Z" title="May 1, 2024, 3:01:23 PM (UTC)">
          {timeText}
        </time>
      );
    }
    return timeText;
  };

  const steps: ReadonlyArray<StepsProps.Step> = baseEntries.map((entry, index) => ({
    status: entry.status,
    statusIconAriaLabel: entry.status ? entry.status : undefined,
    header: entry.header,
    details: withDetails ? (
      <Box fontSize="body-s" color="text-body-secondary">
        Additional information for “{entry.header}”.
      </Box>
    ) : undefined,
    headerStart: getHeaderStart(times[index % times.length]),
  }));

  const renderStep: StepsProps['renderStep'] = useCustomRender
    ? step => ({
        header: <Box fontWeight="bold">Custom: {step.header}</Box>,
        details: step.details ? <Box fontSize="body-s">{step.details}</Box> : undefined,
      })
    : undefined;

  return (
    <ScreenshotArea disableAnimations={true}>
      <Box padding="l">
        <SpaceBetween size="l">
          <Header variant="h1">Steps playground</Header>

          <Container header={<Header variant="h2">Properties</Header>}>
            <SpaceBetween size="m">
              <ColumnLayout columns={2} borders="vertical">
                <FormField label="Orientation">
                  <Select
                    selectedOption={orientation}
                    options={orientationOptions}
                    onChange={({ detail }) => setOrientation(detail.selectedOption)}
                  />
                </FormField>
                <FormField label="ariaLabel">
                  <Input value={ariaLabel} onChange={({ detail }) => setAriaLabel(detail.value)} />
                </FormField>
              </ColumnLayout>

              <ColumnLayout columns={2}>
                <Checkbox checked={withTimestamps} onChange={({ detail }) => setWithTimestamps(detail.checked)}>
                  Show <code>headerStart</code> (timestamps)
                </Checkbox>
                <Checkbox
                  checked={timeAsElement}
                  disabled={!withTimestamps}
                  onChange={({ detail }) => setTimeAsElement(detail.checked)}
                >
                  Timestamp as <code>&lt;time&gt;</code> element
                </Checkbox>
                <Checkbox checked={withDetails} onChange={({ detail }) => setWithDetails(detail.checked)}>
                  Show <code>details</code>
                </Checkbox>
                <Checkbox checked={useCustomRender} onChange={({ detail }) => setUseCustomRender(detail.checked)}>
                  Use <code>renderStep</code>
                </Checkbox>
              </ColumnLayout>
            </SpaceBetween>
          </Container>

          <Container header={<Header variant="h2">Preview</Header>}>
            <Steps
              ariaLabel={ariaLabel || undefined}
              orientation={orientation.value as StepsProps.Orientation}
              steps={steps}
              renderStep={renderStep}
            />
          </Container>
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
