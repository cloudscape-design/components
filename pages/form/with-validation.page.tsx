// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import {
  Alert,
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
  const [showInlineSuccess, setShowInlineSuccess] = useState(false);
  const [submitWithDelay, setSubmitWithDelay] = useState(false);

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

    const submit = () => {
      setLoading(false);

      if (simulateServerError) {
        setShowFormError(true);
      } else {
        setFinished(true);
      }
    };

    if (submitWithDelay) {
      setTimeout(submit, 2000);
    } else {
      submit();
    }
  };

  return (
    <>
      <BreadcrumbGroup
        items={[
          { text: 'Breadcrumbs', href: '#' },
          { text: 'Create a resource', href: '#' },
        ]}
      />
      {finished && !showInlineSuccess ? (
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
              <FormField
                label="Form field"
                errorText={
                  attemptedToSubmit && value.length > 4 ? 'The text must not be longer than 4 letters' : undefined
                }
                warningText={value.includes(' ') ? 'The value has empty characters.' : undefined}
                constraintText="Maximum length: 4 letters"
                i18nStrings={{ errorIconAriaLabel: 'Error', warningIconAriaLabel: 'Warning' }}
              >
                <Input value={value} onChange={e => setValue(e.detail.value)} disabled={loading} />
              </FormField>
            </Container>
            <Container header={<Header variant="h2">Form section 2</Header>}>
              <SpaceBetween direction="vertical" size="l">
                <FormField label="Apply delay">
                  <Checkbox
                    checked={submitWithDelay}
                    onChange={e => setSubmitWithDelay(e.detail.checked)}
                    disabled={loading}
                  >
                    Apply a loading state when submitting the form
                  </Checkbox>
                </FormField>

                <FormField label="Error simulation">
                  <Checkbox
                    checked={simulateServerError}
                    onChange={e => setSimulateServerError(e.detail.checked)}
                    disabled={loading}
                  >
                    Show a server side error when this form is submitted
                  </Checkbox>
                </FormField>

                <FormField label="Success display">
                  <Checkbox
                    checked={showInlineSuccess}
                    onChange={e => setShowInlineSuccess(e.detail.checked)}
                    disabled={loading}
                  >
                    Show success inline instead of on a new page
                  </Checkbox>
                </FormField>
              </SpaceBetween>
            </Container>
            {finished && showInlineSuccess && <Alert type="success">The resource was successfully created.</Alert>}
          </SpaceBetween>
        </Form>
      )}
    </>
  );
}
