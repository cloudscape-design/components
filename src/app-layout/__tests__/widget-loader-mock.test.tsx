// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { waitFor } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import { describeWithAppLayoutFeatureFlagEnabled } from '../../internal/widgets/__tests__/utils';
import { describeEachAppLayout, renderComponent } from './utils';

jest.mock('../../../lib/components/internal/widgets/loader-mock', () => {
  // set this flag before the module is instantiated
  (window as any)[Symbol.for('awsui-custom-flags')] = { appLayoutDelayedWidget: true };
  return jest.requireActual('../../../lib/components/internal/widgets/loader-mock');
});

describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['desktop'] }, () => {
  test('renders instantly when widget is not activated', () => {
    const { wrapper } = renderComponent(<AppLayout />);
    expect(wrapper.findNavigation()).toBeTruthy();
    expect(wrapper.findTools()).toBeTruthy();
  });

  describeWithAppLayoutFeatureFlagEnabled(() => {
    test('renders app layout with a delay', async () => {
      const { wrapper } = renderComponent(<AppLayout />);
      expect(wrapper.findNavigation()).toBeFalsy();
      expect(wrapper.findTools()).toBeFalsy();

      await waitFor(() => {
        expect(wrapper.findNavigation()).toBeTruthy();
        expect(wrapper.findTools()).toBeTruthy();
      });
    });
  });
});
