// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { getAllComponents, requireComponent } from './utils';
import { getRequiredPropsForComponent } from './required-props-for-components';

declare global {
  interface Window {
    AWSC?: any;
    AWSUI_METRIC_ORIGIN?: string;
  }
}

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

  getAllComponents().forEach(componentName => {
    const { default: Component } = requireComponent(componentName);
    const props = { ...getRequiredPropsForComponent(componentName), ...runtimeProps[componentName] };

    test(`component ${componentName}`, () => {
      const component = <Component {...props} />;
      const { rerender } = render(component, { container: componentRoot });

      // On the first render the metrics got sent.
      const callCount = window.AWSC.Clog.log.mock.calls.length;
      expect(callCount).toBeGreaterThan(0);

      // On the second render no logs should get sent.
      rerender(component);
      expect(window.AWSC.Clog.log).toHaveBeenCalledTimes(callCount);
    });
  });
});
