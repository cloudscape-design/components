// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';
import AppLayout from '../../../lib/components/app-layout';
import { InternalDrawerProps } from '../../../lib/components/app-layout/drawer/interfaces';
import { TOOLS_DRAWER_ID } from '../../../lib/components/app-layout/utils/use-drawers';
import { awsuiPlugins, awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import { DrawerConfig } from '../../../lib/components/internal/plugins/controllers/drawers';
import createWrapper from '../../../lib/components/test-utils/dom';
import { describeEachAppLayout, singleDrawer } from './utils';

beforeEach(() => {
  awsuiPluginsInternal.appLayout.clearRegisteredDrawers();
});

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [1300, () => {}],
}));

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
  mountContent: container => (container.textContent = 'runtime drawer content'),
  unmountContent: () => {},
};

describeEachAppLayout(() => {
  test('does not render runtime drawers when it is explicitly disabled', async () => {
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper } = await renderComponent(<AppLayout {...({ __disableRuntimeDrawers: true } as any)} />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
  });

  test('runtime drawers integration can be dynamically enabled and disabled', async () => {
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper, rerender } = await renderComponent(<AppLayout />);
    // the 2nd trigger is for tools
    expect(wrapper.findDrawersTriggers()).toHaveLength(2);
    rerender(<AppLayout {...({ __disableRuntimeDrawers: true } as any)} />);
    await delay();
    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
    rerender(<AppLayout />);
    await delay();
    // the 2nd trigger is for tools
    expect(wrapper.findDrawersTriggers()).toHaveLength(2);
  });

  test('renders drawers via runtime config', async () => {
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper } = await renderComponent(<AppLayout />);
    // the 2nd trigger is for tools
    expect(wrapper.findDrawersTriggers()).toHaveLength(2);
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
    const { wrapper } = await renderComponent(<AppLayout toolsHide={true} />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    await delay();
    expect(wrapper.findDrawersTriggers()).toHaveLength(1);
  });

  test('opens registered drawer when defaultActive is set', async () => {
    const { wrapper } = await renderComponent(<AppLayout toolsHide={true} />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
    expect(wrapper.findActiveDrawer()).toBeFalsy();
    awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, defaultActive: true });
    await delay();
    expect(wrapper.findActiveDrawer()!.getElement()).toBeInTheDocument();
  });

  test('does not open defaultActive drawer if the tools are already open', async () => {
    const { wrapper } = await renderComponent(
      <AppLayout toolsOpen={true} tools="Tools content" ariaLabels={{ toolsToggle: 'tools toggle' }} />
    );
    expect(wrapper.findDrawersTriggers()).toHaveLength(0);
    expect(wrapper.findActiveDrawer()).toBeFalsy();
    awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, defaultActive: true });
    await delay();
    expect(wrapper.findDrawerTriggerById(TOOLS_DRAWER_ID)!.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('Tools content');
  });

  test('allows controlled toolsOpen when runtime drawers exist', async () => {
    const onToolsChange = jest.fn();
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper, rerender } = await renderComponent(
      <AppLayout tools="Tools content" toolsOpen={false} onToolsChange={event => onToolsChange(event.detail)} />
    );
    expect(wrapper.findDrawersTriggers()).toHaveLength(2);
    expect(wrapper.findTools()).toBeFalsy();
    expect(onToolsChange).not.toHaveBeenCalled();

    rerender(<AppLayout tools="Tools content" toolsOpen={true} onToolsChange={event => onToolsChange(event.detail)} />);
    expect(wrapper.findTools().getElement()).toHaveTextContent('Tools content');

    wrapper.findToolsClose().click();
    expect(onToolsChange).toHaveBeenCalledWith({ open: false });
  });

  test('allows closing tools in controlled mode when runtime drawers exist', async () => {
    const onToolsChange = jest.fn();
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper } = await renderComponent(
      <AppLayout tools="Tools content" toolsOpen={true} onToolsChange={event => onToolsChange(event.detail)} />
    );
    wrapper.findToolsClose().click();
    expect(onToolsChange).toHaveBeenCalledWith({ open: false });
  });

  test('allows controlled toolsOpen when another drawer is open', async () => {
    const onToolsChange = jest.fn();
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper, rerender } = await renderComponent(
      <AppLayout tools="Tools content" toolsOpen={false} onToolsChange={event => onToolsChange(event.detail)} />
    );

    wrapper.findDrawerTriggerById(drawerDefaults.id)!.click();
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('runtime drawer content');
    expect(onToolsChange).toHaveBeenCalledWith({ open: false });

    onToolsChange.mockClear();
    rerender(<AppLayout tools="Tools content" toolsOpen={true} onToolsChange={event => onToolsChange(event.detail)} />);
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('Tools content');
    expect(wrapper.findDrawerTriggerById(TOOLS_DRAWER_ID)!.getElement()).toHaveAttribute('aria-expanded', 'true');
    expect(wrapper.findDrawerTriggerById(drawerDefaults.id)!.getElement()).toHaveAttribute('aria-expanded', 'false');
    expect(onToolsChange).not.toHaveBeenCalled();
  });

  test('allows switching drawers when toolsOpen is controlled', async () => {
    const onToolsChange = jest.fn();
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper } = await renderComponent(
      <AppLayout tools="Tools content" toolsOpen={false} onToolsChange={event => onToolsChange(event.detail)} />
    );
    wrapper.findDrawerTriggerById(drawerDefaults.id)!.click();
    expect(onToolsChange).toHaveBeenCalledWith({ open: false });
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('runtime drawer content');

    wrapper.findToolsToggle().click();
    expect(onToolsChange).toHaveBeenCalledWith({ open: true });
  });

  test('updates active drawer if multiple are registered', async () => {
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      id: 'first',
      mountContent: container => (container.textContent = 'first drawer content'),
    });
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      id: 'second',
      defaultActive: true,
      mountContent: container => (container.textContent = 'second drawer content'),
    });
    const { wrapper } = await renderComponent(<AppLayout toolsHide={true} />);
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('second drawer content');
  });

  test('only the first defaultActive drawer gets open', async () => {
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      id: 'first',
      defaultActive: true,
      mountContent: container => (container.textContent = 'first drawer content'),
    });
    const { wrapper } = await renderComponent(<AppLayout toolsHide={true} />);
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('first drawer content');
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      id: 'second',
      defaultActive: true,
      mountContent: container => (container.textContent = 'second drawer content'),
    });
    await delay();
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('first drawer content');
  });

  test('opens default active drawer if it loaded late', async () => {
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      id: 'first',
      mountContent: container => (container.textContent = 'first drawer content'),
    });
    const { wrapper } = await renderComponent(<AppLayout />);
    expect(wrapper.findActiveDrawer()).toBeFalsy();
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      id: 'second',
      defaultActive: true,
      mountContent: container => (container.textContent = 'second drawer content'),
    });
    await delay();
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('second drawer content');
  });

  test('updates active drawer id in controlled mode', async () => {
    awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, defaultActive: true });
    const onChange = jest.fn();
    const drawers: Required<InternalDrawerProps> = {
      drawers: {
        ...singleDrawer.drawers,
        onChange: event => onChange(event.detail),
      },
    };
    const { wrapper } = await renderComponent(<AppLayout contentType="form" {...drawers} />);
    expect(onChange).toHaveBeenCalledWith(drawerDefaults.id);
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('runtime drawer content');
  });

  test('does not override other active drawers', async () => {
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      id: 'first',
      mountContent: container => (container.textContent = 'first drawer content'),
    });
    const { wrapper } = await renderComponent(<AppLayout />);
    wrapper.findDrawerTriggerById('first')!.click();
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('first drawer content');
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      id: 'first',
      defaultActive: true,
      mountContent: container => (container.textContent = 'second drawer content'),
    });
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('first drawer content');
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
    expect(wrapper.findDrawerTriggerById(drawerDefaults.id)!.find('svg')).toBeFalsy();
  });

  test('persists drawer config between mounts/unmounts', async () => {
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper, rerender } = await renderComponent(<AppLayout key="first" />);
    expect(wrapper.findDrawersTriggers()).toHaveLength(2);
    rerender(<AppLayout key="second" />);
    await delay();
    expect(wrapper.findDrawersTriggers()).toHaveLength(2);
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
    wrapper.findDrawerTriggerById(drawerDefaults.id)!.click();
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
    wrapper.findDrawerTriggerById('first')!.click();
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('first drawer content');
    wrapper.findDrawerTriggerById('second')!.click();
    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('second drawer content');
  });

  describe('ordering', () => {
    test('renders multiple drawers in alphabetical order by default', async () => {
      awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, id: 'bbb', ariaLabels: { triggerButton: 'bbb' } });
      awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, id: 'aaa', ariaLabels: { triggerButton: 'aaa' } });
      awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, id: 'ccc', ariaLabels: { triggerButton: 'ccc' } });
      const { wrapper } = await renderComponent(<AppLayout ariaLabels={{ toolsToggle: 'tools toggle' }} />);
      expect(wrapper.findDrawersTriggers().map(trigger => trigger.getElement().getAttribute('aria-label'))).toEqual([
        'tools toggle',
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
      const { wrapper } = await renderComponent(<AppLayout ariaLabels={{ toolsToggle: 'tools toggle' }} />);
      expect(wrapper.findDrawersTriggers().map(trigger => trigger.getElement().getAttribute('aria-label'))).toEqual([
        'tools toggle',
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
      const { wrapper } = await renderComponent(
        <AppLayout {...(drawers as any)} ariaLabels={{ toolsToggle: 'tools toggle' }} />
      );
      expect(wrapper.findDrawersTriggers().map(trigger => trigger.getElement().getAttribute('aria-label'))).toEqual([
        'tools toggle',
        'bbb',
        'ddd',
        'aaa',
        'ccc',
      ]);
    });
  });
});
