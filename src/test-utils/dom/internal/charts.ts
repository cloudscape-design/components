// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ComponentWrapper, createWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import ChartLegendWrapper from './chart-legend';
import ChartFilterWrapper from './chart-filter';
import ChartPopoverWrapper from './chart-popover';
import legendStyles from '../../../internal/components/chart-legend/styles.selectors.js';
import filterStyles from '../../../internal/components/chart-filter/styles.selectors.js';
import popoverStyles from '../../../internal/components/chart-popover/styles.selectors.js';
import statusContainerStyles from '../../../internal/components/chart-status-container/styles.selectors.js';

export default class CommonChartWrapper extends ComponentWrapper {
  findDefaultFilter(): ChartFilterWrapper | null {
    return this.findComponent(`.${filterStyles['chart-filter']}`, ChartFilterWrapper);
  }

  findStatusContainer(): ElementWrapper | null {
    return this.findByClassName(statusContainerStyles.root);
  }

  findLegend(): ChartLegendWrapper | null {
    return this.findComponent(`.${legendStyles.root}`, ChartLegendWrapper);
  }

  findDetailPopover(): ChartPopoverWrapper | null {
    return createWrapper().findComponent(`.${popoverStyles.root}`, ChartPopoverWrapper);
  }
}
