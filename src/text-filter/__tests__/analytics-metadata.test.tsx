// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import createWrapper from '../../../lib/components/test-utils/dom';
import TextFilter, { TextFilterProps } from '../../../lib/components/text-filter';
import InternalTextFilter from '../../../lib/components/text-filter/internal';

const label = 'text filter label';

const props: TextFilterProps = {
  filteringText: 'whatever',
  onChange: () => {},
  filteringAriaLabel: label,
  filteringClearAriaLabel: 'clear',
};

function renderTextFilter(disabled = false) {
  const renderResult = render(<TextFilter {...props} disabled={disabled} />);
  return createWrapper(renderResult.container).findTextFilter()!;
}

const getMetadata = (disabled = false) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.TextFilter',
          label,
          properties: {
            disabled: disabled ? 'true' : 'false',
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
    expect(getGeneratedAnalyticsMetadata(clearButton)).toEqual({
      action: 'clearInput',
      detail: {
        label: 'clear',
      },
      ...getMetadata(),
    });
  });
  test('when disabled', () => {
    const wrapper = renderTextFilter(true);
    expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata(true));
  });
});

test('Internal TextFilter does not render "component" metadata', () => {
  const renderResult = render(<InternalTextFilter {...props} />);
  const wrapper = createWrapper(renderResult.container).findTextFilter()!;
  expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual({});
});
