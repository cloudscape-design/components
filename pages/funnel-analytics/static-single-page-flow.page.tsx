// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import {
  Box,
  BreadcrumbGroup,
  Button,
  Container,
  Form,
  FormField,
  Header,
  Input,
  Link,
  Modal,
  NonCancelableCustomEvent,
  S3ResourceSelector,
  S3ResourceSelectorProps,
  SpaceBetween,
} from '~components';

import { fetchBuckets, fetchObjects, fetchVersions } from '../s3-resource-selector/data/request';
import { i18nStrings } from '../s3-resource-selector/data/i18n-strings';
import { SelfDismissibleAlert, uriToConsoleUrl } from '../s3-resource-selector/shared';

import { setFunnelMetrics } from '~components/internal/analytics';
import { MockedFunnelMetrics } from './mock-funnel';
import { getAnalyticsProps } from './metadata';

setFunnelMetrics(MockedFunnelMetrics);

export default function StaticSinglePageCreatePage() {
  const [mounted, setUnmounted] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState('');
  const [errorText, setErrorText] = useState('');
  const [validationError, setValidationError] = useState<string | undefined>();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [resource, setResource] = useState<S3ResourceSelectorProps.Resource>({ uri: '' });

  function wrapWithErrorHandler<T extends (...args: any[]) => Promise<unknown>>(callback: T): T {
    return ((...args) => {
      setFetchError(null);
      return callback(...args).catch(error => {
        setFetchError(error.message);
        throw error;
      });
    }) as T;
  }

  const s3ResourceSelectorProps: S3ResourceSelectorProps = {
    resource,
    viewHref: resource?.uri !== '' && !validationError ? uriToConsoleUrl(resource.uri) : '',
    alert: fetchError && (
      <SelfDismissibleAlert type="error" header="Data fetching error">
        {fetchError}
      </SelfDismissibleAlert>
    ),
    invalid: !!validationError,
    selectableItemsTypes: ['objects', 'versions'],
    bucketsVisibleColumns: ['CreationDate', 'Region', 'Name'],
    objectsIsItemDisabled: object => !!object.IsFolder,
    i18nStrings,
    fetchBuckets: wrapWithErrorHandler(fetchBuckets),
    fetchObjects: wrapWithErrorHandler(fetchObjects),
    fetchVersions: wrapWithErrorHandler(fetchVersions),
    onChange: ({ detail }: NonCancelableCustomEvent<S3ResourceSelectorProps.ChangeDetail>) => {
      setResource(detail.resource);
      setValidationError(detail.errorText);
    },
  };

  return (
    <Box>
      <BreadcrumbGroup
        items={[
          { text: 'System', href: '#' },
          { text: 'Components', href: '#components' },
          {
            text: 'Create Resource',
            href: '#components/breadcrumb-group',
          },
        ]}
        ariaLabel="Breadcrumbs"
      />
      {mounted && (
        <Form
          {...getAnalyticsProps({
            instanceIdentifier: 'single-page-demo',
            flowType: 'create',
            ...(errorText ? { errorContext: 'errors.validation' } : {}),
          })}
          errorText={errorText}
          actions={
            <SpaceBetween size="xs" direction="horizontal">
              <Button data-testid="unmount" onClick={() => setUnmounted(false)}>
                Unmount component
              </Button>
              <Button data-testid="embedded-form-modal" onClick={() => setModalVisible(true)}>
                Open Modal
              </Button>
              {modalVisible && (
                <Modal header="Modal title" visible={modalVisible}>
                  <Form>I am a form</Form>
                </Modal>
              )}
              <Button data-testid="cancel" onClick={() => setUnmounted(false)}>
                Cancel
              </Button>
              <Button
                data-testid="submit"
                variant="primary"
                onClick={() => {
                  if (value === 'error') {
                    setErrorText('There is an error');
                  } else {
                    setErrorText('');
                    setUnmounted(false);
                  }
                }}
              >
                Submit
              </Button>
            </SpaceBetween>
          }
          header={
            <Header variant="h1" info={<Link>Info</Link>} description="Form header description">
              Form Header
            </Header>
          }
        >
          <SpaceBetween size="m">
            <Container
              header={
                <Header variant="h2" description="Container 1 - description">
                  Container 1 - header
                </Header>
              }
              {...getAnalyticsProps({
                instanceIdentifier: 'container-1',
                errorContext: value === 'error' ? 'errors.fields' : undefined,
              })}
            >
              <SpaceBetween size="s">
                <FormField
                  info={
                    <Link data-testid="external-link" external={true} href="#">
                      Learn more
                    </Link>
                  }
                  errorText={value === 'error' ? 'Trigger error' : ''}
                  label="This is an ordinary text field"
                  {...getAnalyticsProps({
                    instanceIdentifier: 'field1',
                    errorContext: value === 'error' ? 'errors.triggered' : undefined,
                  })}
                >
                  <Input
                    data-testid="field1"
                    value={value}
                    onChange={event => {
                      setValue(event.detail.value);
                    }}
                  />
                </FormField>
              </SpaceBetween>
            </Container>
            <Container
              header={
                <Header variant="h2" description="Container 2 - description">
                  Container 2 - header
                </Header>
              }
              {...getAnalyticsProps({
                instanceIdentifier: 'container-2',
              })}
            >
              <FormField
                info={
                  <Link data-testid="info-link" variant="info">
                    Info
                  </Link>
                }
                label="Read audio files from S3"
                description="Choose an audio file in Amazon S3. Amazon S3 is object storage built to store and retrieve data."
                constraintText="Format: s3://bucket/prefix/object. For objects in a bucket with versioning enabled, you can choose the most recent or a previous version of the object."
                errorText={validationError}
                stretch={true}
              >
                <S3ResourceSelector {...s3ResourceSelectorProps} />
              </FormField>
            </Container>
          </SpaceBetween>
        </Form>
      )}
    </Box>
  );
}
