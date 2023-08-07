// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';
import AppLayout from '../../../lib/components/app-layout';
import { InternalDrawerProps } from '../../../lib/components/app-layout/drawer/interfaces';
import { awsuiPlugins, awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import { DrawerConfig } from '../../../lib/components/internal/plugins/controllers/drawers';
import createWrapper from '../../../lib/components/test-utils/dom';
import { defineClientHeight } from './utils';

beforeEach(() => {
  awsuiPluginsInternal.appLayout.clearRegisteredDrawers();
});

defineClientHeight(800);

async function renderComponent(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  const wrapper = createWrapper(container).findAppLayout()!;
  await delay();
  return { wrapper, rerender };
}

function delay() {
  return act(() => new Promise(resolve => setTimeout(resolve)));
}

const drawerDefaults: DrawerConfig = {
  id: 'test',
  ariaLabels: {},
  trigger: { iconSvg: '' },
  mountContent: () => {},
  unmountContent: () => {},
};

describe('Runtime drawers', () => {
  test('does not render runtime drawers when it is explicitly disabled', async () => {
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper } = await renderComponent(<AppLayout {...({ __disableRuntimeDrawers: true } as any)} />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
  });

  test('runtime drawers integration can be dynamically enabled and disabled', async () => {
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper, rerender } = await renderComponent(<AppLayout />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
    rerender(<AppLayout {...({ __disableRuntimeDrawers: true } as any)} />);
    await delay();
    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
    rerender(<AppLayout />);
    await delay();
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
  });

  test('renders drawers via runtime config', async () => {
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper } = await renderComponent(<AppLayout />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
  });

  test('combines runtime drawers with the tools', async () => {
    awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, ariaLabels: { triggerButton: 'Runtime drawer' } });
    const { wrapper } = await renderComponent(<AppLayout tools="test" ariaLabels={{ toolsToggle: 'Tools' }} />);
    expect(wrapper.findDrawersTriggers().map(trigger => trigger.getElement().getAttribute('aria-label'))).toEqual([
      'Tools',
      'Runtime drawer',
    ]);
  });

  test('accepts drawers registration after initial rendering', async () => {
    const { wrapper } = await renderComponent(<AppLayout />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    await delay();
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
  });

  test('propagates iconSvg as html content', async () => {
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      trigger: { iconSvg: `<rect data-testid="custom-icon" />` },
    });
    const { wrapper } = await renderComponent(<AppLayout />);
    expect(wrapper.find('[data-testid="custom-icon"]')).toBeTruthy();
  });

  test('does not support iconName', async () => {
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      // @ts-expect-error testing that unsupported feature does not fail in runtime
      trigger: { iconName: `<rect data-testid="custom-icon" />` },
    });
    const { wrapper } = await renderComponent(<AppLayout />);
    expect(wrapper.findDrawersTriggers()[0].find('svg')).toBeFalsy();
  });

  test('persists drawer config between mounts/unmounts', async () => {
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper, rerender } = await renderComponent(<AppLayout key="first" />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
    rerender(<AppLayout key="second" />);
    await delay();
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
  });

  test('drawer content lifecycle', async () => {
    const mountContent = jest.fn();
    const unmountContent = jest.fn();
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      mountContent,
      unmountContent,
    });
    const { wrapper } = await renderComponent(<AppLayout />);
    expect(mountContent).toHaveBeenCalledTimes(0);
    wrapper.findDrawersTriggers()[0].click();
    expect(mountContent).toHaveBeenCalledTimes(1);
    expect(unmountContent).toHaveBeenCalledTimes(0);
    wrapper.findActiveDrawerCloseButton()!.click();
    expect(mountContent).toHaveBeenCalledTimes(1);
    expect(unmountContent).toHaveBeenCalledTimes(1);
  });

  test('drawer content updates when switching active drawers', async () => {
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      id: 'first',
      mountContent: container => (container.textContent = 'first drawer content'),
    });
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      id: 'second',
      mountContent: container => (container.textContent = 'second drawer content'),
    });
    const { wrapper } = await renderComponent(<AppLayout />);
    wrapper.findDrawersTriggers()[0].click();
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('first drawer content');
    wrapper.findDrawersTriggers()[1].click();
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('second drawer content');
  });

  describe('ordering', () => {
    test('renders multiple drawers in alphabetical order by default', async () => {
      awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, id: 'bbb', ariaLabels: { triggerButton: 'bbb' } });
      awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, id: 'aaa', ariaLabels: { triggerButton: 'aaa' } });
      awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, id: 'ccc', ariaLabels: { triggerButton: 'ccc' } });
      const { wrapper } = await renderComponent(<AppLayout />);
      expect(wrapper.findDrawersTriggers().map(trigger => trigger.getElement().getAttribute('aria-label'))).toEqual([
        'aaa',
        'bbb',
        'ccc',
      ]);
    });

    test('renders multiple drawers according to order priority when it is set', async () => {
      awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, id: 'ddd', ariaLabels: { triggerButton: 'ddd' } });
      awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, id: 'bbb', ariaLabels: { triggerButton: 'bbb' } });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'aaa',
        ariaLabels: { triggerButton: 'aaa' },
        orderPriority: 1,
      });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'ccc',
        ariaLabels: { triggerButton: 'ccc' },
        orderPriority: 10,
      });
      const { wrapper } = await renderComponent(<AppLayout />);
      expect(wrapper.findDrawersTriggers().map(trigger => trigger.getElement().getAttribute('aria-label'))).toEqual([
        'ccc',
        'aaa',
        'bbb',
        'ddd',
      ]);
    });

    test('allows mixing static and runtime drawers', async () => {
      awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, id: 'aaa', ariaLabels: { triggerButton: 'aaa' } });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'bbb',
        ariaLabels: { triggerButton: 'bbb' },
        orderPriority: 1,
      });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'ccc',
        ariaLabels: { triggerButton: 'ccc' },
        orderPriority: -1,
      });
      const drawers: InternalDrawerProps = {
        drawers: {
          items: [{ id: 'ddd', trigger: {}, content: null, ariaLabels: { triggerButton: 'ddd' } }],
        },
      };
      const { wrapper } = await renderComponent(<AppLayout {...(drawers as any)} />);
      expect(wrapper.findDrawersTriggers().map(trigger => trigger.getElement().getAttribute('aria-label'))).toEqual([
        'bbb',
        'ddd',
        'aaa',
        'ccc',
      ]);
    });
  });
});
