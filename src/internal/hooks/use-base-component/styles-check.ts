// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';

import { GIT_SHA, PACKAGE_VERSION, THEME } from '../../environment';
import { metrics } from '../../metrics';

function waitForStylesheets(doc: Document, signal: AbortSignal) {
  const links = Array.from(doc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));

  return Promise.all(
    links.map(link => {
      // already loaded
      if (link.sheet) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const onLoad = () => cleanup(resolve);
        const onError = () => cleanup(() => reject(new Error(`Stylesheet failed: ${link.href}`)));

        const onAbort = () => cleanup(() => reject(new DOMException('Aborted', 'AbortError')));

        function cleanup(done: () => void) {
          link.removeEventListener('load', onLoad);
          link.removeEventListener('error', onError);
          signal.removeEventListener('abort', onAbort);
          done();
        }

        link.addEventListener('load', onLoad);
        link.addEventListener('error', onError);
        signal.addEventListener('abort', onAbort);
      });
    })
  );
}

function getVarFrom(node: Element, doc: Document, name: string) {
  const view = doc.defaultView!;
  const value = view.getComputedStyle(node).getPropertyValue(name);
  return value ? value.trim() : '';
}

export function checkMissingStyles(ownerDocument: Document) {
  const win = ownerDocument.defaultView;
  if (!win) {
    return;
  }

  const varName = `--awsui-version-info-${GIT_SHA}`;
  const bodyVal = ownerDocument.body ? getVarFrom(ownerDocument.body, ownerDocument, varName) : '';

  if (!bodyVal) {
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
      async () => {
        await waitForStylesheets(ownerDocument, abortController.signal);
        checkMissingStylesOnce(ownerDocument);
      },
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
