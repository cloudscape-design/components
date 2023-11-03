// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import Drawer from '../../../lib/components/drawer';
import TestI18nProvider from '../../../lib/components/i18n/testing';

function renderDrawer(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findDrawer()!;
}

test('renders only children by default', () => {
  const wrapper = renderDrawer(<Drawer>test content</Drawer>);

  expect(wrapper.findHeader()).toBeNull();
  expect(wrapper.findContent()!.getElement()).toHaveTextContent('test content');
});

test('renders header if it is provided', () => {
  const wrapper = renderDrawer(<Drawer header="Bla bla">there is a header above</Drawer>);
  expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Bla bla');
  expect(wrapper.findContent()!.getElement()).toHaveTextContent('there is a header above');
});

test('renders loading state', () => {
  const { container } = render(<Drawer loading={true} i18nStrings={{ loadingText: 'Loading content' }} />);
  expect(createWrapper(container).findStatusIndicator()!.getElement()).toHaveTextContent('Loading content');
  expect(createWrapper(container).findDrawer()!.findHeader()).toBeNull();
  expect(createWrapper(container).findDrawer()!.findContent()).toBeNull();
});

describe('i18n', () => {
  test('supports providing loadingText from i18n provider', () => {
    const { container } = render(
      <TestI18nProvider messages={{ drawer: { 'i18nStrings.loadingText': 'Custom loading text' } }}>
        <Drawer loading={true} />
      </TestI18nProvider>
    );
    expect(createWrapper(container).findStatusIndicator()!.getElement()).toHaveTextContent('Custom loading text');
  });
});
