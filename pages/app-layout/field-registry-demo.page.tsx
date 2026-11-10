// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import {
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

const ARCHITECTURES = [
  { label: 'x86_64', value: 'x86_64' },
  { label: 'arm64', value: 'arm64' },
];

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
  const [architecture, setArchitecture] = useState('x86_64');
  const [logging, setLogging] = useState(false);
  const [description, setDescription] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <AppLayout
      ariaLabels={{ ...appLayoutLabels, ...drawerLabels }}
      breadcrumbs={<Breadcrumbs />}
      navigationHide={true}
      toolsHide={true}
      content={
        <Form
          header={<Header variant="h1">Create function</Header>}
          actions={<Button variant="primary">Create</Button>}
        >
          <SpaceBetween size="l">
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
                    onChange={({ detail }) => setRuntime(detail.selectedOption)}
                  />
                </FormField>
                <FormField label="Architecture" data-testid="architecture">
                  <RadioGroup
                    value={architecture}
                    items={ARCHITECTURES}
                    onChange={({ detail }) => setArchitecture(detail.value)}
                  />
                </FormField>
                <Toggle data-testid="logging" checked={logging} onChange={({ detail }) => setLogging(detail.checked)}>
                  Enable logging
                </Toggle>
              </SpaceBetween>
            </Container>
            <ExpandableSection headerText="Advanced settings" variant="container" data-testid="advanced">
              <FormField label="Description" data-testid="description">
                <Textarea value={description} onChange={({ detail }) => setDescription(detail.value)} />
              </FormField>
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
                  style={{ border: 0, inlineSize: '100%', blockSize: 420 }}
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
