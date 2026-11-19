// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';

import testUtilStyles from '../../../live-region/test-classes/styles.selectors.js';

export default class LiveRegionWrapper extends ComponentWrapper {
  static rootSelector: string = testUtilStyles.root;
}
