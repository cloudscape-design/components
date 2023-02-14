// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { getAllComponents, requireComponent } from './utils';
import { getRequiredPropsForComponent } from './required-props-for-components';
import {
  MetricsTestHelper,
  formatVersionForMetricName,
  formatMajorVersionForMetricDetail,
} from '../../lib/components/internal/metrics';
import { THEME, PACKAGE_VERSION } from '../../lib/components/internal/environment';
import { Checkbox, Button } from '../../lib/components';

declare global {
  interface Window {
    AWSC?: any;
    AWSUI_METRIC_ORIGIN?: string;
  }
}

const verifyMetricsAreLoggedOnlyOnce = () => {
  const callCount = window.AWSC.Clog.log.mock.calls.length;
  const metricNames = window.AWSC.Clog.log.mock.calls.map((call: any) => {
    return call[0];
  });
  expect(new Set(metricNames).size === callCount).toBeTruthy();
};

const getExpectedMetricName = (lowerCaseComponentName: string) => {
  return `awsui_${lowerCaseComponentName}_${formatVersionForMetricName(THEME, PACKAGE_VERSION)}`;
};

describe('useTelemetry hook is used in all public components', () => {
  const componentRoot = document.createElement('div');
  document.body.appendChild(componentRoot);

  const runtimeProps: any = {
    modal: {
      modalRoot: componentRoot,
    },
  };

  window.AWSC = {
    Clog: {
      log: () => {},
    },
  };

  beforeEach(() => {
    jest.spyOn(window.AWSC.Clog, 'log');
  });

  afterEach(() => {
    jest.clearAllMocks();
    new MetricsTestHelper().resetOneTimeMetricsCache();
  });

  describe('emit the metrics and viewport dimensions for component usage', () => {
    getAllComponents().forEach(componentName => {
      const lowerCaseComponentName = componentName.replace(/-/g, '').toLowerCase();
      const { default: Component } = requireComponent(componentName);
      const props = { ...getRequiredPropsForComponent(componentName), ...runtimeProps[componentName] };

      test(`component ${componentName}`, () => {
        const component = <Component {...props} className="example" />;
        const { rerender } = render(component, { container: componentRoot });
        const expectedMetricName = getExpectedMetricName(lowerCaseComponentName);

        // on the first render the metrics got sent
        const callCount = window.AWSC.Clog.log.mock.calls.length;
        // the order is defined in the telemetry hook
        expect(window.AWSC.Clog.log).toHaveBeenNthCalledWith(1, 'awsui-viewport-width', 1024, undefined);
        expect(window.AWSC.Clog.log).toHaveBeenNthCalledWith(2, 'awsui-viewport-height', 768, undefined);
        expect(window.AWSC.Clog.log).toHaveBeenNthCalledWith(
          3,
          'awsui_components_d30',
          1,
          expect.stringContaining('loaded')
        );
        expect(window.AWSC.Clog.log).toHaveBeenLastCalledWith(
          expectedMetricName,
          1,
          JSON.stringify({
            o: 'main',
            s: lowerCaseComponentName,
            t: 'default',
            a: 'used',
            f: 'react',
            v: formatMajorVersionForMetricDetail(PACKAGE_VERSION),
          })
        );

        verifyMetricsAreLoggedOnlyOnce();

        // on the second render no logs should get sent
        rerender(component);
        expect(window.AWSC.Clog.log).toHaveBeenCalledTimes(callCount);
      });
    });

    test('one-time metrics (viewport, component usage) do not repeat', () => {
      render(<Checkbox checked={true} />);
      window.AWSC.Clog.log.mockClear();
      render(<Button />);
      expect(window.AWSC.Clog.log).toHaveBeenCalledTimes(1);
      expect(window.AWSC.Clog.log).toHaveBeenCalledWith(
        getExpectedMetricName('button'),
        1,
        JSON.stringify({
          o: 'main',
          s: 'button',
          t: 'default',
          a: 'used',
          f: 'react',
          v: formatMajorVersionForMetricDetail(PACKAGE_VERSION),
        })
      );
    });

    test('supports custom origin', () => {
      window.AWSUI_METRIC_ORIGIN = 'custom';
      render(<Button />);
      expect(window.AWSC.Clog.log).toHaveBeenCalledWith(
        getExpectedMetricName('button'),
        1,
        JSON.stringify({
          o: 'custom',
          s: 'button',
          t: 'default',
          a: 'used',
          f: 'react',
          v: formatMajorVersionForMetricDetail(PACKAGE_VERSION),
        })
      );
    });
  });
});
