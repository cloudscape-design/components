// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { describeEachAppLayout, getGlobalDrawersTestUtils, testDrawer } from './utils';
import AppLayout from '../../../lib/components/app-layout';
import { awsuiPlugins, awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import { computeHorizontalLayout } from '../../../lib/components/app-layout/visual-refresh-toolbar/compute-layout';
import { DrawerConfig } from '../../../lib/components/internal/plugins/controllers/drawers';
import createWrapper from '../../../lib/components/test-utils/dom';
import { KeyCode } from '../../internal/keycode';

beforeEach(() => {
  awsuiPluginsInternal.appLayout.clearRegisteredDrawers();
});

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [1300, () => {}],
}));

jest.mock('../../../lib/components/app-layout/visual-refresh-toolbar/compute-layout', () => {
  return {
    ...jest.requireActual('../../../lib/components/app-layout/visual-refresh-toolbar/compute-layout'),
    computeHorizontalLayout: jest.fn().mockReturnValue({
      splitPanelPosition: 'bottom',
      splitPanelForcedPosition: false,
      sideSplitPanelSize: 0,
      maxSplitPanelSize: 1500,
      maxDrawerSize: 1500,
      maxGlobalDrawersSizes: {},
      totalActiveGlobalDrawersSize: 0,
      resizableSpaceAvailable: 1500,
    }),
  };
});

async function renderComponent(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findAppLayout()!;
  const globalDrawersWrapper = getGlobalDrawersTestUtils(wrapper);
  await delay();
  return {
    wrapper,
    globalDrawersWrapper,
    rerender,
  };
}

function delay() {
  return act(() => new Promise(resolve => setTimeout(resolve)));
}

const drawerDefaults: DrawerConfig = {
  id: 'test',
  ariaLabels: {},
  trigger: { iconSvg: '' },
  mountContent: container => (container.textContent = 'runtime drawer content'),
  unmountContent: () => {},
};

describe('toolbar mode only features', () => {
  describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['desktop'] }, () => {
    test('first opened drawer (global drawer) should be closed when active drawers take up all available space on the page and a third drawer is opened', async () => {
      jest.mocked(computeHorizontalLayout).mockReturnValue({
        splitPanelPosition: 'bottom',
        splitPanelForcedPosition: false,
        sideSplitPanelSize: 0,
        maxSplitPanelSize: 792,
        maxDrawerSize: 792,
        maxGlobalDrawersSizes: {},
        totalActiveGlobalDrawersSize: 0,
        resizableSpaceAvailable: 792,
      });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'local-drawer',
        mountContent: container => (container.textContent = 'local-drawer content'),
      });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-1',
        type: 'global',
        defaultActive: true,
        mountContent: container => (container.textContent = 'global drawer content 1'),
      });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-2',
        type: 'global',
        defaultActive: true,
        mountContent: container => (container.textContent = 'global drawer content 2'),
      });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-3',
        mountContent: container => (container.textContent = 'global drawer content 3'),
      });
      const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      await delay();

      expect(globalDrawersWrapper.findActiveDrawers()!.length).toBe(2);
      expect(globalDrawersWrapper.findActiveDrawers()[0].getElement()).toHaveTextContent('global drawer content 1');
      expect(globalDrawersWrapper.findActiveDrawers()[1].getElement()).toHaveTextContent('global drawer content 2');

      wrapper.findDrawerTriggerById('local-drawer')!.click();

      await waitFor(() => {
        expect(globalDrawersWrapper.findActiveDrawers()!.length).toBe(2);
      });
      expect(globalDrawersWrapper.findActiveDrawers()[0].getElement()).toHaveTextContent('local-drawer');
      expect(globalDrawersWrapper.findActiveDrawers()[1].getElement()).toHaveTextContent('global drawer content 2');
    });

    test('first opened drawer (local drawer) should be closed when active drawers take up all available space on the page and a third drawer is opened', async () => {
      jest.mocked(computeHorizontalLayout).mockReturnValue({
        splitPanelPosition: 'bottom',
        splitPanelForcedPosition: false,
        sideSplitPanelSize: 0,
        maxSplitPanelSize: 792,
        maxDrawerSize: 792,
        maxGlobalDrawersSizes: {},
        totalActiveGlobalDrawersSize: 0,
        resizableSpaceAvailable: 792,
      });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'local-drawer',
        defaultActive: true,
        mountContent: container => (container.textContent = 'local-drawer content'),
      });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-1',
        type: 'global',
        defaultActive: true,
        mountContent: container => (container.textContent = 'global drawer content 1'),
      });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-2',
        type: 'global',
        mountContent: container => (container.textContent = 'global drawer content 2'),
      });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-3',
        mountContent: container => (container.textContent = 'global drawer content 3'),
      });
      const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      await delay();

      expect(globalDrawersWrapper.findActiveDrawers()!.length).toBe(2);
      expect(globalDrawersWrapper.findActiveDrawers()[0].getElement()).toHaveTextContent('local-drawer content');
      expect(globalDrawersWrapper.findActiveDrawers()[1].getElement()).toHaveTextContent('global drawer content 1');

      wrapper.findDrawerTriggerById('global-drawer-2')!.click();

      await delay();

      expect(globalDrawersWrapper.findActiveDrawers()!.length).toBe(2);
      expect(globalDrawersWrapper.findActiveDrawers()[0].getElement()).toHaveTextContent('global drawer content 1');
      expect(globalDrawersWrapper.findActiveDrawers()[1].getElement()).toHaveTextContent('global drawer content 2');
    });

    test('should change global drawer size via keyboard events on slider handle', async () => {
      jest.mocked(computeHorizontalLayout).mockReturnValue({
        splitPanelPosition: 'bottom',
        splitPanelForcedPosition: false,
        sideSplitPanelSize: 0,
        maxSplitPanelSize: 792,
        maxDrawerSize: 792,
        maxGlobalDrawersSizes: {
          'global-drawer-1': 500,
        },
        totalActiveGlobalDrawersSize: 0,
        resizableSpaceAvailable: 792,
      });
      const onDrawerItemResize = jest.fn();
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-1',
        type: 'global',
        resizable: true,
        defaultActive: true,
        mountContent: container => (container.textContent = 'global drawer content 1'),
        onResize: event => onDrawerItemResize(event.detail),
      });

      const { globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);
      globalDrawersWrapper.findResizeHandleByActiveDrawerId('global-drawer-1')!.keydown(KeyCode.left);

      expect(onDrawerItemResize).toHaveBeenCalledWith({ size: expect.any(Number), id: 'global-drawer-1' });
    });
  });
});
