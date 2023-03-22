// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Header from '~components/header';
import Form from '~components/form';
import Link from '~components/link';
import Button from '~components/button';
import FormField from '~components/form-field';
import Input from '~components/input';
import SpaceBetween from '~components/space-between';
import Container from '~components/container';
import AppLayout from '~components/app-layout';
import ContentLayout from '~components/content-layout';
import {
  Alert,
  AlertProps,
  BreadcrumbGroup,
  NonCancelableCustomEvent,
  S3ResourceSelector,
  S3ResourceSelectorProps,
  Select,
  SelectProps,
  Tiles,
} from '~components';

import { fetchBuckets, fetchObjects, fetchVersions } from '../s3-resource-selector/data/request';
import { i18nStrings } from '../s3-resource-selector/data/i18n-strings';

function SelfDismissibleAlert(props: Omit<AlertProps, 'visible' | 'onDismiss'>) {
  const [visible, setVisible] = React.useState(true);
  return <Alert {...props} visible={visible} dismissible={true} onDismiss={() => setVisible(false)} />;
}

function uriToConsoleUrl(uri: string) {
  const prefix = 'https://s3.console.aws.amazon.com/s3/buckets/';
  return uri.replace(/^s3:\/\//, prefix);
}

const Content = () => {
  const [bucketName, setBucketName] = useState('');
  const [region, setRegion] = useState<SelectProps['selectedOption']>({
    label: 'US West (Oregon) us-west-2',
    value: 'us-west-2',
  });

  const [acl, setACL] = useState('disabled');
  const [validationError, setValidationError] = useState<string | undefined>();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [resource, setResource] = useState<S3ResourceSelectorProps.Resource>({ uri: '' });

  const history = useHistory();

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
    selectableItemsTypes: ['buckets', 'objects'],
    bucketsVisibleColumns: ['CreationDate', 'Region', 'Name'],
    objectsIsItemDisabled: object => !!object.IsFolder,
    i18nStrings: { ...i18nStrings, inContextUriLabel: '' },
    fetchBuckets: wrapWithErrorHandler(fetchBuckets),
    fetchObjects: wrapWithErrorHandler(fetchObjects),
    fetchVersions: wrapWithErrorHandler(fetchVersions),
    onChange: ({ detail }: NonCancelableCustomEvent<S3ResourceSelectorProps.ChangeDetail>) => {
      setResource(detail.resource);
      setValidationError(detail.errorText);
    },
  };

  const handleCancel = () => {
    history.push('/');
  };

  const handleSubmit = () => {
    history.push('/');
  };

  return (
    <form onSubmit={(event: { preventDefault: () => any }) => event.preventDefault()}>
      <Form
        data-analytics-funnel="Create bucket"
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Create bucket
            </Button>
          </SpaceBetween>
        }
        errorIconAriaLabel="Error"
      >
        <SpaceBetween direction="vertical" size="l">
          <Container header={<Header variant="h2">General configuration</Header>}>
            <SpaceBetween direction="vertical" size="l">
              <FormField
                label="Bucket name"
                constraintText="Bucket name must be globally unique and must not contain spaces or uppercase letters."
              >
                <Input
                  placeholder="myawsbucket"
                  value={bucketName}
                  onChange={(event: { detail: { value: any } }) => setBucketName(event.detail.value)}
                />
              </FormField>
              <FormField label="AWS Region">
                <Select
                  statusType="error"
                  errorText="My select!"
                  selectedOption={region}
                  onChange={({ detail }) => setRegion(detail.selectedOption)}
                  options={[
                    { label: 'US West (Oregon) us-west-2', value: 'us-west-2' },
                    { label: 'US East (N. Virginia) us-east-1', value: 'us-east-1' },
                  ]}
                  selectedAriaLabel="Selected"
                />
              </FormField>
              <FormField
                label="Copy settings from existing bucket"
                description="Only the bucket settings in the following configuration are copied"
                constraintText="Format: s3://bucket/prefix/object. For objects in a bucket with versioning enabled, you can choose the most recent or a previous version of the object."
                errorText={validationError}
                stretch={true}
              >
                <S3ResourceSelector {...s3ResourceSelectorProps} />
              </FormField>
            </SpaceBetween>
          </Container>
          <Alert
            statusIconAriaLabel="Info"
            action={<Button>Enable versioning</Button>}
            header="Versioning is not enabled"
          >
            Versioning is not enabled for objects in bucket [IAM-user].
          </Alert>
          <Container
            header={
              <Header
                variant="h2"
                description="Control ownership written to this bucket from other AWS accounts and the use of access control lists (ACLs). Object ownership determines who can specify access to objects"
              >
                Object ownership
              </Header>
            }
          >
            <SpaceBetween direction="vertical" size="l">
              <FormField>
                <Tiles
                  onChange={({ detail }) => setACL(detail.value)}
                  value={acl}
                  items={[
                    {
                      label: 'ACLs disabled (recommended)',
                      description:
                        'All objects in this bucket are owned by this account. Access to this bucket and its objects is specified using only policies.',
                      value: 'disabled',
                    },
                    {
                      label: 'ACLs enabled',
                      description:
                        'Objects in this bucket can be owned by other AWS accounts. Access to this bucket and its objects can be specified using ACLs.',
                      value: 'enabled',
                    },
                  ]}
                />
              </FormField>
              <Alert statusIconAriaLabel="Info" header="Upcoming permission changes to disabled ACLs">
                Starting in April 2023, to disabled ACLs when creating buckets by using the S3 console, you will no
                longer need the s3:PutBucketOwnershipControls permissions.
              </Alert>
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      </Form>
    </form>
  );
};

export default function SinglePageCreate() {
  return (
    <AppLayout
      contentType="form"
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Amazon S3', href: '#' },
            { text: 'Buckets', href: '#buckets' },
            {
              text: 'Create bucket',
              href: '#buckets/create',
            },
          ]}
          ariaLabel="Breadcrumbs"
        />
      }
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              description="Buckets are containers for data stored in S3"
              info={<Link variant="info">Info</Link>}
            >
              Create bucket
            </Header>
          }
        >
          <Content />
        </ContentLayout>
      }
    />
  );
}
