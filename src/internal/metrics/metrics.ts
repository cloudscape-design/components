// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// TODO: move to component-toolkit/internal/metrics

import { CLogClient, PanoramaClient, MetricsLogItem, MetricsV2EventItem } from './log-clients';
import { buildMetricDetail, buildMetricHash, buildMetricName } from './metrics-formatters';

const oneTimeMetrics: Record<string, boolean> = {};

// In case we need to override the theme for VR.
let theme = '';
function setTheme(newTheme: string) {
  theme = newTheme;
}

export class Metrics {
  readonly source: string;
  readonly packageVersion: string;

  private clog = new CLogClient();
  private panorama = new PanoramaClient();

  constructor(source: string, packageVersion: string) {
    this.source = source;
    this.packageVersion = packageVersion;
  }

  initMetrics(theme: string) {
    setTheme(theme);
  }

  /**
   * Calls Console Platform's client logging JS API with provided metric name, value, and detail.
   * Does nothing if Console Platform client logging JS is not present in page.
   */
  sendMetric(metricName: string, value: number, detail?: string): void {
    if (!theme) {
      // Metrics need to be initialized first (initMetrics)
      console.error('Metrics need to be initialized first.');
      return;
    }

    this.clog.sendMetric(metricName, value, detail);
  }

  /**
   * Calls Console Platform's client v2 logging JS API with provided metric name and detail.
   * Does nothing if Console Platform client logging JS is not present in page.
   */
  sendPanoramaMetric(metric: MetricsV2EventItem): void {
    this.panorama.sendMetric(metric);
  }

  sendMetricObject(metric: MetricsLogItem, value: number): void {
    this.sendMetric(buildMetricName(metric, theme), value, buildMetricDetail(metric, theme));
  }

  sendMetricObjectOnce(metric: MetricsLogItem, value: number): void {
    const metricHash = buildMetricHash(metric);
    if (!oneTimeMetrics[metricHash]) {
      this.sendMetricObject(metric, value);
      oneTimeMetrics[metricHash] = true;
    }
  }

  /*
   * Calls Console Platform's client logging only the first time the provided metricName is used.
   * Subsequent calls with the same metricName are ignored.
   */
  sendMetricOnce(metricName: string, value: number, detail?: string): void {
    if (!oneTimeMetrics[metricName]) {
      this.sendMetric(metricName, value, detail);
      oneTimeMetrics[metricName] = true;
    }
  }

  /*
   * Reports a metric value 1 to Console Platform's client logging service to indicate that the
   * component was loaded. The component load event will only be reported as used to client logging
   * service once per page view.
   */
  logComponentLoaded() {
    this.sendMetricObjectOnce({ source: this.source, action: 'loaded', version: this.packageVersion }, 1);
  }

  /*
   * Reports a metric value 1 to Console Platform's client logging service to indicate that the
   * component was used in the page.  A component will only be reported as used to client logging
   * service once per page view.
   */
  logComponentUsed(componentName: string) {
    this.sendMetricObjectOnce(
      {
        source: componentName,
        action: 'used',
        version: this.packageVersion,
      },
      1
    );
  }
}

export class MetricsTestHelper {
  resetOneTimeMetricsCache() {
    for (const prop in oneTimeMetrics) {
      delete oneTimeMetrics[prop];
    }
  }
}
