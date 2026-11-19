// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseCartesianChartWrapper } from '../mixed-line-bar-chart';

import styles from '../../../line-chart/styles.selectors.js';

export default class LineChartWrapper extends BaseCartesianChartWrapper {
  static rootSelector: string = styles.root;
}
