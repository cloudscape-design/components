// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import styles from '../../../column-layout/styles.selectors.js';
import GridWrapper from '../grid';

export default class ColumnLayoutWrapper extends GridWrapper {
  static rootSelector: string = styles['column-layout'];
}
