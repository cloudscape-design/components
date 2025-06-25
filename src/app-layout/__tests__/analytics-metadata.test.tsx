// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import AppLayout from '../../../lib/components/app-layout';
import Header from '../../../lib/components/header';
import { describeEachAppLayout, renderComponent } from './utils';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [1300, () => {}],
}));

const getMetadata = (label = 'Label') => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.AppLayoutToolbar',
          label,
        },
      },
    ],
  };
  return metadata;
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['desktop'] }, () => {
  describe('AppLayoutToolbar renders correct analytics metadata', () => {
    test('with the header component inside the content', () => {
      const { wrapper } = renderComponent(
        <AppLayout
          content={
            <Header variant="h1" counter="not included">
              H1 Header
            </Header>
          }
        />
      );
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata('H1 Header'));
    });
    test('with a simple h1 tag inside the content', () => {
      const { wrapper } = renderComponent(<AppLayout content={<h1>Label</h1>} />);
      expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata());
    });
  });
});
