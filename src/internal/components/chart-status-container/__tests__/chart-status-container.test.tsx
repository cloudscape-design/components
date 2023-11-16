// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../../../lib/components/test-utils/dom';
import ChartStatusContainer from '../../../../../lib/components/internal/components/chart-status-container';
import styles from '../../../../../lib/components/internal/components/chart-status-container/styles.css.js';

const commonProps = {
  loadingText: 'Loading',
  errorText: 'Error',
  recoveryText: 'Retry',
  empty: 'Empty',
  noMatch: 'No match',
};

function renderStatusContainer(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  return {
    rerender,
    wrapper: createWrapper(container).findByClassName(styles.root)!,
  };
}

describe('Chart status container', () => {
  it('is always an ARIA live region', () => {
    const { wrapper, rerender } = renderStatusContainer(
      <ChartStatusContainer {...commonProps} isEmpty={true} statusType="finished" />
    );

    (['finished', 'loading', 'error'] as const).forEach(statusType => {
      rerender(<ChartStatusContainer {...commonProps} isEmpty={true} statusType={statusType} />);
      expect(wrapper.getElement()).toHaveAttribute('aria-live', 'polite');
    });
  });

  it('renders empty state', () => {
    const { wrapper } = renderStatusContainer(
      <ChartStatusContainer {...commonProps} isEmpty={true} statusType="finished" />
    );
    expect(wrapper.getElement()).toHaveTextContent('Empty');
  });

  it('renders noMatch state', () => {
    const { wrapper } = renderStatusContainer(
      <ChartStatusContainer {...commonProps} isEmpty={true} isNoMatch={true} statusType="finished" />
    );
    expect(wrapper.getElement()).toHaveTextContent('No match');
  });

  it('renders loading state', () => {
    const { wrapper } = renderStatusContainer(
      <ChartStatusContainer {...commonProps} isEmpty={true} statusType="loading" />
    );
    expect(wrapper.getElement()).toHaveTextContent('Loading');
  });

  it('renders error state', () => {
    const { wrapper } = renderStatusContainer(
      <ChartStatusContainer {...commonProps} isEmpty={true} statusType="error" onRecoveryClick={() => {}} />
    );
    expect(wrapper.getElement()).toHaveTextContent('Error');
    expect(wrapper.getElement()).toHaveTextContent('Retry');
  });

  it('can click on recovery action', () => {
    const cb = jest.fn();
    const { wrapper } = renderStatusContainer(
      <ChartStatusContainer {...commonProps} statusType="error" onRecoveryClick={cb} />
    );

    wrapper.findLink()?.click();
    expect(cb).toBeCalledTimes(1);
  });
});
