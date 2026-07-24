// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Container from '~components/container';
import Header from '~components/header';
import Icon from '~components/icon';
import SpaceBetween from '~components/space-between';
import Steps, { StepsProps } from '~components/steps';

import { SimplePage } from '../app/templates';

const timelineSteps: ReadonlyArray<StepsProps.Step> = [
  {
    annotation: <time dateTime="2026-07-24T09:00:00Z">Jul 24, 9:00 AM</time>,
    status: 'log',
    header: 'Deployment requested',
    details: 'A new deployment was requested from the pull request.',
  },
  {
    annotation: <time dateTime="2026-07-24T09:02:13Z">9:02 AM</time>,
    status: 'success',
    statusIconAriaLabel: 'Success',
    header: 'Build completed',
    details: 'The application and its assets were built successfully.',
  },
  {
    annotation: <time dateTime="2026-07-24T09:03:42Z">9:03 AM</time>,
    status: 'log',
    header: 'Deployment started',
  },
  {
    annotation: <time dateTime="2026-07-24T09:05:08Z">9:05 AM</time>,
    status: 'in-progress',
    statusIconAriaLabel: 'In progress',
    header: 'Validating deployment',
    details: 'Health checks are running in the target environment.',
  },
];

const varyingAnnotationsSteps: ReadonlyArray<StepsProps.Step> = [
  {
    annotation: <time dateTime="2026-07-24T09:00:00Z">9:00 AM</time>,
    status: 'log',
    header: 'Short annotation',
  },
  {
    annotation: <time dateTime="2026-12-31T23:59:59Z">December 31, 2026, 11:59:59 PM UTC</time>,
    status: 'success',
    statusIconAriaLabel: 'Success',
    header: 'Long annotation',
    details: 'This step checks alignment when annotations have different lengths.',
  },
  {
    status: 'loading',
    statusIconAriaLabel: 'Loading',
    header: 'No annotation',
    details: 'This step checks alignment when an annotation is omitted.',
  },
];

const progressSteps: ReadonlyArray<StepsProps.Step> = [
  {
    status: 'success',
    statusIconAriaLabel: 'Success',
    header: 'Create change set',
  },
  {
    status: 'loading',
    statusIconAriaLabel: 'Loading',
    header: 'Apply changes',
    details: 'This configuration verifies that existing progress steps are unchanged.',
  },
  {
    status: 'not-started',
    statusIconAriaLabel: 'Not started',
    header: 'Validate resources',
  },
];

interface Configuration {
  title: string;
  description: string;
  props: StepsProps;
}

const configurations: ReadonlyArray<Configuration> = [
  {
    title: 'Vertical timeline',
    description: 'Annotations, details, and mixed statuses in the default vertical orientation.',
    props: {
      ariaLabel: 'Vertical deployment timeline',
      steps: timelineSteps,
    },
  },
  {
    title: 'Horizontal timeline',
    description: 'The same timeline in the horizontal orientation.',
    props: {
      ariaLabel: 'Horizontal deployment timeline',
      orientation: 'horizontal',
      steps: timelineSteps,
    },
  },
  {
    title: 'Vertical timeline with varying annotations',
    description: 'Short, long, and missing annotations in the vertical orientation.',
    props: {
      ariaLabel: 'Vertical timeline with varying annotations',
      steps: varyingAnnotationsSteps,
    },
  },
  {
    title: 'Horizontal timeline with varying annotations',
    description: 'Short, long, and missing annotations in the horizontal orientation.',
    props: {
      ariaLabel: 'Horizontal timeline with varying annotations',
      orientation: 'horizontal',
      steps: varyingAnnotationsSteps,
    },
  },
  {
    title: 'Timeline without connector lines',
    description: 'A vertical timeline with connector lines hidden.',
    props: {
      ariaLabel: 'Deployment timeline without connector lines',
      connectorLines: 'none',
      steps: timelineSteps,
    },
  },
  {
    title: 'Timeline with custom step rendering',
    description: 'Annotations combined with custom headers, details, and icons.',
    props: {
      ariaLabel: 'Custom deployment timeline',
      steps: timelineSteps,
      renderStep: step => ({
        header: <strong>{step.header}</strong>,
        details: step.details && <Box color="text-body-secondary">{step.details}</Box>,
        icon: <Icon ariaLabel="Timeline event" name="status-info" variant="link" />,
      }),
    },
  },
  {
    title: 'Progress steps without annotations',
    description: 'A regression configuration for existing progress-step usage.',
    props: {
      ariaLabel: 'Deployment progress',
      steps: progressSteps,
    },
  },
];

export default function StepsPlayground() {
  return (
    <SimplePage
      title="Steps playground"
      subtitle="Use these configurations to test annotations, timeline layouts, and existing progress-step behavior."
    >
      <SpaceBetween size="l">
        {configurations.map(configuration => (
          <Container
            key={configuration.title}
            header={
              <Header variant="h2" description={configuration.description}>
                {configuration.title}
              </Header>
            }
          >
            <Steps {...configuration.props} />
          </Container>
        ))}
      </SpaceBetween>
    </SimplePage>
  );
}
