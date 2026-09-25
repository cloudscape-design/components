// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../table-body/styles.selectors.js';

export default class TableBodyWrapper extends ComponentWrapper {
  static rootSelector: string = styles.body;
}
