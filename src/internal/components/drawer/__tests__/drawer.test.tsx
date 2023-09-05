// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../../../lib/components/test-utils/dom';
import Drawer from '../../../../../lib/components/internal/components/drawer';
import TestI18nProvider from '../../../../../lib/components/i18n/testing';
import styles from '../../../../../lib/components/internal/components/drawer/styles.css.js';

function renderDrawer(jsx: React.ReactElement) {
  const { container } = render(jsx);
  const wrapper = createWrapper(container).findByClassName(styles.drawer)!;
  const header = wrapper.findByClassName(styles.header);
  const content = wrapper.findByClassName(styles['test-utils-drawer-content']);
  return { wrapper, header, content };
}

test('renders only children by default', () => {
  const { header, content } = renderDrawer(<Drawer>test content</Drawer>);

  expect(header).toBeNull();
  expect(content!.getElement()).toHaveTextContent('test content');
});

test('renders header if it is provided', () => {
  const { header, content } = renderDrawer(<Drawer header="Bla bla">there is a header above</Drawer>);
  expect(header!.getElement()).toHaveTextContent('Bla bla');
  expect(content!.getElement()).toHaveTextContent('there is a header above');
});

test('renders loading state', () => {
  const { wrapper, header, content } = renderDrawer(
    <Drawer loading={true} i18nStrings={{ loadingText: 'Loading content' }} />
  );
  expect(wrapper.findStatusIndicator()!.getElement()).toHaveTextContent('Loading content');
  expect(header).toBeNull();
  expect(content).toBeNull();
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
