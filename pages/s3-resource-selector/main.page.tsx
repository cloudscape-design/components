// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Box from '~components/box';
import Container from '~components/container';
import FormField from '~components/form-field';
import Header from '~components/header';
import { NonCancelableCustomEvent } from '~components/interfaces';
import S3ResourceSelector, { S3ResourceSelectorProps } from '~components/s3-resource-selector';

import { fetchBuckets, fetchObjects, fetchVersions } from './data/request';
import { i18nStrings } from './data/i18n-strings';
import { SelfDismissibleAlert, uriToConsoleUrl } from './shared';

export default function S3PickerExample() {
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
    <Box padding="l">
      <Container header={<Header headingTagOverride="h1">S3 Resource Selector Example</Header>}>
        <button id="focus-start">Set focus here</button>
        <FormField
          label="Read audio files from S3"
          description="Choose an audio file in Amazon S3. Amazon S3 is object storage built to store and retrieve data."
          constraintText="Format: s3://bucket/prefix/object. For objects in a bucket with versioning enabled, you can choose the most recent or a previous version of the object."
          errorText={validationError}
          stretch={true}
        >
          <S3ResourceSelector {...s3ResourceSelectorProps} />
        </FormField>
      </Container>
    </Box>
  );
}
