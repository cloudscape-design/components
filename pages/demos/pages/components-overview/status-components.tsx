// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Alert from '@cloudscape-design/components/alert';
import Badge from '@cloudscape-design/components/badge';
import Button from '@cloudscape-design/components/button';
import ButtonGroup from '@cloudscape-design/components/button-group';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import FileTokenGroup from '@cloudscape-design/components/file-token-group';
import Flashbar, { FlashbarProps } from '@cloudscape-design/components/flashbar';
import FormField from '@cloudscape-design/components/form-field';
import Grid from '@cloudscape-design/components/grid';
import Input from '@cloudscape-design/components/input';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import Select from '@cloudscape-design/components/select';
import Slider from '@cloudscape-design/components/slider';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Spinner from '@cloudscape-design/components/spinner';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Steps from '@cloudscape-design/components/steps';

import { flashbarItems } from './component-data';
import { Section, SubSection } from './utils';

export default function StatusComponents() {
  return (
    <Section header="Status components" level="h2">
      <>
        <SubSection header="Errors">
          <ColumnLayout columns={3}>
            <Flashbar items={[flashbarItems.find(item => item.type === 'error') as FlashbarProps.MessageDefinition]} />
            <Alert
              type="error"
              dismissible={true}
              i18nStrings={{ dismissAriaLabel: '"Dismiss error alert"' }}
              header="Error"
            >
              This is an error alert -- check it out!
            </Alert>
            <Slider value={50} invalid={true} max={100} min={0} ariaLabel="Invalid slider" />
            <Input value="Invalid input" invalid={true} ariaLabel="Invalid input" />

            <FormField
              constraintText="Requirements and constraints for the field."
              description="This is a description."
              errorText="This is an error message."
              label="Form field label"
            >
              <Input value="Hello" />
            </FormField>

            <Grid
              gridDefinition={[
                { colspan: { default: 6, xxs: 4 } },
                { colspan: { default: 6, xxs: 4 } },
                { colspan: { default: 6, xxs: 4 } },
              ]}
            >
              <Steps
                steps={[
                  {
                    status: 'error',
                    header: 'Error step',
                    statusIconAriaLabel: 'Error',
                  },
                  {
                    status: 'error',
                    header: 'Error step',
                    statusIconAriaLabel: 'Error',
                  },
                  {
                    status: 'error',
                    header: 'Error step',
                    statusIconAriaLabel: 'Error',
                  },
                ]}
              />
              <SpaceBetween size="xs">
                <StatusIndicator type="error">Error Status</StatusIndicator>
                <Badge color="red">Badge</Badge>
              </SpaceBetween>
            </Grid>
          </ColumnLayout>
        </SubSection>

        <SubSection header="Warnings">
          <ColumnLayout columns={3}>
            <Flashbar
              items={[flashbarItems.find(item => item.type === 'warning') as FlashbarProps.MessageDefinition]}
            />
            <Alert
              type="warning"
              dismissible={true}
              i18nStrings={{ dismissAriaLabel: '"Dismiss warning alert"' }}
              header="Warning"
            >
              This is a warning alert -- check it out!
            </Alert>
            <Slider value={50} warning={true} max={100} min={0} ariaLabel="Warning slider" />
            <Input value="Warning input" warning={true} ariaLabel="Warning input" />
            <FormField
              constraintText="Requirements and constraints for the field."
              description="This is a description."
              warningText="This is a warning message."
              label="Form field label"
            >
              <Input value="Hello" />
            </FormField>

            <Grid
              gridDefinition={[
                { colspan: { default: 6, xxs: 4 } },
                { colspan: { default: 6, xxs: 4 } },
                { colspan: { default: 6, xxs: 4 } },
              ]}
            >
              <Steps
                steps={[
                  {
                    status: 'warning',
                    header: 'Warning step',
                    statusIconAriaLabel: 'Warning',
                  },
                  {
                    status: 'warning',
                    header: 'Warning step',
                    statusIconAriaLabel: 'Warning',
                  },
                  {
                    status: 'warning',
                    header: 'Warning step',
                    statusIconAriaLabel: 'Warning',
                  },
                ]}
              />
              <StatusIndicator type="warning">Warning Status</StatusIndicator>
            </Grid>
          </ColumnLayout>
        </SubSection>

        <SubSection header="Success">
          <ColumnLayout columns={3}>
            <Flashbar
              items={[flashbarItems.find(item => item.type === 'success') as FlashbarProps.MessageDefinition]}
            />
            <Alert
              type="success"
              dismissible={true}
              i18nStrings={{ dismissAriaLabel: '"Dismiss success alert"' }}
              header="Success"
            >
              This is a success alert -- check it out!
            </Alert>

            <Grid
              gridDefinition={[
                { colspan: { default: 6, xxs: 4 } },
                { colspan: { default: 6, xxs: 4 } },
                { colspan: { default: 6, xxs: 4 } },
              ]}
            >
              <Steps
                steps={[
                  {
                    status: 'success',
                    header: 'Success step',
                    statusIconAriaLabel: 'Success',
                  },
                  {
                    status: 'success',
                    header: 'Success step',
                    statusIconAriaLabel: 'Success',
                  },
                  {
                    status: 'success',
                    header: 'Success step',
                    statusIconAriaLabel: 'Success',
                  },
                ]}
              />
              <SpaceBetween size="xs">
                <StatusIndicator type="success">Success Status</StatusIndicator>
                <Badge color="green">Badge</Badge>
              </SpaceBetween>
            </Grid>
          </ColumnLayout>
        </SubSection>

        <SubSection header="Info">
          <ColumnLayout columns={3}>
            <Flashbar items={[flashbarItems.find(item => item.type === 'info') as FlashbarProps.MessageDefinition]} />
            <Alert
              type="info"
              dismissible={true}
              i18nStrings={{ dismissAriaLabel: '"Dismiss info alert"' }}
              header="Info"
            >
              This is an info alert -- check it out!
            </Alert>

            <Grid
              gridDefinition={[
                { colspan: { default: 6, xxs: 4 } },
                { colspan: { default: 6, xxs: 4 } },
                { colspan: { default: 6, xxs: 4 } },
              ]}
            >
              <Steps
                steps={[
                  {
                    status: 'info',
                    header: 'Info step',
                    statusIconAriaLabel: 'Info',
                  },
                  {
                    status: 'info',
                    header: 'Info step',
                    statusIconAriaLabel: 'Info',
                  },
                  {
                    status: 'info',
                    header: 'Info step',
                    statusIconAriaLabel: 'Info',
                  },
                ]}
              />
              <SpaceBetween size="xs">
                <StatusIndicator type="info">Info Status</StatusIndicator>
                <SpaceBetween size="xxs">
                  <Badge color="blue">Badge</Badge>
                </SpaceBetween>
              </SpaceBetween>
            </Grid>
          </ColumnLayout>
        </SubSection>

        <SubSection header="Loading & in-progress">
          <ColumnLayout columns={3}>
            <Flashbar
              items={[
                {
                  type: 'in-progress',
                  header: 'In-progress',
                  content: (
                    <>
                      This is an in-progress flash -- check it out!
                      <ProgressBar value={37} variant="flash" ariaLabel="Progress bar in flash" />
                    </>
                  ),
                  dismissible: true,
                  dismissLabel: 'Dismiss in-progress message',
                  id: 'in-progress',
                },
                {
                  header: 'Loading',
                  type: 'in-progress',
                  loading: true,
                  content: 'This is a loading flash -- check it out!',
                  dismissible: true,
                  dismissLabel: 'Dismiss loading message',
                  id: 'loading',
                },
              ]}
            />
            <SpaceBetween size="s">
              <FileTokenGroup
                items={[
                  {
                    file: new File([new Blob(['Test content'])], 'file-1.pdf', {
                      type: 'application/pdf',
                      lastModified: 1590962400000,
                    }),
                    loading: true,
                  },
                ]}
                onDismiss={() => {
                  /* no-op for demo*/
                }}
              />
              <Select
                selectedOption={{ value: '1', label: `Loading state in dropdown` }}
                loadingText="Loading"
                statusType="loading"
                ariaLabel="Select"
              />
              <ProgressBar value={60} label="Progress" ariaLabel="Progress bar" />
              <SpaceBetween direction="horizontal" size="s">
                <Button variant="primary" loading={true}>
                  Loading
                </Button>
                <Button loading={true}>Loading</Button>
                <Button loading={true} iconName="refresh" ariaLabel="Loading button" />
                <Button variant="link" loading={true}>
                  Loading
                </Button>
              </SpaceBetween>
              <SpaceBetween direction="horizontal" size="s">
                <Spinner size="normal" />
                <Spinner size="big" />
                <Button variant="icon" loading={true} ariaLabel="Loading icon button" />
                <ButtonGroup
                  ariaLabel="Loading button group"
                  items={[
                    {
                      type: 'icon-button',
                      id: 'copy',
                      iconName: 'upload',
                      text: 'Upload files',
                      loading: true,
                      loadingText: 'Loading',
                    },
                  ]}
                  variant="icon"
                />
              </SpaceBetween>
            </SpaceBetween>

            <Grid
              gridDefinition={[
                { colspan: { default: 6, xs: 4 } },
                { colspan: { default: 6, xs: 4 } },
                { colspan: { default: 6, xs: 4 } },
              ]}
            >
              <Steps
                steps={[
                  {
                    status: 'in-progress',
                    header: 'In-progress step',
                    statusIconAriaLabel: 'In-progress',
                  },
                  {
                    status: 'loading',
                    header: 'Loading step',
                    statusIconAriaLabel: 'Loading',
                  },
                  {
                    status: 'stopped',
                    header: 'Stopped step',
                    statusIconAriaLabel: 'Stopped',
                  },
                  {
                    status: 'pending',
                    header: 'Pending step',
                    statusIconAriaLabel: 'Pending',
                  },
                ]}
              />
              <SpaceBetween size="xs">
                <StatusIndicator type="in-progress">In-progress Status</StatusIndicator>
                <StatusIndicator type="loading">Loading</StatusIndicator>
                <StatusIndicator type="stopped">Stopped Status</StatusIndicator>
                <StatusIndicator type="pending">Pending Status</StatusIndicator>
                <Badge color="grey">Badge</Badge>
              </SpaceBetween>
            </Grid>
          </ColumnLayout>
        </SubSection>
      </>
    </Section>
  );
}
