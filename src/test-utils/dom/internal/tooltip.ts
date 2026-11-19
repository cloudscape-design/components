// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import tooltipStyles from '../../../internal/components/tooltip/styles.selectors.js';

export default class TooltipWrapper extends ElementWrapper {
  static rootSelector: string = tooltipStyles.root;
}
