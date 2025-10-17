// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import AppLayout from '../../../lib/components/app-layout';
import { metrics } from '../../../lib/components/internal/metrics';
import * as awsuiWidgetPlugins from '../../../lib/components/internal/plugins/widget';
import * as awsuiWidgetInternal from '../../../lib/components/internal/plugins/widget/core';
import { DrawerPayload } from '../../../lib/components/internal/plugins/widget/interfaces';
import createWrapper from '../../../lib/components/test-utils/dom';
import { describeEachAppLayout, getGlobalDrawersTestUtils } from './utils';

const drawerDefaults: DrawerPayload = {
  id: 'test',
  ariaLabels: {},
  trigger: { customIcon: 'custom icon' },
  mountContent: container => (container.textContent = 'widgetized drawer content'),
  unmountContent: () => {},
};

beforeEach(() => {
  awsuiWidgetInternal.clearInitialMessages();
  jest.resetAllMocks();
});

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [1300, () => {}],
}));

function renderComponent(jsx: React.ReactElement) {
  const { container, rerender, ...rest } = render(jsx);
  const wrapper = createWrapper(container).findAppLayout()!;
  const globalDrawersWrapper = getGlobalDrawersTestUtils(wrapper);
  return {
    wrapper,
    globalDrawersWrapper,
    rerender,
    ...rest,
  };
}

describeEachAppLayout({ themes: ['refresh-toolbar'] }, ({ size }) => {
  test('renders ai drawer when registered', () => {
    awsuiWidgetPlugins.registerLeftDrawer(drawerDefaults);
    const { globalDrawersWrapper } = renderComponent(<AppLayout />);

    expect(globalDrawersWrapper.findDrawerById(drawerDefaults.id)).toBeFalsy();
    expect(globalDrawersWrapper.findAiDrawerTrigger()).toBeTruthy();

    globalDrawersWrapper.findAiDrawerTrigger()!.click();

    expect(globalDrawersWrapper.findDrawerById(drawerDefaults.id)!.isActive()).toBe(true);
  });

  test('isAppLayoutReady returns true when app layout is ready', async () => {
    expect(awsuiWidgetPlugins.isAppLayoutReady()).toBe(false);
    const { rerender } = renderComponent(<AppLayout />);

    expect(awsuiWidgetPlugins.isAppLayoutReady()).toBe(true);
    await expect(awsuiWidgetPlugins.whenAppLayoutReady()).resolves.toBe(undefined);

    rerender(<></>);

    expect(awsuiWidgetPlugins.isAppLayoutReady()).toBe(false);
  });

  test('whenAppLayoutReady resolves when app layout is ready', async () => {
    const readyPromise = awsuiWidgetPlugins.whenAppLayoutReady();

    let isResolved = false;
    readyPromise.then(() => {
      isResolved = true;
    });

    expect(isResolved).toBe(false);

    const { rerender } = renderComponent(<AppLayout />);

    rerender(<></>);

    await readyPromise;
    expect(isResolved).toBe(true);
  });

  test('adds ai drawer to an already rendered component', () => {
    const { globalDrawersWrapper } = renderComponent(<AppLayout />);
    expect(globalDrawersWrapper.findAiDrawerTrigger()).toBeFalsy();

    act(() => awsuiWidgetPlugins.registerLeftDrawer(drawerDefaults));
    expect(globalDrawersWrapper.findAiDrawerTrigger()).toBeTruthy();
  });

  test('should render custom header in global-ai drawer', () => {
    awsuiWidgetPlugins.registerLeftDrawer({
      ...drawerDefaults,
      mountHeader: container => {
        container.innerHTML = 'custom header';
      },
      unmountHeader: () => {},
    });
    const { globalDrawersWrapper } = renderComponent(<AppLayout />);

    globalDrawersWrapper.findAiDrawerTrigger()!.click();
    expect(globalDrawersWrapper.findDrawerById(drawerDefaults.id)!.getElement()).toHaveTextContent('custom header');
  });

  test('can update drawer config dynamically for left drawer', () => {
    awsuiWidgetPlugins.registerLeftDrawer(drawerDefaults);
    const { globalDrawersWrapper } = renderComponent(<AppLayout />);

    expect(globalDrawersWrapper.findAiDrawerTrigger()!.getElement()).not.toHaveAttribute('aria-label');
    act(() =>
      awsuiWidgetPlugins.updateDrawer({
        type: 'updateDrawerConfig',
        payload: { id: drawerDefaults.id, ariaLabels: { triggerButton: 'trigger button label' } },
      })
    );

    expect(globalDrawersWrapper.findAiDrawerTrigger()!.getElement()).toHaveAttribute(
      'aria-label',
      'trigger button label'
    );
  });

  test('can update drawer config dynamically for bottom drawer', () => {
    awsuiWidgetPlugins.registerBottomDrawer(drawerDefaults);
    const { wrapper } = renderComponent(<AppLayout />);

    expect(wrapper.findDrawerTriggerById(drawerDefaults.id)!.getElement()).not.toHaveAttribute('aria-label');
    act(() =>
      awsuiWidgetPlugins.updateDrawer({
        type: 'updateDrawerConfig',
        payload: { id: drawerDefaults.id, ariaLabels: { triggerButton: 'trigger button label' } },
      })
    );

    expect(wrapper.findDrawerTriggerById(drawerDefaults.id)!.getElement()).toHaveAttribute(
      'aria-label',
      'trigger button label'
    );
  });

  test('should open global ai drawer by default when defaultActive is set', () => {
    awsuiWidgetPlugins.registerLeftDrawer({
      ...drawerDefaults,
      defaultActive: true,
    });

    const { globalDrawersWrapper } = renderComponent(<AppLayout />);

    expect(globalDrawersWrapper.findDrawerById(drawerDefaults.id)!.isActive()).toBe(true);
  });

  test('should open global ai drawer by default if it is dynamically registered', () => {
    const { globalDrawersWrapper } = renderComponent(<AppLayout />);

    awsuiWidgetPlugins.registerLeftDrawer({
      ...drawerDefaults,
      defaultActive: true,
    });

    expect(globalDrawersWrapper.findDrawerById(drawerDefaults.id)!.isActive()).toBe(true);
  });

  test('should open global ai drawer via API', () => {
    awsuiWidgetPlugins.registerLeftDrawer(drawerDefaults);

    const { globalDrawersWrapper } = renderComponent(<AppLayout />);
    expect(globalDrawersWrapper.findDrawerById(drawerDefaults.id)).toBeFalsy();

    act(() => awsuiWidgetPlugins.updateDrawer({ type: 'openDrawer', payload: { id: drawerDefaults.id } }));

    expect(globalDrawersWrapper.findDrawerById(drawerDefaults.id)!.isActive()).toBe(true);
  });

  test('should enter and exit focus mode in global ai drawer via API', () => {
    awsuiWidgetPlugins.registerLeftDrawer({ ...drawerDefaults, isExpandable: true, defaultActive: true });

    const { globalDrawersWrapper } = renderComponent(<AppLayout />);
    expect(globalDrawersWrapper.findDrawerById(drawerDefaults.id)).toBeTruthy();

    act(() => awsuiWidgetPlugins.updateDrawer({ type: 'expandDrawer', payload: { id: drawerDefaults.id } }));

    expect(globalDrawersWrapper.findDrawerById(drawerDefaults.id)!.isDrawerInExpandedMode()).toBe(true);
    expect(globalDrawersWrapper.isLayoutInDrawerExpandedMode()).toBe(true);

    act(() => awsuiWidgetPlugins.updateDrawer({ type: 'exitExpandedMode' }));

    expect(globalDrawersWrapper.findDrawerById(drawerDefaults.id)!.isDrawerInExpandedMode()).toBe(false);
    expect(globalDrawersWrapper.isLayoutInDrawerExpandedMode()).toBe(false);
  });

  test('onResize functionality', () => {
    const onResize = jest.fn();
    awsuiWidgetPlugins.registerLeftDrawer({
      ...drawerDefaults,
      resizable: true,
      onResize: event => onResize(event.detail),
    });
    const { wrapper, globalDrawersWrapper } = renderComponent(<AppLayout />);
    globalDrawersWrapper.findAiDrawerTrigger()!.click();

    if (size === 'mobile') {
      expect(wrapper.findActiveDrawerResizeHandle()).toBeFalsy();
    } else {
      const handle = wrapper.findActiveDrawerResizeHandle()!;
      handle.fireEvent(new MouseEvent('pointerdown', { bubbles: true }));
      handle.fireEvent(new MouseEvent('pointermove', { bubbles: true }));
      handle.fireEvent(new MouseEvent('pointerup', { bubbles: true }));

      expect(onResize).toHaveBeenCalledWith({ size: expect.any(Number), id: drawerDefaults.id });
    }
  });

  test.each(['standard', 'custom', 'custom-invalid'] as const)(
    'should exit focus mode by clicking on a %s exit button in the AI global drawer',
    type => {
      awsuiWidgetPlugins.registerLeftDrawer({
        ...drawerDefaults,
        ariaLabels: {
          exitExpandedModeButton: 'exitExpandedModeButton',
        },
        isExpandable: true,
        ...(type === 'custom' && {
          exitExpandedModeTrigger: {
            customIcon: `
              <svg width="94" height="24" viewBox="0 0 94 24" fill="none" focusable="false" aria-hidden="true"></svg>
            `,
          },
        }),
        ...(type === 'custom-invalid' && {
          exitExpandedModeTrigger: {},
        }),
      });
      const { globalDrawersWrapper } = renderComponent(<AppLayout />);

      globalDrawersWrapper.findAiDrawerTrigger()!.click();
      if (size === 'mobile') {
        expect(globalDrawersWrapper.findExpandedModeButtonByActiveDrawerId(drawerDefaults.id)).toBeFalsy();
      } else {
        createWrapper().findButtonGroup()!.findButtonById('expand')!.click();
        expect(globalDrawersWrapper.findDrawerById(drawerDefaults.id)!.isDrawerInExpandedMode()).toBe(true);
        expect(globalDrawersWrapper.isLayoutInDrawerExpandedMode()).toBe(true);
        globalDrawersWrapper.findLeaveExpandedModeButtonInAIDrawer()!.click();
        expect(globalDrawersWrapper.isLayoutInDrawerExpandedMode()).toBe(false);
      }
    }
  );

  describe('metrics', () => {
    let sendPanoramaMetricSpy: jest.SpyInstance;
    beforeEach(() => {
      sendPanoramaMetricSpy = jest.spyOn(metrics, 'sendOpsMetricObject').mockImplementation(() => {});
    });

    test('should report ops metric when unknown id is provided', () => {
      awsuiWidgetPlugins.registerLeftDrawer(drawerDefaults);
      renderComponent(<AppLayout />);

      act(() => awsuiWidgetPlugins.updateDrawer({ type: 'openDrawer', payload: { id: 'unknown' } }));

      expect(sendPanoramaMetricSpy).toHaveBeenCalledWith('awsui-widget-drawer-incorrect-id', {
        id: 'unknown',
        type: 'openDrawer',
      });
    });

    test('should report ops metric when no id is provided', () => {
      awsuiWidgetPlugins.registerLeftDrawer(drawerDefaults);
      renderComponent(<AppLayout />);

      act(() => awsuiWidgetPlugins.updateDrawer({ type: 'openDrawer' } as any));

      expect(sendPanoramaMetricSpy).toHaveBeenCalledWith('awsui-widget-drawer-incorrect-id', {
        type: 'openDrawer',
      });
    });
  });
});
