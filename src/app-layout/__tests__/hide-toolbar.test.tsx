// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import { isAppLayoutHideToolbar, PendingGlobalFlags } from '../../../lib/components/app-layout/utils/feature-flags';
import createWrapper from '../../../lib/components/test-utils/dom';
import { describeEachAppLayout, renderComponent } from './utils';

import testUtilStyles from '../../../lib/components/app-layout/test-classes/styles.css.js';

const globalWithFlags = globalThis as any;
const flagsSymbol = Symbol.for('awsui-global-flags');

function setPendingGlobalFlag<FlagName extends keyof PendingGlobalFlags>(
  flagName: FlagName,
  value: PendingGlobalFlags[FlagName] | undefined
) {
  globalWithFlags[flagsSymbol] = globalWithFlags[flagsSymbol] ?? {};
  if (value === undefined) {
    delete globalWithFlags[flagsSymbol][flagName];
  } else {
    globalWithFlags[flagsSymbol][flagName] = value;
  }
}

afterEach(() => setPendingGlobalFlag('appLayoutHideToolbar', undefined));

describe('isAppLayoutHideToolbar', () => {
  test('returns false when the flag is not set', () => {
    expect(isAppLayoutHideToolbar()).toBe(false);
  });

  test('returns false when the flag is false', () => {
    setPendingGlobalFlag('appLayoutHideToolbar', false);
    expect(isAppLayoutHideToolbar()).toBe(false);
  });

  test('returns true when the flag is true', () => {
    setPendingGlobalFlag('appLayoutHideToolbar', true);
    expect(isAppLayoutHideToolbar()).toBe(true);
  });
});

describeEachAppLayout({ themes: ['refresh-toolbar'] }, () => {
  test('renders the toolbar when the flag is not set', () => {
    const { wrapper } = renderComponent(<AppLayout navigation="nav" />);
    expect(wrapper.findToolbar()).toBeTruthy();
  });

  test('does not render the toolbar when the flag is set', () => {
    setPendingGlobalFlag('appLayoutHideToolbar', true);
    const { wrapper } = renderComponent(<AppLayout navigation="nav" tools="tools" />);
    expect(wrapper.findToolbar()).toBeFalsy();
    expect(wrapper.findNavigationToggle()).toBeFalsy();
    expect(wrapper.findToolsToggle()).toBeFalsy();
  });

  test('keeps rendering the content and open navigation when the flag is set', () => {
    setPendingGlobalFlag('appLayoutHideToolbar', true);
    const { wrapper } = renderComponent(
      <AppLayout navigation="nav" navigationOpen={true} onNavigationChange={() => {}} content="main content" />
    );
    expect(wrapper.findToolbar()).toBeFalsy();
    expect(wrapper.findContentRegion().getElement()).toHaveTextContent('main content');
    expect(wrapper.findNavigation().getElement()).toHaveTextContent('nav');
  });

  test('keeps rendering an open tools drawer when the flag is set', () => {
    setPendingGlobalFlag('appLayoutHideToolbar', true);
    const { wrapper } = renderComponent(<AppLayout tools="tools content" toolsOpen={true} onToolsChange={() => {}} />);
    expect(wrapper.findToolbar()).toBeFalsy();
    expect(wrapper.findTools().getElement()).toHaveTextContent('tools content');
  });

  test('reads the flag on every render', () => {
    const { wrapper, rerender } = renderComponent(<AppLayout navigation="nav" />);
    expect(wrapper.findToolbar()).toBeTruthy();

    setPendingGlobalFlag('appLayoutHideToolbar', true);
    rerender(<AppLayout navigation="nav" content="hidden" />);
    expect(wrapper.findToolbar()).toBeFalsy();

    setPendingGlobalFlag('appLayoutHideToolbar', undefined);
    rerender(<AppLayout navigation="nav" content="visible" />);
    expect(wrapper.findToolbar()).toBeTruthy();
  });

  test('does not render a toolbar for nested layouts when the flag is set', async () => {
    setPendingGlobalFlag('appLayoutHideToolbar', true);
    render(
      <AppLayout
        {...({ __disableRuntimeDrawers: true } as any)}
        navigation="outer nav"
        content={
          <AppLayout {...({ __disableRuntimeDrawers: true } as any)} navigationHide={true} tools="inner tools" />
        }
      />
    );
    // let the layouts negotiate which one owns the toolbar
    await act(() => new Promise(resolve => setTimeout(resolve, 10)));
    expect(createWrapper().findAllByClassName(testUtilStyles.toolbar)).toHaveLength(0);
  });
});

describeEachAppLayout({ themes: ['classic', 'refresh'] }, () => {
  test('does not affect non-toolbar designs', () => {
    setPendingGlobalFlag('appLayoutHideToolbar', true);
    const { wrapper } = renderComponent(<AppLayout navigation="nav" content="main content" />);
    expect(wrapper.findNavigation().getElement()).toHaveTextContent('nav');
    expect(wrapper.findContentRegion().getElement()).toHaveTextContent('main content');
  });
});
