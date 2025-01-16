// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { PACKAGE_VERSION } from '../../environment';
import { metrics } from '../../metrics';

export function reportRuntimeApiLoadMetric() {
  metrics.sendPanoramaMetric({ eventName: 'awsui-runtime-api-loaded', eventDetail: { version: PACKAGE_VERSION } });
}

export function reportRuntimeApiWarning(component: string, message: string) {
  console.warn('[AwsUi]', `[${component}]`, message);
  metrics.sendPanoramaMetric({
    eventName: 'awsui-runtime-api-warning',
    eventDetail: { version: PACKAGE_VERSION, component, message },
  });
}
