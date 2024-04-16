// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '../../../lib/components/app-layout';
import TestI18nProvider from '../../../lib/components/i18n/testing';
import { renderComponent } from './utils';

const i18nMessages = {
  'app-layout': {
    'ariaLabels.navigationClose': 'navigation from provider',
    'ariaLabels.toolsClose': 'tools from provider',
  },
};

test('renders no labels by default', () => {
  const { wrapper } = renderComponent(<AppLayout />);
  expect(wrapper.findNavigationClose().getElement()).not.toHaveAttribute('aria-label');
  expect(wrapper.findToolsClose().getElement()).not.toHaveAttribute('aria-label');
});

test('renders own property labels', () => {
  const { wrapper } = renderComponent(
    <AppLayout ariaLabels={{ navigationClose: 'label for navigation', toolsClose: 'label for tools' }} />
  );
  expect(wrapper.findNavigationClose().getElement()).toHaveAttribute('aria-label', 'label for navigation');
  expect(wrapper.findToolsClose().getElement()).toHaveAttribute('aria-label', 'label for tools');
});

test('renders labels from i18n provider', () => {
  const { wrapper } = renderComponent(
    <TestI18nProvider messages={i18nMessages}>
      <AppLayout />
    </TestI18nProvider>
  );
  expect(wrapper.findNavigationClose().getElement()).toHaveAttribute('aria-label', 'navigation from provider');
  expect(wrapper.findToolsClose().getElement()).toHaveAttribute('aria-label', 'tools from provider');
});

test('supports mixing own and provider labels', () => {
  const { wrapper } = renderComponent(
    <TestI18nProvider messages={i18nMessages}>
      <AppLayout ariaLabels={{ navigationClose: 'label for navigation' }} />
    </TestI18nProvider>
  );
  expect(wrapper.findNavigationClose().getElement()).toHaveAttribute('aria-label', 'label for navigation');
  expect(wrapper.findToolsClose().getElement()).toHaveAttribute('aria-label', 'tools from provider');
});
