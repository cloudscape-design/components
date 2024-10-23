// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../internal/components/file-dropzone/styles.selectors.js';

export default class FileDropzoneWrapper extends ElementWrapper {
  static rootSelector: string = styles.root;
}
