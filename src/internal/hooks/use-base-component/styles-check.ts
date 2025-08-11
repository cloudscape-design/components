// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';

import { GIT_SHA, PACKAGE_VERSION, THEME } from '../../environment.js';
import { metrics } from '../../metrics.js';

export function checkMissingStyles(ownerDocument: Document) {
  const result = getComputedStyle(ownerDocument.body).getPropertyValue(`--awsui-version-info-${GIT_SHA}`);
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

const checkedDocs = new WeakMap<Document, boolean>();
const checkMissingStylesOnce = (elementRef: React.RefObject<HTMLElement>) => {
  const ownerDocument = elementRef.current?.ownerDocument ?? document;
  const checked = checkedDocs.get(ownerDocument);
  if (!checked) {
    checkMissingStyles(ownerDocument);
    checkedDocs.set(ownerDocument, true);
  }
};

export function useMissingStylesCheck(elementRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    return idleWithDelay(() => checkMissingStylesOnce(elementRef));
  }, [elementRef]);
}
