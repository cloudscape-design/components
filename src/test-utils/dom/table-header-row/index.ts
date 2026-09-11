// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../table-header-row/styles.selectors.js';

export default class TableHeaderRowWrapper extends ComponentWrapper {
  static rootSelector: string = styles['header-row'];
}
