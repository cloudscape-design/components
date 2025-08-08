// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { describeEachAppLayout } from '../../app-layout/__tests__/utils';
import { renderSplitPanel } from './common';

describe('Split panel: Header slots', () => {
  describeEachAppLayout({ sizes: ['desktop', 'mobile'] }, () => {
    test('renders headerActions', () => {
      const { wrapper } = renderSplitPanel({
        props: { headerActions: <button>Action</button> },
      });
      expect(wrapper!.findHeaderActions()).not.toBeNull();
      expect(wrapper!.findHeaderActions()!.getElement()).toHaveTextContent('Action');
    });

    test('renders headerDescription', () => {
      const { wrapper } = renderSplitPanel({
        props: { headerDescription: 'Header description' },
      });
      expect(wrapper!.findHeaderDescription()).not.toBeNull();
      expect(wrapper!.findHeaderDescription()!.getElement()).toHaveTextContent('Header description');
    });

    test('renders headerInfo', () => {
      const { wrapper } = renderSplitPanel({
        props: { headerInfo: <span>Info</span> },
      });
      expect(wrapper!.findHeaderInfo()).not.toBeNull();
      expect(wrapper!.findHeaderInfo()!.getElement()).toHaveTextContent('Info');
    });

    test('does not render header properties when not provided', () => {
      const { wrapper } = renderSplitPanel();
      expect(wrapper!.findHeaderActions()).toBeNull();
      expect(wrapper!.findHeaderDescription()).toBeNull();
      expect(wrapper!.findHeaderInfo()).toBeNull();
    });
  });
});
