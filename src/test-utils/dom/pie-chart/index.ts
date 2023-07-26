// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import CommonChartWrapper from '../internal/charts';
import styles from '../../../pie-chart/styles.selectors.js';
import chartPlotStyles from '../../../internal/components/chart-plot/styles.selectors.js';
import chartWrapperStyles from '../../../internal/components/chart-wrapper/styles.selectors.js';

export default class PieChartWrapper extends CommonChartWrapper {
  static rootSelector: string = styles.root;

  findFilterContainer(): ElementWrapper | null {
    return this.findByClassName(chartWrapperStyles['filter-container']);
  }

  findSegments(): Array<ElementWrapper> {
    return this.findAllByClassName(styles.segment);
  }

  findHighlightedSegment(): ElementWrapper | null {
    return this.findByClassName(styles['segment--highlighted']);
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

  findInnerContent(): ElementWrapper | null {
    return this.findByClassName(styles['inner-content']);
  }

  findSegmentLabels(): Array<ElementWrapper> {
    return this.findAllByClassName(styles.label);
  }

  findHighlightedSegmentLabel(): ElementWrapper | null {
    return this.findByClassName(styles['label--highlighted']);
  }
}
