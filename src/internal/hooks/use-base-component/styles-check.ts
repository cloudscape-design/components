// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';

import { GIT_SHA, PACKAGE_VERSION, THEME } from '../../environment';
import { metrics } from '../../metrics';

function summarizeStylesheets(doc: Document) {
  const sheets = Array.from(doc.styleSheets || []);
  return sheets.map((s, i) => {
    // Accessing cssRules can throw for cross-origin sheets
    let rulesCount: number | 'inaccessible' = 0;
    try {
      rulesCount = (s as CSSStyleSheet).cssRules?.length ?? 0;
    } catch {
      rulesCount = 'inaccessible';
    }

    return {
      i,
      href: (s as CSSStyleSheet).href ?? null,
      disabled: (s as CSSStyleSheet).disabled ?? null,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ownerNode: (s as CSSStyleSheet).ownerNode?.nodeName + (s as CSSStyleSheet).ownerNode?.getAttribute ? '' : '',
      rulesCount,
    };
  });
}

function summarizeCssNodes(doc: Document) {
  const nodes = Array.from(doc.querySelectorAll('link[rel="stylesheet"], style'));
  return nodes.map((n, i) => {
    if (n.tagName === 'LINK') {
      const link = n as HTMLLinkElement;
      return {
        i,
        type: 'link',
        href: link.href || link.getAttribute('href'),
        rel: link.rel,
        media: link.media || null,
        disabled: link.disabled || false,
      };
    }
    const style = n as HTMLStyleElement;
    return {
      i,
      type: 'style',
      media: style.media || null,
      // avoid dumping full CSS; just include size + a small prefix
      textLen: style.textContent?.length ?? 0,
      textHead: (style.textContent ?? '').slice(0, 200),
    };
  });
}

function getVarFrom(node: Element, doc: Document, name: string) {
  const view = doc.defaultView!;
  const value = view.getComputedStyle(node).getPropertyValue(name);
  return value ? value.trim() : '';
}

function getUrlContext(doc: Document) {
  const base = doc.querySelector('base')?.getAttribute('href') ?? null;
  return {
    locationHref: doc.defaultView?.location?.href ?? null,
    documentURL: doc.URL,
    baseHref: base,
    readyState: doc.readyState,
  };
}

export function checkMissingStyles(ownerDocument: Document) {
  const win = ownerDocument.defaultView;
  if (!win) {
    return;
  }

  const varName = `--awsui-version-info-${GIT_SHA}`;

  // check multiple roots — this is very informative
  const bodyVal = ownerDocument.body ? getVarFrom(ownerDocument.body, ownerDocument, varName) : '';
  const rootVal = ownerDocument.documentElement
    ? getVarFrom(ownerDocument.documentElement, ownerDocument, varName)
    : '';

  // Keep your existing behavior: decide based on body (or switch to root)
  const result = bodyVal;

  if (!result) {
    // Collect diagnostics
    const diag = {
      message: 'Missing AWS-UI CSS variable',
      varName,
      gitSha: GIT_SHA,
      theme: THEME,
      packageVersion: PACKAGE_VERSION,

      // where is it visible (if anywhere)?
      values: {
        onBody: bodyVal,
        onRoot: rootVal,
      },

      // url/base context (catches publicPath "./" deep route issues)
      url: getUrlContext(ownerDocument),

      // stylesheet nodes in DOM
      cssNodes: summarizeCssNodes(ownerDocument),

      // CSSOM stylesheets (and whether rules are accessible)
      styleSheets: summarizeStylesheets(ownerDocument),

      // Timing: helps correlate with rAF/idle/load
      timing: {
        now: win.performance?.now?.() ?? null,
      },
    };

    console.error(
      `Missing AWS-UI CSS for theme "${THEME}", version "${PACKAGE_VERSION}", and git sha "${GIT_SHA}". Detail: ${JSON.stringify(diag, null, 2)}`
    );

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
