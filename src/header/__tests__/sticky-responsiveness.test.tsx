// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import { useVisualRefresh } from '../../../lib/components/internal/hooks/use-visual-mode';
import { StickyHeaderContext } from '../../../lib/components/container/use-sticky-header';
import Header from '../../../lib/components/header';
import styles from '../../../lib/components/header/styles.css.js';

jest.mock('../../../lib/components/internal/hooks/use-visual-mode', () => ({
  useVisualRefresh: jest.fn().mockReturnValue(false),
}));

function renderHeader(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container).findHeader()!;
}

test('renders constant header without visual refresh', () => {
  const wrapper = renderHeader(
    <StickyHeaderContext.Provider value={{ isStuck: false }}>
      <Header variant="awsui-h1-sticky">test</Header>
    </StickyHeaderContext.Provider>
  );
  expect(wrapper.getElement()).toHaveClass(styles['root-variant-h2']);
  expect(wrapper.find('h1')).toBeTruthy();
});

describe('in visual refresh', () => {
  beforeEach(() => {
    (useVisualRefresh as jest.Mock).mockReturnValue(true);
  });
  afterEach(() => {
    (useVisualRefresh as jest.Mock).mockReturnValue(false);
  });

  test('renders h1 variant when header is not stuck', () => {
    const wrapper = renderHeader(
      <StickyHeaderContext.Provider value={{ isStuck: false }}>
        <Header variant="awsui-h1-sticky">test</Header>
      </StickyHeaderContext.Provider>
    );
    expect(wrapper.findHeadingText().getElement()).toHaveClass(styles['heading-text-variant-h1']);
    expect(wrapper.find('h1')).toBeTruthy();
  });
  test('renders h2 variant when header is stuck', () => {
    const wrapper = renderHeader(
      <StickyHeaderContext.Provider value={{ isStuck: true }}>
        <Header variant="awsui-h1-sticky">test</Header>
      </StickyHeaderContext.Provider>
    );
    expect(wrapper.findHeadingText().getElement()).toHaveClass(styles['heading-text-variant-h2']);
    expect(wrapper.find('h1')).toBeTruthy();
  });

  test('renders other variants as-is in visual refresh', () => {
    const wrapper = renderHeader(<Header variant="h1">test</Header>);
    expect(wrapper.findHeadingText().getElement()).toHaveClass(styles['heading-text-variant-h1']);
    expect(wrapper.find('h1')).toBeTruthy();
  });
});
