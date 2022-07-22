// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import ContentLayout, { ContentLayoutProps } from '../../../lib/components/content-layout';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderContentLayout(props: ContentLayoutProps = {}) {
  const renderResult = render(<ContentLayout {...props} />);
  return createWrapper(renderResult.container).findContentLayout()!;
}

describe('ContentLayout component', () => {
  test('It renders the header slot', () => {
    const wrapper = renderContentLayout({
      header: <>Header text</>,
    });

    expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Header text');
    expect(wrapper.findContent()).toBeNull();
  });

  test('It renders the content slot', () => {
    const wrapper = renderContentLayout({
      children: <>Content text</>,
    });

    expect(wrapper.findHeader()).toBeNull();
    expect(wrapper.findContent()!.getElement()).toHaveTextContent('Content text');
  });

  test('It renders the header and content slots', () => {
    const wrapper = renderContentLayout({
      children: <>Content text</>,
      header: <>Header text</>,
    });

    expect(wrapper.findHeader()!.getElement()).toHaveTextContent('Header text');
    expect(wrapper.findContent()!.getElement()).toHaveTextContent('Content text');
  });

  test('It renders nothing', () => {
    const wrapper = renderContentLayout({});

    expect(wrapper.findHeader()).toBeNull();
    expect(wrapper.findContent()).toBeNull();
  });
});
