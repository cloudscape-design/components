// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Link, { LinkProps } from '../../../lib/components/link';
import InternalLink from '../../../lib/components/link/internal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

function renderLink(props: LinkProps) {
  const renderResult = render(<Link {...props} />);
  return createWrapper(renderResult.container).findLink()!.getElement()!;
}

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Link renders correct analytics metadata', () => {
  test('with href', () => {
    const label = 'Link text';
    const props: LinkProps = {
      children: label,
      href: '#',
    };
    const element = renderLink(props);
    validateComponentNameAndLabels(element, {});
    expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
  });
  test('with secondary variant', () => {
    const label = 'Link text';
    const props: LinkProps = {
      children: label,
      variant: 'secondary',
    };
    const element = renderLink(props);
    validateComponentNameAndLabels(element, {});
    expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
  });
  test('external', () => {
    const label = 'Link text';
    const props: LinkProps = {
      children: label,
      variant: 'secondary',
      external: true,
    };
    const element = renderLink(props);
    validateComponentNameAndLabels(element, {});
    expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
  });
  test('with info variant', () => {
    const label = 'Link text';
    const props: LinkProps = {
      children: label,
      variant: 'info',
    };
    const element = renderLink(props);
    validateComponentNameAndLabels(element, {});
    expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
  });
});

test('Internal Link does not render  metadata', () => {
  const renderResult = render(<InternalLink>Link text</InternalLink>);
  const wrapper = createWrapper(renderResult.container).findLink()!;
  expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toMatchSnapshot();
});
