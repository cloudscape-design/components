// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AppLayoutWidgetController } from '../../../../../lib/components/internal/plugins/controllers/app-layout-widget';

function delay() {
  return new Promise(resolve => setTimeout(resolve));
}

test('registers and unregisters a single instance', () => {
  const onRegister = jest.fn();
  const controller = new AppLayoutWidgetController();
  const cleanup = controller.register(undefined, onRegister);
  expect(controller.getStateForTesting().registrations).toHaveLength(1);
  expect(onRegister).toHaveBeenCalledWith({ type: 'primary', discoveredProps: [] });

  cleanup();
  expect(controller.getStateForTesting().registrations).toHaveLength(0);
});

test('registers and unregisters multiple instances', async () => {
  const onRegisterFirst = jest.fn();
  const onRegisterSecond = jest.fn();
  const controller = new AppLayoutWidgetController();
  const cleanupFirst = controller.register(undefined, onRegisterFirst);
  expect(onRegisterFirst).toHaveBeenCalledTimes(1);
  expect(onRegisterFirst).toHaveBeenCalledWith({ type: 'primary', discoveredProps: [] });
  onRegisterFirst.mockClear();
  const cleanupSecond = controller.register(undefined, onRegisterSecond);
  expect(controller.getStateForTesting().registrations).toHaveLength(2);
  expect(onRegisterFirst).toHaveBeenCalledTimes(1);
  expect(onRegisterFirst).toHaveBeenCalledWith({ type: 'secondary', update: expect.any(Function) });
  expect(onRegisterSecond).toHaveBeenCalledTimes(1);
  expect(onRegisterSecond).toHaveBeenCalledWith({ type: 'primary', discoveredProps: [{}] });

  onRegisterFirst.mockClear();
  onRegisterSecond.mockClear();
  cleanupFirst();
  cleanupSecond();
  expect(controller.getStateForTesting().registrations).toHaveLength(0);

  await delay();

  expect(onRegisterFirst).toHaveBeenCalledTimes(0);
  expect(onRegisterSecond).toHaveBeenCalledTimes(0);
});

test('delivers property updates from secondary to primary instance', async () => {
  const onRegisterFirst = jest.fn();
  const onRegisterSecond = jest.fn();
  const controller = new AppLayoutWidgetController();
  controller.register(undefined, onRegisterFirst);
  controller.register(undefined, onRegisterSecond);
  onRegisterSecond.mockClear();

  onRegisterFirst.mock.lastCall[0].update({ foo: '123' });
  await delay();

  expect(onRegisterSecond).toHaveBeenCalledTimes(1);
  expect(onRegisterSecond).toHaveBeenCalledWith({ type: 'primary', discoveredProps: [{ foo: '123' }] });
});

test('delivers property updates from multiple secondary instances', async () => {
  let stateFirst: any;
  let stateSecond: any;
  let stateThird: any;
  const controller = new AppLayoutWidgetController();
  controller.register(undefined, state => (stateFirst = state));
  controller.register(undefined, state => (stateSecond = state));
  controller.register(undefined, state => (stateThird = state));

  expect(stateFirst.type).toEqual('secondary');
  expect(stateSecond.type).toEqual('secondary');
  expect(stateThird.type).toEqual('primary');

  stateFirst.update({ foo: '123' });
  stateSecond.update({ bar: '456' });
  await delay();

  expect(stateThird).toEqual({ type: 'primary', discoveredProps: [{ foo: '123' }, { bar: '456' }] });
});

test('when primary instance is unregistered, the next becomes primary', async () => {
  let stateFirst: any;
  let stateSecond: any;
  let stateThird: any;
  const controller = new AppLayoutWidgetController();
  controller.register(undefined, state => (stateFirst = state));
  controller.register(undefined, state => (stateSecond = state));
  const cleanupLast = controller.register(undefined, state => (stateThird = state));

  expect(stateThird.type).toEqual('primary');

  cleanupLast();
  expect(stateSecond.type).toEqual('secondary');

  await delay();
  expect(stateSecond.type).toEqual('primary');
  expect(stateFirst.type).toEqual('secondary');
});

test('supports forced primary registration', () => {
  let stateFirst: any;
  let stateSecond: any;
  const controller = new AppLayoutWidgetController();
  controller.register('primary', state => (stateFirst = state));
  controller.register(undefined, state => (stateSecond = state));
  expect(stateFirst.type).toEqual('primary');
  expect(stateSecond.type).toEqual('secondary');
});

test('throws an error when multiple forced primary registration are attempted', () => {
  const controller = new AppLayoutWidgetController();
  controller.register('primary', () => {});
  expect(() => controller.register('primary', () => {})).toThrow('Double primary registration attempt');
});

test('supports forced secondary registration', () => {
  let stateFirst: any;
  let stateSecond: any;
  let stateThird: any;
  let stateForth: any;
  const controller = new AppLayoutWidgetController();
  controller.register('secondary', state => (stateFirst = state));
  controller.register('secondary', state => (stateSecond = state));
  expect(stateFirst.type).toEqual('secondary');
  expect(stateSecond.type).toEqual('secondary');

  controller.register(undefined, state => (stateThird = state));
  expect(stateFirst.type).toEqual('secondary');
  expect(stateSecond.type).toEqual('secondary');
  expect(stateThird.type).toEqual('primary');

  controller.register('secondary', state => (stateForth = state));
  expect(stateFirst.type).toEqual('secondary');
  expect(stateSecond.type).toEqual('secondary');
  expect(stateThird.type).toEqual('primary');
  expect(stateForth.type).toEqual('secondary');
});
