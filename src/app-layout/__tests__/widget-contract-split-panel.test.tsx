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
const isRef = (value: any) => {
  if (!isObject(value)) {
    return false;
  }
  if ('current' in value && Object.keys(value).length === 1) {
    return true;
  }
};

function sanitizeProps(props: any): any {
  if (!isObject(props)) {
    return props;
  }
  if (isRef(props)) {
    return '__REF__';
  }
  if (React.isValidElement(props)) {
    return '__JSX__';
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
jest.mock('../../../lib/components/internal/hooks/use-unique-id', () => {
  let counter = 0;
  return {
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
