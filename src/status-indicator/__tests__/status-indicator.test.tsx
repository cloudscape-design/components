// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import StatusIndicator from '../../../lib/components/status-indicator';
import createWrapper from '../../../lib/components/test-utils/dom';

import styles from '../../../lib/components/status-indicator/styles.css.js';

describe('StatusIndicator', () => {
  test('Renders the class corresponding to the type', function () {
    const { container } = render(<StatusIndicator type="error">The creation failed</StatusIndicator>);
    const statusIndicatorWrapper = createWrapper(container.parentElement!).findStatusIndicator()!;
    expect(statusIndicatorWrapper.getElement()).toHaveClass(styles['status-error']);
  });
  it('Renders the icon if the type is not "loading"', function () {
    const { container } = render(<StatusIndicator type="stopped">The instance stopped</StatusIndicator>);
    const iconWrapper = createWrapper(container.parentElement!).findIcon()!;
    expect(iconWrapper.getElement()).toBeTruthy();
  });
  it('Renders the spinner for type "loading"', function () {
    const { container } = render(<StatusIndicator type="loading">The resource is loading</StatusIndicator>);
    const spinnerWrapper = createWrapper(container.parentElement!).findSpinner()!;
    expect(spinnerWrapper.getElement()).toBeTruthy();
  });
  it('Sets aria-label to the value of the iconAriaLabel prop', function () {
    const ariaLabel = 'Loading';
    const { container } = render(
      <StatusIndicator type="loading" iconAriaLabel={ariaLabel}>
        The resource is loading
      </StatusIndicator>
    );
    const statusIndicatorWrapper = createWrapper(container.parentElement!).findStatusIndicator()!;
    expect(statusIndicatorWrapper.findByClassName(styles.icon)!.getElement()).toHaveAttribute('aria-label', ariaLabel);
  });
});
