// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';

import { GIT_SHA, PACKAGE_VERSION, THEME } from '../../environment';
import { metrics } from '../../metrics';

export function checkMissingStyles(ownerDocument: Document) {
  if (!ownerDocument.defaultView) {
    // skip the check if this iframe is detached
    return;
  }
  const result = getComputedStyle(ownerDocument.body).getPropertyValue(`--awsui-version-info-${GIT_SHA}`);
  if (!result) {
    console.error(`Missing AWS-UI CSS for theme "${THEME}", version "${PACKAGE_VERSION}", and git sha "${GIT_SHA}".`);
    metrics.sendOpsMetricObject('awsui-missing-css-asset', {});
  }
}

function documentReady(document: Document, callback: () => void) {
  if (document.readyState === 'complete') {
    callback();
  } else {
    document.defaultView?.addEventListener('load', () => callback(), { once: true });
  }
}

export function documentReadyAndIdle(document: Document, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    documentReady(document, () => {
      setTimeout(() => {
        requestIdleCallback(() => resolve());
      }, 1000);
    });
  });
}

const checkedDocs = new WeakMap<Document, boolean>();
const checkMissingStylesOnce = (document: Document) => {
  const checked = checkedDocs.get(document);
  if (!checked) {
    checkMissingStyles(document);
    checkedDocs.set(document, true);
  }
};

export function useMissingStylesCheck(elementRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    // if idle callbacks not supported, we simply do not collect the metric
    if (typeof requestIdleCallback !== 'function') {
      return;
    }
    const ownerDocument = elementRef.current?.ownerDocument ?? document;
    const abortController = new AbortController();
    documentReadyAndIdle(ownerDocument, abortController.signal).then(
      () => checkMissingStylesOnce(ownerDocument),
      error => {
        // istanbul ignore next
        if (error.name !== 'AbortError') {
          throw error;
        }
      }
    );
    return () => abortController.abort();
  }, [elementRef]);
}
