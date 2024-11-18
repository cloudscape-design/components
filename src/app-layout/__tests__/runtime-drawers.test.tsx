// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint simple-import-sort/imports: 0 */
import React, { useState } from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import {
  describeEachAppLayout,
  findActiveDrawerLandmark,
  getActiveDrawerWidth,
  getGlobalDrawersTestUtils,
  testDrawer,
} from './utils';
import AppLayout, { AppLayoutProps } from '../../../lib/components/app-layout';
import { TOOLS_DRAWER_ID } from '../../../lib/components/app-layout/utils/use-drawers';
import { awsuiPlugins, awsuiPluginsInternal } from '../../../lib/components/internal/plugins/api';
import { DrawerConfig } from '../../../lib/components/internal/plugins/controllers/drawers';
import createWrapper from '../../../lib/components/test-utils/dom';
import triggerStyles from '../../../lib/components/app-layout/visual-refresh/styles.selectors.js';
import toolbarTriggerStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/trigger-button/styles.selectors.js';
import toolbarStyles from '../../../lib/components/app-layout/visual-refresh-toolbar/toolbar/styles.selectors.js';
import iconStyles from '../../../lib/components/icon/styles.selectors.js';
import { Button } from '../../../lib/components';

beforeEach(() => {
  awsuiPluginsInternal.appLayout.clearRegisteredDrawers();
});

jest.mock('@cloudscape-design/component-toolkit', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit'),
  useContainerQuery: () => [1300, () => {}],
}));

async function renderComponent(jsx: React.ReactElement) {
  const { container, rerender, getByTestId } = render(jsx);
  const wrapper = createWrapper(container).findAppLayout()!;
  const globalDrawersWrapper = getGlobalDrawersTestUtils(wrapper);
  await delay();
  return {
    wrapper,
    globalDrawersWrapper,
    rerender,
    getByTestId,
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

describeEachAppLayout(({ theme, size }) => {
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

  test('update rendered drawers via runtime config', async () => {
    awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, resizable: true });
    const { wrapper } = await renderComponent(<AppLayout />);
    // the 2nd trigger is for tools
    expect(wrapper.findDrawersTriggers()).toHaveLength(2);
    const drawerTrigger = wrapper.findDrawerTriggerById(drawerDefaults.id);

    const triggerParent = drawerTrigger!.getElement().parentElement;
    const triggerParentWrapper = createWrapper(triggerParent!);

    awsuiPlugins.appLayout.updateDrawer({
      id: drawerDefaults.id,
      badge: true,
    });
    await delay();
    const badgeSelector =
      theme === 'refresh-toolbar'
        ? toolbarTriggerStyles.badge
        : theme === 'refresh' && size === 'desktop'
          ? triggerStyles.badge
          : iconStyles.badge;

    expect(triggerParentWrapper!.findByClassName(badgeSelector)!.getElement()).toBeInTheDocument();

    awsuiPlugins.appLayout.updateDrawer({
      id: drawerDefaults.id,
      badge: false,
    });
    await delay();

    // re-querying the dot element
    expect(triggerParentWrapper!.findByClassName(badgeSelector)).toBeNull();
  });

  (size === 'desktop' ? test : test.skip)('update runtime drawers config resizable validation', async () => {
    awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, resizable: true });
    const { wrapper } = await renderComponent(<AppLayout />);
    // the 2nd trigger is for tools
    expect(wrapper.findDrawersTriggers()).toHaveLength(2);
    const drawerTrigger = wrapper.findDrawerTriggerById(drawerDefaults.id);
    drawerTrigger?.click();

    await delay();

    const resizeHandle = wrapper.findActiveDrawerResizeHandle()?.getElement();
    expect(resizeHandle).toBeInTheDocument();

    expect(getActiveDrawerWidth(wrapper)).toEqual('290px');

    awsuiPlugins.appLayout.updateDrawer({
      id: drawerDefaults.id,
      resizable: false,
      defaultSize: 350,
    });
    await delay();

    expect(getActiveDrawerWidth(wrapper)).toEqual('350px');
  });

  test('combines runtime drawers with the tools', async () => {
    awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, ariaLabels: { triggerButton: 'Runtime drawer' } });
    const { wrapper } = await renderComponent(<AppLayout tools="test" ariaLabels={{ toolsToggle: 'Tools' }} />);
    expect(wrapper.findDrawersTriggers().map(trigger => trigger.getElement().getAttribute('aria-label'))).toEqual([
      'Tools',
      'Runtime drawer',
    ]);
  });

  test('renders all provided aria-labels', async () => {
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      ariaLabels: {
        triggerButton: 'drawer trigger',
        content: 'drawer content',
        resizeHandle: 'drawer resize',
        closeButton: 'drawer close',
      },
    });
    const { wrapper } = await renderComponent(<AppLayout />);
    expect(wrapper.findDrawerTriggerById(drawerDefaults.id)!.getElement()).toHaveAttribute(
      'aria-label',
      'drawer trigger'
    );
    wrapper.findDrawerTriggerById(drawerDefaults.id)!.click();
    expect(findActiveDrawerLandmark(wrapper)!.getElement()).toHaveAttribute('aria-label', 'drawer content');
    expect(wrapper.findActiveDrawerCloseButton()!.getElement()).toHaveAttribute('aria-label', 'drawer close');
  });

  test('renders resize handle when config is enabled', async () => {
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      id: 'test-resizable',
      resizable: true,
      ariaLabels: {
        triggerButton: 'drawer trigger',
        content: 'drawer content',
        resizeHandle: 'drawer resize',
        closeButton: 'drawer close',
      },
    });
    const { wrapper } = await renderComponent(<AppLayout />);

    wrapper.findDrawerTriggerById(drawerDefaults.id)!.click();
    expect(wrapper.findActiveDrawerResizeHandle()).toBeFalsy();

    wrapper.findDrawerTriggerById('test-resizable')!.click();
    if (size === 'desktop') {
      expect(wrapper.findActiveDrawerResizeHandle()).toBeTruthy();
      expect(wrapper.findActiveDrawerResizeHandle()!.getElement()).toHaveAttribute('aria-label', 'drawer resize');
    } else {
      expect(wrapper.findActiveDrawerResizeHandle()).toBeFalsy();
    }
  });

  (size === 'desktop' ? test : test.skip)('calls onResize handler', async () => {
    const onResize = jest.fn();
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      resizable: true,
      onResize: event => onResize(event.detail),
    });
    const { wrapper } = await renderComponent(<AppLayout />);

    wrapper.findDrawerTriggerById(drawerDefaults.id)!.click();
    const handle = wrapper.findActiveDrawerResizeHandle()!;
    handle.fireEvent(new MouseEvent('pointerdown', { bubbles: true }));
    handle.fireEvent(new MouseEvent('pointermove', { bubbles: true }));
    handle.fireEvent(new MouseEvent('pointerup', { bubbles: true }));

    expect(onResize).toHaveBeenCalledWith({ size: expect.any(Number), id: drawerDefaults.id });
  });

  test('calls onToggle handler (local runtime drawer)', async () => {
    const onToggle = jest.fn();
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      onToggle: event => onToggle(event.detail),
    });
    const { wrapper } = await renderComponent(<AppLayout />);

    wrapper.findDrawerTriggerById(drawerDefaults.id)!.click();
    expect(onToggle).toHaveBeenCalledWith({ isOpen: true, initiatedByUserAction: true });
    wrapper.findActiveDrawerCloseButton()!.click();
    expect(onToggle).toHaveBeenCalledWith({ isOpen: false, initiatedByUserAction: true });
  });

  test('supports badge property', async () => {
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      badge: true,
    });
    const { wrapper } = await renderComponent(<AppLayout />);
    expect(wrapper.findDrawerTriggerById(TOOLS_DRAWER_ID, { hasBadge: false })).toBeTruthy();
    expect(wrapper.findDrawerTriggerById(drawerDefaults.id, { hasBadge: true })).toBeTruthy();
  });

  // always full-screen on mobile
  (size === 'desktop' ? test : test.skip)('supports defaultSize property', async () => {
    awsuiPlugins.appLayout.registerDrawer({
      ...drawerDefaults,
      defaultSize: 400,
    });
    const { wrapper } = await renderComponent(<AppLayout navigationOpen={false} onNavigationChange={() => {}} />);
    wrapper.findToolsToggle()!.click();
    expect(getActiveDrawerWidth(wrapper)).toEqual('290px');
    wrapper.findDrawerTriggerById(drawerDefaults.id)!.click();
    expect(getActiveDrawerWidth(wrapper)).toEqual('400px');
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
      <AppLayout
        toolsOpen={true}
        tools="Tools content"
        ariaLabels={{ toolsToggle: 'tools toggle' }}
        onToolsChange={() => {}}
      />
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

  test('respect controlled toolsOpen with runtime drawers after clicking on tools drawer', async () => {
    function AppLayoutWithControlledTools() {
      const [showTools, setShowTools] = useState(false);
      return (
        <AppLayout
          tools="Tools content"
          toolsOpen={showTools}
          onToolsChange={event => setShowTools(event.detail.open)}
          content={
            <div>
              <button data-testid="toggle-tools-drawer" onClick={() => setShowTools(!showTools)}>
                Toggle tools
              </button>
            </div>
          }
        />
      );
    }

    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper } = await renderComponent(<AppLayoutWithControlledTools />);
    expect(wrapper.findTools()).toBeFalsy();
    wrapper.findToolsToggle().click();

    expect(wrapper.findTools().getElement()).toHaveTextContent('Tools content');

    createWrapper().find('[data-testid="toggle-tools-drawer"]')!.click();

    expect(wrapper.findTools()).toBeFalsy();
  });

  test('does not open tools panel on toggle click for partially controllable tools', async () => {
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);

    const { wrapper } = await renderComponent(<AppLayout tools="Tools content" toolsOpen={false} />);
    expect(wrapper.findTools()).toBeFalsy();

    wrapper.findToolsToggle().click();
    expect(wrapper.findTools()).toBeFalsy();
  });

  test('opens tools drawer via ref', async () => {
    let ref: AppLayoutProps.Ref | null = null;
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper } = await renderComponent(<AppLayout ref={newRef => (ref = newRef)} tools="Tools content" />);

    expect(wrapper.findTools()).toBeFalsy();

    act(() => ref!.openTools());
    expect(wrapper.findTools().getElement()).toHaveTextContent('Tools content');

    wrapper.findToolsClose().click();
    expect(wrapper.findTools()).toBeFalsy();
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

  // skipping these on mobile, because drawers toggles are hidden when mobile mode is used
  (size === 'desktop' ? describe : describe.skip)('switching drawers', () => {
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

    test('allows switching drawers when toolsOpen is controlled', async () => {
      const onToolsChange = jest.fn();
      awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
      const { wrapper } = await renderComponent(
        <AppLayout tools="Tools content" toolsOpen={false} onToolsChange={event => onToolsChange(event.detail)} />
      );
      wrapper.findDrawerTriggerById(drawerDefaults.id)!.click();
      expect(onToolsChange).toHaveBeenCalledWith({ open: false });
      expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('runtime drawer content');

      onToolsChange.mockReset();
      wrapper.findToolsToggle().click();
      expect(onToolsChange).toHaveBeenCalledWith({ open: true });
    });

    test('should fire tools close event when switching from tools to another drawer', async () => {
      awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
      const onToolsChange = jest.fn();
      const { wrapper } = await renderComponent(
        <AppLayout tools="Tools content" toolsOpen={true} onToolsChange={event => onToolsChange(event.detail)} />
      );

      wrapper.findDrawerTriggerById(drawerDefaults.id)!.click();
      expect(onToolsChange).toHaveBeenCalledWith({ open: false });
    });

    test('should fire tools open event when switching from another drawer to tools', async () => {
      awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, defaultActive: true });
      const onToolsChange = jest.fn();
      const { wrapper } = await renderComponent(
        <AppLayout tools="Tools content" toolsOpen={false} onToolsChange={event => onToolsChange(event.detail)} />
      );
      expect(wrapper.findActiveDrawer()!.getElement()).toBeInTheDocument();

      wrapper.findToolsToggle().click();
      expect(onToolsChange).toHaveBeenCalledWith({ open: true });
    });

    test('preserves tools inner state while switching drawers', async () => {
      function Counter() {
        const [count, setCount] = useState(0);
        return (
          <>
            <button data-testid="count-increment" onClick={() => setCount(count + 1)}>
              Inc
            </button>
            <div>Count: {count}</div>
          </>
        );
      }

      awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
      const { wrapper } = await renderComponent(<AppLayout tools={<Counter />} />);
      wrapper.findToolsToggle().click();
      expect(wrapper.findTools().getElement()).toHaveTextContent('Count: 0');
      wrapper.find('[data-testid="count-increment"]')!.click();

      expect(wrapper.findTools().getElement()).toHaveTextContent('Count: 1');

      wrapper.findToolsClose().click();
      expect(wrapper.findTools()).toBeFalsy();

      wrapper.findToolsToggle().click();
      expect(wrapper.findTools().getElement()).toHaveTextContent('Count: 1');

      wrapper.findDrawerTriggerById(drawerDefaults.id)!.click();
      expect(wrapper.findTools()).toBeFalsy();

      wrapper.findDrawerTriggerById(TOOLS_DRAWER_ID)!.click();
      expect(wrapper.findTools().getElement()).toHaveTextContent('Count: 1');
    });
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
    const { wrapper } = await renderComponent(
      <AppLayout drawers={[testDrawer]} onDrawerChange={event => onChange(event.detail)} />
    );
    expect(onChange).toHaveBeenCalledWith({ activeDrawerId: drawerDefaults.id });
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

  // skip these tests on mobile mode, because triggers will overflow
  (size === 'desktop' ? describe : describe.skip)('ordering', () => {
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

    test('ignores tools when drawers are present', async () => {
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
      const { wrapper } = await renderComponent(
        <AppLayout
          drawers={[{ id: 'ddd', trigger: {}, content: null, ariaLabels: { triggerButton: 'ddd', drawerName: 'ddd' } }]}
          ariaLabels={{ toolsToggle: 'tools toggle' }}
        />
      );
      expect(wrapper.findDrawersTriggers().map(trigger => trigger.getElement().getAttribute('aria-label'))).toEqual([
        'bbb',
        'ddd',
        'aaa',
        'ccc',
      ]);
    });
  });

  test('should fire tools change event when closing tools panel while drawers are present', async () => {
    const onToolsChange = jest.fn();
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);
    const { wrapper } = await renderComponent(
      <AppLayout tools="Tools content" onToolsChange={event => onToolsChange(event.detail)} />
    );

    wrapper.findToolsToggle().click();
    expect(onToolsChange).toHaveBeenCalledWith({ open: true });

    onToolsChange.mockClear();
    wrapper.findToolsClose().click();
    expect(onToolsChange).toHaveBeenCalledWith({ open: false });
  });

  test('opens a drawer when openDrawer is called', async () => {
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);

    const { wrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

    expect(wrapper.findActiveDrawer()).toBeFalsy();

    awsuiPlugins.appLayout.openDrawer('test');

    await delay();

    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('runtime drawer content');
  });

  test('closes a drawer when closeDrawer is called (local drawer)', async () => {
    awsuiPlugins.appLayout.registerDrawer(drawerDefaults);

    const { wrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

    awsuiPlugins.appLayout.openDrawer('test');

    await delay();

    expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('runtime drawer content');

    awsuiPlugins.appLayout.closeDrawer('test');

    await delay();

    expect(wrapper.findActiveDrawer()).toBeFalsy();
  });
});

describe('toolbar mode only features', () => {
  describeEachAppLayout({ themes: ['refresh-toolbar'], sizes: ['desktop'] }, () => {
    test('should contain overridden in AWS-UI-Widget-Global-Navigation css classes for drawers', async () => {
      const { wrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer',
        type: 'global',
        mountContent: container => (container.textContent = 'global drawer content 1'),
      });

      await delay();

      wrapper.findDrawerTriggerById('global-drawer')!.click();

      expect(wrapper!.find('[class*="awsui_drawer-close-button_12i0j"]')).toBeTruthy();
      expect(wrapper!.find('[class*="awsui_drawer-global_12i0j"][class*="awsui_last-opened_12i0j"]')).toBeTruthy();
    });

    test('registerDrawer registers local drawers if type is not specified', async () => {
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'local-drawer',
        defaultActive: true,
        mountContent: container => (container.textContent = 'local drawer content'),
      });
      const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      await delay();

      expect(wrapper.findDrawersTriggers()).toHaveLength(2);
      expect(globalDrawersWrapper.findGlobalDrawersTriggers()).toHaveLength(0);
    });

    test('should register global runtime drawers and their trigger buttons', async () => {
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'local-drawer',
        defaultActive: true,
        mountContent: container => (container.textContent = 'local drawer content'),
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
      const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      await delay();

      expect(wrapper.findDrawersTriggers().length).toBe(4);
      expect(wrapper.find(`.${toolbarStyles['group-divider']}`)!.getElement()).toBeInTheDocument();
      expect(globalDrawersWrapper.findActiveDrawers()!.length).toBe(3);
      expect(globalDrawersWrapper.findDrawerById('local-drawer')!.getElement()).toHaveTextContent(
        'local drawer content'
      );
      expect(globalDrawersWrapper.findDrawerById('global-drawer-1')!.getElement()).toHaveTextContent(
        'global drawer content 1'
      );
      expect(globalDrawersWrapper.findDrawerById('global-drawer-2')!.getElement()).toHaveTextContent(
        'global drawer content 2'
      );
    });

    test('if 2 global drawers are already open, and third drawers has opened, it should replace the first opened drawer', async () => {
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
        type: 'global',
        mountContent: container => (container.textContent = 'global drawer content 3'),
      });
      const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      expect(globalDrawersWrapper.findActiveDrawers()!.length).toBe(2);
      expect(globalDrawersWrapper.findActiveDrawers()[0].getElement()).toHaveTextContent('global drawer content 1');
      expect(globalDrawersWrapper.findActiveDrawers()[1].getElement()).toHaveTextContent('global drawer content 2');

      wrapper.findDrawerTriggerById('global-drawer-3')!.click();

      expect(globalDrawersWrapper.findActiveDrawers()!.length).toBe(2);
      expect(globalDrawersWrapper.findActiveDrawers()[0].getElement()).toHaveTextContent('global drawer content 2');
      expect(globalDrawersWrapper.findActiveDrawers()[1].getElement()).toHaveTextContent('global drawer content 3');
    });

    test('renders resize handle for a global drawer when config is enabled', async () => {
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'test-resizable',
        resizable: true,
        type: 'global',
        ariaLabels: {
          triggerButton: 'drawer trigger',
          content: 'drawer content',
          resizeHandle: 'drawer resize',
          closeButton: 'drawer close',
        },
      });
      const { globalDrawersWrapper, wrapper } = await renderComponent(<AppLayout />);

      wrapper.findDrawerTriggerById('test-resizable')!.click();

      expect(globalDrawersWrapper.findResizeHandleByActiveDrawerId('test-resizable')!.getElement()).toHaveFocus();
      expect(globalDrawersWrapper.findResizeHandleByActiveDrawerId('test-resizable')!.getElement()).toHaveAttribute(
        'aria-label',
        'drawer resize'
      );
    });

    test('close active global drawer by clicking on close button', async () => {
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer',
        type: 'global',
        ariaLabels: {
          triggerButton: 'drawer trigger',
          content: 'drawer content',
          resizeHandle: 'drawer resize',
          closeButton: 'drawer close',
        },
      });
      const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout />);

      wrapper.findDrawerTriggerById('global-drawer')!.click();
      expect(globalDrawersWrapper.findDrawerById('global-drawer')!.getElement()).toBeInTheDocument();
      globalDrawersWrapper.findCloseButtonByActiveDrawerId('global-drawer')!.click();
      expect(globalDrawersWrapper.findDrawerById('global-drawer')).toBeNull();
    });

    test('the order of the opened global drawers should match the positions of their corresponding toggle buttons on the toolbar', async () => {
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-1',
        type: 'global',
        mountContent: container => (container.textContent = 'global drawer content 1'),
      });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-2',
        type: 'global',
        mountContent: container => (container.textContent = 'global drawer content 2'),
      });

      const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      wrapper.findDrawerTriggerById('global-drawer-2')!.click();
      wrapper.findDrawerTriggerById('global-drawer-1')!.click();

      expect(globalDrawersWrapper.findActiveDrawers()[0].getElement()).toHaveTextContent('global drawer content 1');
      expect(globalDrawersWrapper.findActiveDrawers()[1].getElement()).toHaveTextContent('global drawer content 2');
    });

    test('should close opened global drawer by clicking on its trigger button', async () => {
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-1',
        type: 'global',
        mountContent: container => (container.textContent = 'global drawer content 1'),
      });

      const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      wrapper.findDrawerTriggerById('global-drawer-1')!.click();

      expect(globalDrawersWrapper.findDrawerById('global-drawer-1')!.getElement()).toBeInTheDocument();

      wrapper.findDrawerTriggerById('global-drawer-1')!.click();

      expect(globalDrawersWrapper.findDrawerById('global-drawer-1')).toBeNull();
    });

    test('opens a drawer when openDrawer is called', async () => {
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'local-drawer',
        mountContent: container => (container.textContent = 'local-drawer content'),
      });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-1',
        type: 'global',
        mountContent: container => (container.textContent = 'global drawer content 1'),
      });
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-2',
        type: 'global',
        mountContent: container => (container.textContent = 'global drawer content 2'),
      });

      const { globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      expect(globalDrawersWrapper.findActiveDrawers()).toHaveLength(0);

      awsuiPlugins.appLayout.openDrawer('local-drawer');

      await delay();

      expect(globalDrawersWrapper.findActiveDrawers()).toHaveLength(1);

      awsuiPlugins.appLayout.openDrawer('global-drawer-1');

      await delay();

      expect(globalDrawersWrapper.findActiveDrawers()).toHaveLength(2);
    });

    test('does not do anything when openDrawer is called with active drawer id', async () => {
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'local-drawer',
        mountContent: container => (container.textContent = 'local-drawer content'),
      });

      const { globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      expect(globalDrawersWrapper.findActiveDrawers()).toHaveLength(0);

      awsuiPlugins.appLayout.openDrawer('local-drawer');

      await delay();

      expect(globalDrawersWrapper.findActiveDrawers()).toHaveLength(1);

      awsuiPlugins.appLayout.openDrawer('local-drawer');

      await delay();

      expect(globalDrawersWrapper.findActiveDrawers()).toHaveLength(1);
    });

    test('should restore focus when a global drawer is closed', async () => {
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-1',
        type: 'global',
        mountContent: container => (container.textContent = 'global drawer content 1'),
      });

      const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      wrapper.findDrawerTriggerById('global-drawer-1')!.focus();
      wrapper.findDrawerTriggerById('global-drawer-1')!.click();
      expect(globalDrawersWrapper.findDrawerById('global-drawer-1')!.getElement()).toBeInTheDocument();
      globalDrawersWrapper.findCloseButtonByActiveDrawerId('global-drawer-1')!.click();
      expect(globalDrawersWrapper.findDrawerById('global-drawer-1')).toBeNull();
      expect(wrapper.findDrawerTriggerById('global-drawer-1')!.getElement()).toHaveFocus();
    });

    test('when keepContentMounted is set to true, initially closed drawer does not exist in dom (but mounted and persists when opened and closed)', async () => {
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-1',
        type: 'global',
        mountContent: container => (container.textContent = 'global drawer content 1'),
        preserveInactiveContent: true,
      });

      const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      expect(globalDrawersWrapper.findDrawerById('global-drawer-1')).toBeNull();

      wrapper.findDrawerTriggerById('global-drawer-1')!.click();

      await delay();

      expect(globalDrawersWrapper.findDrawerById('global-drawer-1')!.isActive()).toBe(true);
      wrapper.findDrawerTriggerById('global-drawer-1')!.click();

      expect(globalDrawersWrapper.findDrawerById('global-drawer-1')!.getElement()).toBeInTheDocument();
      expect(globalDrawersWrapper.findDrawerById('global-drawer-1')!.isActive()).toBe(false);
    });

    test('should call visibilityChange callback when global drawer with preserveInactiveContent is opened and closed', async () => {
      const onVisibilityChangeMock = jest.fn();
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer-1',
        type: 'global',
        mountContent: (container, mountContext) => {
          if (mountContext?.onVisibilityChange) {
            mountContext.onVisibilityChange(onVisibilityChangeMock);
          }
          container.textContent = 'global drawer content 1';
        },
        preserveInactiveContent: true,
      });

      const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      wrapper.findDrawerTriggerById('global-drawer-1')!.click();

      await delay();

      expect(globalDrawersWrapper.findDrawerById('global-drawer-1')!.isActive()).toBe(true);
      expect(onVisibilityChangeMock).toHaveBeenCalledWith(true);

      globalDrawersWrapper.findCloseButtonByActiveDrawerId('global-drawer-1')!.click();
      expect(onVisibilityChangeMock).toHaveBeenCalledWith(false);
    });

    test('should restore focus to a custom trigger when a global drawer does not have trigger button', async () => {
      const drawerId = 'global-drawer-without-trigger';
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: drawerId,
        type: 'global',
        trigger: undefined,
      });

      const { globalDrawersWrapper, getByTestId } = await renderComponent(
        <AppLayout
          drawers={[testDrawer]}
          content={
            <>
              <Button data-testid="trigger-button" onClick={() => awsuiPlugins.appLayout.openDrawer(drawerId)}>
                Open a drawer without a trigger
              </Button>
            </>
          }
        />
      );

      getByTestId('trigger-button').focus();
      getByTestId('trigger-button').click();

      expect(globalDrawersWrapper.findDrawerById(drawerId)!.isActive()).toBe(true);

      // globalDrawersWrapper.findDrawerById(drawerId)!.blur() does not trigger the blur event on the active drawer
      fireEvent.blur(globalDrawersWrapper.findDrawerById(drawerId)!.getElement());
      expect(getByTestId('trigger-button')).not.toHaveFocus();

      globalDrawersWrapper.findCloseButtonByActiveDrawerId(drawerId)!.click();

      expect(getByTestId('trigger-button')).toHaveFocus();
    });

    test('closes a drawer when closeDrawer is called (global drawer)', async () => {
      awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, resizable: true, type: 'global' });

      const { wrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      awsuiPlugins.appLayout.openDrawer('test');

      await delay();

      expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('runtime drawer content');

      awsuiPlugins.appLayout.closeDrawer('test');

      await delay();

      expect(wrapper.findActiveDrawer()).toBeFalsy();
    });

    test('should not render a trigger button if registered drawer does not have a trigger prop', async () => {
      awsuiPlugins.appLayout.registerDrawer({ ...drawerDefaults, trigger: undefined });

      const { wrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

      expect(wrapper.findDrawerTriggerById('test')).toBeFalsy();

      awsuiPlugins.appLayout.openDrawer('test');

      await delay();

      expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('runtime drawer content');
    });

    test('should render trigger buttons for global drawers even if local drawers are not present', async () => {
      const { wrapper } = await renderComponent(<AppLayout toolsHide={true} />);

      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global1',
        type: 'global',
      });

      await delay();

      expect(wrapper.findDrawerTriggerById('global1')!.getElement()).toBeInTheDocument();
    });

    test('calls onToggle handler by clicking on drawers trigger button (global runtime drawers)', async () => {
      const onToggle = jest.fn();
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer',
        type: 'global',
        onToggle: event => onToggle(event.detail),
      });
      const { wrapper } = await renderComponent(<AppLayout />);

      wrapper.findDrawerTriggerById('global-drawer')!.click();
      expect(onToggle).toHaveBeenCalledWith({ isOpen: true, initiatedByUserAction: true });
      wrapper.findDrawerTriggerById('global-drawer')!.click();
      expect(onToggle).toHaveBeenCalledWith({ isOpen: false, initiatedByUserAction: true });
    });

    test('calls onToggle handler by calling openDrawer and closeDrawer plugin api (global runtime drawers)', async () => {
      const onToggle = jest.fn();
      awsuiPlugins.appLayout.registerDrawer({
        ...drawerDefaults,
        id: 'global-drawer',
        type: 'global',
        onToggle: event => onToggle(event.detail),
      });
      await renderComponent(<AppLayout />);

      awsuiPlugins.appLayout.openDrawer('global-drawer');
      expect(onToggle).toHaveBeenCalledWith({ isOpen: true, initiatedByUserAction: true });
      awsuiPlugins.appLayout.closeDrawer('global-drawer');
      expect(onToggle).toHaveBeenCalledWith({ isOpen: false, initiatedByUserAction: true });
    });

    describe('dynamically registered drawers with defaultActive: true', () => {
      test('should open if there are already open local drawer on the page', async () => {
        const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

        wrapper.findDrawerTriggerById('security')!.click();
        expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('Security');

        awsuiPlugins.appLayout.registerDrawer({
          ...drawerDefaults,
          id: 'global1',
          type: 'global',
          defaultActive: true,
        });

        await delay();

        expect(globalDrawersWrapper.findDrawerById('global1')!.isActive()).toBe(true);

        awsuiPlugins.appLayout.registerDrawer({
          ...drawerDefaults,
          id: 'global2',
          type: 'global',
          defaultActive: true,
        });

        await delay();

        expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('Security');
        expect(globalDrawersWrapper.findDrawerById('global1')!.isActive()).toBe(true);
        expect(globalDrawersWrapper.findDrawerById('global2')!.isActive()).toBe(true);
      });

      test('should not open if there are already global drawers opened by user action on the page', async () => {
        const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

        wrapper.findDrawerTriggerById('security')!.click();
        expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('Security');

        awsuiPlugins.appLayout.registerDrawer({
          ...drawerDefaults,
          id: 'global1',
          type: 'global',
        });

        await delay();

        wrapper.findDrawerTriggerById('global1')!.click();
        expect(globalDrawersWrapper.findDrawerById('global1')!.isActive()).toBe(true);

        awsuiPlugins.appLayout.registerDrawer({
          ...drawerDefaults,
          id: 'global2',
          type: 'global',
          defaultActive: true,
        });

        await delay();

        expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('Security');
        expect(globalDrawersWrapper.findDrawerById('global1')!.isActive()).toBe(true);
        expect(globalDrawersWrapper.findDrawerById('global2')).toBeFalsy();
      });

      test('should not open if the maximum number (2) of global drawers is already open on the page', async () => {
        const { wrapper, globalDrawersWrapper } = await renderComponent(<AppLayout drawers={[testDrawer]} />);

        wrapper.findDrawerTriggerById('security')!.click();
        expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('Security');

        awsuiPlugins.appLayout.registerDrawer({
          ...drawerDefaults,
          id: 'global1',
          type: 'global',
          defaultActive: true,
        });

        await delay();

        expect(globalDrawersWrapper.findDrawerById('global1')!.isActive()).toBe(true);

        awsuiPlugins.appLayout.registerDrawer({
          ...drawerDefaults,
          id: 'global2',
          type: 'global',
          defaultActive: true,
        });

        await delay();

        // this drawer should not open because there are already two global drawers open on the page, which is the maximum limit
        awsuiPlugins.appLayout.registerDrawer({
          ...drawerDefaults,
          id: 'global3',
          type: 'global',
          defaultActive: true,
        });

        await delay();

        expect(wrapper.findActiveDrawer()!.getElement()).toHaveTextContent('Security');
        expect(globalDrawersWrapper.findDrawerById('global1')!.isActive()).toBe(true);
        expect(globalDrawersWrapper.findDrawerById('global2')!.isActive()).toBe(true);
        expect(globalDrawersWrapper.findDrawerById('global3')).toBeFalsy();
      });
    });
  });
});
