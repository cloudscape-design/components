// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import createWrapper from '../../../lib/components/test-utils/dom/index.js';
import { GeneratedAnalyticsMetadataTextFilterClearInput } from '../../../lib/components/text-filter/analytics-metadata/interfaces.js';
import TextFilter, { TextFilterProps } from '../../../lib/components/text-filter/index.js';
import InternalTextFilter from '../../../lib/components/text-filter/internal.js';

const label = 'text filter label';

const props: Partial<TextFilterProps> = {
  onChange: () => {},
  filteringAriaLabel: label,
  filteringClearAriaLabel: 'clear',
};

function renderTextFilter(disabled = false, filteringText = 'whatever') {
  const renderResult = render(<TextFilter {...props} disabled={disabled} filteringText={filteringText} />);
  return createWrapper(renderResult.container).findTextFilter()!;
}

const getMetadata = (disabled = false, filteringText = 'whatever') => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.TextFilter',
          label,
          properties: {
            disabled: disabled ? 'true' : 'false',
            filteringText,
          },
        },
      },
    ],
  };
  return metadata;
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('TextFilter renders correct analytics metadata', () => {
  test('on clearInput', () => {
    const wrapper = renderTextFilter();
    const clearButton = wrapper.findInput().findClearButton()!.getElement();
    const clearInputMetadata: GeneratedAnalyticsMetadataTextFilterClearInput = {
      action: 'clearInput',
      detail: {
        label: 'clear',
      },
    };
    expect(getGeneratedAnalyticsMetadata(clearButton)).toEqual({
      ...clearInputMetadata,
      ...getMetadata(),
    });
  });
  test('when disabled', () => {
    const wrapper = renderTextFilter(true, '');
    expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata(true, ''));
  });
});

test('Internal TextFilter does not render "component" metadata', () => {
  const renderResult = render(<InternalTextFilter {...props} filteringText="whatever" />);
  const wrapper = createWrapper(renderResult.container).findTextFilter()!;
  expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual({});
});
