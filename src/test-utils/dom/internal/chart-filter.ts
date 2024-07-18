// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import DropdownHostComponentWrapper from '../internal/dropdown-host';

import buttonTriggerStyles from '../../../internal/components/button-trigger/styles.selectors.js';
import styles from '../../../internal/components/chart-filter/styles.selectors.js';
import selectPartsStyles from '../../../select/parts/styles.selectors.js';

export default class ChartFilterWrapper extends DropdownHostComponentWrapper {
  static rootSelector: string = styles['chart-filter'];

  findPlaceholder(): ElementWrapper | null {
    return this.findByClassName(selectPartsStyles.placeholder);
  }

  findTrigger(): ElementWrapper {
    return this.findByClassName(buttonTriggerStyles['button-trigger'])!;
  }
}
