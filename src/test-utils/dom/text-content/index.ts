// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';

import styles from '../../../text-content/styles.selectors.js';

export default class TextContentWrapper extends ComponentWrapper<HTMLSpanElement> {
  static rootSelector: string = styles['text-content'];
}
