// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { Metrics } from '../../metrics';

jest.mock('../../environment', () => ({ PACKAGE_VERSION: '3.0 (HEAD)' }), { virtual: true });

// This test file is separate from metrics.test.ts because we want to test an uninitialized Metrics module
describe('Metrics.initMetrics', () => {
  beforeEach(() => {
    window.AWSC = {
      Clog: {
        log: () => {},
      },
    };
    jest.spyOn(window.AWSC.Clog, 'log');
  });

  test('is required before sending metrics', () => {
    const consoleSpy = jest.spyOn(console, 'error');

    Metrics.sendMetric('name', 0);
    expect(window.AWSC.Clog.log).toHaveBeenCalledTimes(0);
    expect(consoleSpy).toHaveBeenCalled();

    Metrics.initMetrics('default');
    Metrics.sendMetric('name', 0);
    expect(window.AWSC.Clog.log).toHaveBeenCalledTimes(1);
  });
});
