// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { FileDropzone } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function FileDropzoneStyleV2Page() {
  return (
    <SimplePage title="FileDropzone with Style API v2" screenshotArea={{}}>
      <FileDropzone onChange={() => undefined} className={styles['styled-dropzone']}>
        Drop files here or click to browse
      </FileDropzone>
    </SimplePage>
  );
}
