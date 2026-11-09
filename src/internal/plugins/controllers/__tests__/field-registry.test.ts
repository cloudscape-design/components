// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { FieldDescriptor } from '../../../../../lib/components/internal/field-registry';
import { FieldRegistryController } from '../../../../../lib/components/internal/plugins/controllers/field-registry';

const descriptor = (name: string, value: unknown = ''): FieldDescriptor => ({
  name,
  label: name,
  type: 'input',
  value,
  setValue: () => true,
});

const delay = () => new Promise(resolve => setTimeout(resolve));

test('a listener receives the current fields when it registers', () => {
  const controller = new FieldRegistryController();
  controller.registerField(descriptor('name'));
  const listener = jest.fn();
  controller.registerListener(listener);
  expect(listener).toHaveBeenCalledWith([expect.objectContaining({ name: 'name' })]);
});

test('registrations, updates and cleanups are batched into one notification', async () => {
  const controller = new FieldRegistryController();
  const listener = jest.fn();
  controller.registerListener(listener);
  listener.mockClear();

  const first = controller.registerField(descriptor('first'));
  controller.registerField(descriptor('second'));
  first.update(descriptor('first', 'updated'));
  await delay();
  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenCalledWith([
    expect.objectContaining({ name: 'first', value: 'updated' }),
    expect.objectContaining({ name: 'second' }),
  ]);

  first.cleanup();
  await delay();
  expect(listener).toHaveBeenLastCalledWith([expect.objectContaining({ name: 'second' })]);
});

test('an unregistered listener is not notified', async () => {
  const controller = new FieldRegistryController();
  const listener = jest.fn();
  const stop = controller.registerListener(listener);
  listener.mockClear();
  stop();
  controller.registerField(descriptor('name'));
  await delay();
  expect(listener).not.toHaveBeenCalled();
});

test('an existing API keeps its methods when the controller is installed again', () => {
  const first = new FieldRegistryController();
  const second = new FieldRegistryController();
  const publicApi = second.installPublic(first.installPublic());
  const internalApi = second.installInternal(first.installInternal());
  expect(publicApi.registerListener).toBe(first.registerListener);
  expect(internalApi.registerField).toBe(first.registerField);
});
