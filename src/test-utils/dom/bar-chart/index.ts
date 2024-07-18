// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import styles from '../../../bar-chart/styles.selectors.js';
import MixedLineBarChartWrapper from '../mixed-line-bar-chart';

export default class BarChartWrapper extends MixedLineBarChartWrapper {
  static rootSelector: string = styles.root;
}
