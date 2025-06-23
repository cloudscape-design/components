// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { GIT_SHA } from '../../../../../lib/components/internal/environment';
import { checkMissingStyles } from '../../../../../lib/components/internal/hooks/use-base-component/styles-check';
import { metrics } from '../../../../../lib/components/internal/metrics';
import { idleWithDelay } from '../styles-check';

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
    checkMissingStyles();
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(sendPanoramaMetricSpy).not.toHaveBeenCalled();
  });

  test('should detect missing styles', () => {
    checkMissingStyles();
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
    checkMissingStyles();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Missing AWS-UI CSS for theme "default", version "3.0.0 (abc)", and git sha "abc".'
    );
    expect(sendPanoramaMetricSpy).toHaveBeenCalledWith('awsui-missing-css-asset', {});
  });
});

describe('idleWithDelay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // simulate requestIdleCallback for JSDOM
    globalThis.requestIdleCallback = cb => setTimeout(cb, 0);
  });

  afterEach(() => {
    jest.useRealTimers();
    // @ts-expect-error reset to initial state
    globalThis.requestIdleCallback = undefined;
  });

  test('does nothing if requestIdleCallback not supported', () => {
    // @ts-expect-error simulate missing API
    globalThis.requestIdleCallback = undefined;
    const cb = jest.fn();
    expect(requestIdleCallback).toBe(undefined);
    idleWithDelay(cb);
    jest.runAllTimers();
    expect(cb).not.toHaveBeenCalled();
  });

  test('runs callback after a delay', () => {
    const cb = jest.fn();
    idleWithDelay(cb);
    jest.runAllTimers();
    expect(cb).toHaveBeenCalled();
  });

  test('delay can be aborted before setTimeout phase', () => {
    const cb = jest.fn();
    const abort = idleWithDelay(cb);
    abort!();
    jest.runAllTimers();
    expect(cb).not.toHaveBeenCalled();
  });

  test('delay can be aborted before requestIdleCallback phase', () => {
    const cb = jest.fn();
    const abort = idleWithDelay(cb);
    jest.runOnlyPendingTimers(); // flush setTimeout
    abort!();
    jest.runOnlyPendingTimers(); // flush following requestIdleCallback
    expect(cb).not.toHaveBeenCalled();
  });
});
