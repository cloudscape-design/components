// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';

import { useAnalytics } from '../index';

describe('useAnalytics', () => {
  function App() {
    const analyticsEnabled = useAnalytics();
    return <div data-testid="root">{analyticsEnabled.toString()}</div>;
  }

  test('analytics disabled by default', () => {
    render(<App />);
    expect(screen.getByTestId('root')).toHaveTextContent('false');
  });
});
