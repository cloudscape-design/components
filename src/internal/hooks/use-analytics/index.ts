// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// We expect analytics to be set only once and before the application is rendered.
let analyticsEnabled: boolean | undefined = undefined;

export function useAnalytics() {
  if (analyticsEnabled === undefined) {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      analyticsEnabled = false;
    } else {
      analyticsEnabled = !!document.querySelector('.awsui-analytics-enabled');
    }
  }

  return analyticsEnabled;
}
