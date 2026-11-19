// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import './widget-new-mocks'; // should be imported before components to activate mocks
import AppLayout from '../../../lib/components/app-layout';
import { describeEachAppLayout, testDrawer } from './utils';
import { renderedProps } from './widget-new-mocks';

jest.mock('@cloudscape-design/component-toolkit/internal', () => {
  let counter = 0;
  return {
    ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
    useUniqueId: (prefix: string) => `${prefix}${++counter}`,
  };
});

describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['desktop'] }, () => {
  beforeEach(() => {
    renderedProps.clear();
  });

  test('contract for default use-case', () => {
    render(<AppLayout />);
    expect(renderedProps).toMatchSnapshot();
  });

  test('contract with all slots provided', () => {
    render(
      <AppLayout
        breadcrumbs={<div>breadcrumbs</div>}
        notifications={<div>notifications</div>}
        navigation={<div>navigation</div>}
        tools={<div>tools</div>}
        content={<div>content</div>}
        splitPanel={<div>split panel</div>}
      />
    );
    expect(renderedProps).toMatchSnapshot();
  });

  test('contract with drawers', () => {
    render(<AppLayout activeDrawerId={testDrawer.id} onDrawerChange={() => {}} drawers={[testDrawer]} />);
    expect(renderedProps).toMatchSnapshot();
  });
});
