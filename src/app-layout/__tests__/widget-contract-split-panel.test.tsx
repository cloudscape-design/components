// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable simple-import-sort/imports */
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { describeEachAppLayout } from './utils';
import AppLayout from '../../../lib/components/app-layout';
import SplitPanel from '../../../lib/components/split-panel';
import createWrapper from '../../../lib/components/test-utils/selectors';

const isObject = (value: any) => Object.prototype.toString.call(value) === '[object Object]';

// this string
// awsui_root_7nfqu_jksfw_153 awsui_root_1fj9k_z5zo8_5 awsui_has-adaptive-widths-default_7nfqu_jksfw_197
// becomes
// awsui_root awsui_root awsui_has-adaptive-widths-default
function skipHashInClassnames(classNames: string): string {
  return classNames
    .split(' ')
    .map(className => className.replace(/_[a-z0-9]+_[a-z0-9]+_\d+$/i, ''))
    .join(' ');
}

function sanitizeProps(props: any): any {
  if (!isObject(props)) {
    return props;
  }
  if (React.isValidElement(props) || props?.current instanceof Element) {
    return '__JSX__';
  }
  // Now that classNames and styles are provided by the widget API,
  // they need to be included in the check.
  // However, they're regenerated on every build, and the hash part makes the snapshot test flaky.
  // To avoid this, we strip out the hash portion.
  if (props.className) {
    return {
      ...props,
      className: skipHashInClassnames(props.className),
    };
  }
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => {
      return [key, sanitizeProps(value)];
    })
  );
}

const renderedProps = new Map();
function createWidgetizedComponentMock(Implementation: React.ComponentType) {
  return () => {
    return function Widgetized(props: any) {
      renderedProps.set(Implementation, sanitizeProps(props));
      return <Implementation {...(props as any)} />;
    };
  };
}

jest.mock('../../../lib/components/internal/widgets', () => ({
  createWidgetizedComponent: createWidgetizedComponentMock,
}));
jest.mock('@cloudscape-design/component-toolkit/internal', () => {
  let counter = 0;
  return {
    ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
    useUniqueId: (prefix: string) => `${prefix}${++counter}`,
    useRandomId: (prefix: string) => `${prefix}${++counter}`,
  };
});

describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['desktop'] }, () => {
  beforeEach(() => {
    renderedProps.clear();
  });

  test('contract with split panel', async () => {
    render(
      <AppLayout
        splitPanel={
          <SplitPanel header="Split panel header">
            <div>split panel content</div>
          </SplitPanel>
        }
      />
    );
    await waitFor(() => {
      expect(createWrapper().findSplitPanel()).toBeTruthy();
    });
    expect(renderedProps).toMatchSnapshot();
  });

  test('contract with split panel (trigger is hidden)', async () => {
    render(
      <AppLayout
        splitPanel={
          <SplitPanel header="Split panel header" closeBehavior="hide">
            <div>split panel content</div>
          </SplitPanel>
        }
      />
    );
    await waitFor(() => {
      expect(createWrapper().findSplitPanel()).toBeTruthy();
    });
    expect(renderedProps).toMatchSnapshot();
  });
});
