// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DrawerConfig, DrawersController } from '../../../../lib/components/internal/plugins/drawers-controller';

const drawerA = { id: 'drawerA' } as DrawerConfig;
const drawerB = { id: 'drawerB' } as DrawerConfig;

function delay() {
  return new Promise(resolve => setTimeout(resolve));
}

test('notifies about registered drawers initially', async () => {
  const onDrawersRegistered = jest.fn();
  const drawers = new DrawersController();
  drawers.onDrawersRegistered(onDrawersRegistered);
  drawers.registerDrawer(drawerA);
  drawers.registerDrawer(drawerB);
  expect(onDrawersRegistered).not.toHaveBeenCalled();
  await delay();
  expect(onDrawersRegistered).toHaveBeenCalledWith([drawerA, drawerB]);
});

test('returns empty array when no drawers registered', async () => {
  const onDrawersRegistered = jest.fn();
  const drawers = new DrawersController();
  drawers.onDrawersRegistered(onDrawersRegistered);
  await delay();
  expect(onDrawersRegistered).toHaveBeenCalledWith([]);
});

test('notifies about late added drawers', async () => {
  const onDrawersRegistered = jest.fn();
  const drawers = new DrawersController();
  drawers.registerDrawer(drawerA);
  drawers.onDrawersRegistered(onDrawersRegistered);
  await delay();
  onDrawersRegistered.mockReset();
  drawers.registerDrawer(drawerB);
  await delay();
  expect(onDrawersRegistered).toHaveBeenCalledWith([drawerA, drawerB]);
});

test('change listener is not called after cleanup', async () => {
  const onDrawersRegistered = jest.fn();
  const drawers = new DrawersController();
  const cleanup = drawers.onDrawersRegistered(onDrawersRegistered);
  await delay();
  onDrawersRegistered.mockReset();
  cleanup();
  drawers.registerDrawer(drawerA);
  await delay();
  expect(onDrawersRegistered).not.toHaveBeenCalled();
});

describe('console warnings', () => {
  let consoleWarnSpy: jest.SpyInstance;
  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  test('warns if multiple change listeners attempted to register', () => {
    const drawers = new DrawersController();
    drawers.onDrawersRegistered(() => {});
    expect(consoleWarnSpy).not.toHaveBeenCalled();
    drawers.onDrawersRegistered(() => {});
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringMatching(/multiple app layout instances detected/));
  });
});
