// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { PACKAGE_VERSION } from './environment';

export interface MetricsLogItem {
  source: string;
  action: string;
  version: string;
}

export interface MetricsV2EventItem {
  eventType?: string;
  eventContext?: string;
  eventDetail?: string | Record<string, string | number | boolean>;
  eventValue?: string | Record<string, string | number | boolean>;
}

interface AWSC {
  Clog: any;
}

interface MetricsWindow extends Window {
  AWSC?: AWSC;
  panorama?: any;
}

declare const AWSUI_METRIC_ORIGIN: string | undefined;

const oneTimeMetrics: Record<string, boolean> = {};

// In case we need to override the theme for VR
let theme = '';
function setTheme(newTheme: string) {
  theme = newTheme;
}

// react is the only framework we're using
const framework = 'react';

const buildMetricHash = ({ source, action }: MetricsLogItem): string => {
  return [`src${source}`, `action${action}`].join('_');
};

const getMajorVersion = (versionString: string): string => {
  const majorVersionMatch = versionString.match(/^(\d+\.\d+)/);
  return majorVersionMatch ? majorVersionMatch[1] : '';
};

const formatMajorVersionForMetricDetail = (version: string) => {
  return version.replace(/\s/g, '');
};

const formatVersionForMetricName = (theme: string, version: string) => {
  return `${theme.charAt(0)}${getMajorVersion(version).replace('.', '')}`;
};

const buildMetricDetail = ({ source, action, version }: MetricsLogItem): string => {
  const metricOrigin = typeof AWSUI_METRIC_ORIGIN !== 'undefined' ? AWSUI_METRIC_ORIGIN : 'main';
  const detailObject = {
    o: metricOrigin,
    s: source,
    t: theme,
    a: action,
    f: framework,
    v: formatMajorVersionForMetricDetail(version),
  };
  return JSON.stringify(detailObject);
};

const buildMetricName = ({ source, version }: MetricsLogItem): string => {
  return ['awsui', source, `${formatVersionForMetricName(theme, version)}`].join('_');
};

const findPanorama = (currentWindow?: MetricsWindow): any | undefined => {
  try {
    if (typeof currentWindow?.panorama === 'function') {
      return currentWindow?.panorama;
    }

    if (!currentWindow || currentWindow.parent === currentWindow) {
      // When the window has no more parents, it references itself
      return undefined;
    }

    return findPanorama(currentWindow.parent);
  } catch (ex) {
    // Most likely a cross-origin access error
    return undefined;
  }
};

const findAWSC = (currentWindow?: MetricsWindow): AWSC | undefined => {
  try {
    if (typeof currentWindow?.AWSC === 'object') {
      return currentWindow?.AWSC;
    }

    if (!currentWindow || currentWindow.parent === currentWindow) {
      // When the window has no more parents, it references itself
      return undefined;
    }

    return findAWSC(currentWindow.parent);
  } catch (ex) {
    // Most likely a cross-origin access error
    return undefined;
  }
};

export const Metrics = {
  initMetrics(theme: string) {
    setTheme(theme);
  },

  /**
   * Calls Console Platform's client logging JS API with provided metric name, value, and detail.
   * Does nothing if Console Platform client logging JS is not present in page.
   */
  sendMetric(metricName: string, value: number, detail?: string): void {
    if (!theme) {
      // Metrics need to be initialized first (initMetrics)
      console.error('Metrics need to be initalized first.');
      return;
    }

    if (!metricName || !/^[a-zA-Z0-9_-]{1,32}$/.test(metricName)) {
      console.error(`Invalid metric name: ${metricName}`);
      return;
    }
    if (detail && detail.length > 200) {
      console.error(`Detail for metric ${metricName} is too long: ${detail}`);
      return;
    }
    const AWSC = findAWSC(window);
    if (typeof AWSC === 'object' && typeof AWSC.Clog === 'object' && typeof AWSC.Clog.log === 'function') {
      AWSC.Clog.log(metricName, value, detail);
    }
  },

  /**
   * Calls Console Platform's client v2 logging JS API with provided metric name and detail.
   * Does nothing if Console Platform client logging JS is not present in page.
   */
  sendPanoramaMetric(metric: MetricsV2EventItem): void {
    if (typeof metric.eventDetail === 'object') {
      metric.eventDetail = JSON.stringify(metric.eventDetail);
    }
    if (metric.eventDetail && metric.eventDetail.length > 200) {
      console.error(`Detail for metric is too long: ${metric.eventDetail}`);
      return;
    }
    if (typeof metric.eventValue === 'object') {
      metric.eventValue = JSON.stringify(metric.eventValue);
    }
    const panorama = findPanorama(window);
    if (typeof panorama === 'function') {
      panorama('trackCustomEvent', {
        ...metric,
        timestamp: Date.now(),
      });
    }
  },

  sendMetricObject(metric: MetricsLogItem, value: number): void {
    this.sendMetric(buildMetricName(metric), value, buildMetricDetail(metric));
  },

  sendMetricObjectOnce(metric: MetricsLogItem, value: number): void {
    const metricHash = buildMetricHash(metric);
    if (!oneTimeMetrics[metricHash]) {
      this.sendMetricObject(metric, value);
      oneTimeMetrics[metricHash] = true;
    }
  },

  /*
   * Calls Console Platform's client logging only the first time the provided metricName is used.
   * Subsequent calls with the same metricName are ignored.
   */
  sendMetricOnce(metricName: string, value: number, detail?: string): void {
    if (!oneTimeMetrics[metricName]) {
      this.sendMetric(metricName, value, detail);
      oneTimeMetrics[metricName] = true;
    }
  },

  /*
   * Reports a metric value 1 to Console Platform's client logging service to indicate that the
   * component was loaded. The component load event will only be reported as used to client logging
   * service once per page view.
   */
  logComponentLoaded() {
    this.sendMetricObjectOnce(
      {
        source: 'components',
        action: 'loaded',
        version: PACKAGE_VERSION,
      },
      1
    );
  },

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
        version: PACKAGE_VERSION,
      },
      1
    );
  },
};

export const MetricsTestHelper = {
  resetOneTimeMetricsCache: () => {
    for (const prop in oneTimeMetrics) {
      delete oneTimeMetrics[prop];
    }
  },
  formatMajorVersionForMetricDetail,
  formatVersionForMetricName,
};
