// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable simple-import-sort/imports */
import React from 'react';
import { render, waitFor } from '@testing-library/react';

import './widget-old-mocks'; // should be imported before components to activate mocks
import { describeEachAppLayout } from './utils';
import AppLayout from '../../../lib/components/app-layout';
import SplitPanel from '../../../lib/components/split-panel';
import createWrapper from '../../../lib/components/test-utils/selectors';
import { renderedProps } from './widget-old-mocks';

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
