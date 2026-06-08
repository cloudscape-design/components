// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import FormField from '@cloudscape-design/components/form-field';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import RadioGroup from '@cloudscape-design/components/radio-group';
import Select from '@cloudscape-design/components/select';
import Slider from '@cloudscape-design/components/slider';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { InfoLink } from '../../commons/common-components';
import { DetailsState, ToolsContent, WizardState } from '../interfaces';
import { AVAILABILITY_ZONES, CLASS_OPTIONS, STORAGE_TYPES, TIME_ZONES, TOOLS_CONTENT } from '../steps-config';

const { details: detailsToolsContent } = TOOLS_CONTENT;

interface InstanceOptionsProps extends DetailsState {
  setHelpPanelContent: (tools: ToolsContent) => void;
  onChange: (state: Partial<DetailsState>) => void;
}

const InstanceOptions = ({
  timeZone,
  availabilityZone,
  port,
  iamAuth,
  instanceClass,
  storageType,
  storage,
  onChange,
  setHelpPanelContent,
}: InstanceOptionsProps) => {
  const validateStorageValue = (value: number, range: [number, number]) => {
    if (value === undefined) {
      return '';
    }
    if (value < range[0] || value > range[1]) {
      return 'Enter a valid storage amount.';
    }

    return '';
  };

  return (
    <Container
      header={<Header variant="h2">Instance options</Header>}
      footer={
        <ExpandableSection headerText="Additional options" variant="footer">
          <SpaceBetween size="l">
            <FormField
              label={
                <>
                  Time zone <i>- optional</i>
                </>
              }
            >
              <Select
                options={TIME_ZONES}
                onChange={event => onChange({ timeZone: event.detail.selectedOption })}
                selectedAriaLabel="Selected"
                selectedOption={timeZone}
              />
            </FormField>
            <FormField label="Availability zone">
              <Select
                options={AVAILABILITY_ZONES}
                onChange={event => onChange({ availabilityZone: event.detail.selectedOption })}
                selectedAriaLabel="Selected"
                selectedOption={availabilityZone}
              />
            </FormField>
            <FormField
              label="Database port"
              description="TCP/IP port the DB instance will use for application connections."
            >
              <Input type="number" value={port} onChange={event => onChange({ port: event.detail.value })} />
            </FormField>
            <FormField
              label="IAM DB authentication"
              info={<InfoLink onFollow={() => setHelpPanelContent(detailsToolsContent.iamAuth)} />}
              stretch={true}
            >
              <RadioGroup
                items={[
                  {
                    value: 'on',
                    label: 'Turn on IAM DB authentication',
                    description: 'Manage your database user credentials through AWS IAM users and roles.',
                  },
                  {
                    value: 'off',
                    label: 'Turn off IAM DB authentication',
                  },
                ]}
                value={iamAuth}
                onChange={event => onChange({ iamAuth: event.detail.value })}
              />
            </FormField>
          </SpaceBetween>
        </ExpandableSection>
      }
    >
      <SpaceBetween size="l">
        <FormField
          label="Class"
          info={<InfoLink onFollow={() => setHelpPanelContent(detailsToolsContent.instanceClass)} />}
          description="Instance class allocates the computational, network, and memory capacity required by planned workload of this DB instance."
        >
          <Select
            options={CLASS_OPTIONS}
            onChange={event => onChange({ instanceClass: event.detail.selectedOption })}
            selectedAriaLabel="Selected"
            selectedOption={instanceClass}
          />
        </FormField>

        <FormField
          label="Storage type"
          info={<InfoLink onFollow={() => setHelpPanelContent(detailsToolsContent.storageType)} />}
          stretch={true}
        >
          <RadioGroup
            onChange={event => onChange({ storageType: event.detail.value })}
            items={STORAGE_TYPES}
            value={storageType}
          />
        </FormField>
        <FormField
          label="Allocated storage"
          description="Higher allocated storage may improve IOPS performance."
          errorText={validateStorageValue(Number(storage), [20, 128])}
        >
          <div className="flex-wrapper">
            <div className="slider-wrapper">
              <Slider
                ariaLabel="Allocated storage slider"
                value={Number(storage)}
                onChange={event => onChange({ storage: String(event.detail.value) })}
                min={20}
                max={128}
              />
            </div>
            <SpaceBetween size="m" alignItems="center" direction="horizontal">
              <div className="input-wrapper">
                <Input
                  type="number"
                  autoComplete={true}
                  controlId="storage"
                  value={storage}
                  onChange={event => onChange({ storage: String(event.detail.value) })}
                />
              </div>
              <div>GiB</div>
            </SpaceBetween>
          </div>
        </FormField>
        <Alert type="info" statusIconAriaLabel="Info">
          Provisioning less than 100 GiB of General Purpose (SSD) storage for high throughput workloads could result in
          higher latencies upon exhaustion of the initial General Purpose (SSD) IO credit balance.
        </Alert>
      </SpaceBetween>
    </Container>
  );
};

interface NameAndPassword extends DetailsState {
  setHelpPanelContent: (tools: ToolsContent) => void;
  onChange: (state: Partial<DetailsState>) => void;
}

const NameAndPassword = ({
  identifier,
  username,
  password,
  confirmPassword,
  onChange,
  setHelpPanelContent,
}: NameAndPassword) => {
  return (
    <Container header={<Header variant="h2">Names and password</Header>}>
      <SpaceBetween size="l">
        <FormField
          label="DB instance identifier"
          info={<InfoLink onFollow={() => setHelpPanelContent(detailsToolsContent.identifier)} />}
          description="A name that is unique for all DB instances owned by your AWS account in the current Region."
          constraintText="Case insensitive, but stored as all lower-case. Must contain from 1 to 63 alphanumeric characters or hyphens  (1 to 15 for SQL Server). First character must be a letter. Cannot end with a hyphen or contain two consecutive hyphens."
        >
          <Input
            placeholder="example-instance-identifier"
            value={identifier}
            onChange={event => onChange({ identifier: event.detail.value })}
          />
        </FormField>
        <FormField
          label="Primary user name"
          info={<InfoLink onFollow={() => setHelpPanelContent(detailsToolsContent.username)} />}
          description="A string that defines the login ID for the primary user."
          constraintText="Must start with a letter. Must contain 1 to 64 alphanumeric characters."
        >
          <Input
            placeholder="example-username"
            value={username}
            onChange={event => onChange({ username: event.detail.value })}
          />
        </FormField>
        <ColumnLayout columns={2}>
          <FormField
            label="Primary password"
            info={<InfoLink onFollow={() => setHelpPanelContent(detailsToolsContent.password)} />}
            constraintText="Must be at least eight characters long. Can be any printable ASCII character except “/”, ““”, or “@”."
          >
            <Input type="password" value={password} onChange={event => onChange({ password: event.detail.value })} />
          </FormField>
          <FormField label="Confirm password">
            <Input
              type="password"
              value={confirmPassword}
              onChange={event => onChange({ confirmPassword: event.detail.value })}
            />
          </FormField>
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
};

interface DetailsProps {
  info: WizardState;
  onChange: (state: Partial<DetailsState>) => void;
  setHelpPanelContent: (tools: ToolsContent) => void;
}

const Details = ({ info: { details }, setHelpPanelContent, onChange }: DetailsProps) => {
  const childProps = { ...details, setHelpPanelContent, onChange };
  return (
    <Box margin={{ bottom: 'l' }}>
      <SpaceBetween size="l">
        <InstanceOptions {...childProps} />
        <NameAndPassword {...childProps} />
      </SpaceBetween>
    </Box>
  );
};
export default Details;
