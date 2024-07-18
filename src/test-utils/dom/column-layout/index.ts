// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import GridWrapper from '../grid';

import styles from '../../../column-layout/styles.selectors.js';

export default class ColumnLayoutWrapper extends GridWrapper {
  static rootSelector: string = styles['column-layout'];
}
