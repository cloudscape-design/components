// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';

import { BaseCartesianChartWrapper } from '../mixed-line-bar-chart/index.js';

import styles from '../../../area-chart/styles.selectors.js';
import chartPlotStyles from '../../../internal/components/chart-plot/styles.selectors.js';

export default class AreaChartWrapper extends BaseCartesianChartWrapper {
  static rootSelector: string = styles.root;

  findChart(): ElementWrapper | null {
    return this.findByClassName(chartPlotStyles.root);
  }

  /**
   * Returns an array of chart series. Note that thresholds count as series as well.
   */
  findSeries(): Array<ElementWrapper> {
    return this.findAllByClassName(styles.series);
  }

  findHighlightedSeries(): ElementWrapper | null {
    return this.findByClassName(styles['series--highlighted']);
  }
}
