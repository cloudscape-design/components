// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import {
  AppLayout,
  BreadcrumbGroup,
  Button,
  Checkbox,
  Container,
  Form,
  FormField,
  Header,
  Input,
  SpaceBetween,
} from '~components';

export default function FormScenario() {
  const [value, setValue] = useState('');
  const [simulateServerError, setSimulateServerError] = useState(true);

  const [attemptedToSubmit, setAttemptedToSubmit] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showFormError, setShowFormError] = useState(false);

  const [finished, setFinished] = useState(false);

  const onSubmit = () => {
    setAttemptedToSubmit(true);
    setShowFormError(false);

    if (value.length > 4) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (simulateServerError) {
        setShowFormError(true);
      } else {
        setFinished(true);
      }
    }, 2000);
  };

  return (
    <AppLayout
      toolsHide={true}
      navigationHide={true}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Breadcrumbs', href: '#' },
            { text: 'Create a resource', href: '#' },
          ]}
        />
      }
      contentType="form"
      content={
        finished ? (
          <Container>Finished</Container>
        ) : (
          <Form
            header={<Header variant="h1">Form</Header>}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button variant="link" disabled={loading}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={onSubmit} loading={loading} loadingText="Loading">
                  Submit
                </Button>
              </SpaceBetween>
            }
            errorText={showFormError ? 'A server-side error happened.' : undefined}
            errorIconAriaLabel="Error"
          >
            <SpaceBetween direction="vertical" size="l">
              <Container header={<Header variant="h2">Form section 1</Header>}>
                <SpaceBetween direction="vertical" size="l">
                  <FormField
                    label="Form field"
                    errorText={
                      attemptedToSubmit && value.length > 4 ? 'The text must not be longer than 4 letters' : undefined
                    }
                    constraintText="Maximum length: 4 letters"
                  >
                    <Input value={value} onChange={e => setValue(e.detail.value)} disabled={loading} />
                  </FormField>
                </SpaceBetween>
              </Container>
              <Container header={<Header variant="h2">Form section 2</Header>}>
                <FormField label="Error simulation">
                  <Checkbox
                    checked={simulateServerError}
                    onChange={e => setSimulateServerError(e.detail.checked)}
                    disabled={loading}
                  >
                    Show a server side error when this form is submitted
                  </Checkbox>
                </FormField>
              </Container>
            </SpaceBetween>
          </Form>
        )
      }
    />
  );
}
