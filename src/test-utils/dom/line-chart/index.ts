// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import styles from '../../../line-chart/styles.selectors.js';
import { BaseCartesianChartWrapper } from '../mixed-line-bar-chart';

export default class LineChartWrapper extends BaseCartesianChartWrapper {
  static rootSelector: string = styles.root;
}
