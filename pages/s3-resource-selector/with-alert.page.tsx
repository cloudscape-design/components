// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Alert from '~components/alert';
import S3ResourceSelector from '~components/s3-resource-selector';

import ScreenshotArea from '../utils/screenshot-area';
import { i18nStrings } from './data/i18n-strings';
import { fetchBuckets, fetchObjects, fetchVersions } from './data/request';

export default function () {
  return (
    <>
      <h1>S3 Resource Selector with alert</h1>
      <ScreenshotArea>
        <S3ResourceSelector
          alert={
            <Alert type="error" statusIconAriaLabel="Error" header="Resource cannot be found">
              The specified path does not exist
            </Alert>
          }
          resource={{ uri: '' }}
          fetchBuckets={fetchBuckets}
          fetchObjects={fetchObjects}
          fetchVersions={fetchVersions}
          i18nStrings={i18nStrings}
        />
      </ScreenshotArea>
    </>
  );
}
