// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

const allowedJavascriptUrls = ['javascript:void(0)', 'javascript:void(0);', 'javascript:;'];

export function checkSafeUrl(component: string, url: string | undefined | null): void {
  if (!url) {
    return;
  }
  if (allowedJavascriptUrls.indexOf(url.toLowerCase()) !== -1) {
    return;
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch (e) {
    // If the URL cannot be parsed by the browser, it likely does not pose a security risk.
    return;
  }

  if (parsedUrl.protocol === 'javascript:') {
    warnOnce(component, `A javascript: URL was blocked as a security precaution. The URL was "${url}".`);
    // This mirrors the error message that React will use:
    // https://github.com/facebook/react/blob/a724a3b578dce77d427bef313102a4d0e978d9b4/packages/react-dom/src/shared/sanitizeURL.js#L30
    throw new Error(`A javascript: URL was blocked as a security precaution.`);
  }

  return;
}
