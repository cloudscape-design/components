// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import type { FieldDescriptor } from '../../../../../lib/components/internal/field-registry';
import { FieldRegistryController } from '../../../../../lib/components/internal/plugins/controllers/field-registry';

const field = (id: string, value: unknown = ''): FieldDescriptor => ({ id, label: id, type: 'input', value });

const writer = () => jest.fn((value: unknown) => Promise.resolve(field('written', value)));

test('a listener receives the current fields when it registers', () => {
  const controller = new FieldRegistryController();
  controller.registerField(field('name'), writer());
  const listener = jest.fn();
  controller.registerListener(listener);
  expect(listener).toHaveBeenCalledWith([field('name')]);
});

test('a listener is called on every registration, update and cleanup', () => {
  const controller = new FieldRegistryController();
  const listener = jest.fn();
  controller.registerListener(listener);
  listener.mockClear();

  const first = controller.registerField(field('first'), writer());
  controller.registerField(field('second'), writer());
  first.update(field('first', 'updated'));
  first.cleanup();

  expect(listener.mock.calls).toEqual([
    [[field('first')]],
    [[field('first'), field('second')]],
    [[field('first', 'updated'), field('second')]],
    [[field('second')]],
  ]);
});

test('an unregistered listener is not called', () => {
  const controller = new FieldRegistryController();
  const listener = jest.fn();
  const stop = controller.registerListener(listener);
  listener.mockClear();
  stop();
  controller.registerField(field('name'), writer());
  expect(listener).not.toHaveBeenCalled();
});

test('setValue passes the value to the field with that id and returns its promise', async () => {
  const controller = new FieldRegistryController();
  const first = writer();
  const second = writer();
  controller.registerField(field('first'), first);
  controller.registerField(field('second'), second);

  await expect(controller.setValue('second', 'web-1')).resolves.toEqual(field('written', 'web-1'));
  expect(first).not.toHaveBeenCalled();
  expect(second).toHaveBeenCalledWith('web-1');
});

test('setValue rejects for an id that is not registered', async () => {
  const controller = new FieldRegistryController();
  const registration = controller.registerField(field('name'), writer());
  registration.cleanup();
  await expect(controller.setValue('name', 'web-1')).rejects.toThrow('No field has the id "name".');
});

test('an existing API keeps its methods when the controller is installed again', () => {
  const first = new FieldRegistryController();
  const second = new FieldRegistryController();
  const publicApi = second.installPublic(first.installPublic());
  const internalApi = second.installInternal(first.installInternal());
  expect(publicApi.registerListener).toBe(first.registerListener);
  expect(publicApi.setValue).toBe(first.setValue);
  expect(internalApi.registerField).toBe(first.registerField);
});
