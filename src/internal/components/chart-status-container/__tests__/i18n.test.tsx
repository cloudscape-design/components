// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../../../lib/components/test-utils/dom';
import TestI18nProvider from '../../../../../lib/components/internal/i18n/testing';
import ChartStatusContainer from '../../../../../lib/components/internal/components/chart-status-container';
import styles from '../../../../../lib/components/internal/components/chart-status-container/styles.css.js';

function renderStatusContainer(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findByClassName(styles.root)!;
}

it('uses loadingText from i18n provider', () => {
  const wrapper = renderStatusContainer(
    <TestI18nProvider messages={{ '[charts]': { loadingText: 'Custom loading' } }}>
      <ChartStatusContainer statusType="loading" />
    </TestI18nProvider>
  );
  expect(wrapper.getElement()).toHaveTextContent('Custom loading');
});

it('uses errorText and recoveryText from i18n provider', () => {
  const wrapper = renderStatusContainer(
    <TestI18nProvider messages={{ '[charts]': { errorText: 'Custom error', recoveryText: 'Custom recovery' } }}>
      <ChartStatusContainer statusType="error" onRecoveryClick={() => {}} />
    </TestI18nProvider>
  );
  expect(wrapper.getElement()).toHaveTextContent('Custom error Custom recovery');
  expect(wrapper.find('a')!.getElement()).toHaveTextContent('Custom recovery');
});

it('does not use recoveryText from i18n provider if onRecoveryClick is not provided', () => {
  const wrapper = renderStatusContainer(
    <TestI18nProvider messages={{ '[charts]': { errorText: 'Custom error', recoveryText: 'Custom recovery' } }}>
      <ChartStatusContainer statusType="error" />
    </TestI18nProvider>
  );
  expect(wrapper.getElement()).toHaveTextContent('Custom error');
});
