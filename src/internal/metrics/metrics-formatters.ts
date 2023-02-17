// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { MetricsLogItem } from './log-clients';

// TODO: move to component-toolkit/internal/metrics

declare const AWSUI_METRIC_ORIGIN: string | undefined;

// React is the only framework we're using.
const framework = 'react';

export function buildMetricHash({ source, action }: MetricsLogItem): string {
  return [`src${source}`, `action${action}`].join('_');
}

export function buildMetricDetail({ source, action, version }: MetricsLogItem, theme: string): string {
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
}

export function buildMetricName({ source, version }: MetricsLogItem, theme: string): string {
  return ['awsui', source, `${formatVersionForMetricName(theme, version)}`].join('_');
}

export function formatMajorVersionForMetricDetail(version: string) {
  return version.replace(/\s/g, '');
}

export function formatVersionForMetricName(theme: string, version: string) {
  return `${theme.charAt(0)}${getMajorVersion(version).replace('.', '')}`;
}

function getMajorVersion(versionString: string): string {
  const majorVersionMatch = versionString.match(/^(\d+\.\d+)/);
  return majorVersionMatch ? majorVersionMatch[1] : '';
}
