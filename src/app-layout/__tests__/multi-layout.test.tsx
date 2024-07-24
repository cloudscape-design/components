// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable simple-import-sort/imports */
import React from 'react';
import { act, cleanup, render } from '@testing-library/react';

import { clearMessageCache } from '@cloudscape-design/component-toolkit/internal';

import { describeEachAppLayout, isDrawerClosed, testDrawer } from './utils';

import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import { awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import SplitPanel from '../../../lib/components/split-panel';
import createWrapper, { AppLayoutWrapper } from '../../../lib/components/test-utils/dom';

import appLayoutToolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/styles.css.js';

function findToolbar(wrapper: AppLayoutWrapper) {
  return wrapper.findByClassName(appLayoutToolbarStyles['universal-toolbar']);
}

function findAllToolbars() {
  return createWrapper().findAllByClassName(appLayoutToolbarStyles['universal-toolbar']);
}

function delay() {
  // longer than a setTimeout(..., 0) used inside the implementation
  return act(() => new Promise(resolve => setTimeout(resolve, 10)));
}

const defaultAppLayoutProps = {
  // Suppress warning in runtime drawers API
  __disableRuntimeDrawers: true,
  // use this content type to make navigation closed initially
  contentType: 'form',
} as AppLayoutProps;

async function renderAsync(jsx: React.ReactElement) {
  render(jsx);
  await delay();
  const firstLayout = createWrapper().find('[data-testid="first"]')!.findAppLayout()!;
  const secondLayout = createWrapper().find('[data-testid="second"]')!.findAppLayout()!;
  expect(findAllToolbars()).toHaveLength(1);
  expect(findToolbar(secondLayout)).toBeTruthy();
  return { firstLayout, secondLayout };
}

describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['desktop'] }, () => {
  afterEach(() => {
    // force unmount for all rendered component to run clean state assertions
    cleanup();
    const state = awsuiPluginsInternal.appLayoutWidget.getStateForTesting();
    expect(state).toEqual({
      registrations: [],
    });
  });

  test('merges navigation from two instances', async () => {
    const { firstLayout, secondLayout } = await renderAsync(
      <AppLayout
        {...defaultAppLayoutProps}
        data-testid="first"
        navigation="testing nav"
        toolsHide={true}
        content={
          <AppLayout {...defaultAppLayoutProps} data-testid="second" navigationHide={true} tools="testing tools" />
        }
      />
    );
    expect(isDrawerClosed(firstLayout.findNavigation())).toEqual(true);
    expect(secondLayout.findNavigation()).toBeFalsy();

    secondLayout.findNavigationToggle().click();
    expect(isDrawerClosed(firstLayout.findNavigation())).toEqual(false);
  });

  test('merges tools from two instances', async () => {
    const { firstLayout, secondLayout } = await renderAsync(
      <AppLayout
        {...defaultAppLayoutProps}
        data-testid="first"
        toolsHide={true}
        content={<AppLayout data-testid="second" tools="testing tools" />}
      />
    );
    expect(firstLayout.findTools()).toBeFalsy();
    expect(secondLayout.findTools()).toBeFalsy();

    secondLayout.findToolsToggle().click();
    expect(secondLayout.findTools()).toBeTruthy();
  });

  test('merges split panel from two instances', async () => {
    const { firstLayout, secondLayout } = await renderAsync(
      <AppLayout
        {...defaultAppLayoutProps}
        data-testid="first"
        toolsHide={true}
        splitPanel={<SplitPanel header="Testing">Dummy content</SplitPanel>}
        content={<AppLayout data-testid="second" />}
      />
    );
    expect(firstLayout.findSplitPanel()).toBeTruthy();
    expect(secondLayout.findSplitPanel()).toBeFalsy();
    expect(secondLayout.findSplitPanelOpenButton()).toBeTruthy();
    expect(firstLayout.findSplitPanel()!.findOpenPanelBottom()).toBeFalsy();

    secondLayout.findSplitPanelOpenButton()!.click();
    expect(firstLayout.findSplitPanel()!.findOpenPanelBottom()).toBeTruthy();
  });

  test('merges props across multiple react roots', async () => {
    render(<AppLayout {...defaultAppLayoutProps} data-testid="first" navigation="testing nav" toolsHide={true} />);
    render(<AppLayout {...defaultAppLayoutProps} data-testid="second" navigationHide={true} />);

    await delay();

    const firstLayout = createWrapper().find('[data-testid="first"]')!.findAppLayout()!;
    const secondLayout = createWrapper().find('[data-testid="second"]')!.findAppLayout()!;
    expect(firstLayout.findNavigationToggle()).toBeFalsy();
    expect(secondLayout.findNavigationToggle()).toBeTruthy();
  });

  test('merges props from multiple instances', async () => {
    render(
      <AppLayout
        {...defaultAppLayoutProps}
        data-testid="first"
        navigation="testing nav"
        toolsHide={true}
        content={
          <AppLayout
            {...defaultAppLayoutProps}
            data-testid="second"
            navigationHide={true}
            tools="testing tools"
            content={
              <AppLayout
                {...defaultAppLayoutProps}
                data-testid="third"
                navigationHide={true}
                toolsHide={true}
                splitPanel={<SplitPanel header="Testing">Dummy content</SplitPanel>}
              />
            }
          />
        }
      />
    );
    await delay();

    const thirdLayout = createWrapper().find('[data-testid="third"]')!.findAppLayout()!;
    expect(findToolbar(thirdLayout)).toBeTruthy();
    expect(findAllToolbars()).toHaveLength(1);
    expect(thirdLayout.findNavigationToggle()).toBeTruthy();
    expect(thirdLayout.findToolsToggle()).toBeTruthy();
    expect(thirdLayout.findSplitPanelOpenButton()).toBeTruthy();
  });

  test('allows manual deduplication control', async () => {
    render(
      <AppLayout
        {...defaultAppLayoutProps}
        {...{ __forceDeduplicationType: 'primary' }}
        data-testid="first"
        navigationHide={true}
        toolsHide={true}
        content={
          <AppLayout
            {...defaultAppLayoutProps}
            {...{ __forceDeduplicationType: 'secondary' }}
            data-testid="second"
            navigation="testing nav"
          />
        }
      />
    );
    await delay();

    const firstLayout = createWrapper().find('[data-testid="first"]')!.findAppLayout()!;
    const secondLayout = createWrapper().find('[data-testid="second"]')!.findAppLayout()!;
    expect(findToolbar(firstLayout)).toBeTruthy();
    expect(findToolbar(secondLayout)).toBeFalsy();
    expect(findAllToolbars()).toHaveLength(1);
    expect(firstLayout.findNavigationToggle()).toBeTruthy();
    expect(secondLayout.findNavigationToggle()).toBeFalsy();
  });

  describe('warnings', () => {
    beforeEach(() => {
      jest.spyOn(console, 'warn').mockImplementation();
    });
    afterEach(() => {
      clearMessageCache();
      jest.restoreAllMocks();
    });

    test('ignores duplicate properties and prints a warning', async () => {
      const { secondLayout } = await renderAsync(
        <AppLayout
          {...defaultAppLayoutProps}
          data-testid="first"
          navigation="first navigation"
          toolsHide={true}
          content={<AppLayout {...defaultAppLayoutProps} data-testid="second" navigation="second navigation" />}
        />
      );
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Another app layout instance on this page already defines navigation property')
      );
      secondLayout.findNavigationToggle().click();
      expect(isDrawerClosed(secondLayout.findNavigation())).toEqual(false);
    });

    test('deduplicates tools and drawers in a single entity', async () => {
      const { secondLayout } = await renderAsync(
        <AppLayout
          {...defaultAppLayoutProps}
          data-testid="first"
          drawers={[testDrawer]}
          content={<AppLayout {...defaultAppLayoutProps} data-testid="second" tools="second tools" />}
        />
      );
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Another app layout instance on this page already defines tools or drawers property')
      );
      expect(secondLayout.findDrawersTriggers()).toHaveLength(0);
      expect(secondLayout.findTools()).toBeFalsy();

      secondLayout.findToolsToggle().click();
      expect(secondLayout.findTools()).toBeTruthy();
    });
  });
});
