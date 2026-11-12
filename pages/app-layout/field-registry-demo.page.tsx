// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';

import {
  Alert,
  AppLayout,
  Button,
  Checkbox,
  Container,
  ExpandableSection,
  Form,
  FormField,
  Header,
  Input,
  RadioGroup,
  Select,
  SpaceBetween,
  Textarea,
  Toggle,
} from '~components';
import { SelectProps } from '~components/select';

import './utils/field-registry-assistant';
import AppContext, { AppContextType } from '../app/app-context';
import { Breadcrumbs } from './utils/content-blocks';
import { drawerLabels } from './utils/drawers';
import appLayoutLabels from './utils/labels';

type DemoContext = React.Context<AppContextType<{ frameForm?: boolean }>>;

const RUNTIMES = [
  { label: 'Node.js 22.x', value: 'nodejs22.x' },
  { label: 'Python 3.13', value: 'python3.13' },
  { label: 'Java 21', value: 'java21' },
];

const REGIONS = [
  { label: 'US East (N. Virginia)', value: 'us-east-1' },
  { label: 'EU (Ireland)', value: 'eu-west-1' },
  { label: 'Asia Pacific (Tokyo)', value: 'ap-northeast-1' },
];

const ARCHITECTURES = [
  { label: 'x86_64', value: 'x86_64' },
  { label: 'arm64', value: 'arm64' },
];

const ROLES = [
  { label: 'lambda-basic-execution', value: 'arn:aws:iam::123456789012:role/lambda-basic-execution' },
  { label: 'lambda-vpc-access', value: 'arn:aws:iam::123456789012:role/lambda-vpc-access' },
];

const LOG_LEVELS = [
  { label: 'INFO', value: 'INFO' },
  { label: 'DEBUG', value: 'DEBUG' },
  { label: 'WARN', value: 'WARN' },
];

const ROLES_LOAD_DELAY = 1000;

const validateName = (value: string) =>
  !value
    ? 'Function name is required'
    : /^[\w-]+$/.test(value)
      ? ''
      : 'Use only letters, numbers, hyphens and underscores';

export default function FieldRegistryDemo() {
  const { urlParams } = useContext(AppContext as DemoContext);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [runtime, setRuntime] = useState<SelectProps.Option | null>(null);
  const [region, setRegion] = useState<SelectProps.Option | null>(REGIONS[0]);
  const [architecture, setArchitecture] = useState('x86_64');
  const [roles, setRoles] = useState<SelectProps.Options | null>(null);
  const [role, setRole] = useState<SelectProps.Option | null>(null);
  const [logging, setLogging] = useState(false);
  const [logLevel, setLogLevel] = useState<SelectProps.Option | null>(LOG_LEVELS[0]);
  const [description, setDescription] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRoles(ROLES), ROLES_LOAD_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const architectureError =
    architecture === 'arm64' && region?.value === 'eu-west-1' ? "arm64 isn't available in EU (Ireland)" : '';

  const create = () => {
    const error = validateName(name);
    setNameError(error);
    setCreated(!error && !architectureError && acknowledged);
  };

  return (
    <AppLayout
      ariaLabels={{ ...appLayoutLabels, ...drawerLabels }}
      breadcrumbs={<Breadcrumbs />}
      navigationHide={true}
      toolsHide={true}
      content={
        <Form
          header={<Header variant="h1">Create function</Header>}
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link">Cancel</Button>
              <Button variant="primary" onClick={create}>
                Create function
              </Button>
            </SpaceBetween>
          }
        >
          <SpaceBetween size="l">
            {created && <Alert type="success">Function {name} created.</Alert>}
            <Container header={<Header variant="h2">Basic information</Header>}>
              <SpaceBetween size="l">
                <FormField label="Function name" errorText={nameError} data-testid="function-name">
                  <Input
                    value={name}
                    onChange={({ detail }) => {
                      setName(detail.value);
                      if (nameError) {
                        setNameError(validateName(detail.value));
                      }
                    }}
                    onBlur={() => setNameError(validateName(name))}
                  />
                </FormField>
                <FormField label="Runtime" data-testid="runtime">
                  <Select
                    selectedOption={runtime}
                    options={RUNTIMES}
                    placeholder="Choose a runtime"
                    onChange={({ detail }) => setRuntime(detail.selectedOption)}
                  />
                </FormField>
                <FormField label="Region" data-testid="region">
                  <Select
                    selectedOption={region}
                    options={REGIONS}
                    onChange={({ detail }) => setRegion(detail.selectedOption)}
                  />
                </FormField>
                <FormField
                  label="Architecture"
                  constraintText="In this demo, arm64 isn't available in EU (Ireland)."
                  errorText={architectureError}
                  data-testid="architecture"
                >
                  <RadioGroup
                    value={architecture}
                    items={ARCHITECTURES}
                    onChange={({ detail }) => setArchitecture(detail.value)}
                  />
                </FormField>
                <FormField label="Account ID" data-testid="account-id">
                  <Input value="123456789012" readOnly={true} onChange={() => {}} />
                </FormField>
              </SpaceBetween>
            </Container>
            <Container header={<Header variant="h2">Permissions and logging</Header>}>
              <SpaceBetween size="l">
                <FormField label="Execution role" data-testid="execution-role">
                  <Select
                    selectedOption={role}
                    options={roles ?? []}
                    statusType={roles ? 'finished' : 'loading'}
                    loadingText="Loading roles"
                    placeholder="Choose a role"
                    onChange={({ detail }) => setRole(detail.selectedOption)}
                  />
                </FormField>
                <Toggle data-testid="logging" checked={logging} onChange={({ detail }) => setLogging(detail.checked)}>
                  Enable logging
                </Toggle>
                {logging && (
                  <FormField label="Log level" data-testid="log-level">
                    <Select
                      selectedOption={logLevel}
                      options={LOG_LEVELS}
                      onChange={({ detail }) => setLogLevel(detail.selectedOption)}
                    />
                  </FormField>
                )}
              </SpaceBetween>
            </Container>
            <ExpandableSection headerText="Advanced settings" variant="container" data-testid="advanced">
              <SpaceBetween size="l">
                <FormField label="Description" data-testid="description">
                  <Textarea value={description} onChange={({ detail }) => setDescription(detail.value)} />
                </FormField>
                <FormField
                  label="Ephemeral storage (MB)"
                  constraintText="Set by your administrator."
                  data-testid="ephemeral-storage"
                >
                  <Input value="512" disabled={true} onChange={() => {}} />
                </FormField>
              </SpaceBetween>
            </ExpandableSection>
            {urlParams.frameForm && (
              <Container
                header={
                  <Header variant="h2" description="Rendered by a separate React and Cloudscape instance in a frame">
                    Network settings
                  </Header>
                }
              >
                <iframe
                  id="field-registry-frame"
                  title="Network settings"
                  src={`#/light/field-registry/frame-form?visualRefresh=${urlParams.visualRefresh}`}
                  style={{ border: 0, inlineSize: '100%', blockSize: 480 }}
                />
              </Container>
            )}
            <Checkbox
              data-testid="acknowledge"
              checked={acknowledged}
              onChange={({ detail }) => setAcknowledged(detail.checked)}
            >
              I acknowledge the terms
            </Checkbox>
          </SpaceBetween>
        </Form>
      }
    />
  );
}
