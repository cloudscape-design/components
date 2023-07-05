// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import ChartWrapper from '../internal/charts';
import styles from '../../../mixed-line-bar-chart/styles.selectors.js';
import chartPlotStyles from '../../../internal/components/chart-plot/styles.selectors.js';
import cartesianStyles from '../../../internal/components/cartesian-chart/styles.selectors.js';
import chartWrapperStyles from '../../../internal/components/chart-wrapper/styles.selectors.js';

export class BaseCartesianChartWrapper extends ChartWrapper {
  findFilterContainer(): ElementWrapper | null {
    return this.findByClassName(chartWrapperStyles['filter-container']);
  }

  findChart(): ElementWrapper | null {
    return this.findByClassName(chartPlotStyles.root);
  }

  /**
   * Returns a focusable element that controls keyboard interactions.
   */
  findApplication(): ElementWrapper | null {
    return this.findByClassName(chartPlotStyles.application);
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

  findXAxisTitle(): ElementWrapper | null {
    return this.findByClassName(cartesianStyles['axis-label--x']);
  }

  findYAxisTitle(): ElementWrapper | null {
    return this.findByClassName(cartesianStyles['axis-label--y']);
  }

  findXTicks(): Array<ElementWrapper> {
    return this.findAllByClassName(cartesianStyles['ticks--x']);
  }

  findYTicks(): Array<ElementWrapper> {
    return this.findAllByClassName(cartesianStyles['ticks--y']);
  }
}

export default class MixedLineBarChartWrapper extends BaseCartesianChartWrapper {
  static rootSelector: string = styles.root;

  /**
   * Returns an array of bar groups, which are used for mouse navigation if a chart contains bar series.
   */
  findBarGroups(): Array<ElementWrapper> {
    return this.findAllByClassName(styles['bar-group']);
  }
}
