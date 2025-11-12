// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { waitFor } from '@testing-library/react';

import { GIT_SHA } from '../../../../../lib/components/internal/environment';
import {
  checkMissingStyles,
  documentReadyAndIdle,
} from '../../../../../lib/components/internal/hooks/use-base-component/styles-check';
import { metrics } from '../../../../../lib/components/internal/metrics';

jest.mock('../../../../../lib/components/internal/environment', () => ({
  ...jest.requireActual('../../../../../lib/components/internal/environment'),
  PACKAGE_VERSION: '3.0.0 (abc)',
  GIT_SHA: 'abc',
}));

afterEach(() => {
  jest.resetAllMocks();
});

describe('checkMissingStyles', () => {
  let consoleWarnSpy: jest.SpyInstance;
  let sendPanoramaMetricSpy: jest.SpyInstance;
  const style = document.createElement('style');
  document.body.append(style);

  beforeEach(() => {
    style.textContent = ``;
    consoleWarnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    sendPanoramaMetricSpy = jest.spyOn(metrics, 'sendOpsMetricObject').mockImplementation(() => {});
  });

  test('should pass the check if styles found', () => {
    // using :root does not work in JSDOM: https://github.com/jsdom/jsdom/issues/3563
    style.textContent = `
      body {
        --awsui-version-info-${GIT_SHA}: true;
      }
  `;
    checkMissingStyles(document);
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(sendPanoramaMetricSpy).not.toHaveBeenCalled();
  });

  test('should detect missing styles', () => {
    checkMissingStyles(document);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Missing AWS-UI CSS for theme "default", version "3.0.0 (abc)", and git sha "abc".'
    );
    expect(sendPanoramaMetricSpy).toHaveBeenCalledWith('awsui-missing-css-asset', {});
  });

  test('should report missing styles if a different version found', () => {
    style.textContent = `
      body {
        --awsui-version-info-c4d5e6: true;
      }
  `;
    checkMissingStyles(document);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Missing AWS-UI CSS for theme "default", version "3.0.0 (abc)", and git sha "abc".'
    );
    expect(sendPanoramaMetricSpy).toHaveBeenCalledWith('awsui-missing-css-asset', {});
  });

  describe('in iframe', () => {
    let iframe: HTMLIFrameElement;
    let iframeDocument: Document;

    beforeEach(() => {
      iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      iframeDocument = iframe.contentDocument!;
    });

    afterEach(() => {
      iframe.remove();
    });

    test('should pass the check if styles found inside an iframe', () => {
      const iframeStyle = document.createElement('style');
      iframeDocument.body.append(iframeStyle);
      // using :root does not work in JSDOM: https://github.com/jsdom/jsdom/issues/3563
      iframeStyle.textContent = `
          body {
            --awsui-version-info-${GIT_SHA}: true;
          }
      `;
      checkMissingStyles(iframeDocument);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(sendPanoramaMetricSpy).not.toHaveBeenCalled();
    });

    test('should report missing styles if rendered in a different iframe', () => {
      style.textContent = `
          body {
            --awsui-version-info-${GIT_SHA}: true;
          }
      `;

      checkMissingStyles(iframeDocument);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Missing AWS-UI CSS for theme "default", version "3.0.0 (abc)", and git sha "abc".'
      );
      expect(sendPanoramaMetricSpy).toHaveBeenCalledWith('awsui-missing-css-asset', {});
    });

    test('should skip the check if iframe was detached', () => {
      const mockDetachedDocument = { body: iframeDocument.body } as Document;
      checkMissingStyles(mockDetachedDocument);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
      expect(sendPanoramaMetricSpy).not.toHaveBeenCalled();
    });
  });
});

describe('documentReadyAndIdle', () => {
  function createDocumentMock(readyState: DocumentReadyState): Document {
    return {
      readyState,
      defaultView: {
        addEventListener: jest.fn() as Window['addEventListener'],
      },
    } as Document;
  }

  beforeEach(() => {
    // simulate requestIdleCallback for JSDOM
    globalThis.requestIdleCallback = cb => setTimeout(cb, 0);
  });

  afterEach(() => {
    // @ts-expect-error reset to initial state
    globalThis.requestIdleCallback = undefined;
  });

  test('runs callback when document is idle', async () => {
    const document = createDocumentMock('complete');
    const cb = jest.fn();
    documentReadyAndIdle(document, new AbortController().signal).then(cb);
    await waitFor(
      () => {
        expect(document.defaultView!.addEventListener).not.toHaveBeenCalled();
        expect(cb).toHaveBeenCalled();
      },
      { timeout: 2000 }
    );
  });

  test('waits for document to be loaded if it is not ready', async () => {
    const document = createDocumentMock('loading');
    const cb = jest.fn();
    documentReadyAndIdle(document, new AbortController().signal).then(cb);
    expect(document.defaultView!.addEventListener).toHaveBeenCalledWith('load', expect.any(Function), { once: true });
    (document.defaultView!.addEventListener as any).mock.lastCall[1]();
    await waitFor(
      () => {
        expect(cb).toHaveBeenCalled();
      },
      { timeout: 2000 }
    );
  });

  test('delay can be aborted before loading state phase', async () => {
    const document = createDocumentMock('loading');
    const onAbort = jest.fn();
    const abortController = new AbortController();
    documentReadyAndIdle(document, abortController.signal).then(() => {}, onAbort);
    expect(document.defaultView!.addEventListener).toHaveBeenCalledWith('load', expect.any(Function), { once: true });
    abortController.abort();
    await waitFor(() => expect(onAbort).toHaveBeenCalledWith(new DOMException('Aborted', 'AbortError')));
  });

  test('delay can be aborted before requestIdleCallback phase', async () => {
    const document = createDocumentMock('complete');
    const onAbort = jest.fn();
    const abortController = new AbortController();
    documentReadyAndIdle(document, abortController.signal).then(() => {}, onAbort);
    expect(document.defaultView!.addEventListener).not.toHaveBeenCalled();
    abortController.abort();
    await waitFor(() => expect(onAbort).toHaveBeenCalledWith(new DOMException('Aborted', 'AbortError')));
  });
});
