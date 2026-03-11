// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';

import {
  __testResetCheckedDocs,
  useMissingStylesCheck,
} from '../../../../../lib/components/internal/hooks/use-base-component/styles-check';
import { metrics } from '../../../../../lib/components/internal/metrics';

jest.mock('../../../../../lib/components/internal/environment', () => ({
  ...jest.requireActual('../../../../../lib/components/internal/environment'),
  PACKAGE_VERSION: '3.0.0 (abc)',
  GIT_SHA: 'abc',
}));

function expectNoError() {
  expect(consoleErrorSpy).not.toHaveBeenCalled();
  expect(sendPanoramaMetricSpy).not.toHaveBeenCalled();
}

function expectError() {
  expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
  expect(consoleErrorSpy).toHaveBeenCalledWith(
    'Missing AWS-UI CSS for theme "default", version "3.0.0 (abc)", and git sha "abc".'
  );
  expect(sendPanoramaMetricSpy).toHaveBeenCalledWith('awsui-missing-css-asset', {});
}

function Test({ versionVar }: { versionVar?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useMissingStylesCheck(ref);
  return <div ref={ref}>{versionVar && <style>{`body { ${versionVar} }`}</style>}</div>;
}

const initialRequestIdleCallback = globalThis.requestIdleCallback;
let consoleErrorSpy: jest.SpyInstance;
let sendPanoramaMetricSpy: jest.SpyInstance;

beforeEach(() => {
  jest.useFakeTimers();
  globalThis.requestIdleCallback = cb => setTimeout(cb, 0);
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  sendPanoramaMetricSpy = jest.spyOn(metrics, 'sendOpsMetricObject').mockImplementation(() => {});
});

afterEach(() => {
  jest.resetAllMocks();
  jest.useRealTimers();
  __testResetCheckedDocs();
  globalThis.requestIdleCallback = initialRequestIdleCallback;
  Object.defineProperty(document, 'readyState', { value: 'complete', configurable: true });
});

test('should pass the check if styles found', async () => {
  render(<Test versionVar="--awsui-version-info-abc: true;" />);

  await jest.advanceTimersByTimeAsync(2000);
  expectNoError();
});

test('should fail the check if git sha does not match', async () => {
  render(<Test versionVar="--awsui-version-info-abcd: true;" />);

  await jest.advanceTimersByTimeAsync(2000);
  expectError();
});

test('emits error and metrics only once', async () => {
  const { rerender } = render(<Test key={1} />);

  await jest.advanceTimersByTimeAsync(2000);
  expectError();

  consoleErrorSpy.mockClear();
  sendPanoramaMetricSpy.mockClear();
  rerender(<Test key={2} />);

  await jest.advanceTimersByTimeAsync(2000);
  expectNoError();
});

describe('in iframe', () => {
  let iframe: HTMLIFrameElement;
  let iframeDocument: Document;
  let mountNode: HTMLDivElement;

  beforeEach(() => {
    iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    iframeDocument = iframe.contentDocument!;

    mountNode = iframeDocument.createElement('div');
    iframeDocument.body.appendChild(mountNode);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(mountNode);
    iframe.remove();
  });

  test('should pass the check if styles found inside an iframe', async () => {
    ReactDOM.render(<Test versionVar="--awsui-version-info-abc: true;" />, mountNode);

    await jest.advanceTimersByTimeAsync(2000);
    expectNoError();
  });

  test('should report missing styles if rendered in a different document', async () => {
    render(<Test versionVar="--awsui-version-info-abc: true;" />);
    ReactDOM.render(<Test />, mountNode);

    await jest.advanceTimersByTimeAsync(2000);
    expectError();
  });

  test('should skip the check if iframe was detached', async () => {
    // Imitates detached iframe.
    Object.defineProperty(iframeDocument, 'defaultView', { value: null, configurable: true });
    ReactDOM.render(<Test />, mountNode);

    await jest.advanceTimersByTimeAsync(2000);
    expectNoError();
  });
});

test('no check while the document is loading', async () => {
  Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

  render(<Test />);

  await jest.advanceTimersByTimeAsync(2000);
  expectNoError();

  document.defaultView!.dispatchEvent(new Event('load'));

  await jest.advanceTimersByTimeAsync(2000);
  expectError();
});

test('no check if component is instantly unmounted', async () => {
  const { unmount } = render(<Test key={1} />);
  unmount();

  await jest.advanceTimersByTimeAsync(2000);
  expectNoError();
});

test('no check if component is quickly unmounted', async () => {
  const { unmount } = render(<Test key={1} />);

  await jest.advanceTimersByTimeAsync(500);
  unmount();

  await jest.advanceTimersByTimeAsync(2000);
  expectNoError();
});

test('no check if requestIdleCallback is not supported', async () => {
  Object.defineProperty(globalThis, 'requestIdleCallback', { value: undefined, configurable: true });
  render(<Test />);

  await jest.advanceTimersByTimeAsync(2000);
  expectNoError();
});

describe('with loading stylesheets', () => {
  const appCss = document.createElement('link');
  appCss.rel = 'stylesheet';
  appCss.href = 'https://example.test/app.css';
  Object.defineProperty(appCss, 'sheet', { value: {}, configurable: true }); // Imitates loaded CSS

  const libCss = document.createElement('link');
  libCss.rel = 'stylesheet';
  libCss.href = 'https://example.test/lib.css';

  beforeEach(() => {
    document.head.appendChild(appCss);
    document.head.appendChild(libCss);
  });

  afterEach(() => {
    appCss.remove();
    libCss.remove();
  });

  test('waits for stylesheet load', async () => {
    render(<Test />);

    await jest.advanceTimersByTimeAsync(2000);
    expectNoError();

    libCss.dispatchEvent(new Event('load'));

    await jest.advanceTimersByTimeAsync(2000);
    expectError();
  });

  test('waits for stylesheet fail', async () => {
    render(<Test />);

    await jest.advanceTimersByTimeAsync(2000);
    expectNoError();

    libCss.dispatchEvent(new Event('error'));

    await jest.advanceTimersByTimeAsync(2000);
    expectError();
  });

  test('no check if component unmounts until stylesheets are ready', async () => {
    const { unmount } = render(<Test key={1} />);

    await jest.advanceTimersByTimeAsync(2000);

    unmount();

    libCss.dispatchEvent(new Event('load'));

    await jest.advanceTimersByTimeAsync(2000);
    expectNoError();
  });
});
