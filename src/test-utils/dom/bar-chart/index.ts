// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import MixedLineBarChartWrapper from '../mixed-line-bar-chart';

import styles from '../../../bar-chart/styles.selectors.js';

export default class BarChartWrapper extends MixedLineBarChartWrapper {
  static rootSelector: string = styles.root;
}
