// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Alert from '~components/alert';
import S3ResourceSelector, { S3ResourceSelectorProps } from '~components/s3-resource-selector';

import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './data/i18n-strings';
import { fetchBuckets, fetchObjects, fetchVersions } from './data/request';

const defaults = {
  resource: { uri: '' },
  selectableItemsTypes: ['buckets', 'objects'],
  fetchBuckets,
  fetchObjects,
  fetchVersions,
  i18nStrings,
} as const;

const permutations: ReadonlyArray<S3ResourceSelectorProps> = [
  {
    ...defaults,
  },
  {
    ...defaults,
    selectableItemsTypes: ['versions'],
  },
  {
    ...defaults,
    invalid: true,
  },
  {
    ...defaults,
    viewHref: '#',
  },
  {
    ...defaults,
    alert: (
      <Alert type="error" statusIconAriaLabel="Error" header="Resource cannot be found">
        The specified path does not exist
      </Alert>
    ),
  },
];

export default function () {
  return (
    <>
      <h1>S3 Resource Selector permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <S3ResourceSelector {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
