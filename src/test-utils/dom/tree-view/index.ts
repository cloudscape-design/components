// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper } from '@cloudscape-design/test-utils-core/dom';

import testClasses from '../../../tree-view/test-classes/styles.selectors.js';

export default class TreeViewWrapper extends ComponentWrapper {
  static rootSelector: string = testClasses.root;
}
