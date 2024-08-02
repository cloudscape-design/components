// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { loadApi } from '../../../../lib/components/internal/plugins/api';
import { DrawerConfig, UpdateDrawerConfig } from '../../../../lib/components/internal/plugins/controllers/drawers';

function delay() {
  return new Promise(resolve => setTimeout(resolve));
}

const storageKey = Symbol.for('awsui-plugin-api');

afterEach(() => {
  delete (window as any)[storageKey];
});

test('loading api multiple times does not reset the state', async () => {
  let api = loadApi();
  const onRegister = jest.fn();

  api.awsuiPluginsInternal.appLayout.onDrawersRegistered(onRegister);
  api.awsuiPlugins.appLayout.registerDrawer({ id: 'drawer-1' } as DrawerConfig);
  await delay();
  expect(onRegister).toHaveBeenCalledWith([{ id: 'drawer-1' }]);
  onRegister.mockReset();

  api = loadApi();
  api.awsuiPlugins.appLayout.registerDrawer({ id: 'drawer-2' } as DrawerConfig);
  await delay();
  expect(onRegister).toHaveBeenCalledWith([{ id: 'drawer-1' }, { id: 'drawer-2' }]);
});

test('triggering update drawer multiple times does not reset the state', async () => {
  const api = loadApi();
  const onRegister = jest.fn();
  api.awsuiPluginsInternal.appLayout.onDrawersRegistered(onRegister);
  api.awsuiPlugins.appLayout.registerDrawer({ id: 'drawer-1' } as DrawerConfig);
  api.awsuiPlugins.appLayout.registerDrawer({ id: 'drawer-2', badge: false } as DrawerConfig);
  await delay();
  expect(onRegister).toHaveBeenCalledWith([{ id: 'drawer-1' }, { id: 'drawer-2', badge: false }]);

  api.awsuiPlugins.appLayout.updateDrawer({ id: 'drawer-2', badge: true } as UpdateDrawerConfig);
  await delay();
  expect(onRegister).toHaveBeenCalledWith([{ id: 'drawer-1' }, { id: 'drawer-2', badge: true }]);

  api.awsuiPlugins.appLayout.updateDrawer({ id: 'drawer-1', defaultSize: 400, resizable: true } as UpdateDrawerConfig);
  await delay();
  expect(onRegister).toHaveBeenCalledWith([
    { id: 'drawer-1', defaultSize: 400, resizable: true },
    { id: 'drawer-2', badge: true },
  ]);
});

test('partial API can be extended', () => {
  const api = loadApi();
  // @ts-expect-error testing runtime issues
  delete api.awsuiPlugins.alert;
  // @ts-expect-error testing runtime issues
  delete api.awsuiPluginsInternal.alert;
  expect(api.awsuiPlugins.alert).toBeUndefined();
  expect(api.awsuiPluginsInternal.alert).toBeUndefined();

  loadApi();
  expect(api.awsuiPlugins.alert).toBeDefined();
  expect(api.awsuiPluginsInternal.alert).toBeDefined();
});
