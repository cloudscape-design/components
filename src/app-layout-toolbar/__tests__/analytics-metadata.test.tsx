// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';
import { clearVisualRefreshState } from '@cloudscape-design/component-toolkit/internal/testing';

import AppLayoutToolbar, { AppLayoutToolbarProps } from '../../../lib/components/app-layout-toolbar';
import Header from '../../../lib/components/header';
import { awsuiPlugins, awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import SplitPanel from '../../../lib/components/split-panel';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [1300, () => {}],
}));

function renderToolbar(props: AppLayoutToolbarProps = {}) {
  const renderResult = render(<AppLayoutToolbar content={<h1>Label</h1>} {...props} />);
  return createWrapper(renderResult.container).findAppLayoutToolbar()!;
}

const delay = () => act(() => new Promise(resolve => setTimeout(resolve)));

const getMetadata = (label = 'Label') => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.AppLayoutToolbar',
          label,
        },
      },
    ],
  };
  return metadata;
};

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [1300, () => {}],
}));
const globalWithFlags = globalThis as any;

beforeEach(() => {
  globalWithFlags[Symbol.for('awsui-visual-refresh-flag')] = () => true;
  awsuiPluginsInternal.appLayout.clearRegisteredDrawers();
});

afterEach(() => {
  delete globalWithFlags[Symbol.for('awsui-visual-refresh-flag')];
  clearVisualRefreshState();
});

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('AppLayoutToolbar renders correct analytics metadata', () => {
  test('with the header component inside the content', () => {
    const wrapper = renderToolbar({
      content: (
        <Header variant="h1" counter="not included">
          H1 Header
        </Header>
      ),
    });
    validateComponentNameAndLabels(wrapper.getElement(), {});
    expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata('H1 Header'));
  });
  test('with a simple h1 tag inside the content', () => {
    const wrapper = renderToolbar();
    validateComponentNameAndLabels(wrapper.getElement(), {});
    expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual(getMetadata());
  });
  describe('with navigation', () => {
    test('closed', () => {
      const wrapper = renderToolbar({
        navigation: <span>navigation</span>,
        navigationOpen: false,
        onNavigationChange: () => {},
        ariaLabels: {
          navigationToggle: 'toggle navigation',
        },
      });
      const navigationTrigger = wrapper.findNavigationToggle().getElement();
      validateComponentNameAndLabels(navigationTrigger, {});
      expect(getGeneratedAnalyticsMetadata(navigationTrigger)).toEqual({
        action: 'open',
        detail: {
          label: 'toggle navigation',
        },
        ...getMetadata(),
      });
    });
    test('open', () => {
      const wrapper = renderToolbar({
        navigation: <span>navigation</span>,
        navigationOpen: true,
        onNavigationChange: () => {},
        ariaLabels: {
          navigationToggle: 'toggle navigation',
          navigationClose: 'close navigation',
        },
      });
      const navigationTrigger = wrapper.findNavigationToggle().getElement();
      validateComponentNameAndLabels(navigationTrigger, {});
      expect(getGeneratedAnalyticsMetadata(navigationTrigger)).toEqual({
        action: 'close',
        detail: {
          label: 'toggle navigation',
        },
        ...getMetadata(),
      });
      expect(getGeneratedAnalyticsMetadata(wrapper.findNavigationClose().getElement())).toEqual({
        action: 'close',
        detail: {
          label: 'close navigation',
        },
        ...getMetadata(),
      });
    });
  });
  describe('with tools', () => {
    test('closed', () => {
      const wrapper = renderToolbar({
        tools: <span>tools</span>,
        toolsOpen: false,
        onToolsChange: () => {},
        ariaLabels: {
          toolsToggle: 'toggle tools',
        },
      });
      const toolsTrigger = wrapper.findToolsToggle().getElement();
      validateComponentNameAndLabels(toolsTrigger, {});
      expect(getGeneratedAnalyticsMetadata(toolsTrigger)).toEqual({
        action: 'open',
        detail: {
          label: 'toggle tools',
        },
        ...getMetadata(),
      });
    });
    test('open', () => {
      const wrapper = renderToolbar({
        tools: <span>tools</span>,
        toolsOpen: true,
        onToolsChange: () => {},
        ariaLabels: {
          toolsToggle: 'toggle tools',
          toolsClose: 'close tools',
        },
      });
      const toolsTrigger = wrapper.findToolsToggle().getElement();
      validateComponentNameAndLabels(toolsTrigger, {});
      expect(getGeneratedAnalyticsMetadata(toolsTrigger)).toEqual({
        action: 'close',
        detail: {
          label: 'toggle tools',
        },
        ...getMetadata(),
      });
      expect(getGeneratedAnalyticsMetadata(wrapper.findToolsClose().getElement())).toEqual({
        action: 'close',
        detail: {
          label: 'close tools',
        },
        ...getMetadata(),
      });
    });
  });

  describe('with local drawer', () => {
    test('closed', () => {
      const wrapper = renderToolbar({
        drawers: [
          {
            id: 'test-drawer',
            trigger: {
              iconName: 'settings',
            },
            content: 'test content',
            ariaLabels: {
              drawerName: 'test drawer',
              triggerButton: 'toggle test drawer',
              closeButton: 'close test drawer',
            },
          },
        ],
      });
      const drawerTrigger = wrapper.findDrawerTriggerById('test-drawer')!.getElement();
      validateComponentNameAndLabels(drawerTrigger, {});
      expect(getGeneratedAnalyticsMetadata(drawerTrigger)).toEqual({
        action: 'open',
        detail: {
          label: 'toggle test drawer',
        },
        ...getMetadata(),
      });
    });
    test('open', () => {
      const wrapper = renderToolbar({
        drawers: [
          {
            id: 'test-drawer',
            trigger: {
              iconName: 'settings',
            },
            content: 'test content',
            ariaLabels: {
              drawerName: 'test drawer',
              triggerButton: 'toggle test drawer',
              closeButton: 'close test drawer',
            },
          },
          {
            id: 'another-drawer',
            trigger: {
              iconName: 'settings',
            },
            content: 'another test content',
            ariaLabels: {
              drawerName: 'another test drawer',
              triggerButton: 'toggle another test drawer',
              closeButton: 'close anothertest drawer',
            },
          },
        ],
        activeDrawerId: 'test-drawer',
        onDrawerChange: () => {},
      });
      const drawerTrigger = wrapper.findDrawerTriggerById('test-drawer')!.getElement();
      validateComponentNameAndLabels(drawerTrigger, {});
      expect(getGeneratedAnalyticsMetadata(drawerTrigger)).toEqual({
        action: 'close',
        detail: {
          label: 'toggle test drawer',
        },
        ...getMetadata(),
      });
      expect(getGeneratedAnalyticsMetadata(wrapper.findDrawerTriggerById('another-drawer')!.getElement())).toEqual({
        action: 'open',
        detail: {
          label: 'toggle another test drawer',
        },
        ...getMetadata(),
      });
      expect(getGeneratedAnalyticsMetadata(wrapper.findActiveDrawerCloseButton()!.getElement())).toEqual({
        action: 'close',
        detail: {
          label: 'close test drawer',
        },
        ...getMetadata(),
      });
    });
  });
  describe('with global drawer', () => {
    test('closed', async () => {
      awsuiPlugins.appLayout.registerDrawer({
        id: 'global-drawer',
        trigger: {
          iconSvg: '',
        },
        mountContent: container => (container.textContent = 'runtime drawer content'),
        unmountContent: () => {},
        ariaLabels: {
          closeButton: 'close global drawer',
          triggerButton: 'toggle global drawer',
        },
      });
      const wrapper = renderToolbar();
      await delay();
      const drawerTrigger = wrapper.findDrawerTriggerById('global-drawer')!.getElement();
      validateComponentNameAndLabels(drawerTrigger, {});
      expect(getGeneratedAnalyticsMetadata(drawerTrigger)).toEqual({
        action: 'open',
        detail: {
          label: 'toggle global drawer',
        },
        ...getMetadata(),
      });
    });
    test('open', async () => {
      awsuiPlugins.appLayout.registerDrawer({
        id: 'global-drawer',
        trigger: {
          iconSvg: '',
        },
        defaultActive: true,
        mountContent: container => (container.textContent = 'runtime drawer content'),
        unmountContent: () => {},
        ariaLabels: {
          closeButton: 'close global drawer',
          triggerButton: 'toggle global drawer',
        },
      });
      const wrapper = renderToolbar();
      await delay();
      const drawerTrigger = wrapper.findDrawerTriggerById('global-drawer')!.getElement();
      validateComponentNameAndLabels(drawerTrigger, {});
      expect(getGeneratedAnalyticsMetadata(drawerTrigger)).toEqual({
        action: 'close',
        detail: {
          label: 'toggle global drawer',
        },
        ...getMetadata(),
      });
      expect(getGeneratedAnalyticsMetadata(wrapper.findActiveDrawerCloseButton()!.getElement())).toEqual({
        action: 'close',
        detail: {
          label: 'close global drawer',
        },
        ...getMetadata(),
      });
    });
  });

  describe('with split panel', () => {
    test.each(['open', 'close'])('%s', action => {
      const wrapper = renderToolbar({
        splitPanel: (
          <SplitPanel i18nStrings={{ openButtonAriaLabel: 'open split panel' }} header="Split panel header">
            content
          </SplitPanel>
        ),
        splitPanelOpen: action !== 'open',
        onSplitPanelToggle: () => {},
      });
      const splitPanelTrigger = wrapper.findSplitPanelOpenButton()!.getElement();
      validateComponentNameAndLabels(splitPanelTrigger, {});
      expect(getGeneratedAnalyticsMetadata(splitPanelTrigger)).toEqual({
        action,
        detail: {
          label: 'open split panel',
        },
        ...getMetadata(),
      });
    });
  });
});
