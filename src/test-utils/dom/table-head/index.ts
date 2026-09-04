// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../table-head/styles.selectors.js';

export default class TableHeadWrapper extends ComponentWrapper {
  static rootSelector: string = styles['head'];
}
