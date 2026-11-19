// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../status-indicator/styles.selectors.js';

export default class StatusIndicatorWrapper extends ComponentWrapper<HTMLButtonElement> {
  static rootSelector: string = styles.root;
}
