// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import {
  Alert,
  BreadcrumbGroup,
  Button,
  Container,
  DatePicker,
  ExpandableSection,
  Form,
  FormField,
  Link,
  Select,
  SelectProps,
} from '~components';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import Input from '~components/input';
import SpaceBetween from '~components/space-between';

import { UncontrolledS3ResourceSelector } from './components/s3-resource-selector';
import { TableContainerVariant } from './components/table';

function Content() {
  const history = useHistory();
  const [errorText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  const [containersVisible, setContainersVisible] = useState<boolean[]>([true, true, true, true]);
  const [selectedOption, setSelectedOption] = useState<SelectProps['selectedOption']>({
    label: 'Option 1',
    value: '1',
  });

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      history.push('/');
      // setErrorText("There was an error with your submission");
    }, 2000);
  };

  const handleCancel = () => {
    history.push('/');
  };

  const hideContainer = (index: number) => {
    const updatedContainersVisible = [...containersVisible];
    updatedContainersVisible[index] = false;
    setContainersVisible(updatedContainersVisible);
  };

  return (
    <Form
      analyticsMetadata={{
        instanceIdentifier: 'my-custom-creation',
        flowType: 'create',
      }}
      errorText={errorText}
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <Button disabled={loading} onClick={handleCancel}>
            Cancel
          </Button>
          <Button disabled={loading} loading={loading} onClick={handleSubmit} variant="primary">
            Submit
          </Button>{' '}
        </SpaceBetween>
      }
      header={
        <Header info={<Link variant="info">Info</Link>} variant="h2">
          My Form
        </Header>
      }
    >
      <SpaceBetween size="s">
        {containersVisible[0] && (
          <Container
            analyticsMetadata={{
              instanceIdentifier: 'my-custom-section',
            }}
            header={
              <Header variant="h2" actions={<Button onClick={() => hideContainer(0)}>Hide</Button>}>
                Section 1
              </Header>
            }
          >
            <SpaceBetween size="s">
              <FormField
                info={
                  <Link data-testid="external-link" external={true} href="#">
                    Learn more
                  </Link>
                }
                errorText={value1 === 'field-error' ? 'This is a field error' : undefined}
                label="Field 1"
              >
                <Input
                  value={value1}
                  onChange={event => {
                    setValue1(event.detail.value);
                  }}
                />
              </FormField>
              <FormField
                info={
                  <Link data-testid="external-link" external={true} href="#">
                    Learn more
                  </Link>
                }
                errorText={value2 === 'field2-error' ? 'This is a second field error' : undefined}
                label="Field 2"
              >
                <Input
                  value={value2}
                  onChange={event => {
                    setValue2(event.detail.value);
                  }}
                />
              </FormField>
              <FormField info={<Link variant="info">Info</Link>} label="Field 3">
                <UncontrolledS3ResourceSelector />
              </FormField>
            </SpaceBetween>
          </Container>
        )}
        <FormField
          info={
            <Link data-testid="external-link" external={true} href="#">
              Learn more
            </Link>
          }
          errorText={value1 === 'error' ? 'This is a field error' : undefined}
          label="Field 1.0"
        >
          <Input
            value={value1}
            onChange={event => {
              setValue1(event.detail.value);
            }}
          />
        </FormField>
        <Alert
          statusIconAriaLabel="Info"
          header="Known issues/limitations"
          type={value1 === 'alert-error' ? 'error' : 'info'}
        >
          Review the documentation to learn about potential compatibility issues with specific database versions.{' '}
          <Link external={true}>Learn more</Link>
        </Alert>
        <TableContainerVariant />
        {containersVisible[1] && (
          <Container
            header={
              <Header variant="h2" actions={<Button onClick={() => hideContainer(1)}>Hide</Button>}>
                Section 2
              </Header>
            }
          >
            <SpaceBetween size="s">
              <FormField label="Field 4">
                <DatePicker
                  expandToViewport={true}
                  onChange={({ detail }) => setValue3(detail.value)}
                  value={value3}
                  openCalendarAriaLabel={selectedDate =>
                    'Choose certificate expiry date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
                  }
                  placeholder="YYYY/MM/DD"
                />
              </FormField>
              <FormField label="Field 5">
                <Select
                  expandToViewport={true}
                  selectedOption={selectedOption}
                  onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
                  options={[
                    { label: 'Option 1', value: '1' },
                    { label: 'Option 2', value: '2' },
                    { label: 'Option 3', value: '3' },
                    { label: 'Option 4', value: '4' },
                    { label: 'Option 5', value: '5' },
                  ]}
                />
              </FormField>
            </SpaceBetween>
          </Container>
        )}

        {containersVisible[2] && (
          <Container
            header={
              <Header variant="h2" actions={<Button onClick={() => hideContainer(2)}>Hide</Button>}>
                Section 3
              </Header>
            }
          >
            <SpaceBetween size="s">
              <FormField label="Field 5">
                <Input value="" />
              </FormField>
              <FormField label="Field 6">
                <Input value="" />
              </FormField>
            </SpaceBetween>
          </Container>
        )}
        {containersVisible[3] && (
          <ExpandableSection
            defaultExpanded={true}
            variant="container"
            headerText="Section 4"
            headerActions={<Button onClick={() => hideContainer(3)}>Hide</Button>}
          >
            <SpaceBetween size="s">
              <FormField label="Field 7">
                <Input value="" />
              </FormField>
              <FormField label="Field 8">
                <Input value="" />
              </FormField>
            </SpaceBetween>
          </ExpandableSection>
        )}
      </SpaceBetween>
    </Form>
  );
}

function App() {
  return (
    <AppLayout
      contentType="form"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'System', href: '#' },
            { text: 'Components', href: '#components' },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      content={<Content />}
    />
  );
}

export default App;
