// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Input from '../../../lib/components/input';
import createWrapper from '../../../lib/components/test-utils/dom';

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Input renders correct analytics metadata', () => {
  test('on the clear button', () => {
    const renderResult = render(<Input value="value" onChange={() => {}} type="search" clearAriaLabel="clear" />);
    const clearInputButton = createWrapper(renderResult.container).findInput()!.findClearButton()!.getElement();
    expect(getGeneratedAnalyticsMetadata(clearInputButton)).toEqual({
      action: 'clearInput',
      detail: {
        label: 'clear',
      },
    });
  });
});
