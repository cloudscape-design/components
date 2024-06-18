// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';
import { TOOLS_DRAWER_ID, useDrawers } from '../../../lib/components/app-layout/utils/use-drawers';
import { AppLayoutProps } from '../../../lib/components/app-layout';
import { fireNonCancelableEvent } from '../../../lib/components/internal/events';
import { testDrawer } from './utils';
import { awsuiPlugins, awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import { DrawerConfig } from '../../../lib/components/internal/plugins/controllers/drawers';

const someDrawers = [
  { ...testDrawer, id: 'one' },
  { ...testDrawer, id: 'two' },
];

function delay() {
  return act(() => new Promise(resolve => setTimeout(resolve)));
}

function TestComponent({
  ariaLabels,
  tools,
  toolsOpen,
  toolsHide,
  toolsWidth,
  onToolsChange,
  ...rest
}: AppLayoutProps) {
  const { drawers } = useDrawers(rest, ariaLabels, {
    ariaLabels,
    tools,
    toolsOpen,
    toolsHide,
    toolsWidth: toolsWidth ?? 0,
    onToolsToggle: open => fireNonCancelableEvent(onToolsChange, { open }),
  });

  return <ul data-testid="drawers-list">{drawers?.map((drawer, index) => <li key={index}>{drawer.id}</li>)}</ul>;
}

function findDrawerIds() {
  return Array.from(document.querySelectorAll('[data-testid="drawers-list"] > li')).map(item => item.textContent);
}

test('should render own drawers when they are provided', () => {
  render(<TestComponent drawers={someDrawers} />);
  expect(findDrawerIds()).toEqual(['one', 'two']);
});

test('should render nothing by default', () => {
  render(<TestComponent />);
  expect(findDrawerIds()).toEqual([]);
});

test('should render nothing if only tools exist', () => {
  render(<TestComponent tools="testing" />);
  expect(findDrawerIds()).toEqual([]);
});

test('when both tools and drawers are defined, only drawers are used', () => {
  render(<TestComponent drawers={someDrawers} tools="testing" />);
  expect(findDrawerIds()).toEqual(['one', 'two']);
});

describe('when runtime drawers exist', () => {
  beforeEach(() => {
    const runtimeDrawerConfig: DrawerConfig = {
      id: 'test',
      ariaLabels: {},
      trigger: { iconSvg: '' },
      mountContent: () => {},
      unmountContent: () => {},
    };
    awsuiPlugins.appLayout.registerDrawer({ ...runtimeDrawerConfig, id: 'runtime-before', orderPriority: 1 });
    awsuiPlugins.appLayout.registerDrawer({ ...runtimeDrawerConfig, id: 'runtime-after', orderPriority: -1 });
  });

  afterEach(() => {
    awsuiPluginsInternal.appLayout.clearRegisteredDrawers();
  });

  test('should merge with own drawers', async () => {
    render(<TestComponent drawers={someDrawers} />);
    await delay();
    expect(findDrawerIds()).toEqual(['runtime-before', 'one', 'two', 'runtime-after']);
  });

  test('should merge with tools', async () => {
    render(<TestComponent tools="testing" />);
    await delay();
    expect(findDrawerIds()).toEqual([TOOLS_DRAWER_ID, 'runtime-before', 'runtime-after']);
  });

  test('should render standalone', async () => {
    render(<TestComponent toolsHide={true} />);
    await delay();
    expect(findDrawerIds()).toEqual(['runtime-before', 'runtime-after']);
  });
});
