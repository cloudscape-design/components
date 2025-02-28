// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout/index.js';
import { describeEachAppLayout, testDrawer } from './utils.js';

const renderedProps = new Map();
function createWidgetizedComponentMock(Implementation: React.ComponentType) {
  return () => {
    return function Widgetized(props: any) {
      renderedProps.set(Implementation, props);
      return null;
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
