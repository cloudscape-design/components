// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// TODO: move to component-toolkit/internal/metrics

export interface AWSC {
  Clog: any;
}

export interface MetricsWindow extends Window {
  AWSC?: AWSC;
  panorama?: any;
}

export interface MetricsV2EventItem {
  eventType?: string;
  eventContext?: string;
  eventDetail?: string | Record<string, string | number | boolean>;
  eventValue?: string | Record<string, string | number | boolean>;
}

export interface MetricsLogItem {
  source: string;
  action: string;
  version: string;
}

/**
 * Console Platform's client logging JS API client.
 */
export class CLogClient {
  /**
   * Sends metric but only if Console Platform client logging JS API is present in the page.
   */
  sendMetric(metricName: string, value: number, detail?: string): void {
    if (!metricName || !/^[a-zA-Z0-9_-]{1,32}$/.test(metricName)) {
      console.error(`Invalid metric name: ${metricName}`);
      return;
    }
    if (detail && detail.length > 200) {
      console.error(`Detail for metric ${metricName} is too long: ${detail}`);
      return;
    }
    const AWSC = this.findAWSC(window);
    if (typeof AWSC === 'object' && typeof AWSC.Clog === 'object' && typeof AWSC.Clog.log === 'function') {
      AWSC.Clog.log(metricName, value, detail);
    }
  }

  private findAWSC(currentWindow?: MetricsWindow): AWSC | undefined {
    try {
      if (typeof currentWindow?.AWSC === 'object') {
        return currentWindow?.AWSC;
      }

      if (!currentWindow || currentWindow.parent === currentWindow) {
        // When the window has no more parents, it references itself
        return undefined;
      }

      return this.findAWSC(currentWindow.parent);
    } catch (ex) {
      // Most likely a cross-origin access error
      return undefined;
    }
  }
}

/**
 * Console Platform's client v2 logging JS API client.
 */
export class PanoramaClient {
  /**
   * Sends metric but only if Console Platform client v2 logging JS API is present in the page.
   */
  sendMetric(metric: MetricsV2EventItem): void {
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
    const panorama = this.findPanorama(window);
    if (typeof panorama === 'function') {
      panorama('trackCustomEvent', { ...metric, timestamp: Date.now() });
    }
  }

  private findPanorama(currentWindow?: MetricsWindow): any | undefined {
    try {
      if (typeof currentWindow?.panorama === 'function') {
        return currentWindow?.panorama;
      }

      if (!currentWindow || currentWindow.parent === currentWindow) {
        // When the window has no more parents, it references itself
        return undefined;
      }

      return this.findPanorama(currentWindow.parent);
    } catch (ex) {
      // Most likely a cross-origin access error
      return undefined;
    }
  }
}
