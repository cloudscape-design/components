// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect } from 'react';

import { GIT_SHA, PACKAGE_VERSION, THEME } from '../../environment';
import { metrics } from '../../metrics';

export function checkMissingStyles() {
  const result = getComputedStyle(document.body).getPropertyValue(`--awsui-version-info-${GIT_SHA}`);
  if (!result) {
    console.error(`Missing AWS-UI CSS for theme "${THEME}", version "${PACKAGE_VERSION}", and git sha "${GIT_SHA}".`);
    metrics.sendOpsMetricObject('awsui-missing-css-asset', {});
  }
}

export function idleWithDelay(cb: () => void) {
  // if idle callbacks not supported, we simply do not collect the metric
  if (typeof requestIdleCallback !== 'function') {
    return;
  }
  let aborted = false;

  setTimeout(() => {
    if (aborted) {
      return;
    }
    requestIdleCallback(() => {
      if (aborted) {
        return;
      }
      cb();
    });
  }, 1000);

  return () => {
    aborted = true;
  };
}

let checked = false;
const checkMissingStylesOnce = () => {
  if (!checked) {
    checkMissingStyles();
    checked = true;
  }
};

export function useMissingStylesCheck() {
  useEffect(() => {
    return idleWithDelay(() => checkMissingStylesOnce());
  }, []);
}
