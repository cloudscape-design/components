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
  FileUpload,
  FileUploadProps,
  Form,
  FormField,
  Link,
  Select,
  SelectProps,
} from '~components';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import { InputControl } from './components/controls';
import { withFunnelTestingApi } from './components/funnel-testing-page';
import { FeedbackModal } from './components/modals';
import { UncontrolledS3ResourceSelector } from './components/s3-resource-selector';
import { TableContainerVariant } from './components/table';

function Content() {
  const history = useHistory();
  const [errorText, setErrorText] = useState<string>('');
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dateValue, setDateValue] = useState<string>('');
  const [filesValue, setFilesValue] = useState<FileUploadProps['value']>([]);
  const [containersVisible, setContainersVisible] = useState<boolean[]>([true, true, true, true]);
  const [selectedOption, setSelectedOption] = useState<SelectProps['selectedOption']>({
    label: 'Option 1',
    value: '1',
  });
  const [containerCount, setContainerCount] = useState(0);

  const handleSubmit = (showError?: boolean) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (showError) {
        setErrorText('There was an error with your submission');
        return;
      } else {
        history.push('/');
      }
    }, 0);
  };

  const handleCancel = () => {
    history.push('/');
  };

  const handleFeedbackModalClose = () => {
    setFeedbackModalVisible(false);
  };

  const hideContainer = (index: number) => {
    const updatedContainersVisible = [...containersVisible];
    updatedContainersVisible[index] = false;
    setContainersVisible(updatedContainersVisible);
  };

  const addContainer = () => {
    setContainerCount(containerCount + 1); // Increment the container count
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
          <Button data-testid="open-modal-button" onClick={() => setFeedbackModalVisible(true)}>
            Open Feedback Modal
          </Button>
          <Button data-testid="cancel-button" disabled={loading} onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            data-testid="submit-with-error-button"
            disabled={loading}
            loading={loading}
            onClick={() => handleSubmit(true)}
            variant="primary"
          >
            Submit with error
          </Button>
          <Button
            data-testid="submit-button"
            disabled={loading}
            loading={loading}
            onClick={() => handleSubmit(false)}
            variant="primary"
          >
            Submit
          </Button>
        </SpaceBetween>
      }
      header={
        <Header info={<Link variant="info">Info</Link>} variant="h2">
          Create component
        </Header>
      }
    >
      <FeedbackModal
        visible={feedbackModalVisible}
        onCancel={handleFeedbackModalClose}
        onConfirm={handleFeedbackModalClose}
        onDismiss={handleFeedbackModalClose}
      />
      <SpaceBetween size="s">
        {containersVisible[0] && (
          <Container
            key="section-1"
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
              <InputControl key="field-1" testId="section-1-field-1" label="Field 1" />
              <InputControl key="field-2" testId="section-1-field-2" label="Field 2" />
              <FormField key="field-3" info={<Link variant="info">Info</Link>} label="Field 3">
                <UncontrolledS3ResourceSelector />
              </FormField>
            </SpaceBetween>
          </Container>
        )}
        <InputControl key="step-field-1" testId="step-field-1" label="Step field 1" />
        <InputControl key="step-field-2" testId="step-field-2" label="Step field 2" />
        <Alert key="alert" statusIconAriaLabel="Info" header="Known issues/limitations" type="info">
          Review the documentation to learn about potential compatibility issues with specific database versions.{' '}
          <Link external={true}>Learn more</Link>
        </Alert>
        <TableContainerVariant key="table" />
        {containersVisible[1] && (
          <Container
            key="section-2"
            header={
              <Header variant="h2" actions={<Button onClick={() => hideContainer(1)}>Hide</Button>}>
                Section 2
              </Header>
            }
          >
            <SpaceBetween size="s">
              <InputControl testId="section-2-field-1" label="Field 1" />
              <FormField data-testid="section-2-field-2" label="Field 2">
                <DatePicker
                  expandToViewport={true}
                  onChange={({ detail }) => setDateValue(detail.value)}
                  value={dateValue}
                  openCalendarAriaLabel={selectedDate =>
                    'Choose certificate expiry date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
                  }
                  placeholder="YYYY/MM/DD"
                />
              </FormField>
              <FormField data-testid="section-2-field-3" label="Field 3">
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
            key="section-3"
            header={
              <Header variant="h2" actions={<Button onClick={() => hideContainer(2)}>Hide</Button>}>
                Section 3
              </Header>
            }
          >
            <SpaceBetween size="s">
              <FormField data-testid="section-3-field-1" label="Field 1" description="Description">
                <FileUpload
                  onChange={({ detail }) => setFilesValue(detail.value)}
                  value={filesValue}
                  i18nStrings={{
                    uploadButtonText: e => (e ? 'Choose files' : 'Choose file'),
                    dropzoneText: e => (e ? 'Drop files to upload' : 'Drop file to upload'),
                    removeFileAriaLabel: e => `Remove file ${e + 1}`,
                    limitShowFewer: 'Show fewer files',
                    limitShowMore: 'Show more files',
                    errorIconAriaLabel: 'Error',
                  }}
                  showFileLastModified={true}
                  showFileSize={true}
                  showFileThumbnail={true}
                  tokenLimit={3}
                  constraintText="Hint text for file requirements"
                />
              </FormField>
              <InputControl testId="section-3-field-2" label="Field 2" />
              <InputControl testId="section-3-field-3" label="Field 3" />
            </SpaceBetween>
          </Container>
        )}
        {containersVisible[3] && (
          <ExpandableSection
            key="section-4"
            defaultExpanded={true}
            variant="container"
            headerText="Section 4"
            headerActions={<Button onClick={() => hideContainer(3)}>Hide</Button>}
          >
            <SpaceBetween size="s">
              <InputControl testId="section-4-field-1" label="Field 1" />
              <InputControl testId="section-4-field-2" label="Field 2" />
            </SpaceBetween>
          </ExpandableSection>
        )}

        {[...Array(containerCount)].map((_, index) => (
          <Container
            key={`dynamic-section-${index}`}
            header={<Header variant="h2">{`Dynamic section ${index + 1}`}</Header>}
          >
            <InputControl testId={`dynamic-section-${index}-field-1`} label="Field 1" />
          </Container>
        ))}
        <Button key="add-container" onClick={addContainer}>
          Add Dynamic Container
        </Button>
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
            { text: 'Create component', href: '#create' },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      content={<Content />}
    />
  );
}

export default withFunnelTestingApi(App);
